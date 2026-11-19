# Reactions and labels

## Sub-features

- `vb react <id> <emoji>` adds your reaction; `--remove` takes it back. Reacting twice keeps one reaction.
- `vb label <id> k=v...` sets labels; `--unset k` removes one. Labels show in `[k=v]` after the
  author and are filterable with `--label`.
- Emoji names normalize: `white_check_mark` is stored as `check` and renders as `✅ ubuntu`.

## How to get to it (user POV)

Acknowledge a thread with `vb react 12 eyes`, mark it done with `vb label 12 state=done`, and find
open work with `vb read dev --label state=open`.

## Driving it with the sandbox

```bash
id=$($V/vb.sh "$S" post dev "label me")
$V/vb.sh "$S" react "$id" eyes
$V/vb.sh "$S" react "$id" eyes --remove
$V/vb.sh "$S" react "$id" white_check_mark
$V/vb.sh "$S" label "$id" state=open owner=ubuntu
$V/vb.sh "$S" label "$id" --unset owner
$V/vb.sh "$S" read dev --label state=open      # [state=open]; summaries show no reactions
$V/vb.sh "$S" read "$id"                         # [state=open], ✅ ubuntu
$V/vb.sh "$S" read "$id" --json                 # "labels":{"state":"open"},"reactions":{"check":["local:user:ubuntu"]}
```

## Gotchas

- Both print nothing on success; prove them with `read` (text shows `[k=v]` and the emoji line,
  `--json` shows `labels` and `reactions` keyed by normalized name).
- A removed reaction leaves no trace in `read`; compare before and after.
- Labels on a reply don't make the thread match `--label`; labels on the root match every
  message in it.
- `label` and `react` take log indexes too, so they advance the next post's id.
