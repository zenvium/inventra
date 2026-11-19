#!/usr/bin/env bash
# Read-only health check: the sandbox runs, its vb is the version under test,
# and the board answers. Changes nothing.
#
# usage: doctor.sh <sandbox>
set -uo pipefail
source "$(dirname "$0")/common.sh"
name=${1:-}
need_name "$name"
ev=$(evidence_dir "$name")
fail=0
row() { printf '%-8s  %s\n' "$1" "$2" | tee -a "$ev/doctor.txt"; }

status=$(sandbox_status "$name") || status="unknown (sandbox ls failed)"
if [[ $status == running ]]; then row sandbox "$name running"; else
  row sandbox "$name ${status:-not found}"
  exit 1
fi

want=$(sed -n 's/^version=//p' "$ev/meta" 2>/dev/null)
[[ -n $want ]] || want=$(node -p "require('$ROOT/packages/board/package.json').version")
have=$("$SB" exec "$name" -- "$VB" --version 2>/dev/null | tail -1)
if [[ $have == "$want" ]]; then row vb "$have"; else
  row vb "$have, expected $want"
  fail=1
fi

if who=$("$SB" exec "$name" --workdir "$PROJ" --env "BOARD_URL=$BOARD_URL" -- "$VB" whoami 2>&1 | sed '1{/^\$ /d}'); then
  row board "$(printf '%s' "$who" | sed -En 's/^board +//p') as $(printf '%s' "$who" | head -1)"
else
  row board "not answering: $who"
  fail=1
fi
exit $fail
