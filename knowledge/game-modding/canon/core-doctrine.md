---
id: "knowledge-game-modding-canon-core-doctrine"
aliases: ["knowledge-game-modding-canon-core-doctrine", "game-modding-core-doctrine", "game-modding-doctrine"]
type: "Knowledge"
namespace: "game-modding"
lifecycle_state: "scratch"
summary: "Drafted core doctrine for the game-modding namespace: a domain cluster spanning local-first, deterministic-validation-before-export, event-sourced mod and asset tooling. Covers the founding principles, the tool posture, and the component surface including Crimson Desert Mod Forge and G.A.C.E. Authored at operator-pending until the operator verifies it."
confidence: 0.7
retrieval_class: "identity"
export_class: "internal"
verified_at: "2026-07-06"
verified_by: "operator-pending"
edges:
  - target: "[[local-first-and-deterministic-validation]]"
    relation: "derived_from"
    confidence: 0.9
  - target: "[[namespace-profiles]]"
    relation: "references"
    confidence: 0.7
created: "2026-07-06"
---

## Read this first

This is the drafted canon of the `game-modding` namespace. It is authored at `operator-pending`:
an agent drafted it from the tool READMEs and package manifests during the 2026-07-06 namespace
build. The operator must verify it before it becomes real canon. Read it whole, then expand into
the pillar and the component material as the query demands.

## What the game-modding domain is

The game-modding domain is a cluster of local-first, event-sourced tools for creating, validating,
packaging, and exporting game mods and assets. The domain is defined by a single load-bearing
principle: assets and mods must validate deterministically before export, and the pipeline must
run local-first. This is not a SaaS platform or a cloud-first build service. It is a desktop
workbench and a Vite workspace that run on the operator's machine.

## The founding principles

The single load-bearing claim, recorded in [[local-first-and-deterministic-validation]], is that
deterministic validation before export is non-negotiable: an asset or mod that cannot pass a
deterministic validation pass must not leave the local machine. The pipeline runs local-first
because the content, the tooling, and the validation must be under the operator's control.

Three operating rules follow from this claim:

- Local-first always. The tooling runs on the operator's machine. Cloud services may assist but
  never gate the core pipeline.
- Deterministic validation before export. Every asset and mod passes a deterministic validation
  step before packaging or export. Non-deterministic validation is rejected as insufficient.
- Event-sourced and agent-traceable. Every transformation, every validation, and every export is
  an event. The event log is the source of truth for what happened, in what order, and by which
  agent or capability pack.

## The component surface

The game-modding domain spans several components, each living in its own repo:

- Crimson Desert Mod Forge: a local-first Vite mod workspace with a frontend, a backend, and a
  `forge` CLI for spec progress tracking and pipeline execution. Built with React, MUI, Radix, and
  a Node backend.
- G.A.C.E. (Game Asset Creation Engine): a Windows-first, cross-platform desktop workbench using
  Vite, Turbo, pnpm, and Playwright. Event-sourced, capability-pack driven, and agent-traceable.
  Carries phase gates, a decision register, and an event audit system.
- Full Game Modding: an unclassified modding surface pending further analysis and classification.
- NemoClaw: a fork of openclaw, the personal AI assistant, adapted for use within the modding
  cluster as a potential modding-assistant runtime.

## Posture

The domain is local-first by design, Windows-first with cross-platform reach, and
deterministically validated. It values portable, auditable workflows over cloud-dependent
convenience. Capability packs define what operations are available; events record what happened.
The pipeline is the contract, and the event log is the proof.

## What this canon does not yet cover

This draft does not cover: the detailed inter-component architecture (to grow in `concepts/`),
the recorded design decisions (to grow in `decisions/`), the CLI contract for the forge or the
G.A.C.E. pipeline, or the classification of Full Game Modding. Those land as the operator
provides and verifies them.

## Changelog

- 2026-07-06: initial draft created during the game-modding namespace build, authored at
  `operator-pending` from the Crimson Desert Mod Forge and G.A.C.E. READMEs and package
  manifests. Awaits operator verification.
