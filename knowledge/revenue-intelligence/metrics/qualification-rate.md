---
id: "knowledge-revenue-intelligence-metrics-qualification-rate"
aliases: ["knowledge-revenue-intelligence-metrics-qualification-rate", "metric-qualification-rate", "qualification-rate"]
type: "Metric"
namespace: "revenue-intelligence"
lifecycle_state: "scratch"
summary: "The fraction of scored leads that pass the qualification threshold in the HRIO pipeline. Measures how effectively the scoring and classification stages surface leads that are worth human review and money-gate approval. Ratio, 0 to 1."
confidence: 0.8
retrieval_class: "domain"
export_class: "internal"
metric_id: "metric-qualification-rate"
format: "ratio"
polarity: "higher-better"
aggregation: "ratio-of-sums"
expression: "count(qualified_leads) / count(total_scored_leads) over a reporting window, where qualified means the lead passed the classification and human review stages and is approved for money-gate consideration"
depends_on: ["metric-lead-score"]
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
  - target: "[[lead-score]]"
    relation: "derived_from"
    confidence: 0.9
  - target: "[[human-in-the-loop-at-the-money-gate]]"
    relation: "informs"
    confidence: 0.8
created: "2026-07-06"
---

**Qualification rate** is the fraction of scored leads that pass the qualification
threshold in the HRIO pipeline, as defined in [[revenue-intelligence-core-doctrine]].
It measures how effectively the pipeline surfaces leads that are worth the operator's
time to review and approve at the money gate, as governed by
[[human-in-the-loop-at-the-money-gate]]. A higher rate means the scoring and
classification stages are producing leads that convert through to qualification;
a lower rate means the pipeline is generating noise or the qualification bar is set
too high.

## Definition

- Unit: dimensionless ratio, range 0 to 1.
- Numerator: the count of leads that pass the qualification threshold. A lead
  qualifies when it survives classification, human review, and is approved for
  money-gate consideration.
- Denominator: the total count of leads that were scored in the same reporting
  window. Leads that were filtered out before scoring are not counted.
- Window: defined by the reporting context. Daily and weekly windows are the
  expected primary use; monthly rollups are secondary.
- Edge case: if zero leads are scored in a window, the qualification rate is
  undefined (not zero). The dashboard or query should handle this as a null or
  no-data state.

## Source

The numerator and denominator both draw from the same Supabase lead table that the
score stage populates. The qualification flag is set during the qualify stage, after
classification and human review. The full source contract, transform, and model
nodes are deferred in this starter build.

## Lineage summary

Scored leads in Supabase lead table
  classification stage tags opportunity type
  human review stage approves or rejects
  qualify stage sets qualification flag
  this metric computes count(qualified) / count(scored)

The full upstream chain (source-contracts/, pipelines/, transforms/, models/) is
deferred in this starter-reduced build. The lineage described here is the expected
path.

## Diagnosis

An Operating Library namespace that diagnoses qualification-rate anomalies would
reference this node by its `metric_id: "metric-qualification-rate"`. The diagnosis
node does not redefine the metric; it describes what moves the number, what failure
modes to check, and what action to take.

Common diagnosis concerns:
- Rate collapse: if the qualification rate drops sharply, check whether the scoring
  weights have drifted (see [[metric-lead-score]]), whether the Reddit source has
  changed, or whether the classification taxonomy needs updating.
- Rate inflation with no revenue: if qualification rate is high but no leads convert
  to revenue, the qualification threshold may be too permissive or the money gate
  may be catching false positives.
- Denominator-only growth: if total scored leads grows but qualified leads stays
  flat, the filter stage may have become too permissive, letting noise through to
  the score stage.

## Using this metric_id across namespaces

Any Operating Library namespace that diagnoses anomalies in qualification-rate
references this node by its `metric_id: "metric-qualification-rate"`. Any dashboard
or report node that displays qualification-rate links to this node by
`[[metric-qualification-rate]]`. Neither redefines the metric.

## Starter implementation posture

This metric is marked `not-wired` through `implementation_path: "hrio-pipeline"`.
The semantic contract (definition, expression, lineage) is real and substantive.
The pipeline implementation that hydrates this metric from live lead data is tracked
in the HRIO repo. When the pipeline reaches production, update
`instrumentation_status` to `live`.

## Known limitations

- This metric depends on lead-score ([[metric-lead-score]]). If lead-score is
  misconfigured, qualification-rate will inherit the error.
- The qualification threshold is a configurable rule, not versioned in this metric
  node. Threshold changes that materially affect the rate should be recorded in
  `support/` as a qualification rule change receipt.
- The metric does not distinguish between qualification failure modes (was the lead
  mis-scored, mis-classified, or correctly rejected?). That breakdown belongs in a
  diagnostic node, not in the metric definition.
