# ai-media

This is the knowledge namespace for the `ai-media` domain: local-first AI media processing and
generation, spanning frame-level video upscaling, frame interpolation, and image generation via
ComfyUI, with a strong no-cloud-dependency posture. It holds the durable doctrine, the founding
pillar, and the component architecture of the local AI media toolchain.

It is a serious retrieval target with a thin canon layer, drafted at `operator-pending` until
the operator verifies it. Source content from the AI-media repos is ingested selectively into
`support/` and promoted toward `synthesis/` and canon only on operator approval.

## Profile

Doctrine profile, serious base. `canon_posture: thin`, `archive_posture: none`,
`freshness_posture: review-on-edit`. Carries the shared base (`INDEX.md`, `canon/`,
`playbooks/`, `support/`, `synthesis/`) plus the doctrine-profile folders (`pillars/`,
`concepts/`, `decisions/`). The profile model is explained in [[namespace-profiles]] and
[[profile-aware-knowledge-graph-design]]. The operative registry entry is
`_system/namespaces/ai-media.md`.

## Load first

1. [[ai-media-core-doctrine]]: the compressed model of what the ai-media domain is, its
   founding claim, and its tool surface. Read it whole before expanding.
2. [[agent-load-order]]: the load-order controller, by query class.

## What is here

- [[local-first-no-cloud-dependency]]: the foundational pillar. Media enhancement and
  generation run entirely on local hardware without reliance on paid cloud APIs. Everything
  else in the domain derives from this.
- Tool architecture and pipeline design grow in `concepts/` and `decisions/` as the domain
  is documented.
- Source material from the AI-media repos lands in `support/` (provenance) and is promoted
  to `synthesis/` as best-current-reading.

## Components (the tool surface)

- AI Video Upscaler (`C:\Projects\AI-video-upscaler`): Python-based local video upscaling
  that splits videos to frames, AI-enhances each frame, and recombines into high-quality
  upscaled video. Built by OCNAI.
- FluidFrames (`C:\Projects\FluidFrames`): Windows frame interpolation app powered by RIFE
  AI for frame-generated and slow-motion video. Built by Djdefrag.
- GLM 5 Ultra Coder (`C:\Projects\GLM 5 - Ultra Coder`): web UI chat frontend for the GLM
  5.2 model via Puter.com, providing local AI coding assistance.
- ComfyUI: the shared runtime for image and video generation, serving as the execution
  backbone for generative pipelines.

## What this namespace drives

- the domain's design and behavior canon (local-first processing, pipeline architecture,
  tool compatibility rules)
- the toolchain architecture map (how the upscaler, interpolator, and ComfyUI interlink)
- ingestion of high-value repo content into durable doctrine

## What does not live here

Per [[surface-boundary]]: live model weights and checkpoints stay in their runtime
directories. Raw source code stays in the AI-media repos; this namespace points at them.
Secrets stay in the root `secrets/` registry as references.

## Map

```text
knowledge/ai-media/
  INDEX.md                       # this router
  canon/
    README.md                    # what canon means here (navigational)
    core-doctrine.md             # the keystone (knowledge node, operator-pending)
    agent-load-order.md          # load order by query class (navigational)
  pillars/
    local-first-no-cloud-dependency.md  # the foundational claim (knowledge node)
  concepts/                      # grows as the toolchain is documented
  decisions/                     # grows as design decisions are made
  playbooks/                     # repeatable procedures
  support/                       # provenance for ingested repo content
  synthesis/                     # derived reading and canon-candidates
```
