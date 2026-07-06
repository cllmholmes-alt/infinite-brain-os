# game-modding

This is the knowledge namespace for the game-modding domain cluster: local-first,
deterministic-validation-before-export, event-sourced mod and asset tooling. It holds the durable
doctrine, design intent, and architecture of the tools and repos in the cluster, spanning Crimson
Desert Mod Forge (the local-first Vite mod workspace), G.A.C.E. (the Game Asset Creation Engine),
and the related modding surfaces.

It is a serious retrieval target with a thin canon layer, drafted at `operator-pending` until the
operator verifies it. Source content from the game-modding repos is ingested selectively into
`support/` and promoted toward `synthesis/` and canon only on operator approval.

## Profile

Doctrine profile, serious base. `canon_posture: thin`, `archive_posture: none`,
`freshness_posture: review-on-edit`. Carries the shared base (`INDEX.md`, `canon/`, `playbooks/`,
`support/`, `synthesis/`) plus the doctrine-profile folders (`pillars/`, `concepts/`,
`decisions/`). The profile model is explained in [[namespace-profiles]] and
[[profile-aware-knowledge-graph-design]]. The operative registry entry is
`_system/namespaces/game-modding.md`.

## Load first

1. [[game-modding-core-doctrine]]: the compressed model of what the game-modding domain is, its
   founding principles, and its component surface. Read it whole before expanding.
2. [[agent-load-order]]: the load-order controller, by query class.

## What is here

- [[local-first-and-deterministic-validation]]: the foundational pillar. Assets and mods must
  validate deterministically before export, and the pipeline runs local-first. Everything else in
  the domain derives from this.
- Component architecture and design intent grow in `concepts/` and `decisions/` as the tools are
  documented.
- Source material from the game-modding repos lands in `support/` (provenance) and is promoted to
  `synthesis/` as best-current-reading.

## Components (the tool surface)

- Crimson Desert Mod Forge: the local-first Vite mod workspace for the Crimson Desert game.
  Frontend and backend, with a `forge` CLI for spec progress and pipeline execution.
- G.A.C.E. (Game Asset Creation Engine): the Windows-first, cross-platform desktop workbench for
  creating, previewing, validating, packaging, and exporting game-ready assets. Event-sourced,
  capability-pack driven, agent-traceable.
- Full Game Modding: unclassified modding surface, pending further classification.
- NemoClaw (forked from openclaw): a personal AI assistant fork adapted within the modding
  cluster, potentially as a modding-assistant runtime.

See `repo-registry/` for per-component ownership and posture, once entries are created.

## What this namespace drives

- the domain's foundational principles (local-first, deterministic validation before export,
  event-sourced tooling, agent-traceability)
- the tool architecture map (how the Mod Forge, G.A.C.E., and related tools interlink)
- ingestion of high-value repo content into durable doctrine

## What does not live here

Per [[surface-boundary]]: live application state, runtime logs, and telemetry stay in their
source repos. Raw source code stays in the repos; this namespace points at them. Secrets and
credentials stay in the root `secrets/` registry as references.

## Map

```text
knowledge/game-modding/
  INDEX.md                                   # this router
  canon/
    README.md                                # what canon means here (navigational)
    core-doctrine.md                         # the keystone (knowledge node, operator-pending)
    agent-load-order.md                      # load order by query class (navigational)
  pillars/
    local-first-and-deterministic-validation.md   # the foundational claim (knowledge node)
  concepts/                                  # grows as the tools are documented
  decisions/                                 # grows as design decisions are made
  playbooks/                                 # repeatable procedures
  support/                                   # provenance for ingested repo content
  synthesis/                                 # derived reading and canon-candidates
```
