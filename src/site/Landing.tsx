import { useState } from 'preact/hooks';
import { Player } from '../player/Player';
import { EXAMPLES, exampleById } from './examples';
import { Poster } from './Poster';

const INSTALL = 'npx skills add feresbr1/traceplay';

const TRACE_SNIPPET = `export default function (t) {
  const a = t.array('a', [5, 2, 8, 1]);
  for (let i = 1; i < a.length; i++)
    for (let j = i; j > 0; j--) {
      a.compare(j - 1, j);
      if (a.get(j - 1) <= a.get(j)) break;
      a.swap(j - 1, j);
    }
}`;

export function Landing() {
  const hero = exampleById('quicksort') ?? EXAMPLES[0]!;
  const [copied, setCopied] = useState(false);
  return (
    <>
      <section class="hero wrap">
        <div>
          <h1>
            Watch any code <em>run.</em>
          </h1>
          <p class="lede">
            traceplay turns algorithms and functions into interactive, step-by-step animations.
            Every frame comes from actually running the code. Ask your AI agent to animate anything,
            or write a trace in a few lines.
          </p>
          <div class="cta">
            <a class="btn primary" href="#/play">
              Open the playground
            </a>
            <a class="btn" href="#gallery">
              See the gallery
            </a>
          </div>
          <div class="cmd" aria-label="Install the agent skill">
            <span class="p">$</span>
            <code>{INSTALL}</code>
            <button
              type="button"
              class="btn small"
              onClick={() => {
                void navigator.clipboard?.writeText(INSTALL).then(() => setCopied(true));
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div data-testid="hero-player">
          <Player trace={hero.trace()} autoplay loop compact exportable={false} />
        </div>
      </section>

      <section class="block wrap" aria-labelledby="how">
        <h2 id="how">Real executions, not drawings</h2>
        <p class="sub">
          A trace is your algorithm, run for real, with a few calls that say what to show. The
          player turns the recorded steps into smooth, scrubbable motion you can share as a link, a
          GIF, or a single HTML file.
        </p>
        <div class="steps">
          <div class="step">
            <span class="num">01 · trace</span>
            <h3>Instrument the real code</h3>
            <p>Track arrays, grids, graphs, trees and variables. Each change becomes a step.</p>
            <pre>
              <code>{TRACE_SNIPPET}</code>
            </pre>
          </div>
          <div class="step">
            <span class="num">02 · render</span>
            <h3>Get an interactive player</h3>
            <p>Play, pause, scrub, step with the arrow keys, follow the highlighted code line.</p>
            <pre>
              <code>
                {
                  'npx github:feresbr1/traceplay \\\n  render insertion.trace.js\n\n✔ 23 steps → insertion.html'
                }
              </code>
            </pre>
          </div>
          <div class="step">
            <span class="num">03 · share</span>
            <h3>Link, GIF or one HTML file</h3>
            <p>
              Embed it in docs, a PR description, a blog post or a lesson. No server, no account.
            </p>
            <pre>
              <code>
                {'<iframe src="insertion.html"\n        width="100%" height="560">\n</iframe>'}
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section class="block wrap" aria-labelledby="agents">
        <div class="agent">
          <div>
            <h2 id="agents">Your agent can animate anything</h2>
            <p class="sub" style={{ marginBottom: '16px' }}>
              Install the skill and ask Claude Code, Codex, Cursor or another agent to explain code
              by animating it. It writes the trace from the real implementation, runs it, checks the
              result and hands you the player.
            </p>
            <div class="cmd" style={{ marginTop: 0 }}>
              <span class="p">$</span>
              <code>{INSTALL}</code>
            </div>
          </div>
          <div class="chat" aria-label="Example prompts">
            <div class="bubble you">
              /traceplay animate how our rate limiter decides to reject a request
            </div>
            <div class="bubble agent-b">
              The skill tells the agent to copy the real implementation into a trace, run it on a
              meaningful input with <code>traceplay check</code>, and render the player with{' '}
              <code>traceplay render</code>.
            </div>
            <div class="bubble you">
              /traceplay show how the LRU cache in src/cache.ts evicts entries
            </div>
          </div>
        </div>
      </section>

      <section class="block wrap" id="gallery" aria-labelledby="gallery-title">
        <h2 id="gallery-title">Gallery</h2>
        <p class="sub">
          Each of these is a trace file in the repository, run in your browser right now.
        </p>
        <div class="gallery">
          {EXAMPLES.map((e) => (
            <a class="card" href={`#/example/${e.id}`} key={e.id} data-testid="gallery-card">
              <Poster trace={e.trace()} />
              <div>
                <h3>{e.title}</h3>
                <p>{e.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
