# Reading and filters

## Sub-features

- `vb read <channel>`: one summary per thread (root, reply count, latest reply), latest activity
  last, with a `dev · 4 threads · cursor N` header. `--limit` counts threads.
- `vb read <id>`: one thread, every message. `--after <id>` keeps the replies after one of its
  messages, and `--label` the ones that wear it; `--by`, `--text`, `--mentions`, and `--source`
  with an ID are a usage error, exit 2.
- `vb read <channel> --before <older>`: the page before one, by the `older` its
  `(older not shown: …)` line printed.
- `vb read nosuch`: `error: Couldn't find channel nosuch.` (with `Did you mean dev?` for a typo), exit 1.
- `vb read [filters]` with no channel: across channels; each summary names its channel.
- Filters: `--re <id>`, `--by <handle>`, `--source <source>`, `--label k[=v|w]`, `--text <words>`,
  `--mentions [@handle]`, `--after <id>`; repeated flags must all match; labels match a message or
  its thread's root.
- `--limit N`, `--json` (one JSON document), `vb channels [--json]`, `vb actors`.
- On Vercel's board, `read` names one channel or one thread: no channel, a subtree, or `--by`,
  `--text`, `--mentions`, `--source` is exit 1 with the board's words (`Vercel's boards don't
  support … yet: …`). The sandbox's board is local, where they all work.

## How to get to it (user POV)

After a few posts, `vb read dev`, then narrow it: `vb read dev --label kind=bug`,
`vb read dev --text deploy`, or `vb read 12 --json | jq` in a script.

## Driving it with the sandbox

```bash
$V/drive-posting.sh "$S" >/dev/null           # seed a thread with replies and an attachment
$V/vb.sh "$S" read dev --label kind
$V/vb.sh "$S" read dev --by ubuntu --text stdin
$V/vb.sh "$S" read dev --re 3
$V/vb.sh "$S" post dev "hi @ubuntu" && $V/vb.sh "$S" read dev --mentions
$V/vb.sh "$S" read 3 --json
$V/vb.sh "$S" channels --json
```

Seen in a sandbox: `--text stdin` returns the one thread with the matching reply, `#3`; `channels --json` gives `{"channels":[{"path":"dev","lastIndex":9,"messages":7,"threads":4}]}`.

## Gotchas

- Plain `vb read` lists every channel's threads.
- `--mentions` with no handle means you: `local:user:ubuntu` in the sandbox, so mention `@ubuntu`.
- `--limit 1` keeps the thread with the newest activity, root included.
- `vb read <channel> --json` prints `{ threads, cursor, older }`, each thread `{ message, replies, last }`;
  `vb read <id> --json` prints `{ message, replies, cursor, schedules }`, where a reply has
  `"re":"<root>"` (IDs are strings).
- `vb.sh` keeps stdout and stderr apart, so `$($V/vb.sh "$S" read dev --json)` is clean JSON.
- Releases before 0.25 print `--json` as one object per line instead.
- Releases before thread summaries read messages by default, and print every channel name as-is.
