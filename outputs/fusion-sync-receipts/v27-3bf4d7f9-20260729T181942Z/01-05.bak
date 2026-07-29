---
id: "repo-registry-netcup-vps"
aliases: ["repo-registry-netcup-vps", "netcup-vps", "vps", "hermes-vps"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "The Netcup VPS hosts the private immutable Fusion runtime and its PostgreSQL and Redis durability services."
confidence: 1
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
edges:
  - relation: "hosts"
    target: "[[repo-registry-fusion-runtime]]"
    confidence: 1
  - relation: "serves"
    target: "[[repo-registry-hermes-agent]]"
    confidence: 0.95
---

# Repo: netcup-vps

## Fusion deployment

- Current release: `/srv/fusion/releases/v25-6f320cb8-20260729T173119Z/`
- Stable pointer: `/srv/fusion/current`
- Runtime commit: 6f320cb8f0c8faf503ac4d26d6f81162973f44d2
- Frozen binding: sha256:b2f58b6f4b7c1baf08191921f2147b43da22abee257a6b9bb0767f699856483c
- Rollback retained: v24-e6fc9de8-20260729T170346Z
- Environment file: `/etc/fusion/fusion-api.env`, secret values never enter this brain
- Network posture: private-only, loopback service with authenticated SSH-tunnel clients

PostgreSQL and Redis hold live durable operational state. Infinite Brain holds curated
knowledge. Neither live database state nor secrets are copied into git.
