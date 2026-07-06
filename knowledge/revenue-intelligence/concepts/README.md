# concepts/

This folder holds domain-specific concepts for the revenue-intelligence namespace.
Concepts are reusable reasoning units that explain how a part of the pipeline works,
why a design direction was chosen, or how two pipeline stages relate to each other.

## What goes here

- Pipeline stage deep dives: detailed reasoning about the scan, filter, score,
  classify, draft, CRM, track, or qualify stages.
- Cross-stage relationships: how scoring feeds into classification, how tracking
  feeds back into qualification.
- Signal theory: what makes a Reddit post a pain signal, what noise looks like,
  and how the filter distinguishes them.
- Integration concepts: how HRIO connects to GetSubmitReady.com (shared Supabase),
  how the manual gate interfaces with Stripe, and how CRM tracking works.

## What does not go here

- The founding claim or the human gate rule: those belong in `pillars/`.
- Recorded design decisions with rejected alternatives: those belong in `decisions/`.
- Step-by-step procedures: those belong in `playbooks/`.
- Metric definitions: those belong in `metrics/`.

## Relationship to canon

Concepts expand on what `core-doctrine.md` compresses. A concept file should be
readable on its own but should not repeat the founding claim or the pipeline model.
Link back to core-doctrine for the canonical framing.

## Navigational note

This README is navigational and carries no node frontmatter.
