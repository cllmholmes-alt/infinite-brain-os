---
id: "department-devops-platform-index"
aliases: ["department-devops-platform-index", "devops-platform"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "scratch"
summary: "Assembly surface for the shared devops-platform department: the CI/CD, secrets, deployment, environments, and observability layer for the whole portfolio."
confidence: 0.85
retrieval_class: "identity"
export_class: "public"
edges:
  - target: "[[department-devops-platform-charter]]"
    relation: "depends_on"
    confidence: 0.9
created: "2026-07-06"
---

# Department: Devops Platform

The shared cross-cutting platform department. Owns CI/CD, secrets, deployment posture,
environments, and observability for every repo and domain department in the portfolio.
Domain departments own their local adaptation layer; platform capabilities centralize here.

See [[department-devops-platform-charter]] for what success means.

## Purpose

Provide reliable, secure, cost-visible platform infrastructure across every repo the
operator builds in, ships from, or depends on. Standardize the pipeline, secret posture,
and deployment surface so domain departments never repeat infrastructure work.

## Scope Class

`shared-platform`. Serves all departments, repos, and products with no primary client or
brand scope.

## Head Agent

Not yet assigned. The head agent will own first-pass triage for platform incidents, secret
rotation scheduling, and the daily platform health update. Gap.

## Intake

- GitHub Dependabot, code scanning, and secret scanning alerts
- CI/CD pipeline failure notifications
- Operator-reported platform incidents (build failures, secret expiry, environment drift)
- General platform inquiries triaged from `intake/`

## Core Knowledge

- The `ai-architecture` namespace: the architecture doctrine that defines the platform layer
- `knowledge/ai-architecture/canon/department-model.md` for the shared-platform pattern
- `knowledge/ai-architecture/canon/system-overview.md` for the portfolio topology
- `_system/repo-registry-rules.md` for repo posture and ownership

## Core Execution

### Tools

- [[tool-comfyui]]: shared Stable Diffusion generation engine, platform-managed local runtime
- [[tool-scaleway-ios-cloud-mac]]: remote iOS build and signing host, load-bearing for mobile
- [[repo-registry-rtk]]: LLM token proxy for cross-cutting cost reduction across all agentic work
- [[tool-lm-studio]]: local LLM inference host, platform-managed model serving
- [[tool-unity]]: game engine build and CI surface for game-modding repos
- [[tool-sunshine]]: local streaming/game-stream host infrastructure
- [[tool-github-cli]]: GitHub CLI automation surface for repo management and CI scripting

### Secrets

The department owns the `secrets/` registry and governs rotation, exposure, and binding
policy across all secret references:

- [[secret-github-cllmholmes-alt-personal-access-token]]: GitHub PAT rotation posture
- Apple Developer credentials: iOS signing and App Store distribution (reference not yet created)
- Stripe API keys: payment infrastructure for commerce products (reference not yet created)
- ScaleWay API credentials: cloud Mac provisioning (reference not yet created)

### Workflows

- CI/CD pipeline standards: not yet formalized as workflows
- Secret rotation playbook: not yet created
- Environment provisioning playbook: not yet created

### Projects

None yet. The first project should be the platform bootstrap: wire secret rotation,
standardize CI across the active repo set, and define the environment model.

## Human Layer

Human-only: secret rotation execution (the operator holds the actual credentials), new
tool adoption decisions, spend approval for cloud resources. Review-gated: CI/CD pipeline
changes affecting the active repo set, environment topology changes. Fully AI-routable:
pipeline health monitoring, secret expiry notifications, daily platform status reporting.

## Daily Update

One short note per day: pipeline health across the active repos, any secret nearing expiry,
any environment drift, any blocked deploys. Rolls up into the weekly platform review and
the fleet-coordinator brief.

## Runtime Mapping

- `department_id`: `devops-platform`
- `department_name`: Devops Platform
- `head_agent`: not yet assigned (gap)
- `owned_namespaces`: `ai-architecture`
- `owned_workflows`: not yet created (gap)
- `owned_tools`: `tool-comfyui`, `tool-scaleway-ios-cloud-mac`, `repo-registry-rtk`, plus planned: `tool-lm-studio`, `tool-unity`, `tool-sunshine`, `tool-github-cli`
- `primary_intake_sources`: GitHub alerting, CI failure notifications, operator reports
- `daily_update_output`: daily platform health note
- `daily_rollup_target`: weekly platform review and fleet-coordinator brief
- `human_review_gates`: secret rotation execution, tool adoption, spend approval, pipeline changes to active repos

## Related Repos

The platform department serves every repo in the portfolio. Key dependencies visible in
`repo-registry/`:

- [[repo-registry-rtk]]: load-bearing token proxy, cross-cutting cost infrastructure
- [[repo-registry-talos]]: agentic system consuming platform infrastructure
- [[repo-registry-openclaw]]: agentic system consuming platform infrastructure
- [[repo-registry-odysseus-dev]]: agentic system consuming platform infrastructure
- The adhd-os repo-registry entries (master-reference-database, artsyled-website, user-dashboard, money-website): mobile build and deploy surface
- [[repo-registry-ai-media-pipeline]]: ComfyUI consumer
- All remaining `repo-registry/` entries: each repo consumes CI, secrets, or deployment surface from this department

## Subdepartments

None. Keep it one surface until the portfolio grows enough to split by domain (mobile CI
versus agentic CI versus media pipeline).

## Open Gaps

- Head agent not assigned; the department has no operating owner yet.
- No CI/CD pipeline workflow exists; posture is described but not automated.
- Secret rotation is manual and untracked beyond the single GitHub PAT reference.
- Environment model (dev, staging, production) is not defined across repos.
- Observability surface (uptime, pipeline health, cost pacing) has no dashboard or workflow.
- The Apple Developer, Stripe, ScaleWay, and LLM-provider secret references exist as placeholders pending operator confirmation of their backends.
- The daily update has no automation.
