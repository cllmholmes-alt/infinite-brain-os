---
id: "department-adhd-os-product-index"
aliases: ["department-adhd-os-product-index", "adhd-os-product"]
type: "Doc"
namespace: "adhd-os"
lifecycle_state: "scratch"
summary: "Assembly surface for the ADHD-OS product department: the entities that ship the calm, cognitive-load-reducing ADHD-OS brand."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
edges:
  - target: "[[department-adhd-os-product-charter]]"
    relation: "depends_on"
    confidence: 0.9
created: "2026-07-06"
---

# Department: ADHD-OS Product

The operating department that ships the ADHD-OS product brand: a calm, institutional,
cognitive-load-reducing behavioral executive-function operating system. It assembles the
namespace, repos, brand, tools, and execution surfaces needed to design, build, and ship
ADHD-OS. It owns no entity bodies; it is a grouping surface over the ontology.

## Purpose

Ship the ADHD-OS product line: the master reference database, the alternative design
exploration, the money website, the art-styled website, and the Expo dashboard app. Every
component advances the founding claim that cognitive load is a structural issue, not a
moral failing. See [[department-adhd-os-product-charter]] for what success means.

## Scope Class

`brand-scoped`. One brand dominates: ADHD-OS.

- `brand_slug`: `adhd-os`
- `party_slugs`: `["adhd-os"]`

Brand record: [[brand-adhd-os]].

## Head Agent

Gap: no head-of-department agent exists yet. The department will need an agent that owns
first-pass triage for ADHD-OS intake, routing across specialist agents (design, build,
deploy), escalation to the operator, and the daily update.

## Intake

Gap: no dedicated intake path exists yet. When wired, intake should route:

- Product decisions and design changes from the Figma source of truth
- Feature requests and bug reports from the dashboard app
- Content updates for the websites
- Build and release signals from the ScaleWay iOS Cloud Mac

## Core Knowledge

- The `adhd-os` namespace, entered through its INDEX
- [[adhd-os-founding-claim]] for the product's operating posture
- [[component-architecture]] for how the database, websites, and app interlink

## Core Execution

- Tool: [[tool-scaleway-ios-cloud-mac]] (iOS build and signing host, load-bearing for shipping the Expo dashboard app)
- Skill: gap (shipping workflow not yet defined)
- Workflow (agentic): gap (daily update not yet automated)
- Workflow (deterministic): gap (build pipeline not yet configured)
- Project: gap (the first shipping milestone is not yet scoped as a project)

## Related Repos

All repos owned by the ADHD-OS brand, tracked in the repo-registry:

- `adhd-os-master-reference-database`: canonical content and data backbone (primary)
- `adhd-os-alternative-design`: alternate design direction (supporting)
- `adhd-money-website`: the money-site web presence (primary)
- `adhdos-artsyled-website`: the art-styled website (primary)
- `adhdos-user-dashboard`: the Expo dashboard app, the capacity-aware execution layer (primary)

## Human Layer

Human-only: pricing, public claims, brand positioning, Figma design decisions, Apple
Developer account management, and anything that authorizes a build on a live device.
Review-gated: canon edits to `knowledge/adhd-os/`, new listing copy, app release
candidates. Fully AI-routed: nothing yet; all routes default to the human until the head
agent is wired.

## Daily Update

Gap: not yet automated. One short note per day: what shipped, what is blocked, what
needs the operator's decision. Should roll up into a weekly product review.

## Runtime Mapping

- `department_id`: `adhd-os-product`
- `department_name`: ADHD-OS Product
- `head_agent`: gap (no agent assigned yet)
- `owned_namespaces`: `adhd-os`
- `owned_workflows`: gap
- `owned_tools`: `tool-scaleway-ios-cloud-mac`
- `primary_intake_sources`: gap
- `daily_update_output`: gap
- `daily_rollup_target`: gap
- `human_review_gates`: canon edits, listing copy, app releases, brand positioning

## Subdepartments

None. Keep it one surface until the product line splits into distinct operating lanes
(database, websites, app).

## Open Gaps

- No head-of-department agent exists.
- No intake routing is wired.
- No daily update or weekly review workflow exists.
- No shipping workflow (design to build to deploy) is defined.
- No project exists for the first shipping milestone.
- The iOS build pipeline through ScaleWay is described, not configured.
- The Apple Developer identity is not yet registered in `secrets/`.
