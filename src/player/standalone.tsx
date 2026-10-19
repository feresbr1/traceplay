// Entry point of the self-contained player embedded in exported HTML files.
import { render } from 'preact';
import type { Trace } from '../core/trace';
import { Player } from './Player';

const data = document.getElementById('traceplay-data');
const root = document.getElementById('app');
if (data && root) {
  const trace = JSON.parse(data.textContent ?? '{}') as Trace;
  const theme = (document.documentElement.dataset.theme as 'light' | 'dark' | 'auto') || 'auto';
  render(<Player trace={trace} theme={theme} branded autoplay={false} />, root);
}
