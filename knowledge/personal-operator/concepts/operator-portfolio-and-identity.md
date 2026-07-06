---
id: "knowledge-personal-operator-concepts-operator-portfolio-and-identity"
aliases: ["knowledge-personal-operator-concepts-operator-portfolio-and-identity", "operator-portfolio-and-identity", "operator-identity-map"]
type: "Knowledge"
namespace: "personal-operator"
lifecycle_state: "research"
summary: "The operator's portfolio and GitHub identity map, confirmed during the 2026-07-05 Hive-Mind integration. The operator is cllmholmes (GitHub cllmholmes-alt); starmynd-org is the upstream origin this brain was cloned from, not the operator's company. Lists the collaborative orgs in use and points at the system map and repo registry."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
verified_at: "2026-07-05"
verified_by: "operator-confirmed-in-session"
edges:
  - target: "[[operator-profile]]"
    relation: "elaborates"
    confidence: 0.85
  - target: "[[personal-operator-core-doctrine]]"
    relation: "references"
    confidence: 0.8
created: "2026-07-05"
---

# Operator portfolio and identity

## The operator

The operator is `cllmholmes`. The primary GitHub account is `cllmholmes-alt`, which owns most
of the portfolio. This is the identity the brain treats as the internal operator, modeled
here in `personal-operator`.

## The brain's upstream origin

`starmynd-org` is the upstream origin this brain (`infinite-brain-os`) was cloned from. It is
the starter's author, not the operator's company. Do not model `starmynd` as an owned party
or brand. The brain is the operator's working copy, diverging from the starter as the
portfolio is integrated.

## Collaborative orgs in use

The portfolio references a few orgs the operator works with or through:

- `OCNAI`: the upstream of `AI-video-upscaler`
- `openclaw`: the upstream of OpenClaw, forked by the operator as NemoClaw
- `rtk-ai`: the upstream of RTK

These are collaborators or upstreams, tracked in `repo-registry/` entries, not owned brands.

## Where the portfolio lives

The full portfolio, grouped by domain cluster with dependency and data-flow edges, is in the
root `system-map.md`. One entry per system lives in `repo-registry/`. Product brands
(`adhd-os`, `talos`) live in `parties/brands/`. This concept node is the identity pointer;
the system map is the topology.

## What does not live here

The subjective operator-tuning values (deep-work windows, communication style, risk posture,
the approve/want/ignore item classes) remain operator-input-required in [[operator-profile]]
and the tuning decisions. They are set by the operator as logged decisions, never guessed by
an agent.
