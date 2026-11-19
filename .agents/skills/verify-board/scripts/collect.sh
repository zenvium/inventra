#!/usr/bin/env bash
# Copies the board's side effects out of the sandbox into the evidence dir:
# the served project's .board/ (local.db log, local/ files; board.db and attachments/ on an older board), the
# serve log, a file listing, and `vb read <id> --json` of every thread in every channel.
#
# usage: collect.sh <sandbox>     (down.sh runs it first)
set -euo pipefail
source "$(dirname "$0")/common.sh"
name=${1:-}
need_name "$name"
ev=$(evidence_dir "$name")
sbx_script "$name" "cd $PROJ && export BOARD_URL=$BOARD_URL
  : > /tmp/read.json; : > /tmp/read.err
  for c in \$($VB channels --json 2>>/tmp/read.err | node -e 'const l = require(\"fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(Boolean).map((x) => JSON.parse(x)); for (const c of l.length === 1 && l[0].channels ? l[0].channels : l) console.log(c.path)'); do
    # one document of thread summaries, or on releases before it a line each (a summary, or a message): either way, each thread's root
    for id in \$($VB read \"\$c\" --json --limit 500 2>>/tmp/read.err | node -e 'const l = require(\"fs\").readFileSync(0, \"utf8\").split(\"\\n\").filter(Boolean).map((x) => JSON.parse(x)); const ids = new Set(); for (const t of l.length === 1 && l[0].threads ? l[0].threads : l) ids.add(t.message ? t.message.id : (t.re ?? t.id)); console.log([...ids].join(\" \"))'); do
      $VB read \"\$id\" --json >> /tmp/read.json 2>>/tmp/read.err || true
    done
  done
  find .board -type f -exec ls -l {} + > /tmp/files.txt 2>&1 || true
  tar -czf /tmp/evidence.tgz .board -C /vercel serve.log -C /tmp read.json read.err files.txt" >/dev/null
"$SB" cp "$name:/tmp/evidence.tgz" "$ev/sandbox-files.tgz" >/dev/null 2>&1
mkdir -p "$ev/files"
tar -xzf "$ev/sandbox-files.tgz" -C "$ev/files"
echo "collected  ${ev/#$HOME/\~}/files"
