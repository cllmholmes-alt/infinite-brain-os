---
id: "secret-codex-auth-token"
aliases: ["secret-codex-auth-token", "codex-auth"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for OpenAI Codex auth token stored in macOS Keychain."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Codex Auth Token

## What this is

The OpenAI Codex CLI auth token for code generation via the Codex CLI tool. Registered as the
`openai-codex` provider in Hermes auth.json and stored in macOS Keychain.

## Secret reference

```yaml
secret_ref:
  id: "codex-auth-token"
  status: "live"
  backend: "macos-keychain"
  locator: "macOS Keychain > 'Codex Auth'"
  exposure_mode: "tool-only"
  allowed_runtimes: ["local-attended"]
  allowed_tools: ["codex-cli", "hermes-agent"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Description |
|---------|-------------|
| macOS Keychain | `Codex Auth` |
| Hermes `auth.json` | provider: `openai-codex` |

## Scope

Codex CLI and Hermes delegation target. Separate from the OpenAI API key.
