---
id: "secret-cloudflare-api-token"
aliases: ["secret-cloudflare-api-token", "cloudflare-api-token", "cloudflare-zone-id"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for Cloudflare API token and zone ID used by Fusion harness and VPS DNS/routing."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Cloudflare API Token

## What this is

The Cloudflare API token manages DNS records, SSL/TLS settings, and routing rules for the operator's
domains (adhd-os.co.uk, getsubmitready.com). Used by Fusion harness and the VPS reverse proxy setup.

## Secret reference

```yaml
secret_ref:
  id: "cloudflare-api-token"
  status: "live"
  backend: "cloudflare-dashboard"
  locator: "Cloudflare > My Profile > API Tokens"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended", "server"]
  allowed_tools: ["fusion-harness", "vps-deployment"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key names |
|---------|-----------|
| `Documents/fusion-harness/.env` | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ZONE_ID` |

## Scope

DNS and edge configuration for adhd-os.co.uk (Zone ID in .env). VPS reverse proxy depends on
Cloudflare for SSL termination and origin pulls.
