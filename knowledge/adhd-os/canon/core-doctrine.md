---
id: "knowledge-adhd-os-canon-core-doctrine"
aliases: ["knowledge-adhd-os-canon-core-doctrine", "adhd-os-core-doctrine", "adhd-os-doctrine"]
type: "Knowledge"
namespace: "adhd-os"
lifecycle_state: "scratch"
summary: "Drafted core doctrine for the ADHD-OS namespace: a calm, cognitive-load-reducing behavioral executive-function operating system whose founding claim is that cognitive load is a structural issue, not a moral failing. Covers the founding claim, the product posture, and the component surface. Authored at operator-pending until the operator verifies it."
confidence: 0.7
retrieval_class: "identity"
export_class: "internal"
verified_at: "2026-07-05"
verified_by: "operator-pending"
edges:
  - target: "[[cognitive-load-is-structural]]"
    relation: "derived_from"
    confidence: 0.9
  - target: "[[namespace-profiles]]"
    relation: "references"
    confidence: 0.7
created: "2026-07-05"
---

## Read this first

This is the drafted canon of the `adhd-os` namespace. It is authored at
`operator-pending`: an agent drafted it from the product's README and Figma source during the
2026-07-05 Hive-Mind integration. The operator must verify it before it becomes real canon.
Read it whole, then expand into the pillar and the component material as the query demands.

## What ADHD-OS is

ADHD-OS is a behavioral executive-function operating system built to reduce cognitive load
rather than capture attention. Its posture, taken from the dashboard app, is calm,
institutional, and cognitive-load-reducing. It exists to stabilise executive function. It is
explicitly not designed to increase screen time, capture attention, or exploit behavioural
data.

## The founding claim

The single load-bearing claim, recorded in [[cognitive-load-is-structural]], is that
cognitive load is a structural issue, not a moral failing. Every product decision in this
namespace should be traceable back to that claim: a feature that adds load must justify
itself against it, and a feature that reduces load aligns with it.

## Product posture

Three operating rules follow from the founding claim:

- Calm before capability. A feature is rejected if it captures attention or increases load,
  even if it is technically impressive.
- Structural, not moral. The product treats executive-function difficulty as a structure to
  fix, not a failure to punish. Design and copy must reflect this.
- Capacity-aware. Execution is mediated by the user's current capacity, not by an idealized
  unlimited user. This is the basis of the capacity-aware execution layer.

## The component surface

ADHD-OS spans several components, each tracked in `repo-registry/`:

- the Master Reference Database, the canonical content and data backbone
- an Alternative Design under evaluation
- two websites (the main artsyled site and the money site)
- the User Dashboard, the Expo mobile app that implements the capacity-aware execution layer

The Figma design at `https://www.figma.com/design/QNmiv2oZ9Jyz08orjDb7Cl/The-New-ADHD-OS` is
the source of truth for the visual identity. The Expo app is built and signed on the ScaleWay
iOS Cloud Mac.

## What this canon does not yet cover

This draft does not cover: the detailed component architecture (to grow in `concepts/`), the
recorded design decisions (to grow in `decisions/`), or the monetization model (to be
documented from the money site). Those land as the operator provides and verifies them.

## Changelog

- 2026-07-05: initial draft created during the Hive-Mind vault integration, authored at
  `operator-pending` from the product README and Figma source. Awaits operator verification.
