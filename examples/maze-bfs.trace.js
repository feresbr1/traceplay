export const meta = {
  title: 'Breadth-first search through a maze',
  description:
    'Explore the maze in rings of equal distance; the first time the exit is reached is the shortest path.',
  code: `function bfs(grid, start, goal) {
  const queue = [start];
  const prev = new Map([[key(start), null]]);
  while (queue.length) {
    const cell = queue.shift();
    if (same(cell, goal)) return path(prev, goal);
    for (const next of neighbours(grid, cell)) {
      if (prev.has(key(next))) continue;
      prev.set(key(next), cell);
      queue.push(next);
    }
  }
  return null;
}`,
};

const MAZE = [
  'S..#.......#....',
  '.#.#.#####.#.##.',
  '.#...#...#...#..',
  '.#####.#.#####.#',
  '...#...#.....#..',
  '##.#.#######.##.',
  '.....#.....#....',
  '.###.#.###.####.',
  '...#...#.......G',
];

export default function (t) {
  const cells = MAZE.map((row) => [...row].map((ch) => (ch === '#' ? '#' : ch === '.' ? '' : ch)));
  const grid = t.grid('maze', cells);
  const start = [0, 0];
  const goal = [MAZE.length - 1, MAZE[0].length - 1];
  const key = ([r, c]) => `${r},${c}`;
  const queue = [start];
  const prev = new Map([[key(start), null]]);
  const v = t.vars('bfs', { queued: 1, explored: 0 });

  t.say('Explore outward from S, one ring of equal distance at a time.');
  t.line(2);
  grid.mark(start[0], start[1], 'frontier');
  let explored = 0;
  while (queue.length) {
    t.line(5);
    const [r, c] = queue.shift();
    grid.pointer('here', r, c);
    if (r === goal[0] && c === goal[1]) {
      t.line(6);
      break;
    }
    explored++;
    grid.mark(r, c, 'visited');
    t.line(7);
    t.batch(() => {
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
      ]) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= cells.length || nc >= cells[0].length) continue;
        if (cells[nr][nc] === '#' || prev.has(key([nr, nc]))) continue;
        prev.set(key([nr, nc]), [r, c]);
        queue.push([nr, nc]);
        grid.mark(nr, nc, 'frontier');
      }
      v.set({ queued: queue.length, explored });
    }, `expand (${r}, ${c})`);
  }

  const path = [];
  for (let cur = goal; cur; cur = prev.get(key(cur))) path.unshift(cur);
  t.say(`Reached G. Shortest path: ${path.length - 1} steps; ${explored} cells explored.`);
  grid.pointer('here', null);
  for (const [r, c] of path) grid.mark(r, c, 'path');
}
