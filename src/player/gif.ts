import { applyPalette, GIFEncoder, quantize } from 'gifenc';
import type { Trace } from '../core/trace';
import { draw, FONT_SANS, interpolate } from './render';
import { buildScene, type LayoutCache, type Palette } from './scene';

export interface GifOptions {
  /** Output width in pixels. */
  width?: number;
  /** Interpolated frames between two steps. */
  tweenFrames?: number;
  /** Milliseconds per output frame. */
  delay?: number;
  /** Hold the last step this long (ms). */
  hold?: number;
  /** Only the first N steps are exported (GIFs get large). */
  maxSteps?: number;
  onProgress?: (done: number, total: number) => void;
}

/** Render a trace to an animated GIF in the browser. */
export async function traceToGif(
  trace: Trace,
  palette: Palette,
  options: GifOptions = {},
): Promise<Blob> {
  const width = options.width ?? 720;
  const tweenFrames = 5;
  const delay = options.delay ?? 50;
  const hold = options.hold ?? 1500;
  const frames = trace.frames.slice(0, options.maxSteps ?? 300);
  const cache: LayoutCache = new Map();
  const scenes = frames.map((f) => buildScene(f, palette, cache));
  const sceneHeight = Math.max(...scenes.map((s) => s.height));
  const scale = width / scenes[0]!.width;
  const captionBand = 44;
  const height = Math.round(sceneHeight * scale) + captionBand;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  const render = (sceneIndex: number, t: number) => {
    const to = scenes[sceneIndex]!;
    const from = scenes[Math.max(0, sceneIndex - 1)]!;
    const scene = t >= 1 ? to : interpolate(from, to, t);
    draw(ctx, { ...scene, height: sceneHeight + captionBand / scale }, scale, palette.bg);
    // Narration band, so a GIF shared on its own still explains itself.
    const frame = frames[sceneIndex]!;
    const caption = frame.caption || trace.meta.title || '';
    ctx.save();
    ctx.fillStyle = palette.panel;
    ctx.fillRect(0, height - captionBand, width, captionBand);
    ctx.fillStyle = palette.ink;
    ctx.font = `600 ${Math.round(width / 46)}px ${FONT_SANS}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(fit(ctx, caption, width - 32), 16, height - captionBand / 2);
    ctx.restore();
    return ctx.getImageData(0, 0, width, height).data;
  };

  // One shared palette, sampled from frames across the whole trace.
  const samples = [0, 0.25, 0.5, 0.75, 1].map((f) =>
    Math.min(scenes.length - 1, Math.round(f * (scenes.length - 1))),
  );
  const sampleData = new Uint8ClampedArray(width * height * 4 * samples.length);
  samples.forEach((s, i) => sampleData.set(render(s, 1), i * width * height * 4));
  const gifPalette = quantize(sampleData, 128);

  const gif = GIFEncoder();
  const total = scenes.length;
  // Long traces get fewer in-between frames, so files stay shareable.
  const tweens = options.tweenFrames ?? (total > 200 ? 1 : total > 100 ? 3 : tweenFrames);
  // Identical consecutive frames are merged by extending the previous frame's delay.
  let pending: { index: Uint8Array; delay: number } | null = null;
  const flush = () => {
    if (pending)
      gif.writeFrame(pending.index, width, height, { palette: gifPalette, delay: pending.delay });
    pending = null;
  };
  const push = (index: Uint8Array, frameDelay: number) => {
    if (pending && sameBytes(pending.index, index)) {
      pending.delay += frameDelay;
      return;
    }
    flush();
    pending = { index, delay: frameDelay };
  };
  for (let i = 0; i < scenes.length; i++) {
    const steps = i === 0 ? 1 : tweens;
    for (let k = 1; k <= steps; k++) {
      const index = applyPalette(render(i, k / steps), gifPalette);
      const last = i === scenes.length - 1 && k === steps;
      push(index, last ? hold : k === steps ? delay * (tweens > 1 ? 4 : 6) : delay);
    }
    options.onProgress?.(i + 1, total);
    // Yield so the page stays responsive.
    if (i % 5 === 0) await new Promise((r) => setTimeout(r, 0));
  }
  flush();
  gif.finish();
  return new Blob([new Uint8Array(gif.bytes())], { type: 'image/gif' });
}

function sameBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function fit(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let out = text;
  while (out.length > 1 && ctx.measureText(`${out}…`).width > max) out = out.slice(0, -1);
  return `${out}…`;
}
