---
id: "secret-cursor-access-token"
aliases: ["secret-cursor-access-token", "cursor-token"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for Cursor IDE access token stored in macOS Keychain."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Cursor Access Token

## What this is

The Cursor IDE access token for the operator's Cursor account. Used for AI-assisted code editing
and the Composer subagent system referenced in the TALOS workflow.

## Secret reference

```yaml
secret_ref:
  id: "cursor-access-token"
  status: "live"
  backend: "macos-keychain"
  locator: "macOS Keychain > 'cursor-access-token' and 'Cursor Safe Storage'"
  exposure_mode: "tool-only"
  allowed_runtimes: ["local-attended"]
  allowed_tools: ["cursor-ide"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Description |
|---------|-------------|
| macOS Keychain | `cursor-access-token`, `Cursor Safe Storage` |

## Scope

Cursor IDE only. No server-side or CI usage.
