# talos

This is the knowledge namespace for TALOS, the Total Agentic Lifecycle Orchestration System:
a governed, evidence-first, approval-gated, multi-agent operating system for building,
launching, operating, improving, and commercially scaling AI-powered businesses and software
products. It holds the durable doctrine, governance model, and lifecycle architecture of
TALOS, and tracks how TALOS relates to this brain.

It is a serious retrieval target with a thin canon layer, drafted at `operator-pending` until
the operator verifies it. Source content from the TALOS repo is ingested selectively into
`support/` and promoted toward `synthesis/` and canon only on operator approval.

## Profile

Doctrine profile, serious base. `canon_posture: thin`, `archive_posture: none`,
`freshness_posture: review-on-edit`. Carries the shared base (`INDEX.md`, `canon/`,
`playbooks/`, `support/`, `synthesis/`) plus the doctrine-profile folders (`pillars/`,
`concepts/`, `decisions/`). The profile model is explained in [[namespace-profiles]] and
[[profile-aware-knowledge-graph-design]]. The operative registry entry is
`_system/namespaces/talos.md`.

## Load first

1. [[talos-core-doctrine]]: the compressed model of what TALOS is, its primary law, and how
   it relates to this brain. Read it whole before expanding.
2. [[agent-load-order]]: the load-order controller, by query class.

## What is here

- [[evidence-first-and-approval-gated]]: the foundational pillar. TALOS is governed by a
  primary law: no claim without evidence, no code without tests, no deployment without
  gates, no autonomy without permissions, no learning without rollback, no completion
  without traceability.
- Governance and lifecycle architecture grow in `concepts/` and `decisions/` as the system
  is documented.
- Source material from the TALOS repo (including `TALOS_SYSTEM_LAW.md`) lands in `support/`
  and is promoted to `synthesis/` as best-current-reading.

## How TALOS relates to this brain

TALOS doctrine overlaps heavily with the infinite-brain-os control model. Both are
approval-gated, evidence-first, and forbid unbounded agent autonomy. The open question, to
resolve in `synthesis/`, is the relationship: is TALOS the runtime substrate this brain
governs (the real-world stand-in for the Paperclip placeholder in the brain's doctrine), a
peer system, or a successor? See [[talos-core-doctrine]] for the framing.

## What this namespace drives

- the TALOS governance model and lifecycle architecture canon
- the TALOS-to-brain relationship map (a high-value synthesis node)
- ingestion of high-value TALOS repo content into durable doctrine

## What does not live here

Per [[surface-boundary]]: live agent runs, task queues, approval state, and audit logs stay
in the TALOS runtime. Raw source code and `TALOS_SYSTEM_LAW.md` stay in the TALOS repo; this
namespace points at them and selectively ingests. Secrets stay in the root `secrets/`
registry as references.

## Map

```text
knowledge/talos/
  INDEX.md                              # this router
  canon/
    README.md                           # what canon means here (navigational)
    core-doctrine.md                    # the keystone (knowledge node, operator-pending)
    agent-load-order.md                 # load order by query class (navigational)
  pillars/
    evidence-first-and-approval-gated.md   # the primary law (knowledge node)
  concepts/                             # grows as governance is documented
  decisions/                            # grows as architecture decisions are made
  playbooks/                            # repeatable procedures
  support/                              # provenance for ingested TALOS repo content
  synthesis/                            # derived reading, the brain-relationship map, canon-candidates
```
