# Why traceplay

Written on 2026-10-19, before implementation. Star counts are from the GitHub API on that day.

## What the breakout projects of 2026 have in common

- [morluto/rea](https://github.com/morluto/rea) (≈330k★ since April 2026): "Reverse engineer anything with agents". One command (`npx rea-agents setup`) gives coding agents a new capability, with a one-line hook: _see a feature you like, understand how it works_.
- [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) (≈99k★): "Give your AI agent eyes to see the entire internet."
- [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy) (≈16.5k★ in 11 days): an agent skill that explains ideas with crafted, interactive, _trustworthy_ visuals ("every number the figure shows comes from the same small model that moves its parts").
- Smaller visual tools trending in October 2026: hairline (2.3k★), floorplan-3d (2.4k★), obsidianmd/pele (2.1k★).

The pattern: a capability for agents, installed in one command, that produces something impressive enough to screenshot and share, and that you can trust.

## Candidates considered

| #   | Idea                                                  | Strongest existing alternative                                                                                                     | Verdict                                       |
| --- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1   | Extract any website's design system for agents        | [dembrandt](https://github.com/dembrandt/dembrandt) 3.7k★                                                                          | Taken                                         |
| 2   | Turn a site's private API into a typed client         | [mitmproxy2swagger](https://github.com/alufers/mitmproxy2swagger) 9.6k★, [Integuru](https://github.com/Integuru-AI/Integuru) 4.8k★ | Taken                                         |
| 3   | "VHS for web apps": scripted, polished demo videos    | [vercel-labs/webreel](https://github.com/vercel-labs/webreel) 948★                                                                 | Taken by a strong brand                       |
| 4   | Repository → architecture diagram                     | [gitdiagram](https://github.com/ahmedkhaleel2004/gitdiagram) 18k★                                                                  | Taken                                         |
| 5   | Repository → wiki                                     | DeepWiki, deepwiki-open                                                                                                            | Taken                                         |
| 6   | Screenshot → code                                     | screenshot-to-code                                                                                                                 | Taken                                         |
| 7   | Agent token / quota analyser                          | [ccusage](https://github.com/ccusage/ccusage) 19k★                                                                                 | Saturated                                     |
| 8   | Agent guardrail hooks                                 | [destructive_command_guard](https://github.com/Dicklesworthstone/destructive_command_guard) 6.2k★                                  | Taken                                         |
| 9   | Website clone from URL                                | open-lovable and others                                                                                                            | Crowded                                       |
| 10  | Git history time-lapse                                | Gource                                                                                                                             | Old but solved                                |
| 11  | Run CI locally                                        | `act`                                                                                                                              | Taken                                         |
| 12  | Mock backend generated from frontend calls            | Mockoon, MSW                                                                                                                       | Weak hook                                     |
| 13  | Codebase → narrated explainer video                   | (none strong)                                                                                                                      | Costly to run; quality depends on paid models |
| 14  | Universal rich `git diff` for binary formats          | difftastic, daff                                                                                                                   | Fragmented demand, low wow                    |
| 15  | Copilot AI-credit bill analyser                       | copilot-arewecooked 137★, several dashboards                                                                                       | Crowded                                       |
| 16  | **Animate real executions of any code, agent-native** | [algorithm-visualizer](https://github.com/algorithm-visualizer/algorithm-visualizer) 48.9k★, **last pushed June 2024**             | **Chosen**                                    |

## Why this one

- **Proven, large demand with a stale incumbent.** algorithm-visualizer has 48.9k stars and has not been updated since 2024. Python Tutor is a staple of programming education. "Algorithm visualizer" is an evergreen search for students, interview candidates and teachers.
- **Broad audience.** Learners, educators, interview prep, developers onboarding to unfamiliar code, reviewers, technical writers, content creators.
- **Instant curiosity, instant demo.** The hero is a moving picture of real code running; it is understood in a second.
- **Shareable output by design.** GIFs, links and single HTML files make every use a potential share.
- **Agent-native, which is new.** A small, deterministic tracing API is exactly what coding agents can write reliably. "Explain this function" becomes an interactive player in one prompt, and `traceplay check` lets the agent verify its own work. No competitor has this.
- **Trustworthy where pure LLM-drawn visuals are not.** Every frame comes from running the code, the same principle that made anatomy credible.
- **Feasible to build well.** No server, no paid APIs; a static site on GitHub Pages plus a dependency-free CLI.

## How it differs from algorithm-visualizer

|               | traceplay                                            | algorithm-visualizer  |
| ------------- | ---------------------------------------------------- | --------------------- |
| Where it runs | Anywhere: local CLI, static site, one HTML file      | Its web app           |
| Output        | Interactive player, GIF, standalone HTML, share link | The web app           |
| Motion        | Interpolated (items slide, trees re-balance)         | Step changes          |
| Code panel    | The original source, line-synced via `t.line()`      | Tracer code           |
| Agents        | Skill + `check` quality report                       | —                     |
| Maintenance   | Active                                               | Last commit June 2024 |

## Scope of 1.0

Arrays (bars and cells), grids, graphs (circle, force, layered, manual), binary and n-ary trees, variables. Narration and code sync. Player with keyboard and speed control. GIF and HTML export. Playground with sandboxed execution and share links. CLI (`render`, `check`, `init`, `docs`). Agent skill. Eleven real examples.
