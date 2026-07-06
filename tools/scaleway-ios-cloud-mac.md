---
id: "tool-scaleway-ios-cloud-mac"
aliases: ["tool-scaleway-ios-cloud-mac", "scaleway-ios-cloud-mac", "ios-cloud-mac"]
type: "Tool"
namespace: "personal-operator"
lifecycle_state: "research"
summary: "A remote macOS build host on ScaleWay used to build and sign iOS apps for the operator's mobile products. Load-bearing for the iOS app shipping flow."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
tool_type: "build-host"
tool_status: "planned"
departments: []
related_namespaces: []
party_slugs: []
client_slug: null
brand_slug: null
created: "2026-07-05"
---

# ScaleWay IOS Cloud Mac

## What this tool does

A remote macOS instance hosted on ScaleWay, used as an iOS build and signing host. It is
the place where Expo or Xcode builds for the operator's mobile apps (notably the ADHD-OS
dashboard) are compiled and signed for iOS distribution.

## Why it matters in this OS

The operator ships iOS apps. A remote Mac is required to build and sign them without local
Apple hardware. This tool is load-bearing for the `adhd-os` and `getreviewreadycom` shipping
flows.

## System fit class

`department-local-tool` (candidate: `adhd-os-product`, `devops-platform`).

## Runtime and source location

- Local reference folder: `C:\Projects\ScaleWay IOS Cloud Mac`
- Backend: ScaleWay cloud (remote macOS instance)
- Access: remote desktop or SSH

## Auth and credential boundary

ScaleWay API credentials and any Apple Developer signing keys live in the external secret
backend, referenced from `secrets/`, never inlined. The Apple Developer account is a
separate party/credential to register.

## Risks and limitations

- Remote host uptime and cost posture affect release cadence.
- Apple code-signing cert rotation must be tracked in `secrets/`.

## Next integration step

Register the Apple Developer identity as a party or credential reference and link it here.
