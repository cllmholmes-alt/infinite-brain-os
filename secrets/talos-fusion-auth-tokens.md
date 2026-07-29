---
id: "secret-talos-fusion-auth-tokens"
aliases: ["secret-talos-fusion-auth-tokens", "talos-operator-token", "talos-viewer-token", "fusion-api-token"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for TALOS/Fusion operator and viewer bearer tokens used for API authentication."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# TALOS / Fusion Auth Tokens

## What this is

Bearer tokens for TALOS API and Fusion API authentication. The operator token grants full read/write
access; the viewer token is read-only. The EDGE_API_TOKEN equals the viewer token for Cloudflare
Worker edge proxying.

## Secret reference

```yaml
secret_ref:
  id: "talos-fusion-auth-tokens"
  status: "live"
  backend: "generated-secrets"
  locator: "~/.hermes/.env, ~/.hermes/profiles/fusion/.env, Documents/fusion-harness/.env"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended", "cloud-headless", "server"]
  allowed_tools: ["talos-runtime", "fusion-harness", "hermes-agent"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key names |
|---------|-----------|
| `~/.hermes/.env` | `TALOS_OPERATOR_TOKEN`, `TALOS_API_TOKEN`, `TALOS_VIEWER_TOKEN` |
| `~/.hermes/profiles/fusion/.env` | `TALOS_OPERATOR_TOKEN`, `TALOS_API_TOKEN`, `TALOS_VIEWER_TOKEN`, `EDGE_API_TOKEN` |
| `~/.hermes/profiles/taloscontrol/.env` | `TALOS_OPERATOR_TOKEN`, `TALOS_API_TOKEN`, `TALOS_VIEWER_TOKEN` |
| `Documents/fusion-harness/.env` | `TALOS_OPERATOR_TOKEN`, `TALOS_API_TOKEN`, `TALOS_VIEWER_TOKEN`, `EDGE_API_TOKEN` |

## Scope

`EDGE_API_TOKEN` = `TALOS_VIEWER_TOKEN` (same value). The operator token (`test-operator-token-at-least-24-chars`)
is the default dev token; production uses different values. Used in `Authorization: Bearer <token>` headers.
