import { toTraceModule } from '../core/module';
import { runTrace, type Trace } from '../core/trace';

const modules = import.meta.glob('../../examples/*.trace.js', { eager: true }) as Record<
  string,
  { meta?: unknown; default?: unknown }
>;
const sources = import.meta.glob('../../examples/*.trace.js', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export interface Example {
  id: string;
  title: string;
  description: string;
  source: string;
  trace: () => Trace;
}

/** Display order for the gallery; anything else goes after. */
const ORDER = [
  'quicksort',
  'token-bucket',
  'maze-bfs',
  'heapsort',
  'dijkstra',
  'game-of-life',
  'binary-search',
  'bst',
  'topological-sort',
  'sliding-window',
];

export const EXAMPLES: Example[] = Object.entries(modules)
  .map(([path, mod]) => {
    const id = path.split('/').pop()!.replace('.trace.js', '');
    const m = toTraceModule(mod);
    let cached: Trace | undefined;
    return {
      id,
      title: m.meta.title ?? id,
      description: m.meta.description ?? '',
      source: sources[path] ?? '',
      trace: () => (cached ??= runTrace(m.fn, m.meta)),
    };
  })
  .sort((a, b) => rank(a.id) - rank(b.id) || a.id.localeCompare(b.id));

function rank(id: string): number {
  const i = ORDER.indexOf(id);
  return i === -1 ? ORDER.length : i;
}

export function exampleById(id: string): Example | undefined {
  return EXAMPLES.find((e) => e.id === id);
}
