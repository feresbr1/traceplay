import { describe, expect, it } from 'vitest';
import { scriptSafeJson, traceToHtml } from '../src/core/html';
import { runTrace } from '../src/core/trace';

describe('exported HTML', () => {
  it('cannot be broken out of by trace content', () => {
    const json = scriptSafeJson({
      s: '</script><img src=x onerror=alert(1)>' + String.fromCharCode(0x2028),
    });
    expect(json).not.toContain('<');
    expect(json).toContain('\\u003c/script');
    expect(json).toContain('\\u2028');
    expect(JSON.parse(json).s.startsWith('</script>')).toBe(true);
  });

  it('embeds the trace and the player, escapes the title, needs nothing external', () => {
    const trace = runTrace((t) => t.array('a', ['</script>']), { title: 'A <b>bold</b> title' });
    const html = traceToHtml(trace, 'console.log("player </script> ok")', 'dark');
    expect(html).toContain('<title>A &lt;b&gt;bold&lt;/b&gt; title · traceplay</title>');
    expect(html).toContain('data-theme="dark"');
    expect(html.match(/<\/script>/g)).toHaveLength(2);
    expect(html).not.toMatch(/src="http|href="http/);
  });
});
