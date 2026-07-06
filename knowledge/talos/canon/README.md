# Canon: talos

This folder holds the compressed first-principles reasoning layer for the TALOS namespace.
It is what an agent should think from before it expands into the deeper graph.

## What lives here

- `core-doctrine.md`: the keystone knowledge node. A compressed synthesis of what TALOS is,
  its primary law, and how it relates to this brain. Authored at `verified_by:
  operator-pending` until the operator verifies it.
- `agent-load-order.md`: the load-order controller, by query class.

## What does not live here

- Copies of `TALOS_SYSTEM_LAW.md` or repo source. Those live in `support/` (provenance) and
  the TALOS repo.
- Open questions about the TALOS-to-brain relationship. Those belong in `synthesis/`.
- Live agent runs, task queues, or approval state. Those stay in the TALOS runtime.

## How to update canon

Canon here is drafted, not yet operator-verified. The sequence:

1. Identify a change (new pillar, revised governance concept, an architecture decision).
2. Draft the revision in `synthesis/` as a canon-candidate.
3. Operator reviews and approves.
4. Update `core-doctrine.md`, add a changelog entry, and set `verified_by` to the operator.

## Navigational note

This README is navigational and carries no node frontmatter. `core-doctrine.md` carries full
node frontmatter because it is a real knowledge node.
