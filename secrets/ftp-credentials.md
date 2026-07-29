---
id: "secret-ftp-credentials"
aliases: ["secret-ftp-credentials", "ftp-credentials"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for FTP server credentials used by GetSubmitReady.com for file transfer automation."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# FTP Credentials

## What this is

FTP server credentials for file transfer operations in GetSubmitReady.com. Multiple FTP endpoints
are configured for different submission/delivery workflows.

## Secret reference

```yaml
secret_ref:
  id: "ftp-credentials"
  status: "live"
  backend: "plaintext-env"
  locator: "Documents/Getreviewreadycom/.env (FTP_HOST, FTP_USER, FTP_PASS, etc.)"
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
| `Documents/Getreviewreadycom/.env` | `FTP_HOST`, `FTP_USER`, `FTP_PASS` + 5 additional FTP endpoint entries |

## Scope

GetSubmitReady-only. Multiple FTP endpoints - 8 entries total. Recommend consolidating into
keychain entries or a secrets manager.
