import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { main, summary } from '../src/cli/main';
import { runTrace } from '../src/core/trace';

const ASSETS = { playerJs: 'window.__player = true;', reference: '# traceplay API reference\n' };
const EXAMPLE = fileURLToPath(new URL('../examples/quicksort.trace.js', import.meta.url));

let out = '';
let err = '';
let dir = '';
beforeEach(() => {
  out = '';
  err = '';
  dir = mkdtempSync(join(tmpdir(), 'traceplay-'));
  // Trace files are ES modules; mark the temp folder as such.
  writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
  vi.spyOn(process.stdout, 'write').mockImplementation((c) => ((out += String(c)), true));
  vi.spyOn(process.stderr, 'write').mockImplementation((c) => ((err += String(c)), true));
});
afterEach(() => vi.restoreAllMocks());

describe('cli', () => {
  it('help, version, docs', async () => {
    expect(await main(['--help'], ASSETS)).toBe(0);
    expect(out).toContain('traceplay render');
    expect(await main([], ASSETS)).toBe(2);
    out = '';
    expect(await main(['docs'], ASSETS)).toBe(0);
    expect(out).toBe(ASSETS.reference);
  });

  it('render writes a self-contained HTML player', async () => {
    const file = join(dir, 'quicksort.trace.js');
    copyFileSync(EXAMPLE, file);
    const html = join(dir, 'out.html');
    expect(await main(['render', file, '-o', html, '--theme', 'dark'], ASSETS)).toBe(0);
    expect(out).toMatch(/✔ \d+ steps → /);
    const page = readFileSync(html, 'utf8');
    expect(page).toContain('window.__player = true;');
    expect(page).toContain('Quicksort (Lomuto partition)');
    expect(page).toContain('data-theme="dark"');
  });

  it('render --json writes the trace', async () => {
    const file = join(dir, 'quicksort.trace.js');
    copyFileSync(EXAMPLE, file);
    expect(await main(['render', file, '--json', '-o', join(dir, 't.json')], ASSETS)).toBe(0);
    const trace = JSON.parse(readFileSync(join(dir, 't.json'), 'utf8'));
    expect(trace.version).toBe(1);
    expect(trace.frames.length).toBeGreaterThan(50);
  });

  it('loads .trace.js files in CommonJS projects too', async () => {
    const cjs = mkdtempSync(join(tmpdir(), 'traceplay-cjs-'));
    writeFileSync(join(cjs, 'package.json'), '{"type":"commonjs"}');
    writeFileSync(join(cjs, 'helper.mjs'), 'export const input = [3, 2, 1];');
    const file = join(cjs, 'sort.trace.js');
    writeFileSync(
      file,
      [
        "import { input } from './helper.mjs';",
        "export const meta = { title: 'CJS project' };",
        "export default function (t) { const a = t.array('a', input); a.swap(0, 2); t.say('ok'); }",
      ].join('\n'),
    );
    expect(await main(['check', file], ASSETS)).toBe(0);
    expect(out).toContain('CJS project');
    expect(out).toContain('frames      3');
    // The temporary copy is cleaned up.
    expect(readdirSync(cjs).sort()).toEqual(['helper.mjs', 'package.json', 'sort.trace.js']);
  });

  it('check summarises and warns', async () => {
    const file = join(dir, 'bare.trace.js');
    writeFileSync(
      file,
      "export default function (t) { const a = t.array('a', [2, 1]); a.swap(0, 1); }\n",
    );
    expect(await main(['check', file], ASSETS)).toBe(0);
    expect(out).toContain('frames      2');
    expect(out).toContain('meta.title is missing');
    expect(out).toContain('No narration');
  });

  it('reports trace errors with the file line', async () => {
    const file = join(dir, 'broken.trace.js');
    writeFileSync(
      file,
      "export default function (t) {\n  const a = t.array('a', [1]);\n  a.swap(0, 4);\n}\n",
    );
    expect(await main(['check', file], ASSETS)).toBe(1);
    expect(err).toContain('Index 4 is outside a');
    expect(err).toContain('broken.trace.js:3');
  });

  it('init creates each template, and every template runs', async () => {
    for (const template of ['array', 'graph', 'grid', 'tree']) {
      out = '';
      const name = join(dir, `demo-${template}`);
      expect(await main(['init', name, '--template', template], ASSETS)).toBe(0);
      expect(existsSync(`${name}.trace.js`)).toBe(true);
      out = '';
      expect(await main(['check', `${name}.trace.js`], ASSETS)).toBe(0);
      expect(out).toMatch(/frames\s+\d+/);
    }
    expect(await main(['init', join(dir, 'demo-array')], ASSETS)).toBe(1);
    expect(err).toContain('already exists');
    expect(await main(['init', 'x', '--template', 'nope'], ASSETS)).toBe(1);
  });

  it('usage errors', async () => {
    expect(await main(['render'], ASSETS)).toBe(1);
    expect(await main(['render', join(dir, 'missing.trace.js')], ASSETS)).toBe(1);
    expect(err).toContain('File not found');
    expect(await main(['frobnicate'], ASSETS)).toBe(1);
    expect(await main(['render', EXAMPLE, '--theme', 'neon'], ASSETS)).toBe(1);
  });

  it('summary flags out-of-range code lines', () => {
    const trace = runTrace(
      (t) => {
        t.line(9);
        t.array('a', [1]);
        t.say('x');
      },
      { title: 'T', code: 'one\ntwo' },
    );
    expect(summary(trace, 'x.trace.js')).toContain('t.line() points past the end of meta.code: 9');
  });
});
