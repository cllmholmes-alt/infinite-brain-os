---
id: "repo-registry-hermes-agent"
aliases: ["repo-registry-hermes-agent", "hermes-agent", "hermes"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "Hermes is a thin operator client of Fusion with a generated digest-bound memory cache."
confidence: 1
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
edges:
  - relation: "client-of"
    target: "[[repo-registry-fusion-runtime]]"
    confidence: 1
  - relation: "connects-to"
    target: "[[repo-registry-netcup-vps]]"
    confidence: 0.95
---

# Repo: hermes-agent

Hermes supplies desktop, CLI, Telegram, schedule, and gateway input surfaces. Its `fusion`
profile is a thin client to the canonical Fusion runtime. It does not manage Fusion,
approve protected actions, or own durable truth.

Hermes built-in memory is a generated cache sourced from Infinite Brain and current Fusion
release evidence. The cache must carry and verify packet digest sha256:4786ad908827d76e83edf50428015691db3ff748fe6b791ab1285bc2df113e0a.

## Current posture

- Profile: `fusion`
- Gateway: managed by Hermes and required to be active
- Fusion route: authenticated private control-plane path
- Knowledge authority: Infinite Brain
- Runtime authority: Fusion
- Cache refresh: every verified Fusion release and every promoted relevant brain change
