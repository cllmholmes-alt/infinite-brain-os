---
id: "department-adhd-os-product-charter"
aliases: ["department-adhd-os-product-charter"]
type: "Charter"
namespace: "adhd-os"
lifecycle_state: "scratch"
summary: "Charter for the ADHD-OS product department: mission, north star, owned outcomes, signals, constraints, and cadence. Optimizes for shipping a calm, load-reducing product."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
edges:
  - target: "[[department-adhd-os-product-index]]"
    relation: "supports"
    confidence: 0.9
departments:
  - "adhd-os-product"
party_slugs: ["adhd-os"]
brand_slug: "adhd-os"
created: "2026-07-06"
---

# Charter: ADHD-OS Product

The INDEX answers what this department contains; this charter answers what it optimizes
and how success is measured.

## Mission

Design, build, and ship the ADHD-OS product line so the operator's cognitive load
decreases, users gain a calm and institutional executive-function tool, and every
component of the brand carries the founding claim that cognitive load is a structural
issue, not a moral failing. The department does not build for engagement; it builds for
clarity, capacity awareness, and load reduction.

## North Star

Every ADHD-OS component feels calm, institutional, and load-reducing to the people who
use it, and every component ships on a predictable, operator-reviewable cadence.

## Owned Outcomes

- The master reference database is the single source of truth for ADHD-OS content and
  data
- Both websites are live, on-brand, and updated without requiring the operator to touch
  code
- The Expo dashboard app is available on iOS and Android, built and signed through the
  ScaleWay pipeline
- The design direction (alternative versus primary) is settled and documented, not
  perpetually explored

## Key Goals

- Settle the design direction: primary design versus alternative design as the shipping
  track
- Ship a first live version of the Expo dashboard app
- Get both websites to a publishable state
- Wire the ScaleWay iOS Cloud Mac into a repeatable build-and-sign flow

## KPIs / Metrics

Three measurable signals, all provisional until a Data System namespace exists:

1. **Components shipped**: number of ADHD-OS components at `live` status, target all
   five within the first operating period. Data posture: `not-wired`, counted by
   operator review.
2. **Build cadence**: days between dashboard app builds, target weekly. Data posture:
   `not-wired`, read from the ScaleWay build log.
3. **Brand-voice pass rate**: new surface copy passing the ADHD-OS voice check on first
   review, target 90 percent. Data posture: `not-wired`, counted in weekly review.

## Targets and Review Posture

Components shipped is the safety metric: if the design direction remains unsettled or no
component ships, everything else waits. Targets are reviewed in a weekly product review
and reset per shipping milestone.

## Core Constraints

- Never spend money on infrastructure or services without the operator's approval
- Never publish a public claim or launch a live page without operator sign-off
- Never ship an iOS build without the operator's Apple Developer credentials, and never
  store those credentials in git
- Never alter the brand's founding claim (calm, institutional, cognitive load reducing)
  without operator approval and a canon edit
- Conservative default: when unsure whether a decision changes the brand posture, surface
  it to the operator

## Related Entities

Namespace `adhd-os`; brand [[brand-adhd-os]]; head agent gap (not yet created); doctrine
[[adhd-os-founding-claim]] and [[component-architecture]];
build host [[tool-scaleway-ios-cloud-mac]]; repos `adhd-os-master-reference-database`,
`adhd-os-alternative-design`, `adhd-money-website`, `adhdos-artsyled-website`,
`adhdos-user-dashboard`; execution surface listed in
[[department-adhd-os-product-index]].

## Human Review / Escalation

The operator owns final acceptance of: brand positioning, public claims, app store
releases, Apple Developer account management, and Figma design decisions. The operator
tunes the shipping cadence and the design-direction decision. Inbox triage, build
execution, and daily updates are candidates for full AI routing once the head agent is
wired, but nothing is AI-routed until that agent exists and the operator approves its
scope.

## Reporting Cadence

Daily product note (gap); weekly product review (gap); a per-milestone retrospective at
each shipping cycle close.

## Open Gaps

- No head-of-department agent exists.
- No KPI data pipeline is wired; all three KPIs are hand-counted.
- The design-direction decision (primary versus alternative) is not yet settled.
- The ScaleWay build pipeline is described, not configured or tested.
- No daily note or weekly review workflow is automated.
- The Apple Developer identity is not yet registered in `secrets/`.
