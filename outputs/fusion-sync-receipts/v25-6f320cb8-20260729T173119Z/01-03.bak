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

- Release: v24-e6fc9de8-20260729T170346Z
- Runtime commit: e6fc9de834ab8ac8f2b4cace31683936b01c8db4
- Evidence commit: 71752941942f0792949c62e6545b684ea72a71d9
- Frozen binding: sha256:90d4ff5eba0138af43aaf2659723d9d884883b22737d5b64aabf5a77ad9ca5ee
- Files: 6374
- Rollback: v23-bfb13630-20260729T164820Z
- Packet: sha256:4786ad908827d76e83edf50428015691db3ff748fe6b791ab1285bc2df113e0a

## Runtime contract

Fusion owns the run lifecycle, approvals, evidence, and release identity. Infinite Brain
stores curated durable knowledge. Hermes, Cursor, OpenDesign, CLI, and compatible HTTP
clients are adapters to the same Fusion run boundary and do not create parallel authority.
