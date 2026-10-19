export const meta = {
  title: 'Quicksort (Lomuto partition)',
  description:
    'Pick the last element as pivot, move smaller values left of it, then sort both sides.',
  code: `function quicksort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    if (a[j] < pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  quicksort(a, lo, i - 1);
  quicksort(a, i + 1, hi);
}`,
};

export default function (t) {
  const input = [38, 27, 43, 3, 9, 82, 10, 64, 51, 17, 70, 25];
  const a = t.array('a', input);
  const v = t.vars('state', { lo: 0, hi: input.length - 1, pivot: null });

  function quicksort(lo, hi) {
    t.line(2);
    if (lo >= hi) {
      if (lo === hi) a.mark(lo, 'done');
      return;
    }
    v.set({ lo, hi });
    t.line(3);
    const pivot = a.get(hi);
    v.set('pivot', pivot);
    t.say(`Partition a[${lo}..${hi}] around pivot ${pivot}.`);
    a.mark(hi, 'pivot');
    t.line(4);
    let i = lo;
    a.pointer('i', i);
    for (let j = lo; j < hi; j++) {
      t.line(5);
      a.pointer('j', j);
      t.line(6);
      a.compare(j, hi);
      if (a.get(j) < pivot) {
        t.line(7);
        if (i !== j) a.swap(i, j);
        t.line(8);
        i++;
        a.pointer('i', i);
      }
    }
    t.line(11);
    t.say(`Put the pivot ${pivot} in its final place, index ${i}.`);
    a.pointer('j', null);
    a.unmark(hi);
    if (i !== hi) a.swap(i, hi);
    a.mark(i, 'done');
    a.pointer('i', null);
    t.line(12);
    quicksort(lo, i - 1);
    t.line(13);
    quicksort(i + 1, hi);
  }

  quicksort(0, input.length - 1);
  t.say('Sorted.');
  a.mark([...Array(a.length).keys()], 'done');
}
