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

- Current release: `/srv/fusion/releases/v24-e6fc9de8-20260729T170346Z/`
- Stable pointer: `/srv/fusion/current`
- Runtime commit: e6fc9de834ab8ac8f2b4cace31683936b01c8db4
- Frozen binding: sha256:90d4ff5eba0138af43aaf2659723d9d884883b22737d5b64aabf5a77ad9ca5ee
- Rollback retained: v23-bfb13630-20260729T164820Z
- Environment file: `/etc/fusion/fusion-api.env`, secret values never enter this brain
- Network posture: private-only, loopback service with authenticated SSH-tunnel clients

PostgreSQL and Redis hold live durable operational state. Infinite Brain holds curated
knowledge. Neither live database state nor secrets are copied into git.
