---
id: "knowledge-talos-canon-core-doctrine"
aliases: ["knowledge-talos-canon-core-doctrine", "talos-core-doctrine", "talos-doctrine"]
type: "Knowledge"
namespace: "talos"
lifecycle_state: "scratch"
summary: "Drafted core doctrine for the TALOS namespace: the Total Agentic Lifecycle Orchestration System, a governed, evidence-first, approval-gated, multi-agent operating system for building and scaling AI-powered businesses. Covers the primary law, the mediation model, the lifecycle scope, and the open relationship to this brain. Authored at operator-pending until the operator verifies it."
confidence: 0.75
retrieval_class: "identity"
export_class: "internal"
verified_at: "2026-07-05"
verified_by: "operator-pending"
edges:
  - target: "[[evidence-first-and-approval-gated]]"
    relation: "derived_from"
    confidence: 0.92
  - target: "[[namespace-profiles]]"
    relation: "references"
    confidence: 0.7
created: "2026-07-05"
---

## Read this first

This is the drafted canon of the `talos` namespace. It is authored at `operator-pending`: an
agent drafted it from the TALOS README and the `TALOS_SYSTEM_LAW.md` reference during the
2026-07-05 Hive-Mind integration. The operator must verify it before it becomes real canon.
Read it whole, then expand into the pillar and the governance material as the query demands.

## What TALOS is

TALOS, the Total Agentic Lifecycle Orchestration System, is a multi-agent operating system
for the full lifecycle of AI-powered businesses and software products: build, launch,
operate, improve, and commercially scale. It is dockerized, with a command-center app under
`apps/command-center/`. `TALOS_SYSTEM_LAW.md` is binding in that repo and outranks all code
there.

## The primary law

TALOS is governed by a primary law, recorded in [[evidence-first-and-approval-gated]]: no
claim without evidence, no code without tests, no deployment without gates, no autonomy
without permissions, no learning without rollback, no completion without traceability. This
is the single load-bearing posture the rest of the system derives from.

## The mediation model

TALOS is deliberately not an unrestricted autonomous agent. Agents never own execution
authority. Every action is mediated by task state, risk level, role permission, tool
contract, evidence requirement, approval posture, gate status, and audit log. Forbidden
actions (fabricating evidence, bypassing gates, expanding own permissions, unauthorised
secret, deploy, or delete) are unreachable by design.

## How TALOS relates to this brain

This is the central open question for the namespace, to be worked in `synthesis/`. TALOS
doctrine overlaps heavily with the infinite-brain-os control model: both are
approval-gated, evidence-first, and forbid unbounded agent autonomy. The brain's doctrine
refers to a "Paperclip" placeholder for whatever runtime substrate adopts its contract.
TALOS is a strong candidate to be that substrate in practice. Three framings are on the
table, none yet settled:

- TALOS as the runtime substrate this brain governs (the real-world Paperclip stand-in)
- TALOS as a peer system, with the brain holding shared canon
- TALOS as a successor or alternative to parts of the brain

Resolving this is a high-value synthesis task and shapes how the two systems share canon.

## What this canon does not yet cover

This draft does not cover: the detailed lifecycle stages (to grow in `concepts/`), the
recorded architecture decisions (to grow in `decisions/`), or the full text of
`TALOS_SYSTEM_LAW.md` (to be ingested into `support/` and distilled). Those land as the
operator provides and verifies them.

## Changelog

- 2026-07-05: initial draft created during the Hive-Mind vault integration, authored at
  `operator-pending` from the TALOS README and the `TALOS_SYSTEM_LAW.md` reference. Awaits
  operator verification.
