# Agent Load Order: revenue-intelligence

This file is navigational. It tells agents what to load next after reading
`core-doctrine.md`, by query class.

## Always load first

`core-doctrine.md` in full. It is the compressed synthesis. Do not skip it to go
directly to metrics or the pillar.

## By query class

**Founding claim** (what is the core principle the pipeline derives from):
Load `core-doctrine.md`, then `pillars/human-in-the-loop-at-the-money-gate.md`.

**"What does metric X mean and how is it calculated?"**
Load `core-doctrine.md`, then `metrics/<metric>.md`. Follow `depends_on` edges to
trace derivation. For qualification-rate, this leads to lead-score.

**"Where does this number come from?" (lineage trace)**
Load `metrics/<metric>.md`. The full upstream chain (source contracts, pipelines,
transforms, models) is deferred in this starter-reduced build. The metric node
carries a lineage summary that describes the expected path.

**Pipeline understanding** (what is HRIO, what does it do, what are the stages):
Load `core-doctrine.md` whole. The pipeline stages are enumerated there. Expand
into `concepts/` for deeper component reasoning as it grows.

**"What is the human gate and why does it exist?"**
Load `pillars/human-in-the-loop-at-the-money-gate.md` directly. It edges back to
core-doctrine and carries the full claim.

**"How are leads scored and qualified?"**
Load `metrics/lead-score.md` for the scoring metric, then
`metrics/qualification-rate.md` for how scored leads are qualified. The
qualification-rate depends on lead-score; read lead-score first.

**"Is there an open dispute or contested design decision?"**
Load `synthesis/README.md` first. The synthesis folder holds contradiction maps
and best-current-reading notes for contested topics.

**"What procedural steps exist for maintaining this namespace?"**
Load `playbooks/README.md`.

**"Where did this content originally come from?" (provenance)**
Load `support/README.md`. Source content from the HRIO repo lands here with
provenance records.

## What to skip on first load

`concepts/` and `decisions/` are secondary surfaces for the initial load. They grow
as the pipeline is documented and design decisions are recorded. Do not load them
before `core-doctrine.md`: those files assume the canonical framing.

## Navigational note

This file does not carry node frontmatter. It is a navigational aid for agents, not
a knowledge node.
