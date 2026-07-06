---
id: "partner-openclaw"
aliases: ["partner-openclaw", "openclaw"]
type: "Party"
namespace: "personal-operator"
lifecycle_state: "research"
summary: "OpenClaw is the upstream open-source organization behind the OpenClaw project, an AI agent framework. The operator maintains a fork named NemoClaw."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-06"
party_slug: "openclaw"
party_type: "partner"
display_name: "OpenClaw"
status: "active"
parent_party_slug: null
client_slug: null
brand_slug: null
namespace_slugs: []
department_slugs: []
tool_slugs: []
repo_slugs: ["openclaw", "nemoclaw"]
notes: "Upstream org for the OpenClaw AI agent framework. The operator forks it as NemoClaw with custom modifications. Track this party to monitor upstream releases and merge decisions."
---

# OpenClaw

## Summary

OpenClaw is an upstream open-source organization that produces the OpenClaw AI agent
framework. The operator maintains a downstream fork, NemoClaw, which carries custom
modifications and integrations specific to the operator's stack. Tracking the upstream
org ensures the operator can monitor releases, security patches, and breaking changes
before merging into the fork.

## Type and scope

- `party_type`: partner (upstream open-source collaborator)
- primary scope: AI agent framework
- relationship: downstream fork with upstream tracking

## Related repos

- OpenClaw (upstream, tracked for releases and upstream changes)
- NemoClaw (`cllmholmes-alt/NemoClaw`): the operator's fork with custom modifications

## Notes

Merge discipline is critical: upstream changes must be reviewed before landing in
NemoClaw. The fork exists to carry operator-specific features that may or may not be
suitable for upstream contribution. The `openclaw` repo slug in the registry tracks the
upstream, while `nemoclaw` is the working fork.
