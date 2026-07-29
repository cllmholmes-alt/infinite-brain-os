---
id: "secret-openai-api-key"
aliases: ["secret-openai-api-key", "openai-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the OpenAI API key used across ADHD-OS, GetSubmitReady, and Hermes auth."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# OpenAI API Key

## What this is

The OpenAI platform API key for GPT/Codex/DALL-E access. Consumed by the ADHD-OS dashboard
(ChatDev integration), GetSubmitReady.com backend, and Hermes auth.json provider pool.

## Secret reference

```yaml
secret_ref:
  id: "openai-api-key"
  status: "live"
  backend: "openai-platform"
  locator: "OpenAI Platform > API Keys"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended", "server"]
  allowed_tools: ["adhd-os-dashboard", "getsubmitready-backend", "hermes-agent"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| `Documents/Figmaadhdosuserdashboard/.env` | `OPENAI_API_KEY`, `OpenAI_ChatDev_API_Key` |
| `Documents/Getreviewreadycom/.env` | `OPENAI_API_KEY` |
| Hermes `auth.json` | provider: `openai-api` |

## Scope

Shared across three distinct consumer systems. Rotation must update all three. The ChatDev key
variant may be a separate key from the main one - verify during next rotation.
