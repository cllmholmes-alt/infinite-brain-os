---
id: "knowledge-ai-media-canon-core-doctrine"
aliases: ["knowledge-ai-media-canon-core-doctrine", "ai-media-core-doctrine", "ai-media-doctrine"]
type: "Knowledge"
namespace: "ai-media"
lifecycle_state: "scratch"
summary: "Drafted core doctrine for the ai-media namespace: a local-first AI media processing and generation domain spanning frame-level video upscaling, frame interpolation, and image generation via ComfyUI. The founding claim is that media enhancement and generation run entirely on local hardware without paid cloud APIs. Covers the founding claim, the tool posture, and the component surface. Authored at operator-pending until the operator verifies it."
confidence: 0.7
retrieval_class: "identity"
export_class: "internal"
verified_at: "2026-07-06"
verified_by: "operator-pending"
edges:
  - target: "[[local-first-no-cloud-dependency]]"
    relation: "derived_from"
    confidence: 0.9
  - target: "[[namespace-profiles]]"
    relation: "references"
    confidence: 0.7
created: "2026-07-06"
---

## Read this first

This is the drafted canon of the `ai-media` namespace. It is authored at
`operator-pending`: an agent drafted it from the AI-media repos during the 2026-07-06
namespace scaffolding. The operator must verify it before it becomes real canon. Read it
whole, then expand into the pillar and the component material as the query demands.

## What ai-media is

The ai-media domain is a local-first AI media processing and generation toolchain. It
synthesizes frame-level video upscaling, AI-driven frame interpolation, and generative image
and video pipelines running through ComfyUI into a unified posture: media enhancement and
generation that runs entirely on local hardware, free of paid cloud API dependencies.

## The founding claim

The single load-bearing claim, recorded in [[local-first-no-cloud-dependency]], is that
media enhancement and generation run on local hardware without reliance on paid cloud APIs.
Every pipeline decision in this namespace should be traceable back to that claim: a tool that
introduces a cloud dependency must justify itself against it, and a tool that strengthens
local execution aligns with it.

## Tool posture

Three operating rules follow from the founding claim:

- Local execution is the default. A tool or pipeline stage is rejected if it requires a paid
  cloud API call as a non-optional path, even if a cloud option is technically faster.
- Hardware is the boundary. The toolchain is designed for consumer hardware (a single
  Windows machine with a capable GPU). It does not assume a cluster, a server farm, or an
  API gateway.
- Model portability matters. Models must be downloadable and runnable without an
  authentication handshake. The toolchain works offline once models are cached.

## The component surface

The ai-media domain spans four components:

- AI Video Upscaler: a Python CLI tool by OCNAI that splits a video into frames, runs each
  frame through an AI upscaling model (2x or 4x), and recombines them with FFMPEG. Models
  are auto-downloaded to local cache.
- FluidFrames: a Windows GUI app by Djdefrag powered by the RIFE AI model for frame
  interpolation and slow-motion video generation. Distributed via Itch.io and Steam.
- GLM 5 Ultra Coder: a web UI chat frontend serving the GLM 5.2 language model via
  Puter.com, providing local-first AI coding assistance through a browser interface.
- ComfyUI: the shared runtime for image and video generation pipelines, serving as the
  execution backbone for generative workflows. Not owned by this namespace but integral to
  the toolchain.

Each component is tracked in `repo-registry/` when registered. The shared runtime (ComfyUI)
is documented as an external dependency with its own posture.

## What this canon does not yet cover

This draft does not cover: the detailed pipeline architecture (to grow in `concepts/`), the
recorded design decisions (to grow in `decisions/`), the model provenance and licensing
posture (to grow in `support/`), or the GPU hardware requirements matrix. Those land as the
operator provides and verifies them.

## Changelog

- 2026-07-06: initial draft created during the ai-media namespace scaffolding, authored at
  `operator-pending` from the AI-media repo READMEs and tool surface. Awaits operator
  verification.
