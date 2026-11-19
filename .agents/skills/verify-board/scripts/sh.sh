#!/usr/bin/env bash
# Runs a shell line in the sandbox, from the served project, with `vb` on PATH,
# and logs it to the transcript. For pipes, background jobs, files, and env.
#
# usage: sh.sh <sandbox> '<bash line>'    e.g. sh.sh "$S" 'echo hi | vb post dev -'
set -uo pipefail
source "$(dirname "$0")/common.sh"
name=${1:-}
need_name "$name"
line=${2:?usage: sh.sh <sandbox> '<bash line>'}
ev=$(evidence_dir "$name")
# Through the environment, so the line reaches bash untouched.
run_logged "$name" "$line" "$SB" exec "$name" --workdir "$PROJ" --env "VERIFY_LINE=$line" --env "BOARD_URL=$BOARD_URL" -- \
  bash -lc 'export PATH=/vercel/bin:$PATH; eval "$VERIFY_LINE"'
