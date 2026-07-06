---
id: "knowledge-revenue-intelligence-canon-core-doctrine"
aliases: ["knowledge-revenue-intelligence-canon-core-doctrine", "revenue-intelligence-core-doctrine", "revenue-intelligence-doctrine"]
type: "Knowledge"
namespace: "revenue-intelligence"
lifecycle_state: "scratch"
summary: "Drafted core doctrine for the revenue-intelligence namespace: a pipeline that converts live pain signals into approved, tracked revenue opportunities with a mandatory human gate before any money action. Covers the founding claim, the pipeline stages, the data system architecture, the metric primitive contract, and source-of-truth rules. Authored at operator-pending until the operator verifies it."
confidence: 0.7
retrieval_class: "identity"
export_class: "internal"
verified_at: "2026-07-06"
verified_by: "operator-pending"
edges:
  - target: "[[human-in-the-loop-at-the-money-gate]]"
    relation: "derived_from"
    confidence: 0.9
  - target: "[[lead-score]]"
    relation: "references"
    confidence: 0.85
  - target: "[[qualification-rate]]"
    relation: "references"
    confidence: 0.85
  - target: "[[metric-primitive-schema]]"
    relation: "implements"
    confidence: 0.9
  - target: "[[namespace-profiles]]"
    relation: "references"
    confidence: 0.7
created: "2026-07-06"
---

## Read this first

This is the drafted canon of the `revenue-intelligence` namespace. It is authored at
`operator-pending`: an agent drafted it from the HRIO README and pipeline documentation
during the 2026-07-06 namespace build. The operator must verify it before it becomes real
canon. Read it whole, then expand into the pillar and the metric nodes as the query
demands.

## What the revenue-intelligence domain is

The revenue-intelligence domain converts live pain signals into approved, tracked revenue
opportunities. Its primary implementation is the Hermes Revenue Intelligence OS (HRIO), a
pipeline that scans Reddit for pain signals, filters noise, scores relevance, classifies
opportunity type, drafts outreach, creates CRM leads, tracks engagement, qualifies
prospects, and gates all money actions behind human approval.

The domain is intentionally not an automated bot. The HRIO system drafts and tracks; a
human operator approves all external posting, direct messages, payment links, and
production money actions. This constraint is load-bearing: it is what makes the pipeline
governable and prevents autonomous revenue actions that cannot be recalled.

## The founding claim

The single load-bearing claim, recorded in [[human-in-the-loop-at-the-money-gate]], is
that no production money action leaves the system without human approval. Posting,
messaging, payment links, and charges all stop at a manual gate. This claim is not a
temporary limitation; it is the operating posture of the namespace. Every design decision
about pipeline automation should be traceable back to it: a feature that bypasses the
gate must justify itself against it, and a feature that strengthens the gate aligns
with it.

## The pipeline stages

1. **Scan**: ingest Reddit posts and comments matching configurable pain-signal patterns.
2. **Filter**: remove noise, spam, and posts that match exclusion rules.
3. **Score**: assign a numeric lead score (see [[metric-lead-score]]) based on signal
   strength, recency, and contextual relevance.
4. **Classify**: tag each lead by opportunity type (service fit, tool gap, price
   complaint, etc.).
5. **Draft**: generate draft outreach text for human review.
6. **CRM lead**: push approved leads to a CRM as trackable entities.
7. **Track**: monitor engagement, response, and follow-up cadence.
8. **Qualify**: assess whether a lead meets the qualification threshold (see
   [[metric-qualification-rate]]).
9. **Manual payment gate**: the human operator reviews and approves or rejects the
   money action. No payment link, DM, or charge fires automatically.

## The data system architecture

The HRIO pipeline is a data system in the five-layer model:

1. **Source contract**: the Reddit API and any configured subreddit or keyword sources.
   What fields arrive, their types, and known quirks.
2. **Pipeline**: how the scan runs (schedule, trigger, Supabase destination).
3. **Transform**: the scoring, filtering, and classification logic. Business rules that
   reshape raw Reddit posts into structured leads.
4. **Model**: the warehouse tables (Supabase) that consumers query: leads, scores,
   classifications, qualification states.
5. **Metric**: two canonical metrics: lead-score and qualification-rate. These sit above
   the models and are what dashboards and agents query by name.

In this starter-reduced namespace, the semantic layer is real (metrics defined in full,
the pillar and doctrine are substantive) but the full upstream chain (source contracts,
pipeline specs, transforms, models) is deferred. The metrics carry lineage descriptions
that point to where those nodes will be defined.

## The metric primitive

Every metric node in this namespace uses the shared metric primitive defined in
[[metric-primitive-schema]]. The key rule: define a metric once, reference it everywhere.
The Data System namespace owns the definition and the lineage. An Operating Library
namespace that diagnoses this metric references the same `metric_id`.

The two canonical metrics:

- **[[metric-lead-score]]**: the numeric score assigned to a Reddit lead during the score
  stage. Format: count, polarity: higher-better, aggregation: sum. A base metric with
  no dependencies.
- **[[metric-qualification-rate]]**: the fraction of leads that pass the qualification
  threshold. Format: ratio (0-1), polarity: higher-better, aggregation: ratio-of-sums.
  Derived from lead-score; depends on it.

Both metrics carry `instrumentation_status: not-wired` in this starter build, reflecting
that the full pipeline is described but not yet connected to a live instrumentation
substrate.

## Source of truth rules

- The HRIO repo is the authoritative source for pipeline code and Supabase schema. This
  namespace interprets and canonizes the design intent; the repo holds the implementation.
- The metric definition in this namespace is the authoritative statement of business
  meaning. If a dashboard or report calculates lead-score differently, that is a dispute
  tracked in `synthesis/`, not a second valid metric node.
- The human gate pillar is the authority on what automation may not do. If an agent or
  pipeline component proposes an automated money action, the pillar governs.

## What belongs in this namespace and what does not

Belongs here: the founding claim, the pipeline stage definitions, the metric definitions
and lineage, the human gate rule, and the reasoning behind design decisions.

Does not belong here: live lead data, pipeline execution logs, CRM records, payment
processing state, Reddit API credentials, or Supabase connection strings. Those are
operational state in the runtime backend or secrets in the root `secrets/` registry.

## What this canon does not yet cover

This draft does not cover: detailed source contract specifications for the Reddit API
(deferred to `source-contracts/`), the transform SQL for scoring and classification
(deferred to `transforms/`), the model schemas (deferred to `models/`), or the pipeline
schedule and trigger configuration (deferred to `pipelines/`). These land in a future
build pass.

## Changelog

- 2026-07-06: initial draft created during the revenue-intelligence namespace build,
  authored at `operator-pending` from the HRIO README and pipeline documentation.
  Awaits operator verification.
