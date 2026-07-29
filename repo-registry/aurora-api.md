---
id: "repo-registry-aurora-api"
aliases: ["repo-registry-aurora-api", "aurora-api", "aurora"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "Aurora API - the external inference gateway running on the Netcup VPS, proxied through adhd-os.co.uk/api/aurora. Dockerized Node.js service providing AI model access to the ADHD-OS platform."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
edges:
  - relation: "depends-on"
    target: "[[repo-registry-netcup-vps]]"
    confidence: 0.95
  - relation: "proxied-by"
    target: "[[repo-registry-fusion-runtime]]"
    confidence: 0.8
  - relation: "managed-by"
    target: "[[repo-registry-hermes-agent]]"
    confidence: 0.85
---

# Repo: aurora-api

## Repo Identity

- Repo slug: `aurora-api`
- VPS path: `/opt/aurora/` (Docker compose deployment)
- Public endpoint: `https://adhd-os.co.uk/api/aurora`
- Stack: Node.js, Docker, nginx reverse proxy

## Primary Job

External-facing AI inference gateway. Provides model access for the ADHD-OS platform
through a proxied endpoint. Runs as a Docker container on the VPS with a healthcheck
that must use `127.0.0.1:3000` (not `localhost` - IPv6 `::1` resolution causes false
unhealthy).

## Current Registry Status

- Working status: `production`
- Operator confirmation required: yes

## Deployment Details

- Docker Compose: `/opt/aurora/docker-compose.yml`
- Environment: `/root/.env`
- Internal port: `:3000`, proxied via nginx to `/api/aurora`
- Healthcheck: `127.0.0.1:3000` (IPv4 only - localhost fails on IPv6)

## Related Surfaces

- Related repos: `[[repo-registry-netcup-vps]]`, `[[repo-registry-hermes-agent]]`
- Credential references: `secrets/aurora-ai-api-key.md`, `secrets/glm-zai-api-key.md`
- Deployment skill: `vps-service-deployment` (canonical VPS deploy reference)
