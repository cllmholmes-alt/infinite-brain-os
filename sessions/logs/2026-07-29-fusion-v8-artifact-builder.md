# Transcript log: Fusion V8 release artifact integrity

Full raw tool-call export is unavailable. This append-only log records durable actions and
evidence without credentials.

## 2026-07-29

- Resumed from verified private release v27 and completed V7.
- Confirmed Fusion is clean and aligned on one local `main` branch and one worktree.
- Confirmed Infinite Brain is clean and aligned; Hermes remains a non-authoritative cache.
- Opened a distinct V8 cycle focused on deterministic release-artifact integrity.
- Created `FUSION_EVOLUTION_PLAN_V8_50.md` with 50 sequential pass/fail gates.
- Added and adversarially tested the canonical release artifact builder and receipt verifier.
- Operator review added streaming file hashing and explicit locally built API output inclusion.
- Complete local verification passed, including script 257/257 and browser E2E 120/120.
- Deployed V28 as the receipt-builder rehearsal. Its workflow completed durably in
  PostgreSQL, but the API did not expose the worker-appended row until restart.
- Added incremental durable run-history refresh with serialized reads and local-write
  deduplication; API available tests passed 861/861.
- Committed and pushed runtime commit `caf33820e2bccacf2b46c75bd21725ec720f4ebe`.
- Built, independently verified, installed, and switched private release
  `v29-caf33820-20260729T190814Z`, binding
  `sha256:b1901c16e63009edb021ab170adcea1fb231821b370954a95c6aa0eea11d14b2`.
- Verified exact outbox-to-BullMQ-to-worker-to-PostgreSQL-to-API lineage, all live paths,
  functions, queues, services, timers, Hermes catalog, and v28/v25 rollback releases.
- Recorded one transient 3-second GLM health timeout; five follow-up samples and the required
  three consecutive acceptance samples were healthy.
- Applied and verified the seven-destination knowledge transaction. Infinite Brain remains
  canonical; Hermes remains a non-authoritative cache; unrelated ADHD-OS material was excluded.
