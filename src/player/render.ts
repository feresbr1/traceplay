import type { Scene, Shape } from './scene';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function parseColor(c: string): [number, number, number] | undefined {
  const m = /^#([0-9a-f]{6})$/i.exec(c);
  if (!m) return undefined;
  const n = parseInt(m[1]!, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixColor(a: string, b: string, t: number): string {
  if (a === b) return b;
  const ca = parseColor(a);
  const cb = parseColor(b);
  if (!ca || !cb) return t < 0.5 ? a : b;
  const c = ca.map((v, i) => Math.round(lerp(v, cb[i]!, t)));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Interpolate two scenes: matching keys move and recolour, new shapes fade in, old ones fade out. */
export function interpolate(from: Scene, to: Scene, tRaw: number): Scene {
  const t = ease(Math.max(0, Math.min(1, tRaw)));
  if (t >= 1) return to;
  const prev = new Map(from.shapes.map((s) => [s.key, s]));
  const shapes: Shape[] = [];
  const seen = new Set<string>();
  for (const b of to.shapes) {
    seen.add(b.key);
    const a = prev.get(b.key);
    if (!a || a.type !== b.type) {
      shapes.push({ ...b, opacity: b.opacity * t });
      continue;
    }
    shapes.push(mixShape(a, b, t));
  }
  for (const a of from.shapes) {
    if (!seen.has(a.key)) shapes.push({ ...a, opacity: a.opacity * (1 - t) });
  }
  return { width: to.width, height: lerp(from.height, to.height, t), shapes };
}

function mixShape(a: Shape, b: Shape, t: number): Shape {
  switch (b.type) {
    case 'rect': {
      const s = a as typeof b;
      return {
        ...b,
        x: lerp(s.x, b.x, t),
        y: lerp(s.y, b.y, t),
        w: lerp(s.w, b.w, t),
        h: lerp(s.h, b.h, t),
        fill: mixColor(s.fill, b.fill, t),
        opacity: lerp(s.opacity, b.opacity, t),
      };
    }
    case 'circle': {
      const s = a as typeof b;
      return {
        ...b,
        x: lerp(s.x, b.x, t),
        y: lerp(s.y, b.y, t),
        radius: lerp(s.radius, b.radius, t),
        fill: mixColor(s.fill, b.fill, t),
        stroke: mixColor(s.stroke, b.stroke, t),
        opacity: lerp(s.opacity, b.opacity, t),
      };
    }
    case 'line': {
      const s = a as typeof b;
      return {
        ...b,
        x1: lerp(s.x1, b.x1, t),
        y1: lerp(s.y1, b.y1, t),
        x2: lerp(s.x2, b.x2, t),
        y2: lerp(s.y2, b.y2, t),
        width: lerp(s.width, b.width, t),
        color: mixColor(s.color, b.color, t),
        opacity: lerp(s.opacity, b.opacity, t),
      };
    }
    case 'text': {
      const s = a as typeof b;
      return {
        ...b,
        x: lerp(s.x, b.x, t),
        y: lerp(s.y, b.y, t),
        text: t < 0.5 ? s.text : b.text,
        color: mixColor(s.color, b.color, t),
        opacity: lerp(s.opacity, b.opacity, t),
      };
    }
  }
}

export const FONT_SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";
export const FONT_MONO =
  "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

type Ctx = CanvasRenderingContext2D;

/** Paint a scene. `scale` maps scene units to canvas pixels. */
export function draw(
  ctx: Ctx,
  scene: Scene,
  scale: number,
  background: string,
  offsetX = 0,
  offsetY = 0,
): void {
  ctx.save();
  ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, scene.width, scene.height + 2);
  // Lines first, then shapes, then text, so labels stay readable.
  for (const s of scene.shapes) if (s.type === 'line') drawShape(ctx, s);
  for (const s of scene.shapes) if (s.type === 'rect' || s.type === 'circle') drawShape(ctx, s);
  for (const s of scene.shapes) if (s.type === 'text') drawShape(ctx, s);
  ctx.restore();
}

function drawShape(ctx: Ctx, s: Shape): void {
  if (s.opacity <= 0.01) return;
  ctx.globalAlpha = Math.min(1, s.opacity);
  switch (s.type) {
    case 'rect': {
      roundRect(ctx, s.x, s.y, s.w, s.h, Math.min(s.r, s.w / 2, s.h / 2));
      ctx.fillStyle = s.fill;
      ctx.fill();
      if (s.stroke) {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = s.stroke;
        ctx.stroke();
      }
      break;
    }
    case 'circle': {
      ctx.beginPath();
      ctx.arc(s.x, s.y, Math.max(0, s.radius), 0, Math.PI * 2);
      ctx.fillStyle = s.fill;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = s.stroke;
      ctx.stroke();
      break;
    }
    case 'line': {
      ctx.beginPath();
      ctx.moveTo(s.x1, s.y1);
      ctx.lineTo(s.x2, s.y2);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.stroke();
      if (s.arrow) {
        const a = Math.atan2(s.y2 - s.y1, s.x2 - s.x1);
        const size = 7 + s.width;
        ctx.beginPath();
        ctx.moveTo(s.x2, s.y2);
        ctx.lineTo(s.x2 - size * Math.cos(a - 0.45), s.y2 - size * Math.sin(a - 0.45));
        ctx.lineTo(s.x2 - size * Math.cos(a + 0.45), s.y2 - size * Math.sin(a + 0.45));
        ctx.closePath();
        ctx.fillStyle = s.color;
        ctx.fill();
      }
      break;
    }
    case 'text': {
      ctx.font = `${s.weight} ${s.size}px ${s.mono ? FONT_MONO : FONT_SANS}`;
      ctx.textAlign = s.align;
      ctx.fillStyle = s.color;
      ctx.fillText(s.text, s.x, s.y);
      break;
    }
  }
  ctx.globalAlpha = 1;
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number): void {
  const rr = Math.max(0, r);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}
