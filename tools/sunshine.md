---
id: "tool-sunshine"
aliases: ["tool-sunshine", "sunshine"]
type: "Tool"
namespace: "personal-operator"
lifecycle_state: "research"
summary: "Sunshine, the LizardByte game-stream host. Streams desktop and game content to Moonlight clients over the local network."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
tool_type: "runtime"
tool_status: "planned"
departments: []
related_namespaces: []
party_slugs: []
client_slug: null
brand_slug: null
created: "2026-07-06"
---

# Sunshine

## What this tool does

Sunshine is an open-source game-stream host from the LizardByte project. It
captures and encodes the display output of the host machine and serves it as a
low-latency video stream that Moonlight clients can consume. It supports H.264
and HEVC hardware encoding via GPU-accelerated codecs.

## Why it matters in this OS

Sunshine enables remote access to the operator's desktop and game runtime
environment from low-power client devices. It is the host-side component of the
operator's streaming setup and is paired with a Moonlight client on the
receiving device.

## System fit class

`os-operational-tool` (shared streaming capability, personal-infra layer).

## Runtime and source location

- Local install: `C:\Projects\Sunshine`
- Stack: C++ with platform-specific GPU-encoding backends (NVENC, AMF, VAAPI,
  VideoToolbox)
- Runtime: system service or tray application

## Auth and credential boundary

Client pairing is handled by a PIN exchange over the local network. No external
credentials are required. Do not expose the Sunshine web UI outside the local
network segment.

## Risks and limitations

- Streaming quality and latency are network-bound; a wired Ethernet connection
  is preferred for the host.
- GPU encoder availability varies by hardware vendor and driver version.
- Port forwarding to expose Sunshine beyond the LAN introduces security risk
  and is not recommended without a VPN.

## Next integration step

Document the Moonlight client pairing procedure and link this tool from the
`personal-infra` department.
