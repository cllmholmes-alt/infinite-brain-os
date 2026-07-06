---
id: "knowledge-talos-concepts-lifecycle-stages"
aliases: ["knowledge-talos-concepts-lifecycle-stages", "lifecycle-stages", "talos-lifecycle"]
type: "Knowledge"
namespace: "talos"
lifecycle_state: "scratch"
summary: "Defines the five lifecycle stages that structure all TALOS-governed work: build, launch, operate, improve, and scale. Each stage carries its own gates, risk profile, audit requirements, and approval postures. Stages are sequential with explicit gate transitions; no stage may be entered without passing the prior stage's exit gates."
confidence: 0.85
retrieval_class: "domain"
export_class: "internal"
edges:
  - target: "[[talos-core-doctrine]]"
    relation: "elaborates"
    confidence: 0.92
  - target: "[[evidence-first-and-approval-gated]]"
    relation: "derived_from"
    confidence: 0.9
created: "2026-07-06"
---

# Lifecycle stages

## The five stages

TALOS organises all work into five sequential lifecycle stages. Every AI-powered business
and software product governed by TALOS passes through these stages in order:

1. **Build**: architecture, implementation, and initial verification. Covers the
   authority artefacts (Phase 0), monorepo setup (Phase 1), database and evidence ledger
   (Phase 2), orchestrator (Phase 3), agent harness (Phase 4), tools (Phase 5),
   command-centre MVP (Phase 6), GTM subsystem (Phase 7), repo-to-release pipeline
   (Phase 8), design system (Phase 9), observability and learning (Phase 10), and evals
   plus live model wiring (Phase 11). Every build artefact must carry tests and evidence.
   Exit gate: all build-phase tests pass, all structural audits pass, the evidence ledger
   records build provenance.

2. **Launch**: first production deployment. Run through the full release gates
   (`pnpm verify`: unit plus coverage plus structural audits plus Playwright E2E plus
   visual baselines). Gate status must be green. Approval posture is `approval_gated`.
   The first production deployment creates the live runtime surface and the audit log
   baseline. Exit gate: first green production deploy, full audit trail from commit to
   release.

3. **Operate**: steady-state production. The running system serves its intended function.
   Agents operate within their bounded tool contracts and role permissions. The
   orchestrator routes work through the mediation pipeline. The evidence ledger records
   all operational events. Gate transitions from operate to improve or scale require
   operator approval. Exit gate: a completed operate window with a recorded
   postmortem baseline.

4. **Improve**: recovery, refinement, and optimisation. Driven by postmortem evidence,
   eval feedback, and learning loops. Improvements must carry before-and-after evidence.
   No improvement may degrade a prior gate status. The learning loop requires rollback
   evidence: every improvement records how to undo it. Improvement candidates are drafted
   at `scope_based_edit` and promoted through `approval_gated` at the operator's
   discretion. Exit gate: improvement evidence accepted, rollback path verified,
   post-improvement gate status equal to or better than pre-improvement.

5. **Scale**: commercial scaling and growth. Activates the GTM subsystem (lead scoring,
   Compliance Kernel, CRM and MEDDPICC schemas, P.S.S.O. offer validation, model-task
   routing policy, synthetic simulation engine). Outbound send, spend, publish, contact,
   pricing, and destructive actions remain human approval-gated. Scale is reachable only
   after operate and improve have produced a stable, evidence-backed baseline. Exit gate:
   scaling operations running with compliant GTM posture.

## Gate structure at each stage

Every lifecycle transition passes through a gate. Gates are defined in
`GATE_REGISTRY_V0.json` and enforced by the gatekeeper and orchestrator state machine.
A gate carries:

- a stage boundary (the two stages it sits between)
- a set of required checks (tests, audits, evidence references, approval records)
- a pass and fail posture (pass opens the next stage; fail blocks all downstream action)
- an audit record of every attempt

Bypassing a gate is a forbidden action. A gate that fails cannot be skipped, overridden,
or marked as passed by an agent.

## Risk profiles by stage

| Stage | Default risk level | Default approval posture | Audit density |
|-------|-------------------|-------------------------|---------------|
| Build | moderate | scope_based_edit | every artefact creation and test run |
| Launch | high | approval_gated | every deploy step, every gate check |
| Operate | moderate to high | scope_based_edit to approval_gated | every mediated action |
| Improve | moderate | scope_based_edit | every change plus rollback record |
| Scale | high | approval_gated for outbound and destructive actions | every GTM action, every spend or publish event |

## Relationship to the primary law

Each lifecycle stage enforces a subset of the primary law [[evidence-first-and-approval-gated]]:

- Build enforces no claim without evidence, no code without tests, no completion without traceability.
- Launch enforces no deployment without gates, no autonomy without permissions, no completion without traceability.
- Operate enforces no autonomy without permissions, no completion without traceability.
- Improve enforces no learning without rollback, no claim without evidence.
- Scale enforces no autonomy without permissions, no deployment without gates (for GTM outbound), no completion without traceability.

## Relationship to the mediation model

Every action within a lifecycle stage passes through the eight mediators of the
[[mediation-model]]: task state (the current stage), risk level (mapped from the stage
and the specific action), role permission, tool contract, evidence requirement, approval
posture, gate status, and audit log. The stage determines the default values for task
state and constrains the range of risk levels and approval postures available.
