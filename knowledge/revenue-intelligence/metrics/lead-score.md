---
id: "knowledge-revenue-intelligence-metrics-lead-score"
aliases: ["knowledge-revenue-intelligence-metrics-lead-score", "metric-lead-score", "lead-score"]
type: "Metric"
namespace: "revenue-intelligence"
lifecycle_state: "scratch"
summary: "The numeric score assigned to a Reddit lead during the HRIO score pipeline stage. Measures signal strength, recency, and contextual relevance. Higher scores indicate stronger revenue opportunity signals."
confidence: 0.8
retrieval_class: "domain"
export_class: "internal"
metric_id: "metric-lead-score"
format: "count"
polarity: "higher-better"
aggregation: "sum"
expression: "sum(signal_strength_weight + recency_weight + context_relevance_weight) per lead, where weights are derived from configurable scoring rules applied to Reddit post and comment fields"
depends_on: []
instrumentation_status: "not-wired"
implementation_path: "hrio-pipeline"
implementation_owner: "operator-managed"
edges:
  - target: "[[revenue-intelligence-core-doctrine]]"
    relation: "grounded_in"
    confidence: 0.85
  - target: "[[metric-primitive-schema]]"
    relation: "implements"
    confidence: 0.95
  - target: "[[qualification-rate]]"
    relation: "feeds"
    confidence: 0.85
created: "2026-07-06"
---

**Lead score** is the numeric score assigned to a Reddit post or comment during the HRIO
score pipeline stage, as defined in [[revenue-intelligence-core-doctrine]]. It aggregates
signal strength, recency, and contextual relevance into a single number that ranks leads
before classification and drafting. Higher scores indicate posts that are more likely to
convert into qualified revenue opportunities, measured by [[metric-qualification-rate]].

## Definition

- Unit: one lead (one Reddit post or comment that passed the filter stage).
- Components:
  - **Signal strength**: how strongly the post matches a configurable pain-signal
    pattern (keyword density, sentiment, explicit need language).
  - **Recency**: how recently the post was made. Fresher posts score higher; stale
    posts decay.
  - **Context relevance**: how well the post's subreddit, thread context, and author
    history align with the target service offering.
- Aggregation: the three component weights are summed per lead to produce a single
  score. No normalization across leads is assumed at the metric level; normalization,
  if any, is a transform concern.
- Window: per-lead scoring at scan time. Rollups (daily average, weekly top-N) are
  dashboard or query concerns, not part of the metric definition.

## Source

The raw fields (post title, body, subreddit, timestamp, author) come from the Reddit
API via the HRIO scan stage. The filter stage removes noise. The score stage applies
the configurable scoring rules. The pipeline lands scored leads in a Supabase table.
The full source contract, transform, and model nodes are deferred in this starter build.

## Lineage summary

Reddit API raw feed
  scan stage ingests posts and comments
  filter stage removes noise and exclusion matches
  score stage applies signal strength, recency, and context relevance weights
  scored lead lands in Supabase lead table
  this metric reads the score column

The full upstream chain (source-contracts/, pipelines/, transforms/, models/) is
deferred in this starter-reduced build. The lineage described here is the expected
path; the specific table names, transform SQL, and field mappings will be documented
when those nodes are created.

## Diagnosis

An Operating Library namespace that diagnoses lead-score anomalies would reference
this node by its `metric_id: "metric-lead-score"`. The diagnosis node does not redefine
the metric; it describes what moves the number, what failure modes to check, and what
action to take.

Common diagnosis concerns:
- Score drift: if average lead scores shift without a rule change, check the Reddit
  API for changes in post volume or subreddit activity patterns.
- Zero-score spikes: if many leads score zero, the filter or scoring rules may be
  misconfigured or the source may have changed its format.
- Score inflation: if scores trend upward without a corresponding increase in qualified
  leads, the scoring weights may need recalibration.

## Using this metric_id across namespaces

Any Operating Library namespace that diagnoses anomalies in lead-score references this
node by its `metric_id: "metric-lead-score"`. Any dashboard or report node that displays
lead-score links to this node by `[[metric-lead-score]]`. Neither redefines the metric.

## Starter implementation posture

This metric is marked `not-wired` through `implementation_path: "hrio-pipeline"`. The
semantic contract (definition, expression, lineage) is real and substantive. The
pipeline implementation that hydrates this metric from live Reddit data is tracked in
the HRIO repo. When the pipeline reaches production, update `instrumentation_status` to
`live`.

## Known limitations

- The scoring weights are configurable and not versioned in this metric node. Weight
  changes that materially affect score distributions should be recorded in `support/`
  as a scoring rule change receipt.
- The metric does not distinguish between different opportunity types at the scoring
  level. Classification happens after scoring; the same score means different things
  for different opportunity types.
- Lead-score is a per-lead metric. Aggregate views (daily average, weekly distribution)
  are downstream dashboard concerns and are not defined here.
