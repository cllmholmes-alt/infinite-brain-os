---
id: "knowledge-ai-media-pillars-local-first-no-cloud-dependency"
aliases: ["knowledge-ai-media-pillars-local-first-no-cloud-dependency", "local-first-no-cloud-dependency", "ai-media-founding-claim"]
type: "Knowledge"
namespace: "ai-media"
lifecycle_state: "scratch"
summary: "The foundational pillar of the ai-media namespace: media enhancement and generation run entirely on local hardware without reliance on paid cloud APIs. Every pipeline and tool decision in the namespace derives from this claim."
confidence: 0.8
retrieval_class: "domain"
export_class: "internal"
verified_at: "2026-07-06"
verified_by: "operator-pending"
edges:
  - target: "[[ai-media-core-doctrine]]"
    relation: "anchors"
    confidence: 0.9
created: "2026-07-06"
---

# Local-first: no cloud dependency

## The claim

Media enhancement and generation run on local hardware without reliance on paid cloud APIs.
The entire pipeline, from frame extraction through AI processing to recombination, executes
on the operator's own machine. No API key, no usage meter, no remote GPU farm is required
for the core enhancement path.

## Why it matters here

This claim is the test every tool and pipeline stage is held against. A component that runs
locally with cached models aligns with the claim. A component that gatekeeps functionality
behind a cloud API call violates it. A component that offers a cloud path as an optional
acceleration mode is acceptable only if the local path is the default and remains fully
functional without the cloud.

## What follows from it

- Offline-capable. The toolchain must function without an internet connection once models are
  cached. Model downloads are one-time setup, not runtime dependencies.
- Consumer-hardware ceiling. Pipeline design targets a single Windows machine with a single
  consumer GPU. Cluster-scale or server-grade assumptions are rejected.
- Model portability. Models are standard file artifacts (ONNX, PyTorch, SafeTensors) stored
  in local cache directories. No authentication, no DRM, no license server handshake.
- Cost is hardware, not subscription. The operator pays once for the GPU and electricity.
  There is no per-frame, per-minute, or per-token billing path in the core toolchain.

## What is permitted at the edge

Tools that connect to a free external service as a convenience layer (for example, the GLM 5
Ultra Coder passing prompts through Puter.com's free tier) are permitted at the edge because
they do not gate the core processing path. The namespace distinguishes between the media
processing spine (local, no cloud) and the auxiliary tooling layer (may use free external
services when convenient but must be replaceable).

## Provenance

Drafted from the AI-media repo READMEs during the 2026-07-06 namespace scaffolding. The AI
Video Upscaler README explicitly states "No reliance on cloud services or paid APIs" as a
feature. FluidFrames ships as a local Windows app distributed via Itch.io and Steam, with no
server-side processing. Authored at `operator-pending`; the operator must verify the wording
before it becomes canon.
