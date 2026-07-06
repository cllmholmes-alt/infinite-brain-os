---
id: namespace-revenue-intelligence
name: revenue-intelligence
purpose: "The knowledge namespace for the Hermes Revenue Intelligence OS (HRIO) and the revenue-intelligence domain: converting live pain signals into approved, tracked revenue opportunities. Holds durable doctrine, the human-in-the-loop money gate pillar, metric definitions (lead-score, qualification-rate), and the data flow architecture. Canon is drafted at operator-pending until verified."
owner: the-operator
lifecycle_state: scratch
created: 2026-07-06
group: personal
retrieval_class: explicit
export_class: internal
default_visibility: private
tags: [namespace, personal, revenue-intelligence, hrio, lead-generation, data-system]
supersedes: null
profile: data-system
v2_status: upgraded
canon_posture: thin
freshness_posture: review-on-edit
archive_posture: none
reduced_base: false
expected_folders: [INDEX.md, canon, pillars, concepts, decisions, playbooks, support, synthesis, metrics]
brand_slug: null
notes: "Data-system namespace created 2026-07-06 for the HRIO revenue pipeline. Canon authored at verified_by operator-pending. Carries the data-system metrics/ additive folder plus pillars/, concepts/, and decisions/ to hold domain-specific revenue-intelligence reasoning. Two metric primitives defined: lead-score and qualification-rate. The starter-reduced posture defers architecture/, source-contracts/, pipelines/, transforms/, models/, and references/ to a future build pass."
---

# revenue-intelligence

## Summary

Data-system namespace holding the durable doctrine for the revenue-intelligence domain and
the Hermes Revenue Intelligence OS (HRIO): a pipeline that converts live pain signals into
approved, tracked revenue opportunities with a mandatory human gate before any money action.
Covers the founding claim, the pipeline stages, and two metric primitives (lead-score and
qualification-rate). Canon is drafted at `operator-pending`, not yet operator-verified.

## Defaults

| Field | Default |
|-------|---------|
| `lifecycle_state` on nodes | `scratch` |
| `retrieval_class` on nodes | `domain` |
| `export_class` on nodes | `internal` |

## Profile and folders

Profile: `data-system` (Profile C, Data System), serious base. Expected folders:
`INDEX.md`, `canon/`, `pillars/`, `concepts/`, `decisions/`, `playbooks/`, `support/`,
`synthesis/`, `metrics/`.

- Carries the shared base plus the data-system `metrics/` additive folder and three
  doctrine-profile folders (`pillars/`, `concepts/`, `decisions/`) to hold domain-specific
  revenue-intelligence reasoning outside the strict data-system shape.
- `canon_posture: thin`: `canon/core-doctrine.md`, `canon/README.md`, and
  `canon/agent-load-order.md` exist, authored at `verified_by: operator-pending`.
- `archive_posture: none`: source stays in the HRIO repo; this namespace points at it.
- This namespace is starter-reduced: `architecture/`, `source-contracts/`, `pipelines/`,
  `transforms/`, `models/`, and `references/` are deferred. The semantic contract is real:
  `metrics/` carries two metric primitives in full.

## Review posture

Freshness posture: `review-on-edit`. Data system doctrine is structural and changes only
when the pipeline architecture or metric definitions change. Review is triggered by edits,
and canon edits require operator verification.

## Use for

- the revenue pipeline's founding claim and the human-in-the-loop money gate
- the definition and lineage of the two canonical metrics (lead-score, qualification-rate)
- ingestion of high-value HRIO repo content into durable doctrine

## Do not use for

- live lead tracking state, pipeline execution logs, or CRM data (runtime backend)
- raw source code (stays in the HRIO repo; this namespace points at it)
- secrets (root `secrets/` registry holds references)
- payment processing logic (that is the runtime's domain)

## Related surfaces

- Repo: `C:\Projects\Hermes Revenue Intelligence OS (HRIO)`
- Repo: `C:\Projects\Getreviewreadycom` (GetSubmitReady.com, shares Supabase project)
- Namespace: `personal-operator` (operator goals and review cadence)
