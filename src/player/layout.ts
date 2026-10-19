import type { GraphState, TreeState } from '../core/trace';

export interface Point {
  x: number;
  y: number;
}

/** Deterministic pseudo-random numbers, so a graph always lays out the same way. */
function seeded(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

/** Node positions in the unit square [0,1]². */
export function graphLayout(g: GraphState): Record<string, Point> {
  const n = g.nodes.length;
  const out: Record<string, Point> = {};
  if (n === 0) return out;

  if (g.layout === 'manual') {
    const xs = g.nodes.map((v) => v.x ?? 0);
    const ys = g.nodes.map((v) => v.y ?? 0);
    const [minX, maxX, minY, maxY] = [
      Math.min(...xs),
      Math.max(...xs),
      Math.min(...ys),
      Math.max(...ys),
    ];
    for (const v of g.nodes) {
      out[v.id] = {
        x: maxX === minX ? 0.5 : ((v.x ?? 0) - minX) / (maxX - minX),
        y: maxY === minY ? 0.5 : ((v.y ?? 0) - minY) / (maxY - minY),
      };
    }
    return out;
  }

  if (g.layout === 'layered') {
    // Longest-path layering from nodes with no incoming edges.
    const incoming = new Map(g.nodes.map((v) => [v.id, 0]));
    for (const e of g.edges) incoming.set(e.to, (incoming.get(e.to) ?? 0) + 1);
    const level = new Map<string, number>();
    const visit = (id: string, depth: number, seen: Set<string>) => {
      if (seen.has(id)) return;
      if ((level.get(id) ?? -1) >= depth) return;
      level.set(id, depth);
      seen.add(id);
      for (const e of g.edges) if (e.from === id) visit(e.to, depth + 1, seen);
      seen.delete(id);
    };
    for (const v of g.nodes) if (!incoming.get(v.id)) visit(v.id, 0, new Set());
    for (const v of g.nodes) if (!level.has(v.id)) level.set(v.id, 0);
    const maxLevel = Math.max(...level.values());
    const byLevel = new Map<number, string[]>();
    for (const v of g.nodes) {
      const l = level.get(v.id)!;
      byLevel.set(l, [...(byLevel.get(l) ?? []), v.id]);
    }
    for (const [l, ids] of byLevel) {
      ids.forEach((id, i) => {
        out[id] = { x: maxLevel === 0 ? 0.5 : l / maxLevel, y: (i + 1) / (ids.length + 1) };
      });
    }
    return out;
  }

  // Circle, used as is or as the start of a force layout.
  g.nodes.forEach((v, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    out[v.id] = { x: 0.5 + 0.42 * Math.cos(a), y: 0.5 + 0.42 * Math.sin(a) };
  });
  if (g.layout === 'circle' || n < 3) return out;

  // Fruchterman–Reingold, deterministic.
  const rand = seeded(n * 7919 + g.edges.length);
  const pos = g.nodes.map((v) => ({ ...out[v.id]!, x: out[v.id]!.x + (rand() - 0.5) * 0.05 }));
  const index = new Map(g.nodes.map((v, i) => [v.id, i]));
  const k = Math.sqrt(1 / n);
  let temp = 0.1;
  for (let iter = 0; iter < 300; iter++) {
    const disp = pos.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[i]!.x - pos[j]!.x;
        const dy = pos[i]!.y - pos[j]!.y;
        const d = Math.max(0.001, Math.hypot(dx, dy));
        const f = (k * k) / d;
        disp[i]!.x += (dx / d) * f;
        disp[i]!.y += (dy / d) * f;
        disp[j]!.x -= (dx / d) * f;
        disp[j]!.y -= (dy / d) * f;
      }
    }
    for (const e of g.edges) {
      const a = index.get(e.from)!;
      const b = index.get(e.to)!;
      const dx = pos[a]!.x - pos[b]!.x;
      const dy = pos[a]!.y - pos[b]!.y;
      const d = Math.max(0.001, Math.hypot(dx, dy));
      const f = (d * d) / k;
      disp[a]!.x -= (dx / d) * f;
      disp[a]!.y -= (dy / d) * f;
      disp[b]!.x += (dx / d) * f;
      disp[b]!.y += (dy / d) * f;
    }
    for (let i = 0; i < n; i++) {
      const d = Math.max(0.001, Math.hypot(disp[i]!.x, disp[i]!.y));
      pos[i]!.x += (disp[i]!.x / d) * Math.min(d, temp);
      pos[i]!.y += (disp[i]!.y / d) * Math.min(d, temp);
    }
    temp *= 0.985;
  }
  const xs = pos.map((p) => p.x);
  const ys = pos.map((p) => p.y);
  const [minX, maxX, minY, maxY] = [
    Math.min(...xs),
    Math.max(...xs),
    Math.min(...ys),
    Math.max(...ys),
  ];
  g.nodes.forEach((v, i) => {
    out[v.id] = {
      x: maxX === minX ? 0.5 : (pos[i]!.x - minX) / (maxX - minX),
      y: maxY === minY ? 0.5 : (pos[i]!.y - minY) / (maxY - minY),
    };
  });
  return out;
}

export interface TreeLayout {
  /** Node id → (column, depth). Columns may be fractional. */
  positions: Record<string, { col: number; depth: number }>;
  columns: number;
  depth: number;
}

/**
 * Binary trees: x is the in-order position, so the drawing reads like a sorted list.
 * General trees: leaves take successive columns and parents sit over their children.
 */
export function treeLayout(tree: TreeState): TreeLayout {
  const positions: TreeLayout['positions'] = {};
  let col = 0;
  let maxDepth = 0;
  const walkBinary = (id: string | null, depth: number) => {
    if (!id) return;
    const node = tree.nodes[id];
    if (!node) return;
    walkBinary(node.children[0] ?? null, depth + 1);
    positions[id] = { col: col++, depth };
    maxDepth = Math.max(maxDepth, depth);
    walkBinary(node.children[1] ?? null, depth + 1);
  };
  const walkGeneral = (id: string, depth: number): number => {
    const node = tree.nodes[id];
    maxDepth = Math.max(maxDepth, depth);
    const kids = (node?.children ?? []).filter((c): c is string => Boolean(c && tree.nodes[c]));
    if (!kids.length) {
      positions[id] = { col: col++, depth };
    } else {
      const cols = kids.map((k) => walkGeneral(k, depth + 1));
      positions[id] = { col: (cols[0]! + cols[cols.length - 1]!) / 2, depth };
    }
    return positions[id]!.col;
  };
  if (tree.root) {
    if (tree.binary) walkBinary(tree.root, 0);
    else walkGeneral(tree.root, 0);
  }
  return { positions, columns: col, depth: maxDepth };
}
