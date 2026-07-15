#!/usr/bin/env bash
# Regression test for running the validator through the host's default /bin/bash.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SYSTEM_BASH=${INFINITE_BRAIN_SYSTEM_BASH:-/bin/bash}
OUTPUT=$(mktemp "${TMPDIR:-/tmp}/infinite-brain-validator-runtime.XXXXXX")
trap 'rm -f "$OUTPUT"' EXIT

if ! "$SYSTEM_BASH" "$REPO_ROOT/_system/validate.sh" >"$OUTPUT" 2>&1; then
  printf 'validator failed through %s\n' "$SYSTEM_BASH" >&2
  sed -n '1,80p' "$OUTPUT" >&2
  exit 1
fi

if grep -q 'declare: -A: invalid option' "$OUTPUT"; then
  printf 'validator did not escape the Bash 3.2 compatibility boundary\n' >&2
  exit 1
fi

grep -q '^All checks passed\.$' "$OUTPUT"
printf 'VALIDATOR_RUNTIME_PASS shell=%s\n' "$SYSTEM_BASH"
