---
id: "secret-anthropic-api-key"
aliases: ["secret-anthropic-api-key", "anthropic-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the Anthropic API key used by Hermes Agent for Claude models."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Anthropic API Key

## What this is

The Anthropic API key for Claude model access via Hermes Agent. Registered as the `anthropic` provider
in Hermes auth.json credential pool.

## Secret reference

```yaml
secret_ref:
  id: "anthropic-api-key"
  status: "live"
  backend: "anthropic-console"
  locator: "Anthropic Console > API Keys"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended"]
  allowed_tools: ["hermes-agent"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| Hermes `auth.json` | provider: `anthropic` |
| macOS Keychain | `Claude Code-credentials`, `Claude Code-credentials-24ce8e2b` |

## Scope

Hermes-only provider. The keychain entries are Claude Code (cursor/CLI) client secrets, separate
from the API key but same platform account.
