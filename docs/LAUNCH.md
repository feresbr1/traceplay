# Launch kit

Nothing here has been posted yet. Every channel needs the maintainer's account; follow each community's rules on self-promotion.

**Assets:** https://feresbr1.github.io/traceplay/ · GIFs in `docs/images/` (quicksort, maze-bfs, heapsort, dijkstra, token-bucket, game-of-life) · `docs/images/playground.png` · social card `public/og.png`

## One-liners

- **traceplay**: watch any code run. Interactive step-by-step animations where every frame comes from actually running the code. Ask your AI agent to animate anything.
- Animate the real implementation, not a drawing of it: arrays, graphs, grids and trees, exported as a link, GIF or single HTML file.

## Show HN

**Title:** `Show HN: Traceplay – animate any algorithm from a real run of the code`

> traceplay turns code into interactive, step-by-step animations. You run the real algorithm with a few calls that say what to show (`a.swap(i, j)`, `g.mark('B', 'visited')`, `t.say('…')`), and every change becomes a frame. The animation can't drift from the code, and the original source sits next to it with the current line highlighted.
>
> The idea is algorithm-visualizer (49k stars, unmaintained since 2024), but for your own code, usable in docs, PRs and lessons rather than inside a web IDE. Motion is interpolated (swapped bars slide, trees re-balance in place), the player has scrubbing and keyboard control, and you can export a GIF in the browser or a single offline HTML file.
>
> The part I didn't expect: the tracing API is small and deterministic enough that coding agents write good traces. There's a skill (`npx skills add feresbr1/traceplay`) plus a `traceplay check` command that reports frames, narration and code-line coverage, so the agent can check its own work. "Explain this rate limiter" becomes a playable animation.
>
> Playground (runs in a sandboxed worker, share links encode the code in the URL): https://feresbr1.github.io/traceplay/#/play. No server, no account, MIT.

## Reddit

| Community                             | Angle                                                    | Notes                                                 |
| ------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| r/programming                         | The "frames come from real runs" idea, with the maze GIF | Strict about self-promotion; post once, link the repo |
| r/javascript, r/webdev                | The API and the playground                               | Showoff Saturday rules in r/webdev                    |
| r/learnprogramming, r/compsci         | Visualising classic algorithms                           | Lead with the gallery                                 |
| r/cscareerquestions, r/leetcode       | Interview prep: step through sliding window and BFS      | Only where tools are allowed                          |
| r/ClaudeAI, r/cursor, r/ChatGPTCoding | "Ask your agent to animate your code"                    | Show a real agent session                             |
| r/dataisbeautiful                     | Game of Life / maze GIFs                                 | OC rules apply                                        |

## Other channels

- **X / Bluesky / Mastodon:** one GIF per post (maze BFS, heapsort tree+array, token bucket) with the one-liner and the link.
- **Teachers and course authors:** CS50-style communities, university TA forums. The single-file HTML export works in any LMS.
- **Technical bloggers:** offer the `<iframe>` embed for algorithm posts.
- **Awesome lists:** awesome-algorithms, awesome-javascript (visualization), awesome-claude-code / awesome-agent-skills.

## Keywords

`algorithm visualizer` · `algorithm visualization` · `visualize code execution` · `step through algorithm` · `sorting algorithm animation` · `graph algorithm visualizer` · `dijkstra visualization` · `bfs maze visualization` · `heap visualization` · `binary search tree visualizer` · `python tutor alternative` · `algorithm-visualizer alternative` · `animate code` · `claude code skill visualization` · `agent skill animation`
