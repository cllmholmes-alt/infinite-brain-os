---
id: "secret-openrouter-api-key"
aliases: ["secret-openrouter-api-key", "openrouter-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the OpenRouter API key used by Fusion harness for multi-model routing."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# OpenRouter API Key

## What this is

The OpenRouter API key enables access to the OpenRouter multi-model gateway, providing routing to
models not directly available via their native APIs.

## Secret reference

```yaml
secret_ref:
  id: "openrouter-api-key"
  status: "live"
  backend: "openrouter-console"
  locator: "OpenRouter > Keys"
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
| `Documents/fusion-harness/.env` | `OPENROUTER_API_KEY` |

## Scope

Fusion-only. Not shared with Hermes or TALOS profiles.
