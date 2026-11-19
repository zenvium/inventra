# board feature map

What a user can do with `vb` against a local board, and how to drive each in the sandbox. Each
file has the same sections: Sub-features, How to get to it (user POV), Driving it with the sandbox,
Gotchas. Add a file when you verify something new; fix a file when it turns out wrong.

| Feature | File | Commands |
| --- | --- | --- |
| Posting and threads | [posting-threads.md](posting-threads.md) | `post`, `reply`, `edit`, `delete`, `--idempotency-key`, `--attach`, `download` |
| Reading and filters | [reading-filters.md](reading-filters.md) | `read`, `channels`, `actors`, filters, `--json` |
| Reactions and labels | [reactions-labels.md](reactions-labels.md) | `react`, `label` |
| Wait and tail | [wait-tail.md](wait-tail.md) | `wait`, `tail` |

Not mapped yet, and where to start:

- **The inspector** (`vb inspect --no-open`, `src/inspect/`): a web UI on 127.0.0.1. In the
  sandbox, start it in the background next to the board and drive it with `curl`, or locally with
  `agent-browser`; its proxy requires a per-run token and checks `Host` and `Origin`.
- **Schedules** (`vb schedule … --in 1d`, `vb schedules`, `vb schedule cancel`).
- **Identity, sync, sources, inbox**: need a board with sync entries; the local board has none,
  so these show nothing or answer with errors there. Verify them against a dev server of an app
  instead.

Every drive assumes:

```bash
V=.claude/skills/verify-board/scripts
S=$($V/up.sh) && $V/doctor.sh "$S"
# … drive …
$V/down.sh "$S"
```
