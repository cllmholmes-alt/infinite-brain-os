```yaml
session_id: "session-2026-07-15-validator-portability"
runtime_session_id: "unavailable"
date: "2026-07-15"
topic: "validator-portability"
status: "closed"
surface: "hermes-agent"
provider: "openai-codex"
model: "gpt-5.6-sol"
operator: "the-operator"
repo_scope:
  - "infinite-brain-os"
goal: "Make the deterministic validator invoke a compatible Bash runtime on macOS while preserving the existing validation contract on Linux and modern Bash systems."
linked:
  project: "estate-readiness"
  task: "ib-validator"
  sprint: ""
  namespace: "ai-architecture"
transcript_paths:
  - "sessions/logs/2026-07-15-validator-portability.log.md"
metering:
  usage_capture_status: "unavailable"
  usage_source: "unavailable"
  captured_at: "2026-07-15T03:07:27Z"
  input_tokens:
  output_tokens:
  cached_input_tokens:
  tool_calls:
  tool_cost_usd:
  estimated_cost_usd:
  usage_notes: "Hermes does not expose exact per-session usage totals to this repo session."
loaded_context:
  canon:
    - "knowledge/ai-architecture/canon/doctrine-card.md"
    - "knowledge/ai-architecture/canon/core-doctrine.md"
  skills:
    - "entities/skills/manage-ai-session.md"
  agents: []
  workflows: []
  nodes:
    - "_system/README.md"
    - "_system/session-ledger-rules.md"
```

## Goal

Remove the macOS Bash 3.2 false failure without weakening any validator check or changing the knowledge contract.

## Assumptions and open questions

- Assumption: Homebrew Bash is available at `/opt/homebrew/bin/bash` on the audited Mac.
- Open question: whether the best portable boundary is a small launcher or a validator self-reexec guard.

## Running notes

- 2026-07-15: confirmed `/bin/bash` is 3.2.57 and `/opt/homebrew/bin/bash` is 5.3.15.
- 2026-07-15: confirmed `_system/validate.sh` requires associative arrays and currently fails under Bash 3.2.
- 2026-07-15: added a preflight that re-executes under Homebrew Bash only when the invoking Bash is older than version 4.
- 2026-07-15: added a runtime regression test and proved default Bash, Homebrew Bash, and invocation outside the repository all pass 329-node validation.

## Outputs and changed files

- `_system/validate.sh`
- `_system/tests/validate-bash-runtime.sh`
- `sessions/logs/2026-07-15-validator-portability.log.md`
- `sessions/reviews/2026-07-15-validator-portability-closeout.md`

## Usage receipt

- Exact token, tool-call, and cost totals are unavailable from this surface.

## Swarm touchpoints

- None.

## Closeout pointer

- `sessions/reviews/2026-07-15-validator-portability-closeout.md`
