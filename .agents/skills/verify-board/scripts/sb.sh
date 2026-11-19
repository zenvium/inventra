#!/usr/bin/env bash
# The Vercel Sandbox CLI, pinned, in the vercel-labs scope (SANDBOX_SCOPE overrides).
# usage: sb.sh <sandbox command> [args...]   e.g. sb.sh ls, sb.sh exec <name> -- node --version
set -euo pipefail
cmd=$1
shift
exec npx --yes sandbox@4.8.1 "$cmd" --scope "${SANDBOX_SCOPE:-vercel-labs}" "$@"
