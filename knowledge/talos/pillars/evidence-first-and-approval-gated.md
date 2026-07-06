---
id: "knowledge-talos-pillars-evidence-first-and-approval-gated"
aliases: ["knowledge-talos-pillars-evidence-first-and-approval-gated", "evidence-first-and-approval-gated", "talos-primary-law", "talos-system-law"]
type: "Knowledge"
namespace: "talos"
lifecycle_state: "scratch"
summary: "The foundational pillar of the TALOS namespace: the primary law that governs all agent action. No claim without evidence, no code without tests, no deployment without gates, no autonomy without permissions, no learning without rollback, no completion without traceability."
confidence: 0.85
retrieval_class: "domain"
export_class: "internal"
verified_at: "2026-07-05"
verified_by: "operator-pending"
edges:
  - target: "[[talos-core-doctrine]]"
    relation: "anchors"
    confidence: 0.92
created: "2026-07-05"
---

# Evidence-first and approval-gated

## The primary law

TALOS is governed by a primary law, binding in the TALOS repo via `TALOS_SYSTEM_LAW.md`:

- no claim without evidence
- no code without tests
- no deployment without gates
- no autonomy without permissions
- no learning without rollback
- no completion without traceability

This is the single load-bearing posture. Every capability in TALOS must be traceable to one
of these clauses.

## Why it matters here

This law is what makes TALOS governable rather than merely capable. It is also why TALOS
doctrine overlaps so heavily with the infinite-brain-os control model, which holds the same
approval-gated, evidence-first posture under a different vocabulary.

## What follows from it

- Agents never own execution authority. Action is always mediated by task state, risk level,
  role permission, tool contract, evidence requirement, approval posture, gate status, and
  audit log.
- Forbidden actions are unreachable by design, not merely disallowed by prompt. Fabricating
  evidence, bypassing gates, expanding own permissions, and unauthorised secret, deploy, or
  delete actions cannot be reached.
- Every outcome carries traceability. Completion is not declared without an audit trail.

## Provenance

Drafted from the TALOS README and the `TALOS_SYSTEM_LAW.md` reference during the 2026-07-05
Hive-Mind integration. Authored at `operator-pending`; the operator must verify the wording,
ideally against the full text of `TALOS_SYSTEM_LAW.md` ingested into `support/`, before it
becomes canon.
