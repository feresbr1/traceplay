---
name: traceplay
description: Explain an algorithm or a piece of code by animating a real execution of it. Use when the user asks to visualize, animate, illustrate or step through how code, an algorithm or a data structure works (sorting, searching, graphs, trees, grids, caches, queues, recursion, DP tables), or wants a shareable interactive demo, GIF or HTML file of code running.
---

# traceplay: animate real executions

traceplay turns code into an interactive, step-by-step animation. You write a **trace**: a small JavaScript file that runs the real algorithm on a concrete input and calls a few `t.*` methods to say what to show. Every frame comes from that execution, so the animation is always faithful to the code.

## Workflow

1. **Find the real code.** Read the implementation the user is asking about. Don't invent a different algorithm. If it is not JavaScript, port it to JavaScript faithfully, with the same steps and names.
2. **Pick a small, telling input.** 6–14 array items, a 6–10 node graph, a maze of about 10×16, a tree of about 10 nodes. Choose an input that shows the interesting case (a collision, a rejection, an eviction, a rotation).
3. **Write `<name>.trace.js`** (see the template and `REFERENCE.md`):
   - `export const meta = { title, description, code }`. `code` is the original function's source, exactly, and `t.line(n)` refers to its lines (1-based).
   - `export default function (t) { ... }` runs the algorithm with tracked structures instead of plain arrays and objects.
   - Use `t.say()` for one-sentence narration at each meaningful moment ("4 > 2: swap them", "Bucket empty: reject request 9").
   - Use `t.batch(() => { ... })` to make bulk updates one frame. Aim for 20–400 frames.
4. **Check it:** `npx -y github:feresbr1/traceplay check <name>.trace.js`. It runs the trace and reports frame count, structures, narration and code-line coverage, and any error. Fix and re-run until it is clean.
5. **Render it:** `npx -y github:feresbr1/traceplay render <name>.trace.js` writes `<name>.html`, a single self-contained interactive player (open it in a browser, embed it with an iframe, or attach it). Add `--open` to open it.
6. **Report** what the animation shows and where the file is. Mention that the user can export a GIF from the player's GIF button.

If you cannot run commands, give the user the trace file and tell them to paste it into https://feresbr1.github.io/traceplay/#/play.

## Template

```js
export const meta = {
  title: 'Insertion sort',
  description: 'Each element slides left until the part before it is sorted.',
  code: `function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    for (let j = i; j > 0 && a[j - 1] > a[j]; j--) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
    }
  }
}`,
};

export default function (t) {
  const a = t.array('a', [7, 3, 9, 1, 5]);
  for (let i = 1; i < a.length; i++) {
    t.line(2);
    t.say(`Insert ${a.get(i)} into the sorted part on its left.`);
    for (let j = i; j > 0; j--) {
      t.line(3);
      a.compare(j - 1, j);
      if (a.get(j - 1) <= a.get(j)) break;
      t.line(4);
      a.swap(j - 1, j);
    }
  }
  t.say('Sorted.');
  a.mark([0, 1, 2, 3, 4], 'done');
}
```

## Rules

- The trace must **run the algorithm**. Read values back with `a.get(i)`, `g.neighbors(id)`, `tree.left(id)` and so on, and let the real logic decide the next step. Never hard-code a sequence of animation steps.
- Keep `meta.code` identical to the code you are explaining, and keep `t.line()` numbers accurate.
- Use tones consistently: `compare` for comparisons, `swap` for exchanges, `done` for finished parts, `visited` / `frontier` / `path` for searches, `found` for the answer, `muted` for discarded parts, `error` for conflicts.
- One structure per concept, with short names that match the code (`a`, `queue`, `dist`, `heap`).
- Run `npx -y github:feresbr1/traceplay docs` to see the whole API.
