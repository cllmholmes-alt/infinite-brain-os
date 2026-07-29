---
id: "secret-google-workspace-credentials"
aliases: ["secret-google-workspace-credentials", "google-workspace-admin", "gmail-admin"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for Google Workspace admin credentials (email + password + MFA) used by GetSubmitReady.com."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Google Workspace Admin Credentials

## What this is

Google Workspace admin account credentials for the GetSubmitReady.com domain. Includes admin email,
password, and MFA backup code. Used for Google Workspace API integration (Calendar, Gmail, Drive,
Sheets) in the GetSubmitReady backend.

## Secret reference

```yaml
secret_ref:
  id: "google-workspace-credentials"
  status: "live"
  backend: "plaintext-env-and-google-account"
  locator: "Documents/Getreviewreadycom/.env (GOOGLE_CLIENT_EMAIL, GOOGLE_ADMIN_EMAIL, GOOGLE_PASSWORD, GOOGLE_MFA_BACKUP_CODE)"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["server"]
  allowed_tools: ["getsubmitready-backend"]
  allowed_workflows: []
  scope_class: "getsubmitready"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key names |
|---------|-----------|
| `Documents/Getreviewreadycom/.env` | `GOOGLE_CLIENT_EMAIL`, `GOOGLE_ADMIN_EMAIL`, `GOOGLE_PASSWORD`, `GOOGLE_MFA_BACKUP_CODE` |
| macOS Keychain | `gmail.com` (partial) |

## ⚠️ Security flag

**HIGHEST SENSITIVITY.** This is a full admin credential set - email, password, and MFA backup code
in plaintext. If this .env is ever committed or leaked, the entire Google Workspace domain is
compromised. Recommend: move to macOS Keychain or a secrets manager, remove from plaintext .env.
