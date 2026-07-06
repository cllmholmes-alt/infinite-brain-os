# Concepts: talos

This folder holds definitions, models, and frameworks for the TALOS namespace.

## What goes here

A concept node defines a term or framework that agents need to understand before they can
apply the namespace's doctrine correctly. Concepts elaborate the pillars; they do not
contradict them. Typical content for this namespace: what a gate is, how the mediation model
works, what each lifecycle stage (build, launch, operate, improve, scale) entails.

## What does not go here

Foundational claims go in `pillars/`. Step-by-step procedures go in `playbooks/`. Past
decisions go in `decisions/`. Disputed readings go in `synthesis/`.

## Frontmatter for concept nodes

Use `retrieval_class: "domain"` for most concept nodes. Use `"identity"` only for a concept
that is as foundational as a pillar.

## Current state

This folder is seeded with this README only. Add one file per concept as the system is
documented. Each concept file carries full node frontmatter.
