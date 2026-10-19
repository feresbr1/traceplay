export const meta = {
  title: 'Binary search',
  description: 'Halve the search range until the target is found or the range is empty.',
  code: `function binarySearch(a, target) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (a[mid] === target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
};

export default function (t) {
  const values = [2, 5, 8, 12, 16, 23, 38, 41, 56, 72, 91, 99];
  const target = 72;
  const a = t.array('a', values, { style: 'cells' });
  const v = t.vars('search', { target, lo: 0, hi: values.length - 1, mid: null });
  t.say(`Find ${target} in a sorted array.`);

  t.line(2);
  let lo = 0;
  let hi = values.length - 1;
  a.pointer('lo', lo);
  a.pointer('hi', hi);
  while (lo <= hi) {
    t.line(3);
    t.line(4);
    const mid = (lo + hi) >> 1;
    v.set('mid', mid);
    a.pointer('mid', mid);
    a.focus(mid, 'compare');
    t.line(5);
    if (a.get(mid) === target) {
      t.say(`a[${mid}] is ${target}. Found it after ${countSteps(values, target)} comparisons.`);
      a.mark(mid, 'found');
      return;
    }
    t.line(6);
    if (a.get(mid) < target) {
      t.say(`${a.get(mid)} < ${target}: discard the left half.`);
      a.mark(range(lo, mid), 'muted');
      lo = mid + 1;
      v.set('lo', lo);
      a.pointer('lo', lo);
    } else {
      t.line(7);
      t.say(`${a.get(mid)} > ${target}: discard the right half.`);
      a.mark(range(mid, hi), 'muted');
      hi = mid - 1;
      v.set('hi', hi);
      a.pointer('hi', hi);
    }
  }
  t.line(9);
  t.step('Not found.');
}

function range(from, to) {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

function countSteps(values, target) {
  let lo = 0;
  let hi = values.length - 1;
  let n = 0;
  while (lo <= hi) {
    n++;
    const mid = (lo + hi) >> 1;
    if (values[mid] === target) return n;
    if (values[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return n;
}
