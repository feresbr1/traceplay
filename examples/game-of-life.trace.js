export const meta = {
  title: "Conway's Game of Life",
  description:
    'A live cell survives with 2 or 3 live neighbours; a dead cell comes alive with exactly 3. Here, a glider.',
  code: `function step(board) {
  return board.map((row, r) =>
    row.map((alive, c) => {
      const n = liveNeighbours(board, r, c);
      return n === 3 || (alive && n === 2);
    }),
  );
}`,
};

export default function (t) {
  const rows = 14;
  const cols = 22;
  let board = Array.from({ length: rows }, () => Array(cols).fill(false));
  // A glider and a blinker.
  for (const [r, c] of [
    [1, 2],
    [2, 3],
    [3, 1],
    [3, 2],
    [3, 3],
    [8, 14],
    [8, 15],
    [8, 16],
  ]) {
    board[r][c] = true;
  }
  const grid = t.grid(
    'board',
    board.map((row) => row.map(() => '')),
  );
  const v = t.vars('life', { generation: 0, alive: count(board) });
  const paint = () =>
    t.batch(() => {
      grid.unmark();
      board.forEach((row, r) => row.forEach((alive, c) => alive && grid.mark(r, c, 'active')));
    }, 'draw generation');

  t.say('Generation 0: a glider (top left) and a blinker.');
  paint();
  for (let gen = 1; gen <= 24; gen++) {
    t.line(4);
    const next = board.map((row, r) =>
      row.map((alive, c) => {
        let n = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if ((dr || dc) && board[(r + dr + rows) % rows][(c + dc + cols) % cols]) n++;
          }
        }
        return n === 3 || (alive && n === 2);
      }),
    );
    board = next;
    t.line(5);
    t.say(
      gen % 4 === 0
        ? `Generation ${gen}: the glider has moved one cell diagonally.`
        : `Generation ${gen}.`,
    );
    v.set({ generation: gen, alive: count(board) });
    paint();
  }
}

function count(board) {
  return board.flat().filter(Boolean).length;
}
