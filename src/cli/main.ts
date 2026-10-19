import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { traceToHtml } from '../core/html';
import { toTraceModule } from '../core/module';
import { runTrace, type Trace } from '../core/trace';
import { VERSION } from '../core/version';

export interface CliAssets {
  playerJs: string;
  reference: string;
}

const HELP = `traceplay ${VERSION}
Turn an algorithm into an interactive step-by-step animation of a real execution.

Usage
  traceplay render <file.trace.js> [-o out.html] [--theme light|dark|auto] [--json] [--open]
  traceplay check  <file.trace.js>
  traceplay init   [name] [--template array|graph|grid|tree]
  traceplay docs

Commands
  render   Run the trace and write a self-contained HTML player (or JSON with --json)
  check    Run the trace and report frames, structures, narration and code coverage
  init     Create a starter <name>.trace.js
  docs     Print the API reference

Examples
  npx github:feresbr1/traceplay init bubble-sort
  npx github:feresbr1/traceplay check bubble-sort.trace.js
  npx github:feresbr1/traceplay render bubble-sort.trace.js --open
`;

export async function main(argv: string[], assets: CliAssets): Promise<number> {
  const [command, ...rest] = argv;
  if (!command || command === '-h' || command === '--help' || command === 'help') {
    process.stdout.write(HELP);
    return command ? 0 : 2;
  }
  if (command === '-v' || command === '--version') {
    process.stdout.write(`${VERSION}\n`);
    return 0;
  }
  let parsed;
  try {
    parsed = parseArgs({
      args: rest,
      allowPositionals: true,
      options: {
        output: { type: 'string', short: 'o' },
        theme: { type: 'string' },
        json: { type: 'boolean' },
        open: { type: 'boolean' },
        template: { type: 'string', short: 't' },
      },
    });
  } catch (error) {
    return fail(`${(error as Error).message}\nRun traceplay --help for usage.`);
  }
  const { values, positionals } = parsed;

  switch (command) {
    case 'docs':
      process.stdout.write(assets.reference);
      return 0;
    case 'init':
      return init(positionals[0] ?? 'my-algorithm', values.template ?? 'array');
    case 'check':
    case 'render': {
      const file = positionals[0];
      if (!file) return fail(`Usage: traceplay ${command} <file.trace.js>`);
      const loaded = await load(file);
      if ('error' in loaded) return fail(loaded.error);
      const { trace } = loaded;
      if (command === 'check') {
        process.stdout.write(summary(trace, file));
        return 0;
      }
      const theme = values.theme ?? 'auto';
      if (!['light', 'dark', 'auto'].includes(theme))
        return fail('--theme must be light, dark or auto.');
      const base = basename(file).replace(/\.trace\.[cm]?js$|\.[cm]?js$/, '');
      const out = resolve(values.output ?? `${base}.${values.json ? 'json' : 'html'}`);
      const content = values.json
        ? `${JSON.stringify(trace)}\n`
        : traceToHtml(trace, assets.playerJs, theme as 'light' | 'dark' | 'auto');
      writeFileSync(out, content);
      process.stdout.write(
        `✔ ${trace.frames.length} steps → ${out} (${(Buffer.byteLength(content) / 1024).toFixed(0)} KB)\n`,
      );
      if (values.open && !values.json) openFile(out);
      return 0;
    }
    default:
      return fail(`Unknown command "${command}". Run traceplay --help.`);
  }
}

function fail(message: string): number {
  process.stderr.write(`traceplay: ${message}\n`);
  return 1;
}

async function load(file: string): Promise<{ trace: Trace } | { error: string }> {
  const path = resolve(file);
  if (!existsSync(path)) return { error: `File not found: ${file}` };
  let mod;
  try {
    mod = await importTrace(path);
  } catch (error) {
    const e = error as Error;
    return { error: `Could not load ${file}: ${e.message}` };
  }
  try {
    const { meta, fn } = toTraceModule(mod);
    return { trace: runTrace(fn, meta) };
  } catch (error) {
    const e = error as Error;
    const where = /\.trace\.[cm]?js[^:]*:(\d+):(\d+)/.exec(e.stack ?? '');
    return { error: `${e.message}${where ? ` (${basename(file)}:${where[1]})` : ''}` };
  }
}

const ESM_SYNTAX =
  /Cannot use import statement|Unexpected token 'export'|exports is not defined in ES module/;

/**
 * Import a trace file. In projects without "type": "module", a .js file that uses `export`
 * is loaded as CommonJS and fails; then a temporary .mjs copy is imported from the same
 * folder, so the file's relative imports still resolve.
 */
async function importTrace(path: string): Promise<{ meta?: unknown; default?: unknown }> {
  try {
    // A query string makes repeated runs in one process see file changes.
    return await import(`${pathToFileURL(path).href}?t=${Date.now()}`);
  } catch (error) {
    if (!ESM_SYNTAX.test((error as Error).message) || path.endsWith('.mjs')) throw error;
  }
  const stem = path.slice(0, path.length - extname(path).length);
  const copy = `${stem}.traceplay-${process.pid}.mjs`;
  copyFileSync(path, copy);
  try {
    return await import(pathToFileURL(copy).href);
  } finally {
    rmSync(copy, { force: true });
  }
}

/** What an agent (or person) needs to know to judge a trace. */
export function summary(trace: Trace, file: string): string {
  const frames = trace.frames;
  const last = frames[frames.length - 1]!;
  const kinds = last.structs.map((s) => `${s.name} (${s.kind})`);
  const captions = new Set(frames.map((f) => f.caption).filter(Boolean));
  const codeLines = (trace.meta.code ?? '').split('\n').length;
  const usedLines = new Set(frames.map((f) => f.line).filter((l): l is number => l !== undefined));
  const warnings: string[] = [];
  if (!trace.meta.title) warnings.push('meta.title is missing.');
  if (!trace.meta.code) warnings.push('meta.code is missing: the player will not show the source.');
  if (trace.meta.code && usedLines.size === 0)
    warnings.push('meta.code is set but t.line() is never called.');
  const outOfRange = [...usedLines].filter((l) => l < 1 || l > codeLines);
  if (trace.meta.code && outOfRange.length)
    warnings.push(`t.line() points past the end of meta.code: ${outOfRange.join(', ')}.`);
  if (captions.size === 0) warnings.push('No narration: add t.say() at the key moments.');
  if (frames.length < 5) warnings.push('Very few frames: does the trace run the whole algorithm?');
  if (frames.length > 1500)
    warnings.push(`${frames.length} frames is a lot to watch: use a smaller input or t.batch().`);
  const lines = [
    `${trace.meta.title ?? basename(file)}`,
    `  frames      ${frames.length}`,
    `  structures  ${kinds.join(', ') || 'none'}`,
    `  narration   ${captions.size} distinct captions`,
    trace.meta.code
      ? `  code lines  ${usedLines.size} of ${codeLines} highlighted`
      : '  code lines  (no meta.code)',
    `  last step   ${last.caption || last.event || '(no caption)'}`,
  ];
  if (warnings.length) lines.push('', ...warnings.map((w) => `  ! ${w}`));
  else lines.push('', '  ✔ looks good');
  return `${lines.join('\n')}\n`;
}

const TEMPLATES: Record<string, string> = {
  array: `export const meta = {
  title: 'Bubble sort',
  description: 'Repeatedly swap neighbours that are out of order.',
  code: \`function bubbleSort(a) {
  for (let end = a.length - 1; end > 0; end--) {
    for (let i = 0; i < end; i++) {
      if (a[i] > a[i + 1]) [a[i], a[i + 1]] = [a[i + 1], a[i]];
    }
  }
}\`,
};

export default function (t) {
  const a = t.array('a', [6, 2, 9, 4, 1, 7]);
  for (let end = a.length - 1; end > 0; end--) {
    t.line(2);
    t.say(\`Bubble the largest of a[0..\${end}] to the end.\`);
    for (let i = 0; i < end; i++) {
      t.line(3);
      a.compare(i, i + 1);
      t.line(4);
      if (a.get(i) > a.get(i + 1)) a.swap(i, i + 1);
    }
    a.mark(end, 'done');
  }
  a.mark(0, 'done');
  t.say('Sorted.');
  t.step();
}
`,
  graph: `export const meta = { title: 'Depth-first search', description: 'Go as deep as possible before backtracking.' };

export default function (t) {
  const g = t.graph('g', {
    nodes: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'E'], ['E', 'F'], ['D', 'F']],
  });
  const seen = new Set();
  const visit = (id) => {
    seen.add(id);
    t.say(\`Visit \${id}.\`);
    g.mark(id, 'visited');
    for (const next of g.neighbors(id)) {
      if (seen.has(next)) continue;
      g.markEdge(id, next, 'path');
      visit(next);
    }
    g.mark(id, 'done');
  };
  visit('A');
}
`,
  grid: `export const meta = { title: 'Flood fill', description: 'Paint every connected open cell starting from one cell.' };

export default function (t) {
  const g = t.grid('image', [
    ['', '', '#', '', ''],
    ['', '#', '#', '', ''],
    ['', '', '', '#', ''],
    ['#', '#', '', '#', ''],
  ]);
  const stack = [[0, 0]];
  t.say('Fill from the top-left corner.');
  while (stack.length) {
    const [r, c] = stack.pop();
    if (r < 0 || c < 0 || r >= g.rows || c >= g.cols || g.get(r, c) !== '') continue;
    g.set(r, c, '·');
    g.mark(r, c, 'visited');
    stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]);
  }
  t.say('Filled.');
  t.step();
}
`,
  tree: `export const meta = { title: 'Binary tree in-order traversal', description: 'Left subtree, node, right subtree.' };

export default function (t) {
  const tree = t.tree('tree');
  const root = tree.setRoot(8);
  const l = tree.add(root, 4, 'left');
  const r = tree.add(root, 12, 'right');
  tree.add(l, 2, 'left');
  tree.add(l, 6, 'right');
  tree.add(r, 10, 'left');
  const out = t.array('output', [], { style: 'cells' });
  const walk = (id) => {
    if (!id) return;
    walk(tree.left(id));
    tree.mark(id, 'visited');
    out.push(tree.value(id));
    walk(tree.right(id));
  };
  t.say('Visit left, then node, then right: the values come out sorted.');
  walk(root);
}
`,
};

function init(name: string, template: string): number {
  const source = TEMPLATES[template];
  if (!source) return fail(`--template must be one of ${Object.keys(TEMPLATES).join(', ')}.`);
  const file = resolve(name.endsWith('.js') ? name : `${name}.trace.js`);
  if (existsSync(file)) return fail(`${basename(file)} already exists.`);
  writeFileSync(file, source);
  process.stdout.write(
    `✔ Created ${basename(file)}. Next: traceplay render ${basename(file)} --open\n`,
  );
  return 0;
}

function openFile(path: string): void {
  const [cmd, args] =
    process.platform === 'win32'
      ? ['cmd', ['/c', 'start', '""', path]]
      : process.platform === 'darwin'
        ? ['open', [path]]
        : ['xdg-open', [path]];
  try {
    spawn(cmd, args, { stdio: 'ignore', detached: true }).unref();
  } catch {
    // Opening is a convenience; the path was already printed.
  }
}
