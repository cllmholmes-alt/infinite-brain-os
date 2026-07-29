```yaml
session_id: "session-2026-07-29-fusion-v8-artifact-builder"
runtime_session_id: "unavailable"
date: "2026-07-29"
topic: "fusion-v8-artifact-builder"
status: "closed"
surface: "codex"
provider: "openai-codex"
model: "gpt-5"
operator: "Callum Holmes"
repo_scope:
  - "fusion-harness"
  - "infinite-brain-os"
goal: "Execute Fusion V8: canonical deterministic release artifacts, private v28 release, and verified Brain/Hermes convergence."
linked:
  project: "Fusion canonical migration and evolution"
  task: "V8 release artifact integrity"
  sprint: ""
  namespace: "talos"
transcript_paths:
  - "sessions/logs/2026-07-29-fusion-v8-artifact-builder.md"
metering:
  usage_capture_status: "unavailable"
  usage_source: "unavailable"
  captured_at: "2026-07-29T19:15:41Z"
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

# Session: Fusion V8 release artifact integrity

## Goal

Replace manual release-overlay construction with a canonical, deterministic, independently
verifiable artifact builder; deploy v28 privately; converge verified release knowledge into
Infinite Brain and Hermes.

## Running notes

- V7/v27 is the clean, pushed, private production baseline.
- Fusion starts on one local `main` branch and one registered worktree.
- Infinite Brain is canonical; Hermes remains a replaceable non-authoritative cache/client.
- Public-edge promotion and unrelated ADHD-OS corpus import remain out of scope.
- Implemented all 50 V8 gates and deployed private release
  `v29-caf33820-20260729T190814Z` from runtime commit
  `caf33820e2bccacf2b46c75bd21725ec720f4ebe`.
- Added a deterministic, xattr-free release artifact builder with canonical receipt bytes,
  per-file inventory, deletion ledger, explicit ignored build-output includes, and
  independent no-Git verification.
- The V28 rehearsal proved worker completion but exposed startup-only API run-history
  hydration. V29 incrementally refreshes PostgreSQL rows appended by workers without
  duplicating API-local writes.
- Local artifact tests passed 25/25, script tests 257/257, API tests 861/861 available,
  and the complete workspace verifier passed including browser E2E 120/120.
- V29 path 17/17, functional 21/21, three consecutive eight-probe deep health, PostgreSQL,
  Redis, workers, queues, outbox, timers, Hermes, and immutable release gates pass.
- Durable outbox `outbox-d6061076-9494-40e2-b4b6-0a4b42836cb7` dispatched on attempt 1.
  Run `wfrun-cf90f3d6-fede-4bd1-827a-7ba6f690a02d` completed
  `rebuild_pack_ready`, `gatePass=true`, `unmet=[]`, and is API-visible.
- Infinite Brain and Hermes share packet
  `sha256:8cadc63b472ba8421da80ab45289c573b7c5139e871e3a7257576caac0e574a0`.

## Outputs and changed files

- `knowledge/talos/support/fusion-release-current.md`
- `knowledge/talos/synthesis/fusion-brain-relationship-current.md`
- `repo-registry/fusion-runtime.md`
- `repo-registry/hermes-agent.md`
- `repo-registry/netcup-vps.md`
- `outputs/fusion-sync-receipts/v29-caf33820-20260729T190814Z/receipt.json`
- `sessions/reviews/2026-07-29-fusion-v8-artifact-builder-closeout.md`

## Usage receipt

- Exact token, tool-call, and cost totals are unavailable from this surface.

## Closeout pointer

- `sessions/reviews/2026-07-29-fusion-v8-artifact-builder-closeout.md`
