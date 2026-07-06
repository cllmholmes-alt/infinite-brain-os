---
id: namespace-ai-media
name: ai-media
purpose: "The knowledge namespace for the ai-media domain: local-first AI media processing and generation spanning frame-level video upscaling, frame interpolation, and image generation via ComfyUI. Holds durable doctrine, pipeline architecture, and toolchain posture for the AI Video Upscaler, FluidFrames, GLM 5 Ultra Coder, and ComfyUI runtime. Canon is drafted at operator-pending until verified."
owner: the-operator
lifecycle_state: scratch
created: 2026-07-06
group: personal
retrieval_class: explicit
export_class: internal
default_visibility: private
tags: [namespace, personal, ai-media, local-first, video-upscaling, frame-interpolation, comfyui, media-generation]
supersedes: null
profile: doctrine
v2_status: upgraded
canon_posture: thin
freshness_posture: review-on-edit
archive_posture: none
reduced_base: false
expected_folders: [INDEX.md, canon, pillars, concepts, decisions, playbooks, support, synthesis]
brand_slug: null
notes: "Personal domain namespace created during 2026-07-06 namespace scaffolding. Covers the local AI media toolchain: AI Video Upscaler (OCNAI), FluidFrames (Djdefrag), GLM 5 Ultra Coder, and ComfyUI as shared runtime. Canon authored at verified_by operator-pending from repo READMEs."
---

# ai-media

## Summary

Serious namespace holding the durable doctrine for the ai-media domain: a local-first AI
media processing and generation toolchain. Its founding claim is that media enhancement and
generation run entirely on local hardware without paid cloud APIs. Covers the tool surface
(AI Video Upscaler, FluidFrames, GLM 5 Ultra Coder, and ComfyUI runtime). Canon is drafted,
not yet operator-verified.

## Defaults

| Field | Default |
|-------|---------|
| `lifecycle_state` on nodes | `scratch` |
| `retrieval_class` on nodes | `domain` |
| `export_class` on nodes | `internal` |

## Profile and folders

Profile: `doctrine` (Profile A, Doctrine / Conceptual Canon), serious base. Expected folders:
`INDEX.md`, `canon/`, `pillars/`, `concepts/`, `decisions/`, `playbooks/`, `support/`,
`synthesis/`.

- Carries the shared base plus the doctrine-profile folders.
- `canon_posture: thin`: `canon/core-doctrine.md`, `canon/README.md`, and
  `canon/agent-load-order.md` exist, authored at `verified_by: operator-pending`.
- `archive_posture: none`: source stays in the AI-media repos; this namespace points at them.

## Review posture

Freshness posture: `review-on-edit`. Toolchain doctrine is durable, not decaying state.
Review is triggered by edits, and canon edits require operator verification.

## Use for

- the domain's founding claim and tool posture
- the pipeline architecture and how the upscaler, interpolator, and ComfyUI interlink
- ingestion of high-value AI-media repo content into durable doctrine

## Do not use for

- live model weights or checkpoints (runtime toolchain directories)
- raw source code (stays in the AI-media repos; this namespace points at them)
- secrets (root `secrets/` registry holds references)

## Related surfaces

- Repos: to be registered in `repo-registry/` for each component as the domain is documented
