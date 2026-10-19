# traceplay API reference

A trace file:

```js
export const meta = { title: 'Name', description: 'One line', code: `original source` };
export default function (t) {
  /* run the algorithm with tracked structures */
}
```

Every call that changes something or highlights something records one frame (a snapshot of all structures). Highlights from `compare`, `swap`, `focus`, `set` and `add` last one frame; `mark` lasts until `unmark`.

## Narration and code

| Call                  | Effect                                                             |
| --------------------- | ------------------------------------------------------------------ |
| `t.say(text)`         | Caption shown from now until the next `say`                        |
| `t.line(n)`           | Highlight line `n` (1-based) of `meta.code` from the next frame on |
| `t.step(caption?)`    | Record a frame explicitly                                          |
| `t.batch(fn, event?)` | Run many changes inside `fn` as a single frame                     |

## Arrays: `t.array(name, values, { style })`

`style` is `'bars'` (default for numbers) or `'cells'` (default for strings).

`a.length`, `a.get(i)`, `a.values()`, `a.set(i, v)`, `a.swap(i, j)`, `a.compare(i, j)`, `a.focus(i, tone?)`, `a.mark(i | [i, …], tone?)`, `a.unmark(i?)`, `a.pointer(name, i | null)`, `a.push(v)`, `a.pop()`, `a.shift()`, `a.unshift(v)`

Swapped items keep their identity, so they slide to their new positions.

## Grids: `t.grid(name, rows)`

`rows` is a 2-D array; the value `'#'` draws a wall.

`g.rows`, `g.cols`, `g.get(r, c)`, `g.set(r, c, v)`, `g.mark(r, c, tone?)`, `g.unmark(r?, c?)`, `g.focus(r, c, tone?)`, `g.pointer(name, r | null, c?)`

## Graphs: `t.graph(name, { nodes, edges, directed?, layout? })`

- `nodes`: `'A'` or `{ id, label?, x?, y? }` (x/y on every node selects the manual layout)
- `edges`: `['A', 'B']`, `['A', 'B', weight]` or `{ from, to, weight }`
- `layout`: `'circle'` (default up to 10 nodes), `'force'`, `'layered'` (DAGs, left to right), `'manual'`

`g.neighbors(id)`, `g.weight(a, b)`, `g.mark(id, tone?)`, `g.unmark(id?)`, `g.focus(id, tone?)`, `g.markEdge(a, b, tone?)`, `g.focusEdge(a, b, tone?)`, `g.badge(id, value | null)` (a small label, for example a distance)

## Trees: `t.tree(name, { binary? })`

Binary by default; pass `{ binary: false }` for n-ary trees. Node ids are returned by `setRoot` and `add`.

`tr.setRoot(value)`, `tr.add(parentId, value, 'left' | 'right')` (n-ary: no side), `tr.root`, `tr.value(id)`, `tr.left(id)`, `tr.right(id)`, `tr.children(id)`, `tr.parent(id)`, `tr.setValue(id, v)`, `tr.remove(id)`, `tr.attach(id, parentId | null, side?)`, `tr.detach(parentId, side)`, `tr.mark(id, tone?)`, `tr.unmark(id?)`, `tr.focus(id, tone?)`

Rotations: `t.batch(() => { tr.detach(…); tr.attach(…); … })`.

## Variables: `t.vars(name, initial)`

`v.get(key)`, `v.set(key, value)`, `v.set({ key: value, … })`. Changed values are highlighted in the side panel.

## Tones

`active` `compare` `swap` `done` `visited` `frontier` `path` `found` `muted` `error` `pivot`

## Limits

At most 5,000 frames per trace; use `t.batch` for bulk updates. Values are numbers, strings, booleans or null.

## CLI

```sh
npx -y github:feresbr1/traceplay check  file.trace.js      # run + summary
npx -y github:feresbr1/traceplay render file.trace.js      # → file.html (self-contained player)
npx -y github:feresbr1/traceplay render file.trace.js -o out.html --theme dark --open
npx -y github:feresbr1/traceplay render file.trace.js --json # → trace JSON
npx -y github:feresbr1/traceplay init my-algo                # starter trace
npx -y github:feresbr1/traceplay docs                        # this reference
```
