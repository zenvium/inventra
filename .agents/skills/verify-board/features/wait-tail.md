# Wait and tail

## Sub-features

- `vb wait [channel] [filters] [--timeout 30m]`: blocks for the next matching event, prints it,
  exits 0; exits 1 with `error: Nothing matched within 3s.` when the timeout passes.
- `vb tail [channel] [filters] [--all]`: streams matching events until Ctrl-C, which exits 130;
  `--all` adds non-message events.
- Both take the read filters (`--label`, `--by`, `--mentions`, …).

## How to get to it (user POV)

An agent waits for a reply with `vb wait dev --re 12 --timeout 10m`; a person watches a channel
with `vb tail dev`.

## Driving it with the sandbox

Both block, so start the writer in the background in the same `sh.sh` line:

```bash
$V/vb.sh "$S" wait dev --timeout 3s; echo $?                         # timed out, 1
$V/sh.sh "$S" '(sleep 3; vb post dev "late arrival") & vb wait dev --timeout 30s'
$V/sh.sh "$S" 'timeout 6 vb tail dev & sleep 2; vb post dev "seen by tail"; wait'
```

Seen in a sandbox:

```
$ (sleep 3; vb post dev "late arrival") & vb wait dev --timeout 30s
17
#17  dev  ubuntu: late arrival
```

The first line is the background `post`'s id, the second is `wait`'s output.

## Gotchas

- `wait` only sees events after it starts: post after a delay, or it waits for the next one.
- Always bound `tail` with `timeout N`; an unbounded `tail` holds the `sandbox exec` open until
  the exec times out.
- Output from the backgrounded writer and the waiter interleave; assert on the event line
  (`#N  dev  ubuntu: …`), not on line order.
