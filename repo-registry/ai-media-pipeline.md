---
id: "repo-registry-ai-media-pipeline"
aliases: ["repo-registry-ai-media-pipeline", "ai-media-pipeline", "ai-video-upscaler"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "The AI media processing cluster: local AI video upscaling (AI-video-upscaler from OCNAI) and frame interpolation (FluidFrames from Djdefrag). Grouped as one pipeline entry with upstream clones."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-05"
---

# Repo: ai-media-pipeline

## Repo Identity

- Repo slug: `ai-media-pipeline` (cluster entry)
- Canonical paths:
  - `C:\Projects\AI-video-upscaler` (remote: `github.com/OCNAI/AI-video-upscaler.git`)
  - `C:\Projects\FluidFrames` (remote: `github.com/Djdefrag/FluidFrames.git`)
- Version control: git (both)
- Stack: Python (`requirements.txt`)

## Primary Job

Local AI media processing. AI Video Upscaler splits videos into frames, enhances each frame
with AI upscaling, and recombines them, entirely local with no cloud APIs. FluidFrames
handles frame interpolation. Together they form a local-first media enhancement pipeline.

## Current Registry Status

- Working status: `upstream-clone`
- Operator confirmation required: yes

## Department Linkage

- Working primary owning department: `ai-content-pipeline` (planned, Phase 3/4)

## Related Surfaces

- Related repos: `gace` (shares media-processing DNA), `glm-5-ultra-coder` (model tooling)

## Digestion or Migration Posture

- Working posture: `upstream-clone` (track OCNAI and Djdefrag upstreams)

## Open Decisions and Risks

- Confirm whether the operator forks these for customization or runs them as-is.
