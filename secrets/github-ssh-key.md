---
id: "secret-github-ssh-key"
aliases: ["secret-github-ssh-key", "github-ssh-key", "ssh-ed25519"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the ed25519 SSH key used for GitHub authentication as cllmholmes-alt."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# GitHub SSH Key (ed25519)

## What this is

The operator's primary SSH key for GitHub authentication. Authenticates as user `cllmholmes-alt`.
Has full push access to personal forks (`cllmholmes-alt/*`) and read-only access to upstream repos
(`nexu-io/open-design`, `NousResearch/hermes-agent`).

## Secret reference

```yaml
secret_ref:
  id: "github-ssh-key"
  status: "live"
  backend: "ssh-key-file"
  locator: "~/.ssh/id_ed25519 (private), ~/.ssh/id_ed25519.pub (public)"
  exposure_mode: "tool-only"
  allowed_runtimes: ["local-attended"]
  allowed_tools: ["git", "ssh", "gh-cli"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Description |
|---------|-------------|
| `~/.ssh/id_ed25519` | Private key |
| `~/.ssh/id_ed25519.pub` | Public key (SHA256:3f1Eanw...) |
| GitHub | Registered under `cllmholmes-alt` account |
| macOS Keychain | `gh:github.com` (gh CLI token `gho_***`) |

## Scope

Single SSH keypair for all GitHub operations. The gh CLI uses a separate OAuth token (`gho_`) with
scopes: `repo`, `read:org`, `workflow`, `admin:public_key`, `gist`. Windows PC has a separate
ed25519 key (fingerprint ending `ID5TaYLgGzT4`).
