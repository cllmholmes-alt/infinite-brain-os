---
id: namespace-adhd-os
name: adhd-os
purpose: "The knowledge namespace for the ADHD-OS product brand: a calm, cognitive-load-reducing behavioral executive-function operating system. Holds durable doctrine, design intent, and component architecture for the master reference database, alternative design, two websites, and the Expo dashboard app. Canon is drafted at operator-pending until verified."
owner: the-operator
lifecycle_state: scratch
created: 2026-07-05
group: personal
retrieval_class: explicit
export_class: internal
default_visibility: private
tags: [namespace, personal, adhd-os, product, behavioral-os, executive-function]
supersedes: null
profile: doctrine
v2_status: upgraded
canon_posture: thin
freshness_posture: review-on-edit
archive_posture: none
reduced_base: false
expected_folders: [INDEX.md, canon, pillars, concepts, decisions, playbooks, support, synthesis]
brand_slug: "adhd-os"
notes: "Flagship product namespace created during the 2026-07-05 Hive-Mind vault integration. Canon authored at verified_by operator-pending from the product README and Figma source. The Expo dashboard app is the capacity-aware execution layer; built and signed on the ScaleWay iOS Cloud Mac."
---

# adhd-os

## Summary

Serious namespace holding the durable doctrine for the ADHD-OS product brand: a calm,
institutional, cognitive-load-reducing behavioral executive-function operating system. Its
founding claim is that cognitive load is a structural issue, not a moral failing. Covers the
product surface (master reference database, alternative design, two websites, and the Expo
dashboard app). Canon is drafted, not yet operator-verified.

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
- `archive_posture: none`: source stays in the ADHD-OS repos; this namespace points at them.

## Review posture

Freshness posture: `review-on-edit`. Product doctrine is durable, not decaying state. Review
is triggered by edits, and canon edits require operator verification.

## Use for

- the product's founding claim and operating posture
- the component architecture and how the database, websites, and app interlink
- ingestion of high-value ADHD-OS repo content into durable doctrine

## Do not use for

- live user state, app telemetry, or analytics (runtime backend)
- raw source code or Figma files (stay in the repos; this namespace points at them)
- secrets (root `secrets/` registry holds references)

## Related surfaces

- Brand: `parties/brands/adhd-os.md`
- Repos: `repo-registry/adhd-os-master-reference-database.md`,
  `repo-registry/adhd-os-alternative-design.md`, `repo-registry/adhd-money-website.md`,
  `repo-registry/adhdos-artsyled-website.md`, `repo-registry/adhdos-user-dashboard.md`
- Build host: `tools/scaleway-ios-cloud-mac.md`
