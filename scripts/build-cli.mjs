// 1. Bundle the standalone player (embedded in every exported HTML file).
// 2. Bundle the CLI into one dependency-free file with the player and API reference inlined.
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const player = await build({
  entryPoints: ['src/player/standalone.tsx'],
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2020',
  jsx: 'automatic',
  jsxImportSource: 'preact',
  write: false,
  legalComments: 'none',
});
const playerJs = player.outputFiles[0].text;
mkdirSync('dist/cli', { recursive: true });
writeFileSync('dist/cli/player.js', playerJs);

await build({
  entryPoints: ['src/cli/index.ts'],
  outfile: 'dist/cli/traceplay.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  banner: { js: '#!/usr/bin/env node' },
  define: {
    __PLAYER_JS__: JSON.stringify(playerJs),
    __REFERENCE__: JSON.stringify(readFileSync('skills/traceplay/REFERENCE.md', 'utf8')),
  },
  logLevel: 'info',
});
console.log(`player: ${(playerJs.length / 1024).toFixed(0)} KB`);
