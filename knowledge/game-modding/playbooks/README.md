# Playbooks: game-modding

This folder holds repeatable procedures for work in the game-modding namespace.

## What goes here

A playbook node describes a step-by-step procedure for a repeatable task: how to run the forge
pipeline, how to validate a capability pack, how to audit the event log, how to ingest content
from a game-modding repo into this namespace, how to validate the namespace.

## What does not go here

Principles go in `pillars/`. Definitions go in `concepts/`. Design decisions go in `decisions/`.
Derived analysis go in `synthesis/`.

## Relationship to skills and workflows

A playbook is a knowledge node. A skill in `entities/skills/` is the executable encapsulation of
a playbook for an agent. A workflow in `workflows/` or `automations/n8n/` is the deterministic
automation of a procedure.

## Current state

This folder is seeded with this README only. Add one file per repeatable procedure as the
namespace matures. Each playbook file carries full node frontmatter.
