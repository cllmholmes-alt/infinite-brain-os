```yaml
session_id: "session-2026-07-29-fusion-v7-portable-evidence"
runtime_session_id: "unavailable"
date: "2026-07-29"
topic: "fusion-v7-portable-evidence"
status: "closed"
surface: "codex"
provider: "openai-codex"
model: "gpt-5"
operator: "Callum Holmes"
repo_scope:
  - "fusion-harness"
  - "infinite-brain-os"
goal: "Execute a distinct 50-item Fusion V7 evolution, release it privately, and converge portable evidence into Infinite Brain and Hermes."
linked:
  project: "Fusion canonical migration and evolution"
  task: "V7 portable evidence and clean-tree closure"
  sprint: ""
  namespace: "talos"
transcript_paths:
  - "sessions/logs/2026-07-29-fusion-v7-portable-evidence.md"
metering:
  usage_capture_status: "unavailable"
  usage_source: "unavailable"
  captured_at: "2026-07-29T18:28:08Z"
  input_tokens:
  output_tokens:
  cached_input_tokens:
  tool_calls:
  tool_cost_usd:
  estimated_cost_usd:
  usage_notes: "This Codex surface does not expose reliable session-level usage totals."
loaded_context:
  canon:
    - "knowledge/ai-architecture/canon/doctrine-card.md"
    - "knowledge/ai-architecture/canon/core-doctrine.md"
  skills:
    - "rtk-token-governor"
    - "agent-skills"
    - "gbrain/brain-ops"
  agents: []
  workflows: []
  nodes:
    - "_system/session-ledger-rules.md"
    - "knowledge/talos/support/fusion-release-current.md"
    - "knowledge/talos/synthesis/fusion-brain-relationship-current.md"
```

# Session: Fusion V7 portable evidence

## Goal

Execute a distinct 50-item V7 program that closes the highest-value evidence portability,
clean-tree verification, and cross-surface continuity gaps after V6.

## Running notes

- V6/v25 is the clean, pushed, private production baseline.
- Infinite Brain is canonical; Hermes remains a replaceable non-authoritative cache/client.
- Public-edge promotion and unrelated ADHD-OS corpus import remain out of scope.
- Implemented all 50 V7 items. Focused evidence and ledger tests passed 72/72,
  script tests passed 232/232, and every full-workspace gate passed, including browser
  E2E 120/120.
- Added deterministic evidence sealing with post-commit stable staged-index bindings.
- Added packet schema 2 and portable receipt schema 3 with backup-set and transaction
  digests, predecessor links, exact head mirrors, bounded history, and exact backup sets.
- Deployed immutable release `v27-3bf4d7f9-20260729T181942Z` with 6378 verified files
  and binding
  `sha256:90995e109861ce598a0916e0f8f56a48f6552658577f646b8e92380a09e59a37`.
- Fixed incomplete cleanroom workflow payloads to fail closed as terminal blocked results.
  Valid durable run `wfrun-170046e3-54b8-47c3-ad12-c8363b6b4db2` passed.
- Live path 17/17, functional 21/21, deep health, PostgreSQL, Redis, Hermes, workers,
  queues, immutable release, and v25 rollback gates pass.
- Infinite Brain now tracks 33 historical and current rollback backup files totaling
  49,632 bytes, all mode 0644 and free of configured secret patterns.
- Infinite Brain and Hermes share packet
  `sha256:5c8eee2de28510ffe6f058e3891f378e529e58d9238f5c919de345d504f346ff`.

## Outputs and changed files

- `knowledge/talos/support/fusion-release-current.md`
- `knowledge/talos/synthesis/fusion-brain-relationship-current.md`
- `repo-registry/fusion-runtime.md`
- `repo-registry/hermes-agent.md`
- `repo-registry/netcup-vps.md`
- `outputs/fusion-sync-receipts/v27-3bf4d7f9-20260729T181942Z/receipt.json`
- `sessions/reviews/2026-07-29-fusion-v7-portable-evidence-closeout.md`

## Usage receipt

- Exact token, tool-call, and cost totals are unavailable from this surface.

## Closeout pointer

- `sessions/reviews/2026-07-29-fusion-v7-portable-evidence-closeout.md`
