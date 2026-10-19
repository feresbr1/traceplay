import type { Trace } from '../core/trace';

export type RunResult = { ok: true; trace: Trace } | { ok: false; error: string; line?: number };

const TIMEOUT_MS = 4000;

/** Run untrusted trace code in a throwaway worker, with a time limit. */
export function runInWorker(code: string): Promise<RunResult> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./runner.worker.ts', import.meta.url), { type: 'module' });
    const timer = setTimeout(() => {
      worker.terminate();
      resolve({
        ok: false,
        error: `Stopped after ${TIMEOUT_MS / 1000} seconds. Is there an infinite loop?`,
      });
    }, TIMEOUT_MS);
    worker.onmessage = (e: MessageEvent<RunResult>) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(e.data);
    };
    worker.onerror = (e) => {
      clearTimeout(timer);
      worker.terminate();
      resolve({ ok: false, error: e.message || 'The code could not be run.' });
    };
    worker.postMessage({ code });
  });
}

// ---------------------------------------------------------------------------
// Share links: the code lives in the URL hash, deflated and base64url-encoded.
// ---------------------------------------------------------------------------

export async function encodeCode(code: string): Promise<string> {
  const stream = new Blob([code]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function decodeCode(encoded: string): Promise<string> {
  const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Response(stream).text();
}
