export const meta = {
  title: "Dijkstra's shortest paths",
  description: 'Repeatedly settle the closest unvisited node and relax its edges.',
  code: `function dijkstra(graph, source) {
  const dist = { [source]: 0 }, prev = {};
  const done = new Set();
  while (done.size < graph.nodes.length) {
    const u = closestUnvisited(dist, done);
    if (u === undefined) break;
    done.add(u);
    for (const [v, w] of graph.edges(u)) {
      if (dist[u] + w < (dist[v] ?? Infinity)) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }
  return dist;
}`,
};

export default function (t) {
  const nodes = [
    { id: 'A', x: 0, y: 1 },
    { id: 'B', x: 1, y: 0 },
    { id: 'C', x: 1, y: 2 },
    { id: 'D', x: 2, y: 1 },
    { id: 'E', x: 3, y: 0 },
    { id: 'F', x: 3, y: 2 },
    { id: 'G', x: 4, y: 1 },
  ];
  const edges = [
    ['A', 'B', 4],
    ['A', 'C', 2],
    ['B', 'C', 5],
    ['B', 'D', 10],
    ['C', 'D', 3],
    ['B', 'E', 7],
    ['D', 'E', 4],
    ['D', 'F', 8],
    ['E', 'G', 6],
    ['F', 'G', 1],
    ['C', 'F', 12],
  ];
  const g = t.graph('graph', { nodes, edges });
  const source = 'A';
  const target = 'G';
  const dist = { [source]: 0 };
  const prev = {};
  const done = new Set();

  t.say(`Shortest distance from ${source} to every node.`);
  t.line(2);
  g.badge(source, 0);
  t.line(3);
  while (done.size < nodes.length) {
    t.line(4);
    t.line(5);
    let u;
    for (const n of nodes) {
      if (!done.has(n.id) && dist[n.id] !== undefined && (u === undefined || dist[n.id] < dist[u]))
        u = n.id;
    }
    if (u === undefined) break;
    t.line(7);
    t.say(`${u} is the closest unvisited node (${dist[u]}). Settle it.`);
    done.add(u);
    g.mark(u, 'active');
    for (const v of g.neighbors(u)) {
      if (done.has(v)) continue;
      t.line(8);
      const w = g.weight(u, v);
      g.focusEdge(u, v, 'compare');
      t.line(9);
      if (dist[u] + w < (dist[v] ?? Infinity)) {
        t.line(10);
        t.say(
          `Via ${u}, ${v} costs ${dist[u]} + ${w} = ${dist[u] + w}${dist[v] === undefined ? '' : `, better than ${dist[v]}`}.`,
        );
        dist[v] = dist[u] + w;
        prev[v] = u;
        t.line(11);
        g.badge(v, dist[v]);
        g.mark(v, 'frontier');
      }
    }
    g.mark(u, 'done');
  }

  t.line(15);
  t.say(`Shortest path to ${target}: ${pathTo(prev, target).join(' → ')} (${dist[target]}).`);
  const path = pathTo(prev, target);
  t.batch(() => {
    for (let i = 0; i < path.length - 1; i++) g.markEdge(path[i], path[i + 1], 'path');
    for (const n of path) g.mark(n, 'path');
  }, 'highlight the path');
}

function pathTo(prev, target) {
  const out = [target];
  while (prev[out[0]]) out.unshift(prev[out[0]]);
  return out;
}
