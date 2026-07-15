Session record: `sessions/closed/2026-07-15-validator-portability.md`

## Summary

The validator now detects Bash versions older than 4 and re-executes under a verified Homebrew Bash binary. This removes the macOS Bash 3.2 false failure without changing any validation rule.

## Outputs produced

- `_system/validate.sh`: compatible-runtime preflight.
- `_system/tests/validate-bash-runtime.sh`: regression test for default host Bash invocation.
- Session record and transcript declaration.

## Decisions made

- Preserve associative-array implementation rather than weakening or rewriting the 1,400-line validator.
- Re-execute only after proving the candidate shell is Bash 4 or newer.
- Support an explicit `INFINITE_BRAIN_BASH` override, then standard Apple Silicon and Intel Homebrew locations.
- Keep all existing validator checks and warning behavior unchanged.

## Wrong turns and confusion

- Broad ShellCheck reports existing SC2034 and SC2295 findings in legacy validator lines. Focused ShellCheck with those pre-existing codes excluded passes the changed runtime boundary and regression test.

## Usage receipt

- Usage capture status: unavailable
- Usage source: unavailable
- Runtime session id: unavailable
- Captured at: 2026-07-15T03:07:27Z
- Input tokens: unavailable
- Output tokens: unavailable
- Cached input tokens: unavailable
- Tool calls: unavailable
- Tool cost usd: unavailable
- Estimated cost usd: unavailable
- Usage notes: Hermes did not expose exact per-session usage totals to this repository session.

## Memory candidates

- None. The durable behavior is encoded in the validator and regression test.

## PKM or namespace candidates

- None.

## Follow-up tasks

- Synchronize the complete repository shape to the VPS before claiming Infinite Brain parity there.

## Swarm candidates or follow-ups

- None.

## Human review needed

- Review and commit the local changes before synchronization. No push or VPS mutation was performed.

## System improvements

- Default `bash _system/validate.sh` now works on macOS when Homebrew Bash is installed.

## Unresolved risks or open questions

- A Mac without any Bash 4 or newer installation still exits 2 with direct installation guidance.
- The VPS repository copy remains structurally incomplete and was not changed in this session.
