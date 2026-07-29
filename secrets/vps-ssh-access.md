---
id: "secret-vps-ssh-access"
aliases: ["secret-vps-ssh-access", "vps-ssh", "hermes-vps-ssh"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the SSH key and credentials used to access the Netcup VPS (37.221.192.116)."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# VPS SSH Access

## What this is

SSH credentials for the Netcup VPS at 37.221.192.116 (Debian 13, 16 CPU, 31 GB RAM). Hosts TALOS,
GLM-FableMax, Aurora, Fusion API/Dashboard/Worker, Ollama, and SearXNG. The SSH alias `hermes-vps`
resolves via `~/.ssh/config`.

## Secret reference

```yaml
secret_ref:
  id: "vps-ssh-access"
  status: "live"
  backend: "ssh-key-file"
  locator: "~/.ssh/id_ed25519 → ~/.ssh/config (host: hermes-vps → 37.221.192.116)"
  exposure_mode: "tool-only"
  allowed_runtimes: ["local-attended"]
  allowed_tools: ["ssh", "scp", "rsync"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Description |
|---------|-------------|
| `~/.ssh/id_ed25519` | Same keypair as GitHub - shared private key |
| `~/.ssh/config` | `Host hermes-vps` → `HostName 37.221.192.116`, `User root` |
| Windows PC | Separate ed25519 key (`...ID5TaYLgGzT4`) with same VPS access |

## Scope

Root SSH access to the production VPS. Shared keypair with GitHub (same `id_ed25519`). The Windows
PC has its own key registered separately. All production services run under root.
