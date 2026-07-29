---
id: "secret-telegram-bot-token"
aliases: ["secret-telegram-bot-token", "telegram-bot-token"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for the Telegram bot token used by Hermes Agent gateway on @TalosAgenticHermes_bot."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Telegram Bot Token

## What this is

The Telegram bot token authenticates the Hermes Agent gateway bot (@TalosAgenticHermes_bot, ID 8815129482).
This is the primary conversational interface for the operator's agentic systems.

## Secret reference

```yaml
secret_ref:
  id: "telegram-bot-token"
  status: "live"
  backend: "telegram-botfather"
  locator: "Telegram > @BotFather > /token for @TalosAgenticHermes_bot"
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
| `~/.hermes/.env` | `TELEGRAM_BOT_TOKEN` |
| `~/.hermes/profiles/fusion/.env` | `TELEGRAM_BOT_TOKEN` |
| `~/.hermes/profiles/taloscontrol/.env` | `TELEGRAM_BOT_TOKEN` |

## Scope

Hermes gateway bot. Bot ID: 8815129482, handle: @TalosAgenticHermes_bot.
