const SECTIONS: { title: string; code: string }[] = [
  {
    title: 'Narration and code',
    code: `t.say('Partition around 7')   // caption until the next say()
t.line(5)                     // highlight line 5 of meta.code
t.step('Done')                // record a frame explicitly
t.batch(() => { ... }, 'why') // many changes, one frame`,
  },
  {
    title: 'Arrays (bars for numbers, cells for text)',
    code: `const a = t.array('a', [5, 2, 8], { style: 'bars' })
a.get(i)  a.length  a.values()
a.compare(i, j)   a.swap(i, j)   a.set(i, v)
a.focus(i, tone)  a.mark(i | [i...], tone)  a.unmark(i?)
a.pointer('lo', i)   a.pointer('lo', null)
a.push(v) a.pop() a.shift() a.unshift(v)   // stacks, queues`,
  },
  {
    title: 'Grids',
    code: `const g = t.grid('maze', rows)   // '#' draws a wall
g.get(r, c)  g.set(r, c, v)  g.rows  g.cols
g.mark(r, c, tone)  g.focus(r, c)  g.unmark()
g.pointer('me', r, c)`,
  },
  {
    title: 'Graphs',
    code: `const g = t.graph('g', {
  nodes: ['A', 'B', { id: 'C', x: 2, y: 0 }],
  edges: [['A', 'B', 4], ['B', 'C']],
  directed: false, layout: 'circle' | 'force' | 'layered' | 'manual',
})
g.neighbors('A')  g.weight('A', 'B')
g.mark('A', tone)  g.focus('A')  g.badge('A', 7)
g.markEdge('A', 'B', tone)  g.focusEdge('A', 'B')`,
  },
  {
    title: 'Trees',
    code: `const tr = t.tree('bst')            // { binary: false } for n-ary
const root = tr.setRoot(50)
const l = tr.add(root, 30, 'left')
tr.value(id) tr.left(id) tr.right(id) tr.parent(id)
tr.setValue(id, v)  tr.remove(id)
tr.attach(id, newParent, side)   // rotations
tr.mark(id, tone)  tr.focus(id)`,
  },
  {
    title: 'Variables and tones',
    code: `const v = t.vars('state', { lo: 0, hi: 9 })
v.set('lo', 3)   v.set({ lo: 3, hi: 7 })

tones: active compare swap done visited frontier
       path found muted error pivot`,
  },
];

export function Reference() {
  return (
    <section aria-labelledby="ref-title">
      <h2
        id="ref-title"
        style={{ fontSize: '22px', letterSpacing: '-0.02em', margin: '8px 0 12px' }}
      >
        API reference
      </h2>
      <div class="ref">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h3>{s.title}</h3>
            <pre>{s.code}</pre>
          </div>
        ))}
      </div>
    </section>
  );
}
