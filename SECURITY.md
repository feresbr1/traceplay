# Security Policy

Only the latest release and https://feresbr1.github.io/traceplay/ receive fixes. Report vulnerabilities privately through [GitHub security advisories](https://github.com/feresbr1/traceplay/security/advisories/new), not in public issues.

## What is in scope

- **Playground share links.** Code from a link runs only when you press Run (or when the page loads it), inside a dedicated Web Worker that cannot touch the page or its DOM and is terminated after 4 seconds. A way to make it run in the page itself is a vulnerability. The site stores nothing worth stealing: no accounts, cookies or tokens.
- **Exported HTML.** Trace data is embedded as escaped JSON. Trace content (titles, values, captions) that executes script in an exported file is a vulnerability.

## What is not

Trace files run as normal JavaScript when you use the CLI, like any script you run with Node. Only render traces you trust.
