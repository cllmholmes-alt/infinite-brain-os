---
id: namespace-talos
name: talos
purpose: "The knowledge namespace for TALOS, the Total Agentic Lifecycle Orchestration System: a governed, evidence-first, approval-gated, multi-agent operating system for building and scaling AI-powered businesses. Holds durable doctrine, the primary law, and the lifecycle architecture, and tracks how TALOS relates to this brain. Canon is drafted at operator-pending until verified."
owner: the-operator
lifecycle_state: scratch
created: 2026-07-05
group: personal
retrieval_class: explicit
export_class: internal
default_visibility: private
tags: [namespace, personal, talos, agentic-system, governance, lifecycle-orchestration]
supersedes: null
profile: doctrine
v2_status: upgraded
canon_posture: thin
freshness_posture: review-on-edit
archive_posture: none
reduced_base: false
expected_folders: [INDEX.md, canon, pillars, concepts, decisions, playbooks, support, synthesis]
brand_slug: "talos"
notes: "Flagship agentic-system namespace created during the 2026-07-05 Hive-Mind vault integration. Canon authored at verified_by operator-pending from the TALOS README and the TALOS_SYSTEM_LAW.md reference. The TALOS-to-brain relationship is the highest-priority open question (synthesis)."
---

# talos

## Summary

Serious namespace holding the durable doctrine for TALOS, the Total Agentic Lifecycle
Orchestration System: a governed, evidence-first, approval-gated, multi-agent operating
system for the full lifecycle of AI-powered businesses and software products. Its primary
law is evidence-first and approval-gated: no claim without evidence, no code without tests,
no deployment without gates, no autonomy without permissions, no learning without rollback,
no completion without traceability. Canon is drafted, not yet operator-verified.

## Defaults

| Field | Default |
|-------|---------|
| `lifecycle_state` on nodes | `scratch` |
| `retrieval_class` on nodes | `domain` |
| `export_class` on nodes | `internal` |

## Profile and folders

Profile: `doctrine` (Profile A, Doctrine / Conceptual Canon), serious base. Expected folders:
`INDEX.md`, `canon/`, `pillars/`, `concepts/`, `decisions/`, `playbooks/`, `support/`,
`synthesis/`.

- Carries the shared base plus the doctrine-profile folders.
- `canon_posture: thin`: `canon/core-doctrine.md`, `canon/README.md`, and
  `canon/agent-load-order.md` exist, authored at `verified_by: operator-pending`.
- `archive_posture: none`: source stays in the TALOS repo; this namespace points at it.

## Review posture

Freshness posture: `review-on-edit`. Governance doctrine is durable, not decaying state.
Review is triggered by edits, and canon edits require operator verification.

## Use for

- the TALOS primary law and governance model
- the lifecycle architecture (build, launch, operate, improve, scale)
- the TALOS-to-brain relationship map

## Do not use for

- live agent runs, task queues, approval state, or audit logs (TALOS runtime)
- raw source code or the full `TALOS_SYSTEM_LAW.md` (stay in the repo; this namespace points
  at them)
- secrets (root `secrets/` registry holds references)

## Related surfaces

- Brand: `parties/brands/talos.md`
- Repo: `repo-registry/talos.md`
- Related repos: `repo-registry/odysseus-dev.md`, `repo-registry/openclaw.md`,
  `repo-registry/nemoclaw.md`, `repo-registry/company-os.md` (agentic cluster)
