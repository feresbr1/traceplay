import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { Trace, VarsState } from '../core/trace';
import { traceToGif } from './gif';
import { draw, interpolate } from './render';
import { buildScene, DARK, LIGHT, type LayoutCache, type Scene } from './scene';
import { injectPlayerStyles } from './styles';

export interface PlayerProps {
  trace: Trace;
  autoplay?: boolean;
  loop?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  /** Hide the code/variables side panel. */
  compact?: boolean;
  /** Show the GIF export button. */
  exportable?: boolean;
  /** Link back to traceplay (used in exported files). */
  branded?: boolean;
  /** Start at this step (0-based). */
  start?: number;
  onStep?: (index: number) => void;
}

const SPEEDS = [0.5, 1, 2, 4];

function useDarkPreference(): boolean {
  const query =
    typeof window !== 'undefined' ? window.matchMedia?.('(prefers-color-scheme: dark)') : undefined;
  const [dark, setDark] = useState(Boolean(query?.matches));
  useEffect(() => {
    if (!query) return;
    const on = (e: MediaQueryListEvent) => setDark(e.matches);
    query.addEventListener('change', on);
    return () => query.removeEventListener('change', on);
  }, [query]);
  return dark;
}

export function Player({
  trace,
  autoplay = false,
  loop = false,
  theme = 'auto',
  compact = false,
  exportable = true,
  branded = false,
  start = 0,
  onStep,
}: PlayerProps) {
  injectPlayerStyles();
  const prefersDark = useDarkPreference();
  const dark = theme === 'dark' || (theme === 'auto' && prefersDark);
  const palette = dark ? DARK : LIGHT;
  const frames = trace.frames;
  const last = frames.length - 1;

  const [index, setIndex] = useState(Math.min(Math.max(0, start), last));
  const [playing, setPlaying] = useState(autoplay);
  const [speed, setSpeed] = useState(1);
  const [gifState, setGifState] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const shown = useRef<Scene | null>(null);
  const anim = useRef<{ from: Scene; to: Scene; start: number; duration: number } | null>(null);
  const raf = useRef(0);
  const width = useRef(0);
  const prevIndex = useRef(index);

  // Scenes are built lazily and cached per theme.
  const scenes = useMemo(() => {
    const cache: LayoutCache = new Map();
    const memo = new Map<number, Scene>();
    return (i: number) => {
      let s = memo.get(i);
      if (!s) {
        s = buildScene(frames[i]!, palette, cache);
        memo.set(i, s);
      }
      return s;
    };
  }, [frames, palette]);

  // Keep the canvas height stable: use the tallest scene.
  const maxHeight = useMemo(() => {
    let h = 0;
    const stride = Math.max(1, Math.floor(frames.length / 200));
    for (let i = 0; i < frames.length; i += stride) h = Math.max(h, scenes(i).height);
    return Math.max(h, scenes(last).height);
  }, [scenes, frames, last]);

  const paint = (scene: Scene) => {
    const canvas = canvasRef.current;
    if (!canvas || !width.current) return;
    const dpr = window.devicePixelRatio || 1;
    const scale = width.current / scene.width;
    const cssH = Math.round(maxHeight * scale);
    if (
      canvas.width !== Math.round(width.current * dpr) ||
      canvas.height !== Math.round(cssH * dpr)
    ) {
      canvas.width = Math.round(width.current * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.height = `${cssH}px`;
    }
    const ctx = canvas.getContext('2d');
    if (ctx) draw(ctx, { ...scene, height: maxHeight }, scale * dpr, palette.bg);
  };

  const tick = (now: number) => {
    const a = anim.current;
    if (!a) return;
    const t = Math.min(1, (now - a.start) / a.duration);
    const scene = interpolate(a.from, a.to, t);
    shown.current = scene;
    paint(scene);
    if (t < 1) raf.current = requestAnimationFrame(tick);
    else anim.current = null;
  };

  // Animate to the new step.
  useEffect(() => {
    const target = scenes(index);
    const from = shown.current;
    const distance = Math.abs(index - prevIndex.current);
    prevIndex.current = index;
    onStep?.(index);
    if (!from || distance === 0) {
      shown.current = target;
      paint(target);
      return;
    }
    cancelAnimationFrame(raf.current);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    anim.current = {
      from,
      to: target,
      start: performance.now(),
      duration: reduce ? 1 : distance === 1 ? 420 / speed : 160,
    };
    raf.current = requestAnimationFrame(tick);
  }, [index, scenes]);

  // Resize with the container.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      width.current = el.clientWidth;
      if (shown.current) paint(shown.current);
    });
    ro.observe(el);
    width.current = el.clientWidth;
    if (shown.current) paint(shown.current);
    return () => ro.disconnect();
  }, [maxHeight, palette]);

  // Repaint immediately when the theme changes.
  useEffect(() => {
    shown.current = scenes(index);
    paint(shown.current);
  }, [palette]);

  // Autoplay.
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(
      () => {
        if (index >= last) {
          if (loop) setIndex(0);
          else setPlaying(false);
        } else {
          setIndex(index + 1);
        }
      },
      index >= last ? 1600 : 650 / speed,
    );
    return () => clearTimeout(id);
  }, [playing, index, speed, last, loop]);

  // Keep the highlighted code line in view.
  useEffect(() => {
    const el = codeRef.current?.querySelector('.ln.on') as HTMLElement | null;
    const box = codeRef.current;
    if (el && box) {
      const top = el.offsetTop - box.clientHeight / 2;
      box.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
  }, [frames[index]?.line]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const go = (i: number) => {
    setPlaying(false);
    setIndex(Math.min(last, Math.max(0, i)));
  };

  const onKey = (e: KeyboardEvent) => {
    if (
      (e.target as HTMLElement).tagName === 'SELECT' ||
      (e.target as HTMLElement).tagName === 'INPUT'
    ) {
      if (e.key !== ' ') return;
    }
    if (e.key === ' ' || e.key === 'k') {
      e.preventDefault();
      if (!playing && index >= last) setIndex(0);
      setPlaying(!playing);
    } else if (e.key === 'ArrowRight' || e.key === 'l') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'j') {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      go(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      go(last);
    }
  };

  const exportGif = async () => {
    setPlaying(false);
    setGifState('0%');
    try {
      const blob = await traceToGif(trace, palette, {
        onProgress: (d, t) => setGifState(`${Math.round((d / t) * 100)}%`),
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug(trace.meta.title ?? 'trace')}.gif`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } finally {
      setGifState(null);
    }
  };

  const frame = frames[index]!;
  const vars = frame.structs.filter((s): s is VarsState => s.kind === 'vars');
  const codeLines = trace.meta.code ? trace.meta.code.replace(/\s+$/, '').split('\n') : [];
  const hasSide = !compact && (codeLines.length > 0 || vars.length > 0);

  return (
    <div
      class="tp"
      data-theme={dark ? 'dark' : 'light'}
      tabIndex={0}
      role="region"
      aria-label={`${trace.meta.title ?? 'Trace'} animation. Space to play or pause, arrow keys to step.`}
      onKeyDown={onKey}
    >
      <div class="tp-head">
        <div>
          {trace.meta.title && <h2 class="tp-title">{trace.meta.title}</h2>}
          {trace.meta.description && !compact && <p class="tp-desc">{trace.meta.description}</p>}
        </div>
        <span class="tp-count" data-testid="tp-count">
          step {index + 1} / {frames.length}
        </span>
      </div>
      <div class={`tp-body${hasSide ? ' has-side' : ''}`}>
        <div class="tp-stage" ref={stageRef}>
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={frame.caption || frame.event || 'trace step'}
          />
        </div>
        {hasSide && (
          <div class="tp-side">
            {codeLines.length > 0 && (
              <pre class="tp-code" ref={codeRef} aria-label="Code">
                {codeLines.map((l, i) => (
                  <span class={`ln${frame.line === i + 1 ? ' on' : ''}`} key={i}>
                    <span class="no">{i + 1}</span>
                    {l || ' '}
                  </span>
                ))}
              </pre>
            )}
            {vars.map((v) => (
              <div class="tp-vars" key={v.name}>
                <b>{v.name}</b>
                {Object.entries(v.values).map(([k, val]) => (
                  <div class={`tp-var${v.changed.includes(k) ? ' changed' : ''}`} key={k}>
                    <span>{k}</span>
                    <span>
                      {val === null
                        ? 'null'
                        : typeof val === 'string'
                          ? JSON.stringify(val)
                          : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div class="tp-caption" aria-live="polite">
        <p data-testid="tp-caption">{frame.caption || ' '}</p>
        {frame.event && <small>{frame.event}</small>}
      </div>
      <div class="tp-controls">
        <button
          type="button"
          class="tp-btn"
          onClick={() => go(0)}
          aria-label="First step"
          disabled={index === 0}
        >
          ⏮
        </button>
        <button
          type="button"
          class="tp-btn"
          onClick={() => go(index - 1)}
          aria-label="Previous step"
          disabled={index === 0}
        >
          ◀
        </button>
        <button
          type="button"
          class="tp-btn primary"
          data-testid="tp-play"
          onClick={() => {
            if (!playing && index >= last) setIndex(0);
            setPlaying(!playing);
          }}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '❚❚ Pause' : '▶ Play'}
        </button>
        <button
          type="button"
          class="tp-btn"
          onClick={() => go(index + 1)}
          aria-label="Next step"
          disabled={index === last}
        >
          ▶
        </button>
        <button
          type="button"
          class="tp-btn"
          onClick={() => go(last)}
          aria-label="Last step"
          disabled={index === last}
        >
          ⏭
        </button>
        <input
          class="tp-range"
          type="range"
          min={0}
          max={last}
          value={index}
          aria-label="Step"
          onInput={(e) => go(Number(e.currentTarget.value))}
        />
        <select
          class="tp-speed"
          value={speed}
          aria-label="Speed"
          onChange={(e) => setSpeed(Number(e.currentTarget.value))}
        >
          {SPEEDS.map((s) => (
            <option key={s} value={s}>
              {s}×
            </option>
          ))}
        </select>
        {exportable && (
          <button
            type="button"
            class="tp-btn"
            onClick={() => void exportGif()}
            disabled={gifState !== null}
          >
            {gifState ? `GIF ${gifState}` : 'GIF'}
          </button>
        )}
        {branded && (
          <a
            class="tp-brand"
            href="https://github.com/feresbr1/traceplay"
            target="_blank"
            rel="noreferrer"
          >
            made with traceplay
          </a>
        )}
      </div>
    </div>
  );
}

function slug(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'trace'
  );
}
