---
id: "knowledge-talos-concepts-mediation-model"
aliases: ["knowledge-talos-concepts-mediation-model", "mediation-model", "eight-mediators"]
type: "Knowledge"
namespace: "talos"
lifecycle_state: "scratch"
summary: "Defines the eight-dimensional mediation model that governs every agent action in TALOS. Agents never own execution authority; every action must be expressible through task state, risk level, role permission, tool contract, evidence requirement, approval posture, gate status, and audit log. Forbidden actions are unreachable by design, not merely disallowed by prompt."
confidence: 0.9
retrieval_class: "domain"
export_class: "internal"
edges:
  - target: "[[talos-core-doctrine]]"
    relation: "elaborates"
    confidence: 0.92
  - target: "[[evidence-first-and-approval-gated]]"
    relation: "derived_from"
    confidence: 0.95
created: "2026-07-06"
---

# Mediation model

## The non-negotiable architecture principle

Agents do not own execution authority in TALOS. This is the single most important
architectural truth: capability does not equal authority. An action that cannot be
expressed through all eight mediators MUST NOT execute.

## The eight mediation dimensions

Every agent action is mediated by the following eight dimensions, ordered from action
context through to permanent record:

1. **task state**: what phase the task occupies. Determines which gates apply and which
   lifecycle transitions are valid. A task in `build` has different mediation than one in
   `operate`.

2. **risk level**: a quantified or qualitative assessment mapped to a mandatory approval
   posture via the binding risk-to-posture mapping. Reading source code is
   `autonomous_allowed`; deploying production is `approval_gated`.

3. **role permission**: what the agent's role permits, bounded by the agent registry. No
   agent may expand its own permissions. Role permission gates the set of actions an
   agent may even attempt.

4. **tool contract**: each tool available to an agent declares a bounded capability with
   an enforced contract. A tool that writes files carries different evidence and approval
   requirements than a tool that reads them. Tool contracts are defined in
   `TOOL_CONTRACT_REGISTRY_V0.json`.

5. **evidence requirement**: every claim must reference evidence. The evidence ledger is
   append-only. The evidence requirement scales with risk: a draft report may require
   only source citations; a production deploy requires commit, build, release, and
   rollback refs.

6. **approval posture**: one of six ordered postures, from `autonomous_allowed` through
   `forbidden`. The posture is assigned by the risk-to-posture mapping and enforced by
   the approval engine. Postures escalate, never de-escalate, without operator action.

7. **gate status**: release gates enforced by the orchestrator state machine and
   gatekeeper. A gate that fails blocks all downstream actions. Bypassing a failed gate
   is a forbidden action.

8. **audit log**: every action records an audit entry in the append-only evidence ledger.
   Every approval records the decision-maker and the reason. Every unknown remains
   visible. The audit log is the last mediator, the permanent record that makes
   traceability enforceable.

## How the eight mediators work together

The mediation model operates as a pipeline, not a checklist. An action enters the
pipeline with a task state and risk level. Role permission gates whether the agent may
proceed. The tool contract constrains how. The evidence requirement specifies what must
be recorded. The approval posture determines whether a human must sign off. Gate status
blocks or allows progression to execution. The audit log records the outcome.

If any mediator cannot be satisfied, the action does not execute. There is no fallback
path that skips a mediator. There is no override an agent may invoke to bypass
mediation.

## Forbidden actions are unreachable by design

Forbidden actions (fabricating evidence, bypassing gates, expanding own permissions,
unauthorised secret, deploy, or delete, and the full catalogue in the system law) are
not merely disallowed by prompt or policy. They are structurally unreachable because the
mediation model requires every action to pass through all eight dimensions, and the
risk-to-posture mapping maps each forbidden category to the `forbidden` posture, which
is the terminal state of the mediation pipeline. No tool contract exists for a forbidden
action. No gate permits a forbidden action. The approval engine cannot issue a
`forbidden` posture a pass.

## Relationship to the primary law

The mediation model is the enforcement architecture for the primary law recorded in
[[evidence-first-and-approval-gated]]. Each of the six clauses maps to one or more
mediators:

- No claim without evidence: evidence requirement, audit log
- No code without tests: gate status, audit log
- No deployment without gates: gate status, approval posture
- No autonomy without permissions: role permission, risk level, tool contract
- No learning without rollback: evidence requirement, audit log
- No completion without traceability: audit log

The mediation model is what makes the primary law enforceable at runtime, rather than a
set of aspirational statements.
