import { readdirSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { evaluateTraceSource, toTraceModule } from '../src/core/module';
import {
  MAX_FRAMES,
  runTrace,
  TraceError,
  type ArrayState,
  type GraphState,
  type GridState,
  type TreeState,
} from '../src/core/trace';
import { graphLayout, treeLayout } from '../src/player/layout';
import { buildScene, LIGHT } from '../src/player/scene';
import { interpolate } from '../src/player/render';

const arrayOf = (trace: ReturnType<typeof runTrace>, i: number) =>
  trace.frames[i]!.structs[0] as ArrayState;

describe('arrays', () => {
  it('records a frame per change with snapshots and stable item keys', () => {
    const trace = runTrace((t) => {
      const a = t.array('a', [3, 1, 2]);
      a.compare(0, 1);
      a.swap(0, 1);
      a.set(2, 9);
    });
    expect(trace.frames).toHaveLength(4);
    expect(trace.frames.map((f) => f.event)).toEqual([
      'create a',
      'compare a[0] and a[1]',
      'swap a[0] and a[1]',
      'a[2] = 9',
    ]);
    // Snapshots are independent copies.
    expect(arrayOf(trace, 0).items.map((i) => i.value)).toEqual([3, 1, 2]);
    expect(arrayOf(trace, 3).items.map((i) => i.value)).toEqual([1, 3, 9]);
    // The swapped items keep their keys, so the player can slide them.
    expect(arrayOf(trace, 2).items.map((i) => i.key)).toEqual(['a#1', 'a#0', 'a#2']);
  });

  it('keeps persistent marks and clears one-frame highlights', () => {
    const trace = runTrace((t) => {
      const a = t.array('a', [1, 2, 3]);
      a.mark(0, 'done');
      a.compare(0, 1);
      t.step('after');
    });
    expect(arrayOf(trace, 2).marks).toEqual({ 0: 'compare', 1: 'compare' });
    expect(arrayOf(trace, 3).marks).toEqual({ 0: 'done' });
  });

  it('supports pointers, push/pop/shift/unshift and cells style for strings', () => {
    const trace = runTrace((t) => {
      const q = t.array('q', ['a', 'b']);
      q.pointer('head', 0);
      q.push('c');
      q.shift();
      q.unshift('z');
      expect(q.pop()).toBe('c');
      q.pointer('head', null);
    });
    const last = arrayOf(trace, trace.frames.length - 1);
    expect(last.style).toBe('cells');
    expect(last.items.map((i) => i.value)).toEqual(['z', 'b']);
    expect(last.pointers).toEqual([]);
  });

  it('explains mistakes', () => {
    expect(() => runTrace((t) => t.array('a', [1]).swap(0, 5))).toThrow(/Index 5 is outside a/);
    expect(() => runTrace((t) => t.array('a', [1]).mark(0, 'shiny' as never))).toThrow(
      /Unknown tone "shiny"/,
    );
    expect(() =>
      runTrace((t) => {
        t.array('a', [1]);
        t.array('a', [2]);
      }),
    ).toThrow(/already exists/);
    expect(() => runTrace(() => {})).toThrow(/no frames/);
  });

  it('caps runaway traces', () => {
    expect(() =>
      runTrace((t) => {
        const a = t.array('a', [1, 2]);
        for (;;) a.swap(0, 1);
      }),
    ).toThrow(new RegExp(`More than ${MAX_FRAMES} frames`));
  });

  it('groups changes with batch()', () => {
    const trace = runTrace((t) => {
      const a = t.array('a', [1, 2, 3]);
      t.batch(() => {
        a.set(0, 7);
        a.set(1, 8);
      }, 'two writes');
    });
    expect(trace.frames).toHaveLength(2);
    expect(trace.frames[1]!.event).toBe('two writes');
  });
});

describe('other structures', () => {
  it('grids', () => {
    const trace = runTrace((t) => {
      const g = t.grid('g', [
        ['', '#'],
        ['', ''],
      ]);
      g.mark(1, 0, 'visited');
      g.pointer('me', 1, 1);
      g.set(0, 0, 5);
    });
    const last = trace.frames.at(-1)!.structs[0] as GridState;
    expect(last.cells).toEqual([
      [5, '#'],
      ['', ''],
    ]);
    // set() flashes the cell for that frame only.
    expect(last.marks).toEqual({ '1,0': 'visited', '0,0': 'active' });
    expect(last.pointers).toEqual([{ name: 'me', row: 1, col: 1 }]);
    expect(() => runTrace((t) => t.grid('g', [['']]).mark(3, 3))).toThrow(/outside g/);
  });

  it('graphs: neighbours, weights, marks, badges, validation', () => {
    const trace = runTrace((t) => {
      const g = t.graph('g', {
        nodes: ['A', 'B', 'C'],
        edges: [
          ['A', 'B', 4],
          ['B', 'C'],
        ],
      });
      expect(g.neighbors('B').sort()).toEqual(['A', 'C']);
      expect(g.weight('B', 'A')).toBe(4);
      g.markEdge('B', 'A', 'path');
      g.badge('C', 7);
      g.focus('A');
    });
    const last = trace.frames.at(-1)!.structs[0] as GraphState;
    expect(last.edgeMarks).toEqual({ 'A->B': 'path' });
    expect(last.nodeBadges).toEqual({ C: 7 });
    expect(last.nodeMarks).toEqual({ A: 'active' });
    expect(() => runTrace((t) => t.graph('g', { nodes: ['A'], edges: [['A', 'Z']] }))).toThrow(
      /refers to a node/,
    );
    const directed = runTrace((t) => {
      const g = t.graph('d', { nodes: ['A', 'B'], edges: [['A', 'B']], directed: true });
      expect(g.neighbors('B')).toEqual([]);
    });
    expect((directed.frames[0]!.structs[0] as GraphState).directed).toBe(true);
  });

  it('binary trees: add, attach (rotation), remove', () => {
    const trace = runTrace((t) => {
      const tr = t.tree('t');
      const root = tr.setRoot(2);
      const left = tr.add(root, 1, 'left');
      tr.add(root, 3, 'right');
      expect(tr.left(root)).toBe(left);
      expect(tr.parent(left)).toBe(root);
      expect(() => tr.add(root, 0, 'left')).toThrow(/already has a left child/);
      // Right-rotate: left child becomes root.
      t.batch(() => {
        tr.detach(root, 'left');
        tr.attach(left, null);
        tr.attach(root, left, 'right');
      });
      tr.remove(tr.right(root)!);
    });
    const last = trace.frames.at(-1)!.structs[0] as TreeState;
    expect(last.nodes[last.root!]!.value).toBe(1);
    expect(
      Object.values(last.nodes)
        .map((n) => n.value)
        .sort(),
    ).toEqual([1, 2]);
    const layout = treeLayout(last);
    expect(layout.depth).toBe(1);
  });

  it('variables track what changed', () => {
    const trace = runTrace((t) => {
      const v = t.vars('v', { a: 1 });
      v.set({ a: 2, b: 'x' });
    });
    expect(trace.frames[1]!.structs[0]).toMatchObject({
      values: { a: 2, b: 'x' },
      changed: ['a', 'b'],
    });
    expect(trace.frames[1]!.event).toBe('a = 2, b = "x"');
  });

  it('a closing say() still gets a frame', () => {
    const trace = runTrace((t) => {
      t.array('a', [1]);
      t.say('the end');
    });
    expect(trace.frames.map((f) => f.caption)).toEqual(['', 'the end']);
  });

  it('captions and code lines carry over', () => {
    const trace = runTrace((t) => {
      t.say('hello');
      t.line(3);
      t.array('a', [1]);
      t.step();
    });
    expect(trace.frames.map((f) => [f.caption, f.line])).toEqual([
      ['hello', 3],
      ['hello', 3],
    ]);
  });
});

describe('layout and rendering', () => {
  it('graph layouts are deterministic and inside the unit square', () => {
    const g: GraphState = {
      kind: 'graph',
      name: 'g',
      directed: false,
      layout: 'force',
      nodes: 'ABCDEFGHIJKL'.split('').map((id) => ({ id, label: id })),
      edges: 'ABCDEFGHIJK'.split('').map((id, i) => ({ from: id, to: 'ABCDEFGHIJKL'[i + 1]! })),
      nodeMarks: {},
      edgeMarks: {},
      nodeBadges: {},
    };
    const a = graphLayout(g);
    expect(graphLayout(g)).toEqual(a);
    for (const p of Object.values(a)) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(1);
    }
    expect(Object.keys(graphLayout({ ...g, layout: 'layered' }))).toHaveLength(12);
  });

  it('scenes have stable keys so swaps animate, and interpolation is continuous', () => {
    const trace = runTrace((t) => {
      const a = t.array('a', [5, 1]);
      a.swap(0, 1);
    });
    const cache = new Map();
    const s0 = buildScene(trace.frames[0]!, LIGHT, cache);
    const s1 = buildScene(trace.frames[1]!, LIGHT, cache);
    const bar = (s: typeof s0, key: string) => s.shapes.find((x) => x.key === key) as { x: number };
    expect(bar(s1, 'a#0:bar').x).toBeGreaterThan(bar(s0, 'a#0:bar').x);
    const mid = interpolate(s0, s1, 0.5);
    const x = bar(mid, 'a#0:bar').x;
    expect(x).toBeGreaterThan(bar(s0, 'a#0:bar').x);
    expect(x).toBeLessThan(bar(s1, 'a#0:bar').x);
  });
});

describe('trace modules', () => {
  it('evaluates trace source in the playground format', () => {
    const mod = evaluateTraceSource(
      `export const meta = { title: 'x' };\nexport default function (t) { t.array('a', [1]); }`,
    );
    expect(mod.meta.title).toBe('x');
    expect(runTrace(mod.fn, mod.meta).frames).toHaveLength(1);
    expect(() => evaluateTraceSource(`import x from 'y';\nexport default (t) => {}`)).toThrow(
      /import statements/,
    );
    expect(() => evaluateTraceSource('const x = 1;')).toThrow(/export default/);
    expect(() => toTraceModule({ default: 3 })).toThrow(TraceError);
  });
});

describe('examples', () => {
  const dir = new URL('../examples/', import.meta.url);
  const files = readdirSync(dir).filter((f) => f.endsWith('.trace.js'));

  it('there are examples', () => {
    expect(files.length).toBeGreaterThanOrEqual(8);
  });

  it.each(files)('%s runs, is reasonable, and works in both loaders', async (file) => {
    const mod = toTraceModule(
      await import(pathToFileURL(new URL(file, dir).pathname.replace(/^\/([A-Za-z]:)/, '$1')).href),
    );
    const trace = runTrace(mod.fn, mod.meta);
    expect(trace.meta.title).toBeTruthy();
    expect(trace.frames.length).toBeGreaterThan(5);
    expect(trace.frames.length).toBeLessThan(1500);
    const lines = (mod.meta.code ?? '').split('\n').length;
    for (const f of trace.frames)
      if (f.line !== undefined) expect(f.line).toBeLessThanOrEqual(lines);
    // The same file through the playground's evaluator produces the same trace.
    const viaSource = evaluateTraceSource(readFileSync(new URL(file, dir), 'utf8'));
    expect(runTrace(viaSource.fn, viaSource.meta).frames.length).toBe(trace.frames.length);
    // Every frame renders.
    const cache = new Map();
    for (const f of trace.frames)
      expect(buildScene(f, LIGHT, cache).shapes.length).toBeGreaterThan(0);
  });
});
