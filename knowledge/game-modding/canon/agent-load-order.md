# Agent Load Order: game-modding

This file is navigational. It tells agents what to load next after reading
`core-doctrine.md`, by query class.

## Always load first

`core-doctrine.md` in full. It is the compressed synthesis. Do not skip it to go directly to
pillars or concepts.

## By query class

**Founding claim** (what is the core principle the domain derives from):
Load `pillars/local-first-and-deterministic-validation.md`.

**Tool architecture** (how the Mod Forge, G.A.C.E., and related tools interlink):
Load the relevant file in `concepts/` as it is created, and `repo-registry/` entries for
per-component posture.

**Design decisions** (why a direction was chosen):
Load the relevant file in `decisions/` as decisions are recorded.

**How to apply** (repeatable procedures, build workflows, export pipelines):
Load `playbooks/`.

**What is unsettled** (open questions, contested design choices, unclassified surfaces):
Load `synthesis/`.

**Source context** (where ingested content came from, repo provenance):
Load `support/`.

## What not to load first

Do not load `concepts/` or `decisions/` before `core-doctrine.md`. Those files assume the
canonical framing. An agent that skips canon and goes directly to a concept may apply the
concept without its foundational constraints.

## Navigational note

This file does not carry node frontmatter. It is a navigational aid for agents, not a knowledge
node.
