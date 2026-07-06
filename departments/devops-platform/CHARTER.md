---
id: "department-devops-platform-charter"
aliases: ["department-devops-platform-charter"]
type: "Charter"
namespace: "ai-architecture"
lifecycle_state: "scratch"
summary: "Charter for the devops-platform department: reliable, low-cost, secure platform infrastructure across the portfolio. Mission, north star, KPIs, constraints, and cadence."
confidence: 0.85
retrieval_class: "identity"
export_class: "public"
edges:
  - target: "[[department-devops-platform-index]]"
    relation: "supports"
    confidence: 0.9
created: "2026-07-06"
---

# Charter: Devops Platform

The INDEX answers what this department contains; this charter answers what it optimizes
and how success is measured.

## Mission

Own the shared platform infrastructure layer so every domain department and repo in the
portfolio ships and runs on a reliable, secure, cost-visible foundation. The department
standardizes CI/CD, secrets management, environment topology, deployment posture, and
observability; domain departments own only their local adaptation layer. No department
should ever build its own pipeline or secret stack from scratch.

## North Star

Every repo in the portfolio deploys safely, secrets never rot in the dark, and the operator
knows the platform cost posture at a glance.

## Owned Outcomes

- Pipeline integrity: every active repo has CI that catches breakage before merge
- Secret posture: every credential referenced in `secrets/` has a known rotation date and
  no secret is past its rotation window
- Environment health: the dev, staging, and production topology is defined and drift is
  detectable
- Deploy safety: no deploy proceeds without a known rollback path
- Cost visibility: the operator sees platform spend pacing against budget at the weekly
  review

## Key Goals

- Bootstrap the platform: create the CI/CD standardization workflow, the secret rotation
  playbook, and the environment model for the active repo set
- Assign a head agent and wire the daily platform health update
- Register all known credentials (GitHub, Apple Developer, Stripe, ScaleWay) in `secrets/`
  with rotation posture
- Define the observability surface: pipeline health dashboard, secret expiry alerting,
  cost pacing report

## KPIs / Metrics

Four measurable signals, all provisional until the observability surface is wired:

1. **Pipeline green rate**: percentage of CI runs on the active repo set passing on first
   push, target 95 percent. Data posture: provisional, `not-wired`, to be read from GitHub
   Actions or equivalent CI surface.
2. **Secret rotation posture**: percentage of secrets in `secrets/` with a known rotation
   date and no expired rotation window, target 100 percent. Data posture: provisional,
   `not-wired`, counted from `secrets/` registry entries.
3. **Mean time to recovery (MTTR)**: minutes from pipeline failure detection to restore,
   target under 30 minutes for the active repo set. Data posture: provisional, `not-wired`.
4. **Platform cost pacing**: monthly platform spend (cloud Mac, GPU, API proxy, CI minutes)
   as a percentage of the operator's platform budget, target under 90 percent. Data posture:
   provisional, `not-wired`, to be read from provider billing surfaces.

All four KPIs are provisional with `not-wired` status because no Data System namespace
exists yet for the platform layer. The department will consume a shared Data System when
one is created or define department-scoped data nodes under `data/`.

## Targets and Review Posture

Secret rotation posture is the safety metric: if a credential is past its rotation window,
all other platform work stops until it is rotated. Targets are reviewed in the weekly
platform review and reset quarterly.

## Core Constraints

- Never store a secret value in this repo or in any session log; references only
- Never rotate a credential without operator confirmation
- Never change the CI/CD pipeline of an active repo without review
- Never approve cloud spend beyond the operator's declared budget without explicit approval
- Conservative default: when a pipeline fails and the root cause is unclear, halt deploys
  and surface to the operator, do not auto-retry
- Does not own canon: platform doctrine lives in `knowledge/ai-architecture/`, not here
- Does not own product launch decisions: the platform enables deploys but does not gate
  them on business readiness

## Related Entities

Namespace `ai-architecture`; head agent not yet assigned (gap); doctrine
`knowledge/ai-architecture/canon/department-model.md` and
`knowledge/ai-architecture/canon/system-overview.md`; execution surface listed in
[[department-devops-platform-index]]; owned tools [[tool-comfyui]],
[[tool-scaleway-ios-cloud-mac]], [[repo-registry-rtk]], plus planned [[tool-lm-studio]],
[[tool-unity]], [[tool-sunshine]], [[tool-github-cli]]; owned secret registry `secrets/`
with current entry [[secret-github-cllmholmes-alt-personal-access-token]] and planned
references for Apple Developer, Stripe, and ScaleWay; related repos in `repo-registry/`
including [[repo-registry-talos]], [[repo-registry-openclaw]],
[[repo-registry-odysseus-dev]], and the adhd-os product family.

## Human Review / Escalation

The operator owns final acceptance of: secret rotation execution, new tool adoption,
platform spend decisions, and CI/CD pipeline changes to active repos. The operator tunes
the rotation schedule, the spend budget, and the review cadence. Pipeline health
monitoring, secret expiry notifications, and daily platform status are fully AI-routable
once wired.

## Reporting Cadence

Daily platform health note; weekly rollup through the platform review and fleet-coordinator
brief; monthly cost pacing review; quarterly KPI reset and posture review.

## Open Gaps

- No head agent; the department has no operating owner.
- No CI/CD standardization workflow; pipeline posture is described, not automated.
- No secret rotation playbook; the single GitHub PAT reference is the only tracked credential.
- No environment model; dev, staging, and production topology is undefined.
- No observability surface; all four KPIs are `not-wired`.
- Planned tool nodes ([[tool-lm-studio]], [[tool-unity]], [[tool-sunshine]],
  [[tool-github-cli]]) do not exist yet.
- Planned secret references (Apple Developer, Stripe, ScaleWay) do not exist yet.
- No Data System namespace; KPI data posture is provisional across the board.
