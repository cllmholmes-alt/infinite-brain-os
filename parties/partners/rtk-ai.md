---
id: "partner-rtk-ai"
aliases: ["partner-rtk-ai", "rtk-ai", "rtk"]
type: "Party"
namespace: "personal-operator"
lifecycle_state: "research"
summary: "RTK-AI is the upstream organization behind RTK (Rust Token Killer), a Rust-based LLM proxy for token management and cost control. The operator consumes RTK as a proxy layer."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-06"
party_slug: "rtk-ai"
party_type: "partner"
display_name: "RTK-AI"
status: "active"
parent_party_slug: null
client_slug: null
brand_slug: null
namespace_slugs: []
department_slugs: []
tool_slugs: []
repo_slugs: ["rtk"]
notes: "Upstream org for the RTK LLM proxy. The operator uses RTK as a token management and cost control layer in front of LLM providers. The upstream project is written in Rust."
---

# RTK-AI

## Summary

RTK-AI is the upstream organization behind RTK (Rust Token Killer), a Rust-based LLM
proxy that manages token consumption, routing, and cost control across multiple LLM
providers. The operator uses RTK as a critical infrastructure layer to meter, route, and
optimize LLM usage. The upstream is tracked for releases, breaking API changes, and
security advisories.

## Type and scope

- `party_type`: partner (upstream open-source / vendor collaboration)
- primary scope: LLM proxy and token management infrastructure
- relationship: downstream consumer with operational dependency

## Related repos

- RTK (`cllmholmes-alt/RTK`): the operator's integration or fork of the upstream RTK
  proxy

## Notes

RTK sits in the hot path for all LLM calls. Upstream changes, especially to the routing
or token accounting logic, can have immediate operational impact. Monitor upstream
releases closely. The operator's `rtk` repo slug in the registry tracks this integration.
