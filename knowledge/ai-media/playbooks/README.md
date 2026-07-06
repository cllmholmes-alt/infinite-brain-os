# Playbooks: ai-media

This folder holds repeatable procedures for work in the ai-media namespace.

## What goes here

A playbook node describes a step-by-step procedure for a repeatable task: how to run a video
upscale pipeline end to end, how to set up ComfyUI with local models, how to validate an
output video for quality, how to ingest content from an AI-media repo into this namespace.

## What does not go here

Principles go in `pillars/`. Definitions go in `concepts/`. Design decisions go in
`decisions/`. Derived analysis goes in `synthesis/`.

## Relationship to skills and workflows

A playbook is a knowledge node. A skill in `entities/skills/` is the executable
encapsulation of a playbook for an agent.

## Current state

This folder is seeded with this README only. Add one file per repeatable procedure as the
namespace matures. Each playbook file carries full node frontmatter.
