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

This entry covers the full set of LLM provider API keys fronted by rtk. Individual
provider keys are not tracked as separate secret entries unless a provider-specific
rotation schedule or scope divergence warrants it. The rtk proxy is the single chokepoint
for all agentic LLM consumption in this OS.
