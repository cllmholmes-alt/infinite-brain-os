---
id: "repo-registry-netcup-vps"
aliases: ["repo-registry-netcup-vps", "netcup-vps", "vps", "hermes-vps"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "Netcup VPS - the primary production server (37.221.192.116, Debian 13, 16 CPU, 31 GB RAM). Hosts Fusion API, Aurora API, PostgreSQL, Redis, and nginx. SSH alias hermes-vps from both operator machines."
confidence: 0.95
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
edges:
  - relation: "hosts"
    target: "[[repo-registry-fusion-runtime]]"
    confidence: 0.95
  - relation: "hosts"
    target: "[[repo-registry-aurora-api]]"
    confidence: 0.95
  - relation: "managed-by"
    target: "[[repo-registry-hermes-agent]]"
    confidence: 0.9
---

# Repo: netcup-vps

## Identity

- IP: `37.221.192.116`
- OS: Debian 13
- Specs: 16 CPU, 31 GB RAM
- SSH alias: `hermes-vps` (configured on both MacBook and Windows PC)
- Provider: Netcup

## Primary Job

The production server hosting all externally-facing services:

| Service | Port | Path | Status |
|---------|------|------|--------|
| Fusion API | :4000 | `/srv/fusion/current/` | active |
| Aurora API | :3000 | `/opt/aurora/` (Docker) | active |
| PostgreSQL | :5432 | system | active |
| Redis | :6379 | system | active |
| nginx | :80/:443 | reverse proxy | active |

## Deployment Paths

- **Fusion releases**: `/srv/fusion/releases/v{N}-{hash}-{timestamp}/`
- **Fusion current**: `/srv/fusion/current/` (symlink to active release)
- **Fusion env**: `/etc/fusion/fusion-api.env`
- **Aurora**: `/opt/aurora/docker-compose.yml`, env at `/root/.env`

## Related Surfaces

- Related repos: `[[repo-registry-fusion-runtime]]`, `[[repo-registry-aurora-api]]`, `[[repo-registry-hermes-agent]]`
- Credential references: `secrets/vps-ssh-access.md`
- Public endpoints: `https://adhd-os.co.uk/api/fusion/v1/`, `https://adhd-os.co.uk/api/aurora`

## Open Decisions and Risks

- Release creation must use `cp -rL` (not `cp -a`) - `cp -a` corrupts via symlink
- Python manifest regenerator required on VPS (no git available for JS generator)
- `TALOS_RESOURCE_GOVERNOR_DISABLED=1` required (mem>90% triggers unreleasable emergency stop)
