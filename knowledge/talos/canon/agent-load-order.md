# Agent Load Order: talos

This file is navigational. It tells agents what to load next after reading
`core-doctrine.md`, by query class.

## Always load first

`core-doctrine.md` in full. It is the compressed synthesis, including the open question of
how TALOS relates to this brain. Do not skip it.

## By query class

**Primary law** (what governs all agent action):
Load `pillars/evidence-first-and-approval-gated.md`.

**Lifecycle architecture** (build, launch, operate, improve, scale):
Load the relevant file in `concepts/` as it is created.

**Governance decisions** (why a control was chosen):
Load the relevant file in `decisions/` as decisions are recorded.

**How to apply** (repeatable procedures, run operations):
Load `playbooks/`.

**TALOS-to-brain relationship** (the central open question):
Load `synthesis/`.

**Source context** (where ingested content came from, including `TALOS_SYSTEM_LAW.md`):
Load `support/`.

## What not to load first

Do not load `concepts/` or `decisions/` before `core-doctrine.md`. Those files assume the
canonical framing, including the mediation model and the primary law.

## Navigational note

This file does not carry node frontmatter. It is a navigational aid for agents, not a
knowledge node.
