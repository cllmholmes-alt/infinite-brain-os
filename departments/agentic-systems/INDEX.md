---
id: "department-agentic-systems-index"
aliases: ["department-agentic-systems-index", "agentic-systems"]
type: "Doc"
namespace: "talos"
lifecycle_state: "scratch"
summary: "Assembly surface for the agentic-systems department: the entities that run governed, approval-gated, evidence-first agent execution under the TALOS brand."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
edges:
  - target: "[[department-agentic-systems-charter]]"
    relation: "depends_on"
    confidence: 0.9
created: "2026-07-06"
---

# Department: Agentic Systems

The operating department that owns governed, approval-gated, evidence-first agent
execution under the TALOS brand. It assembles the namespace, repos, brand, shared
platform consumption, and execution surfaces needed to run multi-agent systems that never
own execution authority. It owns no entity bodies; it is a grouping surface over the
ontology.

## Purpose

Run governed agent execution: every action is mediated by task state, risk level, role
permission, evidence requirement, approval posture, gate status, and audit log. The
agents cannot self-authorize; every significant action gates through the operator or an
operator-delegated review surface. See [[department-agentic-systems-charter]] for what
success means.

## Scope Class

`brand-scoped`. One brand dominates: TALOS.

- `brand_slug`: `talos`
- `party_slugs`: `["talos"]`

Brand record: [[brand-talos]].

## Head Agent

Gap: no head-of-department agent exists yet. The department will need an agent that owns
first-pass triage for agentic-systems intake, orchestration across the agentic cluster
(talos, company-os, odysseus-dev, openclaw, nemoclaw), escalation to the operator for
permission changes and gate overrides, and the daily update.

## Intake

Gap: no dedicated intake path exists yet. When wired, intake should route:

- Agent permission requests and gate override requests
- Risk-level escalations from the agentic cluster
- Audit log anomalies and evidence-chain gaps
- Architecture decisions touching governance or the TALOS primary law

## Core Knowledge

- The `talos` namespace, entered through its INDEX
- [[talos-primary-law]] for the six governance rules
- [[lifecycle-stages]] for the build-launch-operate-improve-scale model
- [[talos-brain-relationship]] for how TALOS relates to the infinite-brain-os

## Core Execution

- Skill: gap (agent governance workflow not yet defined)
- Workflow (agentic): gap (daily update not yet automated)
- Workflow (deterministic): gap (audit log digest not yet configured)
- Project: gap (no swarm sprint or milestone is scoped yet)

## Related Repos

All repos in the agentic cluster, tracked in the repo-registry:

- `talos`: the core TALOS runtime, dockerized multi-agent service (primary)
- `company-os`: automated AI software development company OS (primary)
- `odysseus-dev`: agentic development system (supporting)
- `openclaw`: agentic runtime component (supporting)
- `nemoclaw`: agentic runtime component (supporting)

## Shared Platform Consumption

The agentic-systems department consumes shared platform capabilities rather than owning
its own stack:

- CI/CD and deployment posture: planned `devops-platform` department (not yet built)
- Token cost reduction: `rtk` (Rust Token Killer), repo-registry `rtk`, owned by
  `devops-platform`, consumed cross-cutting by all agentic systems
- Secrets posture: shared `devops-platform` standards, not department-local

## Human Layer

Human-only: permission changes, gate overrides, risk-level escalations, primary-law
amendments, and anything that grants or removes agent execution authority. Review-gated:
canon edits to `knowledge/talos/`, new agent role definitions, audit log review.
Fully AI-routed: nothing yet; all routes default to the human until the head agent is
wired and the operator approves its scope.

## Daily Update

Gap: not yet automated. One short note per day: agent runs, permission events, gate
events, anything blocked, anything needing the operator's decision. Should roll up into a
weekly governance review.

## Runtime Mapping

- `department_id`: `agentic-systems`
- `department_name`: Agentic Systems
- `head_agent`: gap (no agent assigned yet)
- `owned_namespaces`: `talos`
- `owned_workflows`: gap
- `owned_tools`: gap
- `primary_intake_sources`: gap
- `daily_update_output`: gap
- `daily_rollup_target`: gap
- `human_review_gates`: permission changes, gate overrides, primary-law amendments, agent role definitions

## Subdepartments

None. Keep it one surface until the agentic cluster grows enough to split governance
(talos) from execution (company-os, odysseus-dev) from runtime subsystems (openclaw,
nemoclaw).

## Open Gaps

- No head-of-department agent exists.
- No intake routing is wired.
- No daily update or weekly governance review workflow exists.
- No agent governance workflow (permission, gate, risk) is defined.
- The shared `devops-platform` department is not yet built; CI/CD and secrets posture
  are undefined.
- No swarm sprint or project is scoped yet.
- The TALOS-to-brain relationship is documented as an open question in the namespace
  synthesis layer, not settled.
