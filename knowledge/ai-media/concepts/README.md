# Concepts: ai-media

This folder holds definitions, models, and frameworks for the ai-media namespace.

## What goes here

A concept node defines a term or framework that agents need to understand before they can
apply the namespace's doctrine correctly. Concepts elaborate the pillars; they do not
contradict them. Typical content for this namespace: what a local-first pipeline is, how
frame-level processing chains together, what ComfyUI's role is in the toolchain, how model
selection works for local inference.

## What does not go here

Foundational claims go in `pillars/`. Step-by-step procedures go in `playbooks/`. Past
decisions go in `decisions/`. Disputed readings go in `synthesis/`.

## Frontmatter for concept nodes

Use `retrieval_class: "domain"` for most concept nodes. Use `"identity"` only for a concept
that is as foundational as a pillar.

## Current state

This folder is seeded with this README only. Add one file per concept as the domain is
documented. Each concept file carries full node frontmatter.
