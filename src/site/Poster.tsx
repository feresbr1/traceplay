import { useEffect, useRef } from 'preact/hooks';
import type { Trace } from '../core/trace';
import { draw } from '../player/render';
import { buildScene, DARK, LIGHT } from '../player/scene';

/** A still frame of a trace, used as a gallery thumbnail. */
export function Poster({ trace, at = 0.6 }: { trace: Trace; at?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const palette = dark ? DARK : LIGHT;
    const frame = trace.frames[Math.floor((trace.frames.length - 1) * at)]!;
    const scene = buildScene(frame, palette, new Map());
    const width = canvas.clientWidth || 320;
    const height = width * (10 / 16);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Fit the whole scene into the card.
    const scale = Math.min(width / scene.width, height / scene.height);
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw(
      ctx,
      scene,
      scale * dpr,
      palette.bg,
      ((width - scene.width * scale) / 2) * dpr,
      ((height - scene.height * scale) / 2) * dpr,
    );
  }, [trace, at]);
  return <canvas ref={ref} aria-hidden="true" />;
}
