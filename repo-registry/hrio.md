---
id: "repo-registry-hrio"
aliases: ["repo-registry-hrio", "hrio", "hermes-revenue-intelligence-os"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "Hermes Revenue Intelligence OS (HRIO): converts live Reddit pain signals into approved, tracked revenue opportunities. Human-in-the-loop at the payment gate. Dockerized. Owned by cllmholmes-alt."
confidence: 0.9
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-05"
---

# Repo: hrio

## Repo Identity

- Repo slug: `hrio`
- Canonical path: `C:\Projects\Hermes Revenue Intelligence OS (HRIO)`
- Remote: `github.com/cllmholmes-alt/Hermes-Revenue-Intelligence-OS-HRIO-.git`
- Version control: git
- Stack: Node (`package.json`), Docker Compose

## Primary Job

A revenue intelligence pipeline. Core flow: Reddit scan, filter, score, classify, draft,
CRM lead, track, qualify, then a manual payment gate. Deliberately not a Reddit bot: it
drafts and tracks, and a human approves all external posting, DMs, payment links, and
production money actions.

## Current Registry Status

- Working status: `primary`
- Operator confirmation required: yes

## Department Linkage

- Working primary owning department: `revenue-intelligence` (planned, Phase 3/4)

## Related Surfaces

- Related namespaces: `knowledge/revenue-intelligence/` (planned; a `data-system` profile
  candidate once metrics are live)
- Related repos: `getreviewreadycom`, `instantpdf-farm-business` (revenue/business cluster)

## Digestion or Migration Posture

- Working posture: `primary` (its scoring and qualification logic is high-value doctrine)

## Open Decisions and Risks

- Strong candidate for the metric primitive (lead score, qualification rate, conversion).
- Confirm the CRM backend it integrates with.
