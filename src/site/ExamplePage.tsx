import { Player } from '../player/Player';
import { exampleById } from './examples';
import { REPO } from './App';

export function ExamplePage({ id }: { id: string }) {
  const example = exampleById(id);
  if (!example) {
    return (
      <div class="wrap page-head">
        <div>
          <h1>Example not found</h1>
          <p>
            <a href="#/">Back to the gallery</a>
          </p>
        </div>
      </div>
    );
  }
  return (
    <div class="wrap">
      <div class="page-head">
        <div>
          <p class="crumb">
            <a href="#/">Gallery</a> / {example.id}
          </p>
          <h1>{example.title}</h1>
        </div>
        <div class="cta">
          <a class="btn small" href={`#/play?example=${example.id}`}>
            Edit in playground
          </a>
          <a class="btn small" href={`${REPO}/blob/main/examples/${example.id}.trace.js`}>
            Source on GitHub
          </a>
        </div>
      </div>
      <Player trace={example.trace()} autoplay={false} />
      <details class="source">
        <summary>The trace file ({example.id}.trace.js)</summary>
        <pre>
          <code>{example.source}</code>
        </pre>
      </details>
    </div>
  );
}
