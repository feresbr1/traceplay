import { TraceError, type TraceFunction, type TraceMeta } from './trace';

export interface TraceModule {
  meta: TraceMeta;
  fn: TraceFunction;
}

/**
 * Evaluate the source of a `.trace.js` file without a module loader:
 *   export const meta = { ... };
 *   export default function (t) { ... }
 * Used by the browser playground (inside a worker). The CLI uses real `import()` instead.
 */
export function evaluateTraceSource(source: string): TraceModule {
  if (/^\s*import\s/m.test(source)) {
    throw new TraceError(
      'import statements are not available here. Paste the code you need into the trace, or use the CLI (`npx github:feresbr1/traceplay render`).',
    );
  }
  const body = source
    .replace(/export\s+const\s+meta\s*=/, '__module.meta =')
    .replace(/export\s+default\s+/, '__module.default = ');
  if (!body.includes('__module.default')) {
    throw new TraceError('A trace needs `export default function (t) { ... }`.');
  }
  const mod: { meta?: TraceMeta; default?: unknown } = {};
  new Function('__module', `"use strict";\n${body}`)(mod);
  return toTraceModule(mod);
}

export function toTraceModule(mod: { meta?: unknown; default?: unknown }): TraceModule {
  if (typeof mod.default !== 'function') {
    throw new TraceError('The default export must be a function that receives `t`.');
  }
  const meta = (mod.meta && typeof mod.meta === 'object' ? mod.meta : {}) as TraceMeta;
  return { meta, fn: mod.default as TraceFunction };
}
