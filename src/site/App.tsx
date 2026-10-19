import { useEffect, useState } from 'preact/hooks';
import { VERSION } from '../core/version';
import { ExamplePage } from './ExamplePage';
import { Landing } from './Landing';
import { Playground } from './Playground';

export const REPO = 'https://github.com/feresbr1/traceplay';

function useRoute(): string {
  const [hash, setHash] = useState(location.hash || '#/');
  useEffect(() => {
    const on = () => {
      setHash(location.hash || '#/');
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

export function App() {
  const route = useRoute();
  const path = route.replace(/^#/, '').split('?')[0]!;
  const example = /^\/example\/([\w-]+)$/.exec(path)?.[1];

  let page;
  if (path.startsWith('/play')) page = <Playground route={route} />;
  else if (example) page = <ExamplePage id={example} />;
  else page = <Landing />;

  return (
    <>
      <a class="sr-only" href="#main">
        Skip to content
      </a>
      <header class="site">
        <div class="wrap">
          <a class="logo" href="#/">
            <span class="logo-mark" aria-hidden="true">
              <i style={{ height: '12px' }} />
              <i style={{ height: '20px' }} />
              <i style={{ height: '8px' }} />
              <i style={{ height: '16px' }} />
            </span>
            traceplay
          </a>
          <nav class="top" aria-label="Site">
            <a href="#/" aria-current={path === '/' ? 'page' : undefined} class="hide-sm">
              Gallery
            </a>
            <a href="#/play" aria-current={path.startsWith('/play') ? 'page' : undefined}>
              Playground
            </a>
            <a href={`${REPO}#readme`} class="hide-sm">
              Docs
            </a>
            <a href={REPO}>GitHub</a>
          </nav>
        </div>
      </header>
      <main id="main">{page}</main>
      <footer class="site">
        <div class="wrap">
          <span>
            traceplay v{VERSION} · MIT · <a href={`${REPO}/issues`}>issues</a>
          </span>
          <span>Every frame on this site comes from running the code shown.</span>
        </div>
      </footer>
    </>
  );
}
