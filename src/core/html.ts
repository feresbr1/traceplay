import type { Trace } from './trace';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** JSON that is safe inside a <script> element. */
export function scriptSafeJson(value: unknown): string {
  const LS = String.fromCharCode(0x2028);
  const PS = String.fromCharCode(0x2029);
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .split(LS)
    .join('\\u2028')
    .split(PS)
    .join('\\u2029');
}

/** A single self-contained HTML page: the trace data plus the player, nothing loaded from elsewhere. */
export function traceToHtml(
  trace: Trace,
  playerJs: string,
  theme: 'light' | 'dark' | 'auto' = 'auto',
): string {
  const title = trace.meta.title ?? 'Trace';
  return `<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="traceplay">
<title>${escapeHtml(title)} · traceplay</title>
<style>
html{color-scheme:light dark}
body{margin:0;padding:24px;background:#fbfaf7}
@media (prefers-color-scheme:dark){html[data-theme=auto] body{background:#141412}}
html[data-theme=dark] body{background:#141412}
#app{max-width:1120px;margin:0 auto}
@media (max-width:640px){body{padding:12px}}
</style>
</head>
<body>
<div id="app"></div>
<script id="traceplay-data" type="application/json">${scriptSafeJson(trace)}</script>
<script>${playerJs.replace(/<\/script/gi, '<\\/script')}</script>
</body>
</html>
`;
}
