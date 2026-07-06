# revenue-intelligence

This is the knowledge namespace for the revenue-intelligence domain and the Hermes Revenue
Intelligence OS (HRIO): a pipeline that converts live pain signals into approved, tracked
revenue opportunities with a mandatory human gate before any money action. It holds the
durable doctrine, the founding claim, the data flow architecture, and two metric primitives
that define what is measured and how.

It is a serious retrieval target with a thin canon layer, drafted at `operator-pending`
until the operator verifies it. Source content from the HRIO repo is ingested selectively
into `support/` and promoted toward `synthesis/` and canon only on operator approval.

## Profile

Data System profile, serious base. `canon_posture: thin`, `archive_posture: none`,
`freshness_posture: review-on-edit`. Carries the shared base (`INDEX.md`, `canon/`,
`playbooks/`, `support/`, `synthesis/`) plus `metrics/` from the data-system additive
set, plus `pillars/`, `concepts/`, and `decisions/` to hold domain-specific
revenue-intelligence reasoning. The profile model is explained in [[namespace-profiles]]
and [[profile-aware-knowledge-graph-design]]. The operative registry entry is
`_system/namespaces/revenue-intelligence.md`.

This namespace is starter-reduced: `architecture/`, `source-contracts/`, `pipelines/`,
`transforms/`, `models/`, and `references/` are deferred to a future build pass. The
semantic contract is real: `metrics/` carries two metric primitives in full, and the
pillar and doctrine are substantive.

## Load first

1. [[revenue-intelligence-core-doctrine]]: the compressed model of what the revenue
   pipeline is, its founding claim, and its data system architecture. Read it whole
   before expanding.
2. [[agent-load-order]]: the load-order controller, by query class.

## What is here

- [[human-in-the-loop-at-the-money-gate]]: the foundational pillar. No production money
  action happens without human approval. This is what makes the pipeline governable.
- [[metric-lead-score]]: the HRIO Reddit signal score. A typed Metric node with full
  metric primitive frontmatter, lineage, and diagnosis faces.
- [[metric-qualification-rate]]: the fraction of leads that qualify. A typed Metric node
  derived from lead-score.
- Pipeline reasoning and design decisions grow in `concepts/` and `decisions/` as the
  namespace is expanded.
- Source material from the HRIO repo lands in `support/` (provenance) and is promoted to
  `synthesis/` as best-current-reading.

## The pipeline

```text
Reddit scan -> filter -> score -> classify -> draft -> CRM lead -> track -> qualify -> manual payment gate
```

The system is intentionally not a Reddit bot. It drafts and tracks; a human approves all
external posting, DMs, payment links, and production money actions.

## Query classes

- **Founding claim** (what is the core principle that governs the pipeline): load
  [[revenue-intelligence-core-doctrine]], then [[human-in-the-loop-at-the-money-gate]].
- **Metric definition** (what does a metric mean, how is it calculated): load
  [[metric-lead-score]] or [[metric-qualification-rate]], then follow `depends_on` edges.
- **Lineage trace** (where does a number come from, which transforms and models feed it):
  load the metric node, then follow `depends_on` edges upstream. The full upstream chain
  (source contracts, transforms, models) is deferred in this starter-reduced build.
- **Pipeline understanding** (what is HRIO, what does it do): load
  [[revenue-intelligence-core-doctrine]] whole, then `concepts/` as it grows.
- **What is unsettled** (open questions, contested design choices): load `synthesis/`.

## What this namespace drives

- which metrics measure the revenue pipeline's health
- how agents answer "where does this lead score come from"
- how the human gate operates and why it is load-bearing
- how the pipeline moves from signal detection to qualified, approved lead

## What does not live here

Per [[surface-boundary]]: live lead state, pipeline execution logs, and CRM data stay in
the runtime backend (HRIO Supabase). Raw source code stays in the HRIO repo; this
namespace points at it. Secrets (Stripe, Supabase, Reddit API) stay in the root `secrets/`
registry as references.

## Map

```text
knowledge/revenue-intelligence/
  INDEX.md                              # this retrieval router (you are here)
  canon/
    README.md                           # what canon means here (navigational)
    core-doctrine.md                    # the keystone (knowledge node, operator-pending)
    agent-load-order.md                 # load order by query class (navigational)
  pillars/
    human-in-the-loop-at-the-money-gate.md  # the foundational claim (knowledge node)
  concepts/                             # grows as the pipeline is documented
  decisions/                            # grows as design decisions are made
  playbooks/                            # repeatable procedures
  support/                              # provenance for ingested HRIO repo content
  synthesis/                            # derived reading and canon-candidates
  metrics/
    README.md                           # what a metric node is and the metric primitive contract
    lead-score.md                       # HRIO Reddit signal score (Metric node)
    qualification-rate.md               # fraction of leads that qualify (Metric node)
```
