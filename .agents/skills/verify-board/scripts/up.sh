#!/usr/bin/env bash
# Creates a fresh Vercel Sandbox, puts board in it, and serves a local board.
#
# usage: up.sh                      the checkout as it is now (tracked + untracked, not ignored)
#        up.sh --published 0.9.0    the board npm package at that version, what users get
#
# Prints the sandbox name as its last stdout line. Its log and evidence go to
# .verify/board/<timestamp>/. If setup fails, the sandbox is removed (VERIFY_KEEP=1 keeps it).
set -euo pipefail
source "$(dirname "$0")/common.sh"

published=
if [[ ${1:-} == --published ]]; then
  published=${2:?usage: up.sh --published <version>}
elif [[ $# -gt 0 ]]; then
  die "usage: up.sh [--published <version>]"
fi

name="verify-board-$(date -u +%Y%m%d-%H%M%S)-$(od -An -N2 -tx1 /dev/urandom | tr -d ' \n')"
ev=$(evidence_dir "$name")
log="$ev/up.log"
echo "sandbox  $name" >&2
echo "log      ${log/#$HOME/\~}" >&2

created=
cleanup_on_fail() {
  local rc=$?
  [[ $rc -eq 0 || -z $created ]] && return
  echo "error: setup failed (exit $rc), see ${log/#$HOME/\~}" >&2
  if [[ ${VERIFY_KEEP:-} == 1 ]]; then
    echo "kept $name: $HERE/down.sh $name" >&2
  else
    "$HERE/down.sh" "$name" >&2 || true
  fi
}
trap cleanup_on_fail EXIT

step() {
  echo "== $*" >>"$log"
  echo "$*" >&2
}

step "creating the sandbox"
"$SB" create --name "$name" --timeout "${VERIFY_TIMEOUT:-45m}" --vcpus "${VERIFY_VCPUS:-4}" >>"$log" 2>&1
created=1
{
  echo "name=$name"
  echo "mode=${published:+published}${published:-source}"
  echo "version=${published:-$(node -p "require('$ROOT/packages/board/package.json').version")}"
  echo "commit=$(git -C "$ROOT" rev-parse HEAD)"
  echo "dirty=$(git -C "$ROOT" status --porcelain | wc -l | tr -d ' ')"
} >"$ev/meta"

if [[ -z $published ]]; then
  step "uploading the checkout"
  tgz=$(mktemp -t board-XXXXXX.tgz)
  # The working tree, not just HEAD: uncommitted changes are what you're verifying.
  (cd "$ROOT" && git ls-files -z --cached --others --exclude-standard -- . ':!.claude/worktrees' |
    while IFS= read -r -d '' f; do [[ -e $f ]] && printf '%s\0' "$f"; done |
    tar --null -T - -czf "$tgz")
  "$SB" cp "$tgz" "$name:/tmp/board.tgz" >>"$log" 2>&1
  rm -f "$tgz"
  step "installing and building (pnpm, a few minutes)"
  sbx_script "$name" "set -e
    mkdir -p $REPO /vercel/bin && tar -xzf /tmp/board.tgz -C $REPO
    cd $REPO
    export COREPACK_ENABLE_DOWNLOAD_PROMPT=0 CI=1
    corepack pnpm install --frozen-lockfile --filter '@vercel/board...'
    corepack pnpm --filter @vercel/board build
    # A symlink, like npm's bin link.
    chmod +x packages/board/dist/cli.mjs
    ln -sf $REPO/packages/board/dist/cli.mjs $VB" >>"$log" 2>&1
else
  step "installing @vercel/board@$published from npm"
  sbx_script "$name" "set -e
    mkdir -p /vercel/cli /vercel/bin
    cd /vercel/cli && npm init -y >/dev/null && npm install --no-fund --no-audit @vercel/board@$published
    ln -sf /vercel/cli/node_modules/.bin/vb $VB" >>"$log" 2>&1
fi

step "serving a local board"
sbx_script "$name" "set -e
  mkdir -p $PROJ && cd $PROJ && git init -q
  setsid nohup $VB serve --no-inspect --no-open >$SERVE_LOG 2>&1 < /dev/null &
  for i in \$(seq 60); do
    BOARD_URL=$BOARD_URL $VB whoami >/dev/null 2>&1 && exit 0
    sleep 0.5
  done
  echo 'the board never answered:' >&2; cat $SERVE_LOG >&2; exit 1" >>"$log" 2>&1
sbx "$name" cat "$SERVE_LOG" | tee -a "$log" >&2

echo "ready" >&2
echo "$name"
