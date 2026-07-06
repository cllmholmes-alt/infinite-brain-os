---
id: "secret-stripe-secret-key"
aliases: ["secret-stripe-secret-key", "stripe-secret-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "scratch"
summary: "Reference for the Stripe secret key used by the GetSubmitReady.com paid checkout flow. Tracks rotation posture only; the value is never stored in this repo."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-06"
---

# Stripe Secret Key (GetSubmitReady.com)

## What this is

The Stripe secret key (`sk_live_*` or `sk_test_*`) that powers the paid checkout flow on
GetSubmitReady.com. This key authorizes server-side Stripe API calls to create payment
intents, manage subscriptions, and process webhooks.

## Secret reference

```yaml
secret_ref:
  id: "stripe-secret-key"
  status: "planned"
  backend: "stripe-dashboard"
  locator: "Stripe Dashboard > Developers > API keys > Secret key (getreviewreadycom)"
  exposure_mode: "tool-only"
  allowed_runtimes: ["local-attended", "server"]
  allowed_tools: ["stripe-cli", "stripe-sdk"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Required operator action

1. Confirm the Stripe account associated with GetSubmitReady.com is active.
2. Verify which Stripe key mode is in use (test or live) and that the webhook signing secret
   matches.
3. If the key has not been rotated recently, generate a new secret key from the Stripe
   Dashboard and roll it across all consumers.
4. Set `status` to `active` and `last_rotated` to today once confirmed and rotated.

## Scope

This key is scoped to the GetSubmitReady.com Stripe account and authorizes server-side
payment operations only. It must never be exposed client-side. The publishable key
(`pk_*`) is not tracked here because it is public-facing by design.
