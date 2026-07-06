# playbooks/

This folder holds repeatable procedures for maintaining the revenue-intelligence
namespace. Playbooks are step-by-step process knowledge: when to run them, what
inputs they need, and what output they produce.

## What goes here

- **Add a new metric**: the steps to define a new metric node, confirm its
  `depends_on` chain is complete, and update the INDEX.md and core-doctrine
  references.
- **Update the pipeline stages**: the steps to revise the pipeline description
  when a new stage is added or an existing stage is redefined.
- **Ingest HRIO repo content**: the steps to pull high-value content from the
  HRIO repo into `support/` with provenance, and promote it toward `synthesis/`.
- **Promote a canon-candidate**: the steps to move a synthesis node into
  `canon/core-doctrine.md` after operator approval.
- **Retire a metric**: the steps to deprecate a metric node, add a `supersedes`
  pointer, and update downstream references.
- **Wire a metric to live instrumentation**: the steps to move a metric from
  `instrumentation_status: not-wired` to `live` when the pipeline implementation
  catches up to the semantic contract.

## What does not go here

Do not put data transformation logic or metric definitions here. This folder holds
procedural guidance for namespace maintenance, not the data layer knowledge itself.

## Format

Each playbook is a knowledge node with full frontmatter. The body follows a
consistent pattern: trigger (when to run this), inputs required, numbered steps,
and a completion check.

## Navigational note

This README is navigational and carries no node frontmatter.
