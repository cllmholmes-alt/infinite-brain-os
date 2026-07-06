---
id: "repo-registry-rtk"
aliases: ["repo-registry-rtk", "rtk", "rust-token-killer"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "RTK, the Rust Token Killer: a high-performance CLI proxy that reduces LLM token consumption by 60 to 90 percent. Owned by cllmholmes-alt, upstream rtk-ai. Rust, Apache 2.0."
confidence: 0.88
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-05"
---

# Repo: rtk

## Repo Identity

- Repo slug: `rtk`
- Canonical path: `C:\Projects\rtk`
- Remote: `github.com/cllmholmes-alt/rtk.git`
- Version control: git
- Stack: Rust (`Cargo.toml`)
- Sibling folder: `C:\Projects\rtk part 2` (local, Cargo; possibly a branch, fork, or
  companion experiment)

## Primary Job

A high-performance CLI proxy that reduces LLM token consumption by 60 to 90 percent. Sits
between LLM clients and providers. Apache 2.0 licensed, available on Homebrew.

## Current Registry Status

- Working status: `supporting`
- Operator confirmation required: yes (confirm whether this is owned, forked, or upstream
  tracking)

## Department Linkage

- Working primary owning department: `devops-platform` (planned; rtk is cross-cutting
  cost infrastructure for all agentic work)

## Related Surfaces

- Related namespaces: candidate tool-contract namespace for the RTK API
- Related tools: all LLM-backed systems (TALOS, openclaw, odysseus) could consume rtk

## Digestion or Migration Posture

- Working posture: `supporting` (potentially load-bearing platform tooling)

## Open Decisions and Risks

- Clarify operator's role: contributor, maintainer, or consumer of rtk-ai.
- Clarify the `rtk part 2` folder relationship.
