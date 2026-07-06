# Canon: adhd-os

This folder holds the compressed first-principles reasoning layer for the ADHD-OS namespace.
It is what an agent should think from before it expands into the deeper graph.

## What lives here

- `core-doctrine.md`: the keystone knowledge node. A compressed synthesis of what ADHD-OS is,
  its founding claim, and its product surface. Authored at `verified_by: operator-pending`
  until the operator verifies it.
- `agent-load-order.md`: the load-order controller, by query class.

## What does not live here

- Copies of repo source or Figma content. Those live in `support/` (provenance) and the
  source repos.
- Open questions or design disputes. Those belong in `synthesis/`.
- Live user state or analytics. Those stay in the runtime backend.

## How to update canon

Canon here is drafted, not yet operator-verified. The sequence:

1. Identify a change (new pillar, revised concept, a design decision).
2. Draft the revision in `synthesis/` as a canon-candidate.
3. Operator reviews and approves.
4. Update `core-doctrine.md`, add a changelog entry, and set `verified_by` to the operator.

## Navigational note

This README is navigational and carries no node frontmatter. `core-doctrine.md` carries full
node frontmatter because it is a real knowledge node.
