# Shared by the verify-board scripts: sourced, not run.
# Paths inside the sandbox, the local evidence dir, and the pinned sandbox CLI.

HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(git -C "$HERE" rev-parse --show-toplevel)
SB="$HERE/sb.sh"

# Inside the sandbox (home is /vercel, user ubuntu).
REPO=/vercel/board        # the checkout under test (source mode)
PROJ=/vercel/proj          # a fresh git project the board is served from
VB=/vercel/bin/vb          # the CLI under test, either mode
SERVE_LOG=/vercel/serve.log
BOARD_URL=http://127.0.0.1:4100/api/board   # what every vb in the sandbox is pointed at

die() {
  echo "error: $*" >&2
  exit 1
}

# Only sandboxes these scripts created: verify-board-<UTC timestamp>-<4 hex>.
# The random suffix keeps parallel runs started in the same second apart.
need_name() {
  [[ ${1:-} =~ ^verify-board-[0-9]{8}-[0-9]{6}-[0-9a-f]{4}$ ]] || die "expected a sandbox name like verify-board-20261014-093000-3f2a, got: ${1:-nothing}"
}

# sandbox_status <sandbox>: prints its status (running, stopped, ...), or
# nothing when the scope has no sandbox by that name. Looks at every state, not
# just running (ls's default), and fails when the sandbox CLI does.
sandbox_status() {
  local list
  list=$("$SB" ls --all --name-prefix "$1" 2>/dev/null) || return 1
  awk -v n="$1" '$1 == n { print $2 }' <<<"$list"
}

# .verify/board/<timestamp>/ for a sandbox name; outlives the sandbox.
evidence_dir() {
  local dir="$ROOT/.verify/board/${1#verify-board-}"
  mkdir -p "$dir"
  echo "$dir"
}

# Runs a command in the sandbox; drops the CLI's "$ <command>" echo from stderr.
sbx() {
  local name=$1
  shift
  "$SB" exec "$name" "$@" 2> >(grep -v '^\$ ' >&2)
}

# sbx_script <sandbox> '<bash script>': runs a multi-line script in the sandbox,
# passed through the environment so it reaches bash untouched (and the CLI's
# echo stays one line).
sbx_script() {
  sbx "$1" --env "VERIFY_SCRIPT=$2" -- bash -lc 'eval "$VERIFY_SCRIPT"'
}

# run_logged <sandbox> <shown> <command...>: runs a single-line sandbox exec,
# passes its stdout, stderr, and exit code through, and appends all three to the
# transcript under "$ <shown>". The sandbox CLI's own "$ …" echo (stderr's first
# line) is dropped.
run_logged() {
  local name=$1 shown=$2 err out errs rc
  shift 2
  err=$(mktemp)
  out=$("$@" 2>"$err")
  rc=$?
  errs=$(sed '1{/^\$ /d}' "$err")
  rm -f "$err"
  {
    printf '$ %s\n' "$shown"
    [[ -n $out ]] && printf '%s\n' "$out"
    [[ -n $errs ]] && printf '%s\n' "$errs"
    [[ $rc -ne 0 ]] && echo "[exit $rc]"
    echo
  } >>"$(evidence_dir "$name")/transcript.txt"
  [[ -n $out ]] && printf '%s\n' "$out"
  [[ -n $errs ]] && printf '%s\n' "$errs" >&2
  return $rc
}
