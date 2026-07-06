---
id: namespace-game-modding
name: game-modding
purpose: "The knowledge namespace for the game-modding domain cluster: local-first, deterministic-validation-before-export, event-sourced mod and asset tooling. Holds durable doctrine, design intent, and tool architecture for Crimson Desert Mod Forge, G.A.C.E., Full Game Modding, and NemoClaw. Canon is drafted at operator-pending until verified."
owner: the-operator
lifecycle_state: scratch
created: 2026-07-06
group: personal
retrieval_class: explicit
export_class: internal
default_visibility: private
tags: [namespace, personal, game-modding, mod-tooling, asset-creation, deterministic-validation, local-first]
supersedes: null
profile: doctrine
v2_status: upgraded
canon_posture: thin
freshness_posture: review-on-edit
archive_posture: none
reduced_base: false
expected_folders: [INDEX.md, canon, pillars, concepts, decisions, playbooks, support, synthesis]
brand_slug: null
notes: "Domain cluster namespace created during the 2026-07-06 namespace build. This is not a single-brand namespace; it covers multiple tools across a shared domain philosophy. Canon authored at verified_by operator-pending from the Crimson Desert Mod Forge and G.A.C.E. READMEs and package manifests. Full Game Modding is unclassified pending further analysis."
---

# game-modding

## Summary

Serious namespace holding the durable doctrine for the game-modding domain cluster: a
local-first, event-sourced, deterministically validated set of tools for creating, validating,
packaging, and exporting game mods and assets. Its founding claim is that assets and mods must
validate deterministically before export and the pipeline must run local-first. Covers the tool
surface (Crimson Desert Mod Forge, G.A.C.E., Full Game Modding, NemoClaw). Canon is drafted, not
yet operator-verified.

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
- `archive_posture: none`: source stays in the game-modding repos; this namespace points at them.
- `brand_slug: null`: this is a domain cluster spanning multiple tools, not a single brand.

## Review posture

Freshness posture: `review-on-edit`. Domain doctrine is durable, not decaying state. Review is
triggered by edits, and canon edits require operator verification.

## Use for

- the domain's founding claim and operating posture (local-first, deterministic validation,
  event-sourced, agent-traceable)
- the tool architecture and how Crimson Desert Mod Forge, G.A.C.E., and related tools interlink
- ingestion of high-value game-modding repo content into durable doctrine
- classification and analysis of unclassified surfaces

## Do not use for

- live application state, runtime logs, or telemetry (source repos)
- raw source code or tool configuration (stay in the repos; this namespace points at them)
- secrets (root `secrets/` registry holds references)
- general AI-assistant configuration (NemoClaw is referenced as a tool in the cluster, not as a
  primary configuration surface)

## Related surfaces

- Repos: Crimson Desert Mod Forge, G.A.C.E., Full Game Modding, openclaw (upstream), NemoClaw
  (fork)
- Registry: `_system/namespaces/game-modding.md` (this file)
