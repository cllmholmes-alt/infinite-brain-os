# Validator portability session log

Full raw Hermes chat export is unavailable to this repository session. This append-only log records the repo-relevant actions and evidence without credentials.

- 2026-07-15: loaded AGENTS.md, CLAUDE.md, doctrine-card.md, core-doctrine.md, _system/README.md, session-ledger-rules.md, and manage-ai-session.md.
- 2026-07-15: verified the repository was clean at `e6b7056` before changes.
- 2026-07-15: observed `/bin/bash` 3.2.57 and Homebrew Bash 5.3.15.
- 2026-07-15: inspected `_system/validate.sh`; associative arrays begin at lines 15 and 16.
- 2026-07-15: reproduced the Bash 3.2 failure with exit 2.
- 2026-07-15: added a Bash version preflight that checks an explicit compatible override, Apple Silicon Homebrew Bash, then Intel Homebrew Bash before failing with installation guidance.
- 2026-07-15: added `_system/tests/validate-bash-runtime.sh` and observed RED before the implementation, then PASS after it.
- 2026-07-15: verified 329 nodes with `/bin/bash`, `/opt/homebrew/bin/bash`, and an absolute validator path from `/tmp`.
- 2026-07-15: focused ShellCheck and syntax checks passed. Existing broad ShellCheck warnings in legacy validator lines remain outside this change.
