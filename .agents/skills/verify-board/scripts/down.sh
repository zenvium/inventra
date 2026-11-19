#!/usr/bin/env bash
# Collects evidence, removes the one sandbox named, and confirms it's gone.
# Never removes by pattern: pass the name up.sh printed.
#
# usage: down.sh <sandbox> [--no-collect]
set -uo pipefail
source "$(dirname "$0")/common.sh"
name=${1:-}
need_name "$name"
ev=$(evidence_dir "$name")
if [[ ${2:-} != --no-collect ]]; then
  "$HERE/collect.sh" "$name" || echo "could not collect evidence (sandbox already gone?)" >&2
fi
"$SB" rm "$name" --delete-orphan-snapshots >/dev/null 2>&1 || echo "rm failed or $name was already gone" >&2
# Every state: a stopped sandbox that rm missed still counts as there.
status=$(sandbox_status "$name") || die "sandbox ls failed, so $name may still exist: check $HERE/sb.sh ls --all"
[[ -z $status ]] || die "$name is still listed by sandbox ls ($status)"
echo "removed  $name" | tee -a "$ev/down.txt"
echo "evidence  ${ev/#$HOME/\~}"
