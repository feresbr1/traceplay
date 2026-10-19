export const meta = {
  title: 'Heapsort: the array is the tree',
  description:
    'A max-heap stored in an array: children of i live at 2i+1 and 2i+2. Watch both views change together.',
  code: `function heapsort(a) {
  for (let i = (a.length >> 1) - 1; i >= 0; i--) siftDown(a, i, a.length);
  for (let end = a.length - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    siftDown(a, 0, end);
  }
}
function siftDown(a, i, n) {
  while (true) {
    const l = 2 * i + 1, r = l + 1;
    let big = i;
    if (l < n && a[l] > a[big]) big = l;
    if (r < n && a[r] > a[big]) big = r;
    if (big === i) return;
    [a[i], a[big]] = [a[big], a[i]];
    i = big;
  }
}`,
};

export default function (t) {
  const values = [16, 4, 10, 14, 7, 9, 3, 2, 8, 1];
  const a = t.array('array', values);
  const tree = t.tree('heap');
  const ids = [];

  // Mirror the heap part of the array (indexes < size) as a binary tree.
  const sync = (size, highlight = {}) => {
    t.batch(() => {
      ids.length = 0;
      if (size === 0) return;
      ids[0] = tree.setRoot(a.get(0));
      for (let i = 1; i < size; i++) {
        ids[i] = tree.add(ids[(i - 1) >> 1], a.get(i), i % 2 === 1 ? 'left' : 'right');
      }
      tree.unmark();
      for (const [i, tone] of Object.entries(highlight)) if (ids[i]) tree.mark(ids[i], tone);
    });
  };

  const siftDown = (i, n) => {
    for (;;) {
      t.line(10);
      const l = 2 * i + 1;
      const r = l + 1;
      let big = i;
      t.line(12);
      if (l < n) {
        a.compare(l, big);
        if (a.get(l) > a.get(big)) big = l;
      }
      t.line(13);
      if (r < n) {
        a.compare(r, big);
        if (a.get(r) > a.get(big)) big = r;
      }
      t.line(14);
      if (big === i) return;
      t.line(15);
      t.say(`${a.get(big)} is larger than its parent ${a.get(i)}: swap them.`);
      a.swap(i, big);
      sync(n, { [i]: 'swap', [big]: 'swap' });
      t.line(16);
      i = big;
    }
  };

  t.say('Build a max-heap: sift down every parent, from the last one to the root.');
  sync(values.length);
  for (let i = (values.length >> 1) - 1; i >= 0; i--) {
    t.line(2);
    t.say(`Sift down a[${i}] = ${a.get(i)}.`);
    sync(values.length, { [i]: 'active' });
    siftDown(i, values.length);
  }
  t.say('Max-heap built: the largest value is at the root.');
  sync(values.length, { 0: 'found' });

  for (let end = values.length - 1; end > 0; end--) {
    t.line(4);
    t.say(`Move the max (${a.get(0)}) to the end, shrink the heap, repair it.`);
    a.swap(0, end);
    a.mark(end, 'done');
    sync(end, { 0: 'swap' });
    t.line(5);
    siftDown(0, end);
  }
  a.mark(0, 'done');
  sync(0);
  t.say('Sorted, in place, in O(n log n).');
  t.step();
}
