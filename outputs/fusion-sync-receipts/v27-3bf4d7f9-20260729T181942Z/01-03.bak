---
id: "repo-registry-fusion-runtime"
aliases: ["repo-registry-fusion-runtime", "fusion-runtime", "fusion-api", "fusion"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "Fusion is the private operator-facing governed agent runtime, deployed as immutable releases on the Netcup VPS."
confidence: 1
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-29"
edges:
  - relation: "depends-on"
    target: "[[repo-registry-netcup-vps]]"
    confidence: 1
  - relation: "serves"
    target: "[[repo-registry-hermes-agent]]"
    confidence: 1
---

# Repo: fusion-runtime

## Identity and authority

- Repo: `github.com/cllmholmes-alt/fusion-harness.git`
- Canonical branch: `main`
- Canonical worktree: `/Users/callumholmes/Documents/fusion-harness`
- Role: sole normal operator-facing identity and governed execution boundary
- Network posture: private-only through loopback and authenticated SSH tunnel paths
- Public edge: blocked pending protected review and explicit operator promotion

## Current verified release

- Release: v25-6f320cb8-20260729T173119Z
- Runtime commit: 6f320cb8f0c8faf503ac4d26d6f81162973f44d2
- Evidence commit: 786c49614cf6bcdaeedf459f10959533aac397c2
- Frozen binding: sha256:b2f58b6f4b7c1baf08191921f2147b43da22abee257a6b9bb0767f699856483c
- Files: 6375
- Rollback: v24-e6fc9de8-20260729T170346Z
- Packet: sha256:97bdf19c6f23c17296da75b80030c8afef9ed6e2d5b212aa898f948065d8062a

## Runtime contract

Fusion owns the run lifecycle, approvals, evidence, and release identity. Infinite Brain
stores curated durable knowledge. Hermes, Cursor, OpenDesign, CLI, and compatible HTTP
clients are adapters to the same Fusion run boundary and do not create parallel authority.
