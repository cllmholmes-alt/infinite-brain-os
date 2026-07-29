---
id: "secret-crm-credentials"
aliases: ["secret-crm-credentials", "crm-api-key", "getsubmitready-crm"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for CRM API credentials used by GetSubmitReady.com for customer management."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# CRM Credentials

## What this is

CRM platform API credentials for customer relationship management in GetSubmitReady.com. Also stored
in macOS Keychain.

## Secret reference

```yaml
secret_ref:
  id: "crm-credentials"
  status: "live"
  backend: "crm-platform-and-macos-keychain"
  locator: "Documents/Getreviewreadycom/.env (CRM_API_KEY); macOS Keychain 'GetSubmitReady CRM'"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["server"]
  allowed_tools: ["getsubmitready-backend"]
  allowed_workflows: []
  scope_class: "getsubmitready"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| `Documents/Getreviewreadycom/.env` | `CRM_API_KEY` + related CRM config |
| macOS Keychain | `GetSubmitReady CRM` |

## Scope

GetSubmitReady-only. The keychain entry mirrors the .env value.
