---
id: "secret-apple-developer-account"
aliases: ["secret-apple-developer-account", "apple-developer-account"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "scratch"
summary: "Reference for the Apple Developer account identity used for iOS app signing (adhd-os dashboard, getreviewready). Tracks rotation posture only; the value is never stored in this repo."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-06"
---

# Apple Developer Account

## What this is

The operator's Apple Developer Program identity, used to sign and distribute iOS apps built
on the [[scaleway-ios-cloud-mac]] build host. This credential is required for the ADHD-OS
dashboard and GetSubmitReady.com iOS shipping flows.

## Secret reference

```yaml
secret_ref:
  id: "apple-developer-account"
  status: "planned"
  backend: "apple-developer-program"
  locator: "Apple Developer > Account > Membership (Team ID: <your-apple-team-id>)"
  exposure_mode: "tool-only"
  allowed_runtimes: ["local-attended"]
  allowed_tools: ["scaleway-ios-cloud-mac"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Required operator action

1. Confirm the Apple Developer account email and Team ID.
2. Verify the Apple Developer Program membership is active and paid.
3. Register the signing certificates and provisioning profiles on the ScaleWay iOS Cloud Mac
   build host.
4. Set `status` to `active` and `last_rotated` to today once confirmed and any stale
   certificates are rotated.

## Scope

This identity is consumed exclusively by the ScaleWay iOS Cloud Mac build host
([[scaleway-ios-cloud-mac]]) to code-sign iOS apps for ad-hoc and App Store distribution.
It is not used for any server-side or web-facing service.
