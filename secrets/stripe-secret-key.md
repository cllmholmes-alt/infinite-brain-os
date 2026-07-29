---
id: "secret-stripe-secret-key"
aliases: ["secret-stripe-secret-key", "stripe-secret-key"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "active"
summary: "Reference for Stripe secret keys (live + test) used by ADHD-OS, GetSubmitReady, and webhook handling."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
---

# Stripe Secret Key

## What this is

Stripe API secret keys for payment processing across the operator's products. Includes restricted keys
(scoped to specific APIs) and webhook signing secrets.

## Secret reference

```yaml
secret_ref:
  id: "stripe-secret-key"
  status: "live"
  backend: "stripe-dashboard"
  locator: "Stripe Dashboard > Developers > API Keys"
  exposure_mode: "runtime-env"
  allowed_runtimes: ["server"]
  allowed_tools: ["adhd-os-dashboard", "getsubmitready-backend"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Where the value lives

| Surface | Key names | Account |
|---------|-----------|---------|
| `Documents/Figmaadhdosuserdashboard/.env` | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | ADHD-OS |
| `Documents/Getreviewreadycom/.env` | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_RESTRICTED_KEY` | GetSubmitReady |
| macOS Keychain | `uk.co.adhdos.stripe-webhook` | ADHD-OS webhook |

## Scope

Two Stripe accounts (ADHD-OS UK Ltd and GetSubmitReady). The GetSubmitReady `.env` contains a
restricted key with scoped API permissions. ADHD-OS webhook signing secret is also in Keychain.
