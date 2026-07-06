# metrics/

This folder holds Metric nodes. Each node uses the shared metric primitive defined in
`_system/metric-primitive-schema.md` ([[metric-primitive-schema]]).

## What goes here

One `.md` file per business metric. The file is a knowledge node with full frontmatter
including all metric primitive fields:

- `type: "Metric"`
- `metric_id`: a stable kebab-case identifier. This is the key that an Operating
  Library uses to reference this metric from its diagnostic nodes.
- `format`: one of `percent`, `currency`, `ratio`, `count`, `duration`.
- `polarity`: `higher-better`, `lower-better`, or `neutral`.
- `aggregation`: how the metric is aggregated over a time window (`sum`, `avg`, `last`,
  `ratio-of-sums`, `custom`).
- `expression`: the plain or SQL-like definition at the business-logic level.
- `depends_on`: a list of `metric_id` values this metric derives from, if any.
- `instrumentation_status`: one of `live`, `manual`, `not-wired`.
- `implementation_path`: the path through which the metric becomes real.
- `implementation_owner`: who is expected to make the metric real.

Edges must include a `derived_from` edge to the supporting model or source and a
`grounded_in` edge to core-doctrine.

In this starter-reduced namespace, metrics carry `instrumentation_status: not-wired`
because the full pipeline implementation is deferred. The semantic contract (definition,
expression, lineage summary) is real and substantive.

## What does not go here

Do not put pipeline nodes, model schema nodes, or transform SQL nodes in this folder.
Those belong in `pipelines/`, `models/`, and `transforms/` respectively (all deferred
in this starter build). This folder holds only the typed metric definition, which is
the business-facing contract.

Do not define the same metric in both this namespace and an Operating Library namespace.
Define it here; the Operating Library references it by `metric_id`.

## Navigational note

This README is navigational and carries no node frontmatter. The metric `.md` files
carry full node frontmatter with all metric primitive fields.
