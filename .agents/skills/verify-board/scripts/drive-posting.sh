#!/usr/bin/env bash
# A worked drive: posting and threads, end to end, as a user would. Every call
# lands in the transcript; the checks at the end fail loudly.
#
# usage: drive-posting.sh <sandbox>
set -uo pipefail
here=$(dirname "$0")
S=${1:?usage: drive-posting.sh <sandbox>}
vb() { "$here/vb.sh" "$S" "$@"; }
sh() { "$here/sh.sh" "$S" "$1"; }
fail() {
  echo "FAIL: $*" >&2
  exit 1
}

root=$(vb post dev "first thread from a fresh sandbox" --label kind=task) || fail "post"
[[ $root =~ ^[0-9]+$ ]] || fail "post printed '$root', not an id"

reply=$(vb reply "$root" "a reply in the thread") || fail "reply"
sh "echo 'a reply from stdin' | vb reply $root -" >/dev/null || fail "reply from stdin"
sh "printf 'notes\n' > notes.txt && vb reply $root 'with a file' --attach notes.txt" >/dev/null || fail "reply with --attach"
vb edit "$reply" "a reply in the thread, edited" >/dev/null || fail "edit"

once=$(vb post dev "posted once" --idempotency-key verify-once) || fail "post --idempotency-key"
again=$(vb post dev "posted once" --idempotency-key verify-once) || fail "post --idempotency-key again"
[[ $once == "$again" ]] || fail "--idempotency-key posted twice: $once then $again"

gone=$(vb post dev "posted to delete") || fail "post to delete"
vb delete "$gone" >/dev/null || fail "delete"

thread=$(vb read "$root") || fail "read thread"
for want in "first thread from a fresh sandbox" "edited" "a reply from stdin" "with a file" "notes.txt"; do
  grep -qF "$want" <<<"$thread" || fail "thread is missing: $want"
done
attachment=$(sed -n 's/.*file notes\.txt · .* · //p' <<<"$thread")
[[ -n $attachment ]] || fail "no attachment id on the file line"
[[ $(vb download "$attachment" -) == notes ]] || fail "download didn't return the file's contents"
channel=$(vb read dev) || fail "read dev"
grep -qF "posted to delete" <<<"$channel" && fail "a deleted post still reads"

vb reply 999999 "no such thread" >/dev/null 2>&1 && fail "reply to a missing thread succeeded"
vb post >/dev/null 2>&1
[[ $? -eq 2 ]] || fail "post with no channel should exit 2 (misuse)"

sh "ls -lR .board" >/dev/null
echo "posting and threads: ok (thread #$root)"
