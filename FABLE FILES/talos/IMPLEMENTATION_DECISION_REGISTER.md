---
id: fable-talos-implementation-decision-register
type: reference
namespace: fable-talos
lifecycle_state: research
summary: FABLE FILES copy of TALOS IMPLEMENTATION_DECISION_REGISTER. Canonical source is the TALOS main repo.
confidence: medium
retrieval_class: background
export_class: internal
---


# Implementation Decision Register

D1 In-memory stores behind repository interfaces (Postgres unavailable in build env).
Alt rejected: sqlite (adds dep w/o proving Prisma target). Rollback: swap repo impls.
D2 In-process async queue implements Queue interface (Redis unavailable).
Rollback: BullMQ adapter drop-in (apps/worker/src/queues.ts documents contract).
D3 npm single-root workspace for proof; pnpm/turbo files included for target env.
D4 API + spine share process for local proof; service split preserved by module seams.
