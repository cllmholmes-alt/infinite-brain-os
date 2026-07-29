---
id: "secret-deepseek-api-key"
aliases: ["secret-deepseek-api-key", "deepseek-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the DeepSeek API key — secondary LLM for Hermes, TALOS, and Fusion."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# DeepSeek API Key

## What this is

The DeepSeek API key authenticates requests to DeepSeek's v4-pro models. Used by Hermes for delegated
subagent work and by TALOS/Fusion for evaluation runs.

## Secret reference

```yaml
secret_ref:
  id: "deepseek-api-key"
  status: "live"
  backend: "deepseek-console"
  locator: "DeepSeek Platform > API Keys"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended", "cloud-headless"]
  allowed_tools: ["hermes-agent", "talos-runtime", "fusion-harness"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| `~/.hermes/.env` | `DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL` |
| `~/.hermes/profiles/fusion/.env` | `DEEPSEEK_API_KEY` |
| `~/.hermes/profiles/taloscontrol/.env` | `DEEPSEEK_API_KEY` |
| `Documents/fusion-harness/.env` | `DEEPSEEK_API_KEY` |
| Hermes `auth.json` | provider: `deepseek` |

## Scope

Secondary model provider for delegated work and evaluation. Pairs with the backup key for failover.
