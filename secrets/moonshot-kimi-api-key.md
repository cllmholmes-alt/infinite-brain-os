---
id: "secret-moonshot-kimi-api-key"
aliases: ["secret-moonshot-kimi-api-key", "moonshot-kimi-api-key", "kimi-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the Moonshot (Kimi) API key used by Fusion harness."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Moonshot / Kimi API Key

## What this is

The Moonshot API key provides access to Kimi K-series models. Consumed by the Fusion evaluation harness
as an alternative LLM provider.

## Secret reference

```yaml
secret_ref:
  id: "moonshot-kimi-api-key"
  status: "live"
  backend: "moonshot-console"
  locator: "Moonshot AI Platform > API Keys"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended", "cloud-headless"]
  allowed_tools: ["fusion-harness"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| `Documents/fusion-harness/.env` | `MOONSHOT_API_KEY`, `KIMI_API_KEY` |

## Scope

Both `MOONSHOT_API_KEY` and `KIMI_API_KEY` map to the same Moonshot platform account. Fusion-only.
