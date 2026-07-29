---
id: "secret-browserbase-api-key"
aliases: ["secret-browserbase-api-key", "browserbase-api-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the Browserbase API key used for cloud browser automation via Hermes."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Browserbase API Key

## What this is

The Browserbase API key provides cloud-hosted browser sessions for Hermes Agent's browser automation
tool (page interaction, scraping, screenshots without local browser dependencies).

## Secret reference

```yaml
secret_ref:
  id: "browserbase-api-key"
  status: "live"
  backend: "browserbase-console"
  locator: "Browserbase Dashboard > Settings > API Keys"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["local-attended", "cloud-headless"]
  allowed_tools: ["hermes-agent"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key name |
|---------|----------|
| `~/.hermes/.env` | `BROWSERBASE_API_KEY` |
| `~/.hermes/profiles/fusion/.env` | `BROWSERBASE_API_KEY` |
| `~/.hermes/profiles/taloscontrol/.env` | `BROWSERBASE_API_KEY` |

## Scope

Hermes-only cloud browser automation. Session-based usage.
