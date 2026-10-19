import type {
  ArrayState,
  Frame,
  GraphState,
  GridState,
  StructState,
  Tone,
  TreeState,
  Value,
} from '../core/trace';
import { graphLayout, treeLayout, type Point } from './layout';

export type Shape =
  | {
      type: 'rect';
      key: string;
      x: number;
      y: number;
      w: number;
      h: number;
      r: number;
      fill: string;
      stroke?: string;
      opacity: number;
    }
  | {
      type: 'circle';
      key: string;
      x: number;
      y: number;
      radius: number;
      fill: string;
      stroke: string;
      opacity: number;
    }
  | {
      type: 'line';
      key: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
      width: number;
      arrow: boolean;
      opacity: number;
    }
  | {
      type: 'text';
      key: string;
      x: number;
      y: number;
      text: string;
      size: number;
      color: string;
      align: 'left' | 'center' | 'right';
      weight: 400 | 600 | 700;
      mono: boolean;
      opacity: number;
    };

export interface Scene {
  width: number;
  height: number;
  shapes: Shape[];
}

export interface Palette {
  bg: string;
  panel: string;
  ink: string;
  muted: string;
  faint: string;
  base: string;
  baseInk: string;
  wall: string;
  tones: Record<Tone, string>;
}

export const LIGHT: Palette = {
  bg: '#fbfaf7',
  panel: '#f2f0ea',
  ink: '#1c1b18',
  muted: '#6f6b62',
  faint: '#d9d5cb',
  base: '#c9c4b8',
  baseInk: '#1c1b18',
  wall: '#3b3933',
  tones: {
    active: '#2f6fed',
    compare: '#e8a317',
    swap: '#e5484d',
    done: '#2f9e5b',
    visited: '#8c6be8',
    frontier: '#14a0c4',
    path: '#f2711c',
    found: '#12a87e',
    muted: '#b9b4a8',
    error: '#d93636',
    pivot: '#c2449b',
  },
};

export const DARK: Palette = {
  bg: '#141412',
  panel: '#1d1c19',
  ink: '#f0ede5',
  muted: '#9b968a',
  faint: '#34322d',
  base: '#4a473f',
  baseInk: '#f0ede5',
  wall: '#cfcabd',
  tones: {
    active: '#5b8cff',
    compare: '#f5b83d',
    swap: '#ff6b6f',
    done: '#4cc27f',
    visited: '#a68bff',
    frontier: '#3cc3e6',
    path: '#ff8a3d',
    found: '#36d0a3',
    muted: '#5d5a52',
    error: '#ff5a5a',
    pivot: '#e264b9',
  },
};

export const WIDTH = 1000;
const PAD = 28;
const TITLE = 26;
const GAP = 22;

/** Cache of graph layouts by structure name, so nodes keep their place across frames. */
export type LayoutCache = Map<string, Record<string, Point>>;

export function buildScene(frame: Frame, palette: Palette, cache: LayoutCache): Scene {
  const shapes: Shape[] = [];
  let y = PAD;
  for (const s of frame.structs) {
    if (s.kind === 'vars') continue;
    shapes.push(text(`${s.name}:title`, PAD, y + 12, s.name, 13, palette.muted, 'left', 600, true));
    y += TITLE;
    const h = drawStruct(s, y, palette, cache, shapes);
    y += h + GAP;
  }
  return { width: WIDTH, height: Math.max(y + PAD - GAP, 120), shapes };
}

function drawStruct(
  s: StructState,
  top: number,
  p: Palette,
  cache: LayoutCache,
  out: Shape[],
): number {
  switch (s.kind) {
    case 'array':
      return s.style === 'bars' ? drawBars(s, top, p, out) : drawCells(s, top, p, out);
    case 'grid':
      return drawGrid(s, top, p, out);
    case 'graph':
      return drawGraph(s, top, p, cache, out);
    case 'tree':
      return drawTree(s, top, p, out);
    default:
      return 0;
  }
}

function text(
  key: string,
  x: number,
  y: number,
  value: string,
  size: number,
  color: string,
  align: 'left' | 'center' | 'right' = 'center',
  weight: 400 | 600 | 700 = 400,
  mono = false,
): Shape {
  return { type: 'text', key, x, y, text: value, size, color, align, weight, mono, opacity: 1 };
}

function label(v: Value): string {
  if (v === null) return '';
  if (typeof v === 'number')
    return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
  return String(v);
}

function toneFill(p: Palette, tone: Tone | undefined, fallback: string): string {
  return tone ? p.tones[tone] : fallback;
}

/** Array as vertical bars; item keys keep identity so swaps slide. */
function drawBars(s: ArrayState, top: number, p: Palette, out: Shape[]): number {
  const n = s.items.length;
  const inner = WIDTH - PAD * 2;
  const slot = n ? inner / n : inner;
  const barW = Math.max(2, Math.min(56, slot * 0.78));
  const height = 210;
  const nums = s.items.map((i) => (typeof i.value === 'number' ? i.value : 0));
  const max = Math.max(1, ...nums.map((v) => Math.abs(v)));
  const hasNeg = nums.some((v) => v < 0);
  const base = hasNeg ? top + height / 2 : top + height;
  const scale = (hasNeg ? height / 2 - 18 : height - 22) / max;
  const showValues = slot >= 18;
  s.items.forEach((item, i) => {
    const v = typeof item.value === 'number' ? item.value : 0;
    const x = PAD + slot * i + (slot - barW) / 2;
    const h = Math.max(2, Math.abs(v) * scale);
    const tone = s.marks[i];
    out.push({
      type: 'rect',
      key: `${item.key}:bar`,
      x,
      y: v >= 0 ? base - h : base,
      w: barW,
      h,
      r: Math.min(6, barW / 4),
      fill: toneFill(p, tone, p.base),
      opacity: 1,
    });
    if (showValues) {
      out.push(
        text(
          `${item.key}:val`,
          x + barW / 2,
          v >= 0 ? base - h - 8 : base + h + 14,
          label(item.value),
          Math.min(14, slot * 0.45),
          tone ? p.tones[tone] : p.ink,
          'center',
          600,
          true,
        ),
      );
    }
  });
  let y = top + height + 6;
  if (showValues || n <= 60) {
    s.items.forEach((_, i) => {
      if (n > 30 && i % 5 !== 0) return;
      out.push(
        text(
          `${s.name}:idx${i}`,
          PAD + slot * i + slot / 2,
          y + 10,
          String(i),
          11,
          p.muted,
          'center',
          400,
          true,
        ),
      );
    });
    y += 16;
  }
  return (
    y -
    top +
    pointerRows(
      s.name,
      s.pointers.map((ptr) => ({ name: ptr.name, x: PAD + slot * ptr.index + slot / 2 })),
      y,
      p,
      out,
    )
  );
}

function drawCells(s: ArrayState, top: number, p: Palette, out: Shape[]): number {
  const n = s.items.length;
  const inner = WIDTH - PAD * 2;
  const size = Math.max(14, Math.min(64, n ? inner / n - 6 : 64));
  const total = n * (size + 6) - 6;
  const left = PAD + Math.max(0, (inner - total) / 2);
  s.items.forEach((item, i) => {
    const x = left + i * (size + 6);
    const tone = s.marks[i];
    out.push({
      type: 'rect',
      key: `${item.key}:cell`,
      x,
      y: top,
      w: size,
      h: size,
      r: 8,
      fill: toneFill(p, tone, p.panel),
      stroke: tone ? undefined : p.faint,
      opacity: 1,
    });
    out.push(
      text(
        `${item.key}:val`,
        x + size / 2,
        top + size / 2 + 5,
        label(item.value),
        Math.min(18, size * 0.38),
        tone ? '#ffffff' : p.ink,
        'center',
        600,
        true,
      ),
    );
  });
  let y = top + size + 6;
  s.items.forEach((_, i) => {
    if (n > 30 && i % 5 !== 0) return;
    out.push(
      text(
        `${s.name}:idx${i}`,
        left + i * (size + 6) + size / 2,
        y + 10,
        String(i),
        11,
        p.muted,
        'center',
        400,
        true,
      ),
    );
  });
  y += 16;
  return (
    y -
    top +
    pointerRows(
      s.name,
      s.pointers.map((ptr) => ({ name: ptr.name, x: left + ptr.index * (size + 6) + size / 2 })),
      y,
      p,
      out,
    )
  );
}

/** Pointer labels ("▲ i"), stacked when several share a position. */
function pointerRows(
  owner: string,
  pointers: { name: string; x: number }[],
  top: number,
  p: Palette,
  out: Shape[],
): number {
  if (!pointers.length) return 0;
  const rows: { x: number }[][] = [];
  let maxRow = 0;
  for (const ptr of pointers) {
    let row = 0;
    while (rows[row]?.some((o) => Math.abs(o.x - ptr.x) < 34)) row++;
    (rows[row] ??= []).push({ x: ptr.x });
    maxRow = Math.max(maxRow, row);
    out.push(
      text(
        `${owner}:ptr:${ptr.name}`,
        ptr.x,
        top + 14 + row * 18,
        `▲ ${ptr.name}`,
        13,
        p.tones.active,
        'center',
        700,
        true,
      ),
    );
  }
  return 20 + maxRow * 18;
}

function drawGrid(s: GridState, top: number, p: Palette, out: Shape[]): number {
  const rows = s.cells.length;
  const cols = s.cells[0]?.length ?? 0;
  const inner = WIDTH - PAD * 2;
  const size = Math.max(6, Math.min(44, cols ? inner / cols : 44));
  const left = PAD + (inner - size * cols) / 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = s.cells[r]![c]!;
      const tone = s.marks[`${r},${c}`];
      const wall = v === '#';
      out.push({
        type: 'rect',
        key: `${s.name}:${r},${c}`,
        x: left + c * size + 1,
        y: top + r * size + 1,
        w: size - 2,
        h: size - 2,
        r: Math.min(6, size / 5),
        fill: tone ? p.tones[tone] : wall ? p.wall : p.panel,
        opacity: 1,
      });
      if (!wall && v !== null && v !== '' && size >= 20) {
        out.push(
          text(
            `${s.name}:${r},${c}:v`,
            left + c * size + size / 2,
            top + r * size + size / 2 + 4,
            label(v),
            Math.min(14, size * 0.38),
            tone ? '#ffffff' : p.ink,
            'center',
            600,
            true,
          ),
        );
      }
    }
  }
  for (const ptr of s.pointers) {
    out.push({
      type: 'circle',
      key: `${s.name}:ptr:${ptr.name}`,
      x: left + ptr.col * size + size / 2,
      y: top + ptr.row * size + size / 2,
      radius: Math.max(3, size * 0.28),
      fill: p.ink,
      stroke: p.bg,
      opacity: 1,
    });
  }
  return rows * size;
}

function drawGraph(
  g: GraphState,
  top: number,
  p: Palette,
  cache: LayoutCache,
  out: Shape[],
): number {
  let pos = cache.get(g.name);
  if (!pos) {
    pos = graphLayout(g);
    cache.set(g.name, pos);
  }
  const height = 360;
  const radius = g.nodes.length > 24 ? 14 : 20;
  const at = (id: string) => {
    const q = pos![id] ?? { x: 0.5, y: 0.5 };
    return {
      x: PAD + radius + q.x * (WIDTH - 2 * PAD - 2 * radius),
      y: top + radius + q.y * (height - 2 * radius),
    };
  };
  for (const e of g.edges) {
    const a = at(e.from);
    const b = at(e.to);
    const tone = g.edgeMarks[`${e.from}->${e.to}`];
    const d = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
    const ux = (b.x - a.x) / d;
    const uy = (b.y - a.y) / d;
    out.push({
      type: 'line',
      key: `${g.name}:e:${e.from}->${e.to}`,
      x1: a.x + ux * radius,
      y1: a.y + uy * radius,
      x2: b.x - ux * (radius + (g.directed ? 2 : 0)),
      y2: b.y - uy * (radius + (g.directed ? 2 : 0)),
      color: tone ? p.tones[tone] : p.faint,
      width: tone ? 4 : 2,
      arrow: g.directed,
      opacity: 1,
    });
    if (e.weight !== undefined) {
      const mx = (a.x + b.x) / 2 - uy * 12;
      const my = (a.y + b.y) / 2 + ux * 12;
      out.push(
        text(
          `${g.name}:w:${e.from}->${e.to}`,
          mx,
          my + 4,
          label(e.weight),
          12,
          tone ? p.tones[tone] : p.muted,
          'center',
          600,
          true,
        ),
      );
    }
  }
  for (const v of g.nodes) {
    const c = at(v.id);
    const tone = g.nodeMarks[v.id];
    out.push({
      type: 'circle',
      key: `${g.name}:n:${v.id}`,
      x: c.x,
      y: c.y,
      radius,
      fill: tone ? p.tones[tone] : p.panel,
      stroke: tone ? p.tones[tone] : p.base,
      opacity: 1,
    });
    out.push(
      text(
        `${g.name}:l:${v.id}`,
        c.x,
        c.y + 5,
        v.label,
        radius > 16 ? 14 : 11,
        tone ? '#ffffff' : p.ink,
        'center',
        700,
        true,
      ),
    );
    const badge = g.nodeBadges[v.id];
    if (badge !== undefined) {
      out.push(
        text(
          `${g.name}:b:${v.id}`,
          c.x + radius + 4,
          c.y - radius + 2,
          label(badge),
          12,
          p.tones.active,
          'left',
          700,
          true,
        ),
      );
    }
  }
  return height;
}

function drawTree(t: TreeState, top: number, p: Palette, out: Shape[]): number {
  const layout = treeLayout(t);
  if (!t.root) {
    out.push(text(`${t.name}:empty`, WIDTH / 2, top + 24, '(empty)', 13, p.muted));
    return 40;
  }
  const radius = 19;
  const levelH = 72;
  const inner = WIDTH - PAD * 2 - radius * 2;
  const step = layout.columns > 1 ? Math.min(90, inner / (layout.columns - 1)) : 0;
  const span = step * (layout.columns - 1);
  const left = PAD + radius + (inner - span) / 2;
  const at = (id: string) => {
    const q = layout.positions[id]!;
    return { x: left + q.col * step, y: top + radius + q.depth * levelH };
  };
  for (const node of Object.values(t.nodes)) {
    if (!layout.positions[node.id]) continue;
    for (const child of node.children) {
      if (!child || !layout.positions[child]) continue;
      const a = at(node.id);
      const b = at(child);
      out.push({
        type: 'line',
        key: `${t.name}:e:${child}`,
        x1: a.x,
        y1: a.y + radius,
        x2: b.x,
        y2: b.y - radius,
        color: p.faint,
        width: 2,
        arrow: false,
        opacity: 1,
      });
    }
  }
  for (const node of Object.values(t.nodes)) {
    if (!layout.positions[node.id]) continue;
    const c = at(node.id);
    const tone = t.marks[node.id];
    out.push({
      type: 'circle',
      key: `${t.name}:n:${node.id}`,
      x: c.x,
      y: c.y,
      radius,
      fill: tone ? p.tones[tone] : p.panel,
      stroke: tone ? p.tones[tone] : p.base,
      opacity: 1,
    });
    out.push(
      text(
        `${t.name}:v:${node.id}`,
        c.x,
        c.y + 5,
        label(node.value),
        13,
        tone ? '#ffffff' : p.ink,
        'center',
        700,
        true,
      ),
    );
  }
  return radius * 2 + layout.depth * levelH + 6;
}
