---
id: "secret-openai-service-account-api-key"
aliases: ["secret-openai-service-account-api-key", "openai-service-account-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the OpenAI service account API key used by GetSubmitReady.com backend."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# OpenAI Service Account API Key

## What this is

A separate OpenAI API key provisioned under a service account for server-side automation on
GetSubmitReady.com, distinct from the personal OpenAI key.

## Secret reference

```yaml
secret_ref:
  id: "openai-service-account-api-key"
  status: "live"
  backend: "openai-platform"
  locator: "OpenAI Platform > API Keys (service account project)"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["server"]
  allowed_tools: ["getsubmitready-backend"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| `Documents/Getreviewreadycom/.env` | `OPENAI_SERVICE_ACCOUNT_API_KEY` |

## Scope

GetSubmitReady-only. Separate billing/quota from the personal OpenAI key.
