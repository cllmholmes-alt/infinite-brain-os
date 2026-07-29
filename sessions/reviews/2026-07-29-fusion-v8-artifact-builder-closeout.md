Session record: `sessions/closed/2026-07-29-fusion-v8-artifact-builder.md`

## Summary

Fusion Evolution V8 completed 50/50. Private release
`v29-caf33820-20260729T190814Z` is active with verified immediate v28 and designated deep
v25 rollback. Release transport is deterministic, receipt-bound, independently verifiable,
and capable of carrying explicit locally built outputs.

## Outputs produced

- Canonical release artifact builder and 25 adversarial tests.
- Canonical archive receipt with per-file hashes, modes, sizes, source commits, includes,
  deletions, and self-digest.
- Incrementally refreshed PostgreSQL run-history visibility across API and worker processes.
- Current Fusion release support, relationship candidate, and three registry refreshes.
- Schema-3 seven-destination transaction receipt and exact rollback backups.
- Closed session record and durable transcript log.

## Decisions made

- Keep Infinite Brain canonical and Hermes a digest-bound non-authoritative cache.
- Build all runtime outputs locally and include them explicitly in receipt-bound artifacts.
- Treat worker-appended PostgreSQL history as a live read source, not startup-only state.
- Keep v28 as immediate rollback and v25 as the deeper designated retention release.
- Preserve the protected public-edge block and exclude unrelated ADHD-OS material.

## Wrong turns and confusion

- The first V29 full verifier stopped on canonical inventory drift after source changes;
  the inventory was regenerated, reviewed, resealed, and the full verifier passed.
- V28 durable execution passed in PostgreSQL but the API polling gate timed out. Direct
  lineage inspection proved the stale API snapshot and led to the V29 fix.
- The first post-V29 deep-health request caught one GLM response over the 3-second threshold.
  Five subsequent samples and the required three consecutive acceptance samples passed.
- The first v25 rollback verification used an abbreviated handoff binding. Manifest equality
  rejected it; rerunning with the exact immutable binding passed.

## Usage receipt

- Usage capture status: unavailable
- Usage source: unavailable
- Runtime session id: unavailable
- Captured at: 2026-07-29T19:15:41Z
- Input tokens: unavailable
- Output tokens: unavailable
- Cached input tokens: unavailable
- Tool calls: unavailable
- Tool cost usd: unavailable
- Estimated cost usd: unavailable
- Usage notes: This Codex surface does not expose reliable session-level usage totals.

## Memory candidates

- V29 release provenance and the receipt-bound artifact contract are durable memory products.

## PKM or namespace candidates

- `knowledge/talos/synthesis/fusion-brain-relationship-current.md` remains operator-pending.

## Follow-up tasks

- Observe GLM latency, queues, outbox counters, and both governed timers through the rollback
  retention window.
- Retain v28 and v25 until explicit retention approval.
- Review the relationship candidate before canon promotion.

## Swarm candidates or follow-ups

- None.

## Human review needed

- Public facade promotion still requires unanimous review and explicit operator approval.
- Relationship candidate promotion remains an operator decision.

## System improvements

- Deployable bytes now have a canonical build and independent acceptance receipt.
- Multi-process durable run history is visible without API restart.
- The operator can correlate archive, release manifest, runtime commit, outbox, worker run,
  Brain packet, and Hermes cache through explicit digests and IDs.

## Unresolved risks or open questions

- Public routing remains intentionally blocked.
- One transient GLM health timeout is retained for latency monitoring.
- Seventeen historical PostgreSQL dead-letter rows remain append-only incident evidence.
