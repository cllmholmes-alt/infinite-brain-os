# Playbooks: talos

This folder holds repeatable procedures for work in the TALOS namespace.

## What goes here

A playbook node describes a step-by-step procedure for a repeatable task: how to run a TALOS
lifecycle stage, how to gate a deployment, how to ingest `TALOS_SYSTEM_LAW.md` content into
this namespace, how to validate the namespace.

## What does not go here

Principles go in `pillars/`. Governance concepts go in `concepts/`. Architecture decisions go
in `decisions/`. Derived analysis goes in `synthesis/`.

## Relationship to skills and workflows

A playbook is a knowledge node. A skill in `entities/skills/` is the executable
encapsulation of a playbook for an agent.

## Current state

This folder is seeded with this README only. Add one file per repeatable procedure as the
namespace matures. Each playbook file carries full node frontmatter.
