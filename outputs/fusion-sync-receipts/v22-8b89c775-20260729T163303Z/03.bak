---
id: "repo-registry-fusion-runtime"
aliases: ["repo-registry-fusion-runtime", "fusion-runtime", "fusion-api", "fusion"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "Fusion API - the OpenAI-compatible inference proxy and agent routing layer within the TALOS ecosystem. Deployed on the Netcup VPS with 6-layer model router, failover chain, and release verification. Public endpoint at adhd-os.co.uk/api/fusion."
confidence: 0.92
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
edges:
  - relation: "part-of"
    target: "[[repo-registry-talos]]"
    confidence: 0.95
  - relation: "depends-on"
    target: "[[repo-registry-netcup-vps]]"
    confidence: 0.95
  - relation: "managed-by"
    target: "[[repo-registry-hermes-agent]]"
    confidence: 0.9
  - relation: "routes-to"
    target: "[[repo-registry-aurora-api]]"
    confidence: 0.75
---

# Repo: fusion-runtime

## Repo Identity

- Repo slug: `fusion-harness` (the monorepo containing the Fusion API)
- Canonical path (Mac): `/Users/callumholmes/Documents/fusion-harness`
- Remote: `github.com/cllmholmes-alt/fusion-harness.git`
- VPS deployment: `/srv/fusion/current/` (release v15, 6336 files)
- Public endpoint: `https://adhd-os.co.uk/api/fusion/v1/`
- Stack: TypeScript, pnpm monorepo, Fastify, Node.js

## Primary Job

OpenAI-compatible inference proxy with a sophisticated 6-layer model router:
concrete → retry → compression → failover → cost-routing → cache. Provides agent
routing, preface modes, streaming/non-streaming responses, and release verification
at API boot. Serves the TALOS ecosystem as its primary inference gateway.

Key subsystems:
- **Model router** - 6-layer stack with provider failover (GLM → DeepSeek → OpenAI → Claude → Kimi)
- **Agent report** - preface modes (none/compact/full), token-efficiency optimization
- **Release verification** - manifest hash check at boot (NODE_ENV=production), Python regenerator
- **Evolution routes** - governed self-evolution with producer/verifier role separation

## Current Registry Status

- Working status: `production`
- Operator confirmation required: yes
- VPS services: fusion-api (active), nginx, postgresql, redis-server

## Recent Changes (2026-07-29)

- Token-efficiency: `prefaceMode="none"` default via `FUSION_PREFACE_MODE_DEFAULT` env var
- Streaming preface bug fixed (commit `76a24ed8`) - onToken now respects prefaceMode
- Compact triage format in agent routing
- All tests: 807 passed, 16 skipped, 0 failed

## Deployment Details

- Release: v15 (`v15-43105864-20260729T011749Z`), manifest verified
- Environment: `/etc/fusion/fusion-api.env` (`NODE_ENV=production`, `FUSION_PREFACE_MODE_DEFAULT=none`)
- Internal: `:4000` (nginx → `/api/fusion/v1/`)
- Auth: `FUSION_API_TOKEN` for `/v1/`; operator token for internal routes
- Local dev: `API_PORT=4100` (port 4000 = SSH tunnel to VPS)

## Related Surfaces

- Related repos: `[[repo-registry-talos]]`, `[[repo-registry-netcup-vps]]`
- Credential references: `secrets/talos-fusion-auth-tokens.md`, `secrets/glm-zai-api-key.md`, `secrets/openai-api-key.md`, `secrets/anthropic-api-key.md`, `secrets/deepseek-api-key.md`, `secrets/moonshot-kimi-api-key.md`
- Verification skill: `fusion-harness-verification` (full API contract reference)
