# Concepts: game-modding

This folder holds definitions, models, and frameworks for the game-modding namespace.

## What goes here

A concept node defines a term or framework that agents need to understand before they can apply
the namespace's doctrine correctly. Concepts elaborate the pillars; they do not contradict them.
Typical content for this namespace: what a capability pack is, how the event log sources truth,
how the forge CLI pipeline is structured, how G.A.C.E. phase gates work, what deterministic
validation means in practice.

## What does not go here

Foundational claims go in `pillars/`. Step-by-step procedures go in `playbooks/`. Past decisions
go in `decisions/`. Disputed readings go in `synthesis/`.

## Frontmatter for concept nodes

Use `retrieval_class: "domain"` for most concept nodes. Use `"identity"` only for a concept that
is as foundational as a pillar.

## Current state

This folder is seeded with this README only. Add one file per concept as the tools are documented.
Each concept file carries full node frontmatter.
