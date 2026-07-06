# decisions/

This folder holds recorded design decisions for the revenue-intelligence namespace.
Each decision node documents what was chosen, what was rejected, why, and what the
consequences are.

## What goes here

- Pipeline design decisions: why the pipeline stages are ordered as they are, why
  Reddit is the primary signal source, why Supabase was chosen as the data store.
- Scoring algorithm decisions: what factors weigh into the lead score, why certain
  signals are weighted higher than others.
- Classification taxonomy decisions: what opportunity types exist, why the taxonomy
  is structured as it is.
- Gate design decisions: what the manual gate UI looks like, why certain actions
  require approval and others do not.
- Rejected alternatives: every decision node should document at least one alternative
  that was considered and rejected, with the reason for rejection.

## What does not go here

- The founding claim: that is settled in `pillars/` and `canon/`, not under debate.
- Procedural instructions: those belong in `playbooks/`.
- Metric definitions: those belong in `metrics/`.
- Open disputes: contested decisions that are not yet settled belong in `synthesis/`.

## Format

Each decision is a knowledge node with full frontmatter. The body should include:
the decision title, the context (what problem it solves), the options considered,
the chosen option, the rejected alternatives with reasons, and the consequences
(what this decision enables and what it precludes).

## Navigational note

This README is navigational and carries no node frontmatter.
