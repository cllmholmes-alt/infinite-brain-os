---
id: "secret-llm-provider-api-keys"
aliases: ["secret-llm-provider-api-keys", "llm-provider-api-keys"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "scratch"
summary: "Reference for API keys of LLM providers consumed by agentic systems (TALOS, openclaw, odysseus), fronted by rtk. Tracks rotation posture only; the values are never stored in this repo."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-06"
---

# LLM Provider API Keys

## What this is

API keys for one or more LLM providers (e.g. OpenAI, Anthropic, Google, OpenRouter) that
are consumed by the operator's agentic systems: TALOS, openclaw, and odysseus. These keys
are fronted by rtk, the operator's local LLM routing proxy, which multiplexes requests
across providers and enforces rate limits and cost controls.

## Secret reference

```yaml
secret_ref:
  id: "llm-provider-api-keys"
  status: "planned"
  backend: "provider-consoles-and-rtk-config"
  locator: "Each provider's API key page (OpenAI dashboard, Anthropic Console, etc.), loaded into rtk configuration at runtime"
  exposure_mode: "tool-only"
  allowed_runtimes: ["local-attended"]
  allowed_tools: ["rtk"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Required operator action

1. Inventory every active LLM provider API key consumed by rtk (OpenAI, Anthropic, Google,
   OpenRouter, and any others).
2. Verify each key has appropriate usage limits and billing alerts configured in the
   provider console.
3. Rotate any key that has not been rotated in the last 90 days.
4. Confirm rtk is the sole consumer: no agentic system bypasses rtk to call a provider
   directly.
5. Set `status` to `active` and `last_rotated` to today once all keys are confirmed and
   rotated.

## Scope

This is the **aggregate reference** for LLM provider keys. Individual provider entries now exist
as separate files in this registry. The rtk proxy was the originally planned chokepoint; in practice,
keys are distributed across `.env` files and Hermes `auth.json` directly.

### Individual entries

| Provider | Entry | Status |
|----------|-------|--------|
| GLM / Z.AI | [glm-zai-api-key.md](glm-zai-api-key.md) | Active (primary model) |
| DeepSeek | [deepseek-api-key.md](deepseek-api-key.md) | Active |
| DeepSeek (backup) | [deepseek-backup-api-key.md](deepseek-backup-api-key.md) | Active (failover) |
| OpenAI | [openai-api-key.md](openai-api-key.md) | Active |
| OpenAI (service) | [openai-service-account-api-key.md](openai-service-account-api-key.md) | Active |
| Anthropic | [anthropic-api-key.md](anthropic-api-key.md) | Active |
| Moonshot / Kimi | [moonshot-kimi-api-key.md](moonshot-kimi-api-key.md) | Active |
| OpenRouter | [openrouter-api-key.md](openrouter-api-key.md) | Active |
