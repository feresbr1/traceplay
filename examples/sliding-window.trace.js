export const meta = {
  title: 'Longest substring without repeating characters',
  description:
    'A sliding window: grow on the right, shrink from the left whenever a character repeats.',
  code: `function longestUnique(s) {
  const last = new Map();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
};

export default function (t) {
  const s = 'abcabcbbxyzab';
  const a = t.array('s', [...s], { style: 'cells' });
  const v = t.vars('window', { left: 0, right: 0, best: 0, bestWindow: '' });
  const last = new Map();
  let left = 0;
  let best = 0;

  t.say('Keep a window with no repeated characters.');
  t.line(3);
  a.pointer('L', 0);
  for (let right = 0; right < s.length; right++) {
    t.line(4);
    a.pointer('R', right);
    const ch = s[right];
    t.line(6);
    if (last.has(ch) && last.get(ch) >= left) {
      t.say(`"${ch}" is already in the window at ${last.get(ch)}: move left past it.`);
      a.focus(last.get(ch), 'error');
      left = last.get(ch) + 1;
      a.pointer('L', left);
    }
    t.line(7);
    last.set(ch, right);
    t.line(8);
    const window = s.slice(left, right + 1);
    if (right - left + 1 > best) {
      best = right - left + 1;
      t.say(`New best: "${window}" (${best} characters).`);
      v.set({ left, right, best, bestWindow: window });
    } else {
      v.set({ left, right });
    }
    t.batch(() => {
      a.unmark();
      for (let i = left; i <= right; i++) a.mark(i, 'frontier');
    }, `window "${window}"`);
  }
  t.line(10);
  t.say(`Answer: ${best}.`);
  t.step();
}
