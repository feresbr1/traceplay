export const meta = {
  title: "Topological sort (Kahn's algorithm)",
  description:
    'Order build steps so every dependency comes first: repeatedly take a node with no remaining inputs.',
  code: `function topoSort(graph) {
  const indegree = countIncoming(graph);
  const queue = graph.nodes.filter((n) => indegree[n] === 0);
  const order = [];
  while (queue.length) {
    const n = queue.shift();
    order.push(n);
    for (const m of graph.next(n)) {
      if (--indegree[m] === 0) queue.push(m);
    }
  }
  return order.length === graph.nodes.length ? order : null;
}`,
};

export default function (t) {
  const nodes = ['types', 'utils', 'parser', 'lexer', 'checker', 'emitter', 'cli', 'tests'];
  const edges = [
    ['types', 'parser'],
    ['types', 'checker'],
    ['utils', 'lexer'],
    ['utils', 'emitter'],
    ['lexer', 'parser'],
    ['parser', 'checker'],
    ['checker', 'emitter'],
    ['emitter', 'cli'],
    ['parser', 'tests'],
    ['cli', 'tests'],
  ];
  const g = t.graph('modules', { nodes, edges, directed: true, layout: 'layered' });
  const queue = t.array('queue', [], { style: 'cells' });
  const order = t.array('build order', [], { style: 'cells' });

  t.line(2);
  const indegree = Object.fromEntries(nodes.map((n) => [n, 0]));
  for (const [, to] of edges) indegree[to]++;
  t.batch(() => {
    for (const n of nodes) g.badge(n, indegree[n]);
  }, 'count incoming edges');
  t.say('Each badge is how many dependencies a module still waits for.');

  t.line(3);
  for (const n of nodes) {
    if (indegree[n] === 0) {
      queue.push(n);
      g.mark(n, 'frontier');
    }
  }
  while (queue.length) {
    t.line(6);
    const n = queue.shift();
    t.line(7);
    order.push(n);
    g.mark(n, 'done');
    t.say(`Build ${n}; its dependents each wait for one fewer module.`);
    t.line(8);
    for (const m of g.neighbors(n)) {
      g.focusEdge(n, m, 'active');
      t.line(9);
      indegree[m]--;
      g.badge(m, indegree[m]);
      if (indegree[m] === 0) {
        queue.push(m);
        g.mark(m, 'frontier');
      }
    }
  }
  t.line(12);
  t.say(`A valid build order: ${order.values().join(' → ')}.`);
  order.mark([...Array(order.length).keys()], 'done');
}
