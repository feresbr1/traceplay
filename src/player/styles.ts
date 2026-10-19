/** Player styles, injected once so exported single-file players need no stylesheet. */
export const PLAYER_CSS = `
.tp{--tp-bg:#fbfaf7;--tp-panel:#f2f0ea;--tp-ink:#1c1b18;--tp-muted:#6f6b62;--tp-rule:#e3dfd5;--tp-accent:#2f6fed;--tp-hl:#fff1c2;
  font-family:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--tp-ink);background:var(--tp-bg);border:1px solid var(--tp-rule);
  border-radius:14px;overflow:hidden;display:flex;flex-direction:column;outline:none;position:relative}
.tp[data-theme=dark]{--tp-bg:#141412;--tp-panel:#1d1c19;--tp-ink:#f0ede5;--tp-muted:#9b968a;--tp-rule:#2e2c27;--tp-accent:#5b8cff;--tp-hl:#3b3418}
.tp:focus-visible{box-shadow:0 0 0 3px color-mix(in srgb,var(--tp-accent) 45%,transparent)}
.tp *{box-sizing:border-box}
.tp-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:12px 16px 4px}
.tp-title{font-weight:700;font-size:15px;letter-spacing:-.01em;margin:0}
.tp-desc{margin:2px 0 0;font-size:13px;color:var(--tp-muted)}
.tp-count{font:12px 'JetBrains Mono',ui-monospace,monospace;color:var(--tp-muted);white-space:nowrap}
.tp-body{display:grid;grid-template-columns:minmax(0,1fr);gap:0}
.tp-body.has-side{grid-template-columns:minmax(0,1fr) minmax(220px,32%)}
@media (max-width:760px){.tp-body.has-side{grid-template-columns:minmax(0,1fr)}}
.tp-stage{position:relative;min-width:0}
.tp-stage canvas{display:block;width:100%}
.tp-side{border-left:1px solid var(--tp-rule);background:var(--tp-panel);min-width:0;display:flex;flex-direction:column;max-height:560px}
@media (max-width:760px){.tp-side{border-left:0;border-top:1px solid var(--tp-rule);max-height:300px}}
.tp-code{margin:0;padding:10px 0;overflow:auto;font:12.5px/1.6 'JetBrains Mono',ui-monospace,monospace;font-variant-ligatures:none;flex:1;min-height:0}
.tp-code .ln{display:block;white-space:pre;padding:0 12px 0 0}
.tp-code .ln.on{background:var(--tp-hl)}
.tp-code .no{display:inline-block;width:2.6em;text-align:right;padding-right:10px;color:var(--tp-muted);user-select:none}
.tp-vars{border-top:1px solid var(--tp-rule);padding:8px 12px;font:12.5px 'JetBrains Mono',ui-monospace,monospace;display:grid;gap:3px}
.tp-vars:first-child{border-top:0}
.tp-vars b{font:600 11px 'Inter',system-ui,sans-serif;color:var(--tp-muted);text-transform:uppercase;letter-spacing:.05em}
.tp-var{display:flex;justify-content:space-between;gap:10px}
.tp-var span:last-child{font-weight:700;overflow:hidden;text-overflow:ellipsis}
.tp-var.changed span:last-child{color:var(--tp-accent)}
.tp-caption{padding:10px 16px;border-top:1px solid var(--tp-rule);min-height:52px}
.tp-caption p{margin:0;font-size:14.5px;line-height:1.45}
.tp-caption small{display:block;margin-top:2px;font:12px 'JetBrains Mono',ui-monospace,monospace;color:var(--tp-muted)}
.tp-controls{display:flex;align-items:center;gap:8px;padding:8px 12px;border-top:1px solid var(--tp-rule);flex-wrap:wrap}
.tp-btn{appearance:none;border:1px solid var(--tp-rule);background:var(--tp-bg);color:var(--tp-ink);border-radius:8px;height:32px;min-width:32px;padding:0 9px;
  font:600 13px 'Inter',system-ui,sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px}
.tp-btn:hover{background:var(--tp-panel)}
.tp-btn.primary{background:var(--tp-ink);color:var(--tp-bg);border-color:var(--tp-ink)}
.tp-btn:disabled{opacity:.5;cursor:default}
.tp-range{flex:1;min-width:120px;accent-color:var(--tp-accent)}
.tp-speed{height:32px;border-radius:8px;border:1px solid var(--tp-rule);background:var(--tp-bg);color:var(--tp-ink);font:12.5px 'Inter',system-ui,sans-serif;padding:0 6px}
.tp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.tp-brand{font:11px 'Inter',system-ui,sans-serif;color:var(--tp-muted);text-decoration:none;margin-left:auto}
.tp-brand:hover{text-decoration:underline}
`;

let injected = false;
export function injectPlayerStyles(doc: Document = document): void {
  if (injected || doc.getElementById('traceplay-style')) return;
  const style = doc.createElement('style');
  style.id = 'traceplay-style';
  style.textContent = PLAYER_CSS;
  doc.head.appendChild(style);
  injected = true;
}
