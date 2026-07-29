---
id: "secret-glm-zai-api-key"
aliases: ["secret-glm-zai-api-key", "glm-zai-api-key", "glm-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the GLM (ZhipuAI / Z.AI) API key — primary LLM for Hermes, TALOS, and Fusion."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# GLM / Z.AI API Key

## What this is

The GLM/Z.AI API key authenticates requests to the GLM-5.2 model endpoint. It is the primary model
for Hermes Agent (this session), TALOS runtime, and the Fusion evaluation harness. Used via the `zai`
provider in Hermes auth.json and as `GLM_API_KEY` across .env files.

## Secret reference

```yaml
secret_ref:
  id: "glm-zai-api-key"
  status: "live"
  backend: "zai-console-and-macos-keychain"
  locator: "Z.AI Console > API Keys; macOS Keychain entry 'TALOS Z.ai GLM API 2026-07-13'"
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
| `~/.hermes/.env` | `GLM_API_KEY` |
| `~/.hermes/profiles/fusion/.env` | `GLM_API_KEY` |
| `~/.hermes/profiles/taloscontrol/.env` | `GLM_API_KEY` |
| `Documents/fusion-harness/.env` | `GLM_API_KEY` |
| Hermes `auth.json` | provider: `zai` |
| macOS Keychain | `TALOS Z.ai GLM API 2026-07-13` |

## Scope

Primary model key for all agentic systems. If rotated, all six surfaces must be updated in lockstep.
The keychain entry was created 2026-07-13 and has not been rotated since.
