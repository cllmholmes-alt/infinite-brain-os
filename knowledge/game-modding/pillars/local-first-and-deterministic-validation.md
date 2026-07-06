---
id: "knowledge-game-modding-pillars-local-first-and-deterministic-validation"
aliases: ["knowledge-game-modding-pillars-local-first-and-deterministic-validation", "local-first-and-deterministic-validation", "game-modding-founding-claim"]
type: "Knowledge"
namespace: "game-modding"
lifecycle_state: "scratch"
summary: "The foundational pillar of the game-modding namespace: assets and mods must validate deterministically before export, and the pipeline runs local-first. Every tool decision in the domain derives from this claim."
confidence: 0.8
retrieval_class: "domain"
export_class: "internal"
verified_at: "2026-07-06"
verified_by: "operator-pending"
edges:
  - target: "[[game-modding-core-doctrine]]"
    relation: "anchors"
    confidence: 0.9
created: "2026-07-06"
---

# Local-first and deterministic validation

## The claim

Assets and mods must validate deterministically before export, and the pipeline must run
local-first. An asset or mod that cannot pass a deterministic validation pass must not leave the
local machine. The content, the tooling, and the validation must be under the operator's control.
This is the single load-bearing claim of the game-modding domain.

## Why it matters here

This claim is the test every tool and pipeline is held against. A tool that enables
deterministic, local-first validation aligns with the claim. A tool that gates validation behind
a cloud service, introduces non-deterministic steps, or hides its event log violates it. There is
no neutral ground: a pipeline step either moves toward more deterministic local validation or away
from it.

## What follows from it

- Local-first always. The tooling runs on the operator's machine. Cloud services may assist
  (remote asset references, shared capability packs) but never gate the critical path. The core
  pipeline must complete offline.
- Deterministic validation is non-negotiable. Every asset and every mod passes a deterministic
  validation step before packaging or export. The validation logic is versioned alongside the
  assets it validates. Validation failures are deterministic: the same inputs always produce the
  same result.
- The event log is the source of truth. Every transformation, every validation pass, every
  export, and every agent action is recorded as an event. The event log proves what happened, in
  what order, and by which capability pack. Audit is not a feature; it is a structural property of
  the pipeline.
- Capability packs define the operations. A capability pack declares what transformations and
  validations are available. The pipeline invokes capability packs; it does not run arbitrary
  scripts. This bounds what the pipeline can do and makes it auditable.

## What this pillar rejects

- Cloud-gated pipelines. A tool that requires a cloud service to validate or export is
  structurally incompatible with this claim.
- Non-deterministic validation. Any step whose output can vary for the same input is not a
  validation; it is a heuristic. Heuristics may inform but must not gate.
- Opaque event trails. A pipeline that does not produce a machine-readable event log of what it
  did is not traceable and cannot be trusted.

## Component alignment

- Crimson Desert Mod Forge aligns through its local-first Vite workspace and its `forge` CLI
  pipeline commands (`forge:pipeline`, `forge:spec`). The pipeline is the contract.
- G.A.C.E. aligns through its event-sourced architecture, its phase gates, and its deterministic
  validation before export. The event audit system (`audit:events`) proves traceability.
- Full Game Modding is unclassified. Its alignment with this claim is pending analysis.

## Provenance

Drafted from the Crimson Desert Mod Forge and G.A.C.E. READMEs, package manifests, and build
conventions during the 2026-07-06 namespace build. Authored at `operator-pending`; the operator
must verify the wording before it becomes canon.
