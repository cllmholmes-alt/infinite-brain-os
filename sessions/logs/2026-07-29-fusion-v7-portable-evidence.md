# Transcript log: Fusion V7 portable evidence

Full raw tool-call export is unavailable. This append-only log records durable actions and
evidence without credentials.

## 2026-07-29

- Resumed from verified private release v25 and completed V6.
- Opened a distinct V7 cycle focused on portable evidence and clean-tree closure.
- Created and executed `FUSION_EVOLUTION_PLAN_V7_50.md` with 50 sequential pass/fail gates.
- Added and proved deterministic staged-candidate evidence sealing.
- Added and proved portable hash-chained schema-3 Brain receipts.
- Passed 72 focused tests, 232 script tests, every full verification stage, and browser
  E2E 120/120.
- Released v26 as the first evidence candidate. Its incomplete negative durable probe
  exposed a cleanroom workflow TypeError.
- Fixed the workflow engine to fail closed on missing claims or outputs and added a
  regression test.
- Released immutable v27, then passed live path 17/17, functional 21/21, three repeated
  deep-health checks, PostgreSQL, Redis, Hermes, queue, blocked-workflow, and successful
  durable-workflow gates.
- Removed only the known failed v26 negative-probe job from BullMQ after exact ID, state,
  and failure-signature checks. PostgreSQL and run-history evidence remain.
- Synchronized seven V7/v27 projections to Infinite Brain and Hermes under packet
  `sha256:5c8eee2de28510ffe6f058e3891f378e529e58d9238f5c919de345d504f346ff`.
- Made all 33 existing and current Brain receipt backups Git-trackable after proving mode,
  aggregate size, and secret-pattern safety.
