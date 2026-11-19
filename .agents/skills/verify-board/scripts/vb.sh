#!/usr/bin/env bash
# Runs `vb` in the sandbox, from the served project, and logs it to the transcript.
#
# usage: vb.sh <sandbox> <vb args...>     e.g. vb.sh "$S" post dev "hello" --label kind=bug
#
# Arguments pass through as argv, no shell: quote as you would locally. stdout,
# stderr, and the exit code are vb's. Each call appends "$ vb …", its output,
# and a nonzero exit to .verify/board/<timestamp>/transcript.txt.
set -uo pipefail
source "$(dirname "$0")/common.sh"
name=${1:-}
need_name "$name"
shift
ev=$(evidence_dir "$name")
printf -v shown ' %q' "$@"
run_logged "$name" "vb$shown" "$SB" exec "$name" --workdir "$PROJ" --env "BOARD_URL=$BOARD_URL" -- "$VB" "$@"
