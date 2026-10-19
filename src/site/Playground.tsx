import { useEffect, useRef, useState } from 'preact/hooks';
import type { Trace } from '../core/trace';
import { Player } from '../player/Player';
import { EXAMPLES, exampleById } from './examples';
import { decodeCode, encodeCode, runInWorker } from './run';
import { Reference } from './Reference';

export const STARTER = `export const meta = {
  title: 'Insertion sort',
  code: \`function insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    for (let j = i; j > 0 && a[j - 1] > a[j]; j--) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
    }
  }
}\`,
};

export default function (t) {
  const a = t.array('a', [7, 3, 9, 1, 5, 8, 2]);
  for (let i = 1; i < a.length; i++) {
    t.line(2);
    t.say(\`Insert a[\${i}] = \${a.get(i)} into the sorted part on its left.\`);
    for (let j = i; j > 0; j--) {
      t.line(3);
      a.compare(j - 1, j);
      if (a.get(j - 1) <= a.get(j)) break;
      t.line(4);
      a.swap(j - 1, j);
    }
    a.mark([...Array(i + 1).keys()], 'done');
  }
  t.say('Sorted.');
}
`;

export function Playground({ route }: { route: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [shared, setShared] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const area = useRef<HTMLTextAreaElement>(null);

  // Load from ?code= (share link), ?example=, or the starter.
  useEffect(() => {
    const params = new URLSearchParams(route.split('?')[1] ?? '');
    const encoded = params.get('code');
    const example = params.get('example');
    if (encoded) {
      decodeCode(encoded).then(
        (c) => setCode(c),
        () => {
          setCode(STARTER);
          setError('This share link is damaged; showing the starter example instead.');
        },
      );
    } else if (example && exampleById(example)) {
      setCode(exampleById(example)!.source);
    } else {
      setCode((c) => c ?? STARTER);
    }
  }, [route]);

  const run = async (source = code) => {
    if (source === null) return;
    setRunning(true);
    const result = await runInWorker(source);
    setRunning(false);
    if (result.ok) {
      setTrace(result.trace);
      setError(null);
      setRunId((n) => n + 1);
    } else {
      setError(result.line ? `Line ${result.line}: ${result.error}` : result.error);
    }
  };

  // Run once when code first loads.
  const loaded = useRef(false);
  useEffect(() => {
    if (code !== null && !loaded.current) {
      loaded.current = true;
      void run(code);
    }
  }, [code]);

  const share = async () => {
    if (code === null) return;
    const encoded = await encodeCode(code);
    const url = `${location.origin}${location.pathname}#/play?code=${encoded}`;
    history.replaceState(null, '', `#/play?code=${encoded}`);
    try {
      await navigator.clipboard.writeText(url);
      setShared('Link copied');
    } catch {
      setShared('Link is in the address bar');
    }
    setTimeout(() => setShared(null), 2000);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      void run();
    } else if (e.key === 'Tab' && !e.shiftKey) {
      // Indent instead of leaving the editor; Esc then Tab moves focus on.
      const el = e.currentTarget as HTMLTextAreaElement;
      if (el.dataset.escaped === '1') {
        el.dataset.escaped = '';
        return;
      }
      e.preventDefault();
      const { selectionStart, selectionEnd, value } = el;
      el.value = `${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`;
      el.selectionStart = el.selectionEnd = selectionStart + 2;
      setCode(el.value);
    } else if (e.key === 'Escape') {
      (e.currentTarget as HTMLTextAreaElement).dataset.escaped = '1';
    }
  };

  return (
    <div class="wrap">
      <div class="play">
        <div class="editor">
          <div class="editor-bar">
            <button
              type="button"
              class="btn small primary"
              onClick={() => void run()}
              disabled={running}
            >
              {running ? 'Running…' : '▶ Run'}
            </button>
            <button type="button" class="btn small" onClick={() => void share()}>
              {shared ?? 'Share link'}
            </button>
            <label class="sr-only" for="template">
              Load an example
            </label>
            <select
              id="template"
              onChange={(e) => {
                const value = e.currentTarget.value;
                const source = value === 'starter' ? STARTER : exampleById(value)?.source;
                if (source) {
                  setCode(source);
                  void run(source);
                }
                e.currentTarget.value = '';
              }}
            >
              <option value="">Load an example…</option>
              <option value="starter">Insertion sort (starter)</option>
              {EXAMPLES.map((ex) => (
                <option value={ex.id} key={ex.id}>
                  {ex.title}
                </option>
              ))}
            </select>
            <span class="hint">Ctrl/⌘ + Enter to run · Esc, Tab to leave</span>
          </div>
          <label class="sr-only" for="code">
            Trace code
          </label>
          <textarea
            id="code"
            ref={area}
            spellcheck={false}
            value={code ?? ''}
            onInput={(e) => setCode(e.currentTarget.value)}
            onKeyDown={onKeyDown}
          />
          {error && (
            <div class="error" role="alert" data-testid="play-error">
              {error}
            </div>
          )}
        </div>
        <div>
          {trace ? (
            <Player key={runId} trace={trace} autoplay />
          ) : (
            <div class="empty-player">{running ? 'Running…' : 'Press Run to see your trace.'}</div>
          )}
        </div>
      </div>
      <Reference />
    </div>
  );
}
