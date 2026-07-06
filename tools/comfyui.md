---
id: "tool-comfyui"
aliases: ["tool-comfyui", "comfyui"]
type: "Tool"
namespace: "personal-operator"
lifecycle_state: "research"
summary: "ComfyUI, the node-based Stable Diffusion image and video generation interface. Serves the AI-media and art workflows across the operator's products."
confidence: 0.8
retrieval_class: "identity"
export_class: "internal"
tool_type: "runtime"
tool_status: "planned"
departments: []
related_namespaces: []
party_slugs: []
client_slug: null
brand_slug: null
created: "2026-07-05"
---

# ComfyUI

## What this tool does

ComfyUI is a node-based interface and backend for Stable Diffusion image and video
generation. It runs locally and orchestrates diffusion pipelines through composable graph
nodes.

## Why it matters in this OS

ComfyUI is the local generation engine behind the AI-media pipeline and any art or asset
generation (including game assets via G.A.C.E and art for WillowGlassArt). It is a shared
execution dependency across multiple products.

## System fit class

`os-operational-tool` (shared media-generation capability).

## Runtime and source location

- Local clone: `C:\Projects\ComfyUI` (forked from `cllmholmes-alt/ComfyUI`)
- Stack: Python (`requirements.txt`, `pyproject.toml`)
- Runtime: local Python server, web UI

## Auth and credential boundary

No external credentials required for local use. Any model-licensing or API keys for hosted
models are referenced from `secrets/`.

## Risks and limitations

- Local GPU dependency; throughput bound by hardware.
- Custom nodes in the fork should be tracked as the operator's divergence.

## Next integration step

Document the custom nodes the operator maintains and link this tool from the
`ai-content-pipeline` department and the `ai-media-pipeline` repo entry.
