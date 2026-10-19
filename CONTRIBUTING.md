# Contributing to traceplay

The most welcome contributions are **new example traces** and **new ways to show things** (structures, layouts, tones).

## Adding an example

1. Create `examples/<name>.trace.js` with `export const meta = { title, description, code }` and `export default function (t) { … }`.
2. Run the real algorithm; never hard-code the animation. Keep `meta.code` identical to the code being explained, and keep `t.line()` numbers right.
3. Run `node dist/cli/traceplay.mjs check examples/<name>.trace.js`; aim for a clean report and 20–400 frames.
4. `npm test` runs every example automatically and checks that each frame renders. Add the id to `ORDER` in `src/site/examples.ts` to place it in the gallery.

## Development

Requires Node.js 22 (the CLI itself runs on 18.17+).

```sh
npm install
npm run dev
npm test
npx playwright install chromium
npm run build:web && npm run test:e2e
npm run check
```

## Layout

```
src/core/      tracer API (trace.ts), trace-file loading, HTML export
src/player/    scene building, layouts, interpolation, canvas drawing, GIF export, Player component
src/site/      website: landing, gallery, example pages, playground (worker sandbox)
src/cli/       command line
skills/        the agent skill and API reference
examples/      the gallery traces
```

## Rules

- The tracer API is the product's contract with agents. Keep it small, deterministic and well-explained in errors. Every new method needs a test and an entry in `skills/traceplay/REFERENCE.md`.
- Rebuild and commit `dist/cli/` (`npm run build:cli`) when core, player or CLI code changes.

By contributing you agree that your contributions are licensed under the MIT License and that you will follow the [Code of Conduct](CODE_OF_CONDUCT.md).
