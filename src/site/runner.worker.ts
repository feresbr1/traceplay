/// <reference lib="webworker" />
// Runs playground code off the main thread. The page terminates this worker if it runs too long.
import { evaluateTraceSource } from '../core/module';
import { runTrace } from '../core/trace';

self.onmessage = (event: MessageEvent<{ code: string }>) => {
  try {
    const mod = evaluateTraceSource(event.data.code);
    const trace = runTrace(mod.fn, mod.meta);
    self.postMessage({ ok: true, trace });
  } catch (error) {
    const e = error as Error;
    const line = /<anonymous>:(\d+):\d+/.exec(e.stack ?? '')?.[1];
    self.postMessage({
      ok: false,
      error: e.message,
      // new Function adds two lines before the user's code.
      line: line ? Number(line) - 2 : undefined,
    });
  }
};
