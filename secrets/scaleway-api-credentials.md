---
id: "secret-scaleway-api-credentials"
aliases: ["secret-scaleway-api-credentials", "scaleway-api-credentials"]
type: "Secret"
namespace: "personal-operator"
lifecycle_state: "scratch"
summary: "Reference for ScaleWay API credentials used to provision and manage the iOS Cloud Mac build host. Tracks rotation posture only; the value is never stored in this repo."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-06"
---

# ScaleWay API Credentials

## What this is

ScaleWay API credentials (access key and secret key) that authorize the operator to
provision, start, stop, and manage the remote macOS instance used as the iOS Cloud Mac
build host ([[scaleway-ios-cloud-mac]]). These credentials control the compute resource
that is load-bearing for the iOS app shipping flow.

## Secret reference

```yaml
secret_ref:
  id: "scaleway-api-credentials"
  status: "planned"
  backend: "scaleway-console"
  locator: "ScaleWay Console > IAM > API Keys (project: <your-scaleway-project-id>)"
  exposure_mode: "tool-only"
  allowed_runtimes: ["local-attended"]
  allowed_tools: ["scaleway-cli", "scaleway-ios-cloud-mac"]
  allowed_workflows: []
  scope_class: "personal-operator"
  rotation_class: "manual"
  last_rotated: "unknown"
```

## Required operator action

1. Confirm the ScaleWay organization and project ID that owns the iOS Cloud Mac instance.
2. Verify the IAM policy attached to the API key is scoped to the minimum required
   permissions (instance management only, not full organization admin).
3. Rotate the API key from the ScaleWay Console if it has not been rotated recently.
4. Set `status` to `active` and `last_rotated` to today once confirmed and rotated.

## Scope

These credentials are scoped to the ScaleWay project that hosts the remote macOS build
instance. They should grant instance lifecycle permissions (create, start, stop, delete)
and nothing beyond that. They are consumed by local operator tooling and the
[[scaleway-ios-cloud-mac]] provisioning path.
