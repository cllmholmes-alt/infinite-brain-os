# adhd-os

This is the knowledge namespace for the ADHD-OS product brand: a calm, institutional,
cognitive-load-reducing behavioral executive-function operating system. It holds the durable
doctrine, design intent, and architecture of the product and its components (the master
reference database, the alternative design, two websites, and the Expo dashboard app).

It is a serious retrieval target with a thin canon layer, drafted at `operator-pending` until
the operator verifies it. Source content from the ADHD-OS repos is ingested selectively into
`support/` and promoted toward `synthesis/` and canon only on operator approval.

## Profile

Doctrine profile, serious base. `canon_posture: thin`, `archive_posture: none`,
`freshness_posture: review-on-edit`. Carries the shared base (`INDEX.md`, `canon/`,
`playbooks/`, `support/`, `synthesis/`) plus the doctrine-profile folders (`pillars/`,
`concepts/`, `decisions/`). The profile model is explained in [[namespace-profiles]] and
[[profile-aware-knowledge-graph-design]]. The operative registry entry is
`_system/namespaces/adhd-os.md`.

## Load first

1. [[adhd-os-core-doctrine]]: the compressed model of what ADHD-OS is, its founding claim,
   and its product surface. Read it whole before expanding.
2. [[agent-load-order]]: the load-order controller, by query class.

## What is here

- [[cognitive-load-is-structural]]: the foundational pillar. Cognitive load is a structural
  issue, not a moral failing. Everything else in the product derives from this.
- Component architecture and design intent grow in `concepts/` and `decisions/` as the
  product is documented.
- Source material from the ADHD-OS repos lands in `support/` (provenance) and is promoted to
  `synthesis/` as best-current-reading.

## Components (the product surface)

- Master Reference Database: the canonical content and data backbone.
- Alternative Design: an alternate design direction under evaluation.
- ADHD-Money-Website: the money or monetization surface.
- AdhdosArtsyledWebsite: the main website (Vite), generated from the Figma source of truth.
- User Dashboard: the Expo mobile app, the capacity-aware execution layer.

See `parties/brands/adhd-os.md` for brand identity and `repo-registry/` for per-component
ownership and posture.

## What this namespace drives

- the product's design and behavior canon (what calms, what reduces load, what is forbidden)
- the component architecture map (how the database, websites, and app interlink)
- ingestion of high-value repo content into durable doctrine

## What does not live here

Per [[surface-boundary]]: live user state, app telemetry, and analytics stay in the runtime
backend. Raw source code and Figma files stay in their repos; this namespace points at them.
Secrets (Stripe, auth, Apple Developer) stay in the root `secrets/` registry as references.

## Map

```text
knowledge/adhd-os/
  INDEX.md                       # this router
  canon/
    README.md                    # what canon means here (navigational)
    core-doctrine.md             # the keystone (knowledge node, operator-pending)
    agent-load-order.md          # load order by query class (navigational)
  pillars/
    cognitive-load-is-structural.md   # the foundational claim (knowledge node)
  concepts/                      # grows as the product is documented
  decisions/                     # grows as design decisions are made
  playbooks/                     # repeatable procedures
  support/                       # provenance for ingested repo content
  synthesis/                     # derived reading and canon-candidates
```
