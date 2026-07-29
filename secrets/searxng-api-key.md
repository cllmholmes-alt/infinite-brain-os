---
id: "secret-searxng-api-key"
aliases: ["secret-searxng-api-key", "searxng-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the SearXNG API key for the self-hosted search instance on the VPS."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# SearXNG API Key

## What this is

The SearXNG API key authenticates queries to the self-hosted SearXNG meta-search instance running on
the Netcup VPS (37.221.192.116). Used by Hermes for web search and research tools.

## Secret reference

```yaml
secret_ref:
  id: "searxng-api-key"
  status: "live"
  backend: "self-hosted-vps"
  locator: "VPS /opt/searxng/settings.yml (secret_key field)"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended", "cloud-headless"]
  allowed_tools: ["hermes-agent"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| `~/.hermes/.env` | `SEARXNG_API_KEY`, `SEARXNG_URL` |
| `~/.hermes/profiles/fusion/.env` | `SEARXNG_API_KEY`, `SEARXNG_URL` |
| `~/.hermes/profiles/taloscontrol/.env` | `SEARXNG_API_KEY`, `SEARXNG_URL` |

## Scope

Hermes search integration. Points to VPS-hosted SearXNG instance.
