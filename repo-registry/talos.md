---
id: "repo-registry-talos"
aliases: ["repo-registry-talos", "talos"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "TALOS, the Total Agentic Lifecycle Orchestration System: a governed, evidence-first, approval-gated, multi-agent operating system for building and scaling AI-powered businesses and software products. Dockerized, with a command-center app. Owned by cllmholmes-alt."
confidence: 0.92
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-05"
---

# Repo: talos

## Repo Identity

- Repo slug: `talos` (fusion-harness monorepo)
- Canonical path (Mac): `/Users/callumholmes/Documents/fusion-harness`
- VPS deployment: `/srv/fusion/current/` on `hermes-vps` (systemd `fusion-api.service`, API :4000, Command Centre :3000)
- Remote: `github.com/cllmholmes-alt/fusion-harness.git`
- Cross-system operating map: `docs/ECOSYSTEM_OPERATIONS.md` in the repo
- Version control: git
- Stack: Node (`package.json`), pnpm monorepo, Docker (`Dockerfile`, `docker-compose.yml`), command-center
  app under `apps/command-center/`, Fusion API under `apps/api/`

## Primary Job

A multi-agent operating system covering the full lifecycle of AI-powered businesses and
software products: build, launch, operate, improve, and commercially scale. Primary law:
no claim without evidence, no code without tests, no deployment without gates, no autonomy
without permissions, no learning without rollback, no completion without traceability.
Agents never own execution authority; every action is mediated by task state, risk level,
role permission, tool contract, evidence requirement, approval posture, gate status, and
audit log. `TALOS_SYSTEM_LAW.md` is binding and outranks all code in that repo.

## Current Registry Status

- Working status: `primary`
- Operator confirmation required: yes

## Department Linkage

- Working primary owning department: `agentic-systems` (planned, Phase 4)

## Related Surfaces

- Related namespaces: `knowledge/talos/`
- Related brand: `parties/brands/talos.md`
- Related repos: `odysseus-dev`, `openclaw`, `nemoclaw`, `company-os` (agentic cluster)

## Digestion or Migration Posture

- Working posture: `primary` (high ingestion value; TALOS governance doctrine overlaps
  heavily with the infinite-brain-os control model)

## Open Decisions and Risks

- TALOS and infinite-brain-os overlap conceptually. Decide the relationship: is TALOS the
  runtime substrate this brain governs (like the Paperclip placeholder in doctrine), a peer
  system, or a successor? A synthesis node should map the two governance models.
- `TALOS-GTM` (go-to-market) is referenced in the README; confirm scope.
