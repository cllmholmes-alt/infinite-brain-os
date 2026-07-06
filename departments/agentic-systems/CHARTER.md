---
id: "department-agentic-systems-charter"
aliases: ["department-agentic-systems-charter"]
type: "Charter"
namespace: "talos"
lifecycle_state: "scratch"
summary: "Charter for the agentic-systems department: mission, north star, owned outcomes, signals, constraints, and cadence. Optimizes for governed, approval-gated agent execution."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
edges:
  - target: "[[department-agentic-systems-index]]"
    relation: "supports"
    confidence: 0.9
departments:
  - "agentic-systems"
party_slugs: ["talos"]
brand_slug: "talos"
created: "2026-07-06"
---

# Charter: Agentic Systems

The INDEX answers what this department contains; this charter answers what it optimizes
and how success is measured.

## Mission

Run governed, approval-gated, evidence-first multi-agent execution so the operator can
scale software delivery without losing audit trail, permission control, or the ability to
halt any agent action. The department enforces the TALOS primary law as a runtime
constraint, not a suggestion: no claim without evidence, no code without tests, no
deployment without gates, no autonomy without permissions, no learning without rollback,
no completion without traceability. Agents never own execution authority; the operator
retains it by default.

## North Star

Every agent action is permissioned, evidenced, gated, and traceable. No agent runs
without a paper trail the operator can inspect. The department makes governed agent
execution the easiest path, not the bureaucratic path.

## Owned Outcomes

- Every agent action across the cluster is permissioned by role, risk level, and gate
  status
- Every deployment through an agent is gated: no code reaches production without tests
  and operator sign-off
- Audit logs are complete, queryable, and reviewed weekly
- The TALOS primary law is binding and enforced, not advisory

## Key Goals

- Wire the head-of-department agent as the single permission-and-gate control surface
- Establish the weekly governance review as a repeatable operator ritual
- Map the TALOS-to-brain relationship and settle whether TALOS is the runtime substrate,
  a peer system, or a successor
- Connect the agentic cluster repos (talos, company-os, odysseus-dev, openclaw,
  nemoclaw) into one observable execution surface

## KPIs / Metrics

Three measurable signals, all provisional until a Data System namespace exists:

1. **Permissioned-action rate**: percentage of agent actions that pass through the
   permission-gate surface, target 100 percent. Data posture: `not-wired`, read from
   agent audit logs.
2. **Gate-pass rate**: percentage of deployments that pass all gates (test, review,
   sign-off) before reaching production, target 100 percent. Data posture: `not-wired`,
   read from the CI/CD gate pipeline.
3. **Audit-log completeness**: percentage of agent actions with a complete evidence chain
   and traceable audit log, target 100 percent. Data posture: `not-wired`, verified in
   the weekly governance review.

## Targets and Review Posture

Permissioned-action rate is the safety metric: if agent actions bypass the permission
surface, the department stops all autonomous execution and escalates to the operator.
Gate-pass rate failure blocks individual deployments, not the whole cluster. Targets are
reviewed in the weekly governance review and reset per operating period.

## Core Constraints

- Never grant an agent execution authority that bypasses the permission-gate surface
- Never deploy code without passing the test and review gates
- Never amend the TALOS primary law without operator approval and a canon edit to
  `knowledge/talos/`
- Never store agent credentials, API keys, or permission tokens in git; all secrets live
  in the shared `devops-platform` secret posture
- Conservative default: when unsure whether an action requires operator approval, require it

## Related Entities

Namespace `talos`; brand [[brand-talos]]; head agent gap (not yet created); doctrine
[[talos-primary-law]], [[lifecycle-stages]], and
[[talos-brain-relationship]]; shared platform `devops-platform` (planned) and
`rtk` (Rust Token Killer, cross-cutting token cost infrastructure); repos `talos`,
`company-os`, `odysseus-dev`, `openclaw`, `nemoclaw`; execution surface listed in
[[department-agentic-systems-index]].

## Human Review / Escalation

The operator owns final acceptance of: permission changes, gate overrides, risk-level
escalations, primary-law amendments, and new agent role definitions. The operator tunes
the permission thresholds and the governance review cadence. Permission gating is a
candidate for partial AI routing once the head agent is wired and the permission contract
is operator-approved, but no action is AI-routed until that contract exists.

## Reporting Cadence

Daily governance note (gap); weekly governance review (gap); a per-operating-period
retrospective.

## Open Gaps

- No head-of-department agent exists.
- No KPI data pipeline is wired; all three KPIs are hand-counted.
- The TALOS-to-brain relationship is not settled; an open synthesis question.
- The agentic cluster is registered in the repo-registry but not yet wired into one
  observable execution surface.
- The shared `devops-platform` department is not yet built; CI/CD, secrets, and
  deployment posture are undefined.
- No daily note or weekly governance review workflow is automated.
- No swarm sprint or project is scoped.
