---
id: "repo-registry-tool-installs"
aliases: ["repo-registry-tool-installs", "tool-installs"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "research"
summary: "Consolidated entry for tool installs and upstream clones that are not projects: BlueStacks, ComfyUI (runtime), LM Studio, Unity, Sunshine, GitHub CLI, EaseUS, HitPaw, vtk, ScaleWay IOS Cloud Mac, the Dolphin3.0 model, and the expo upstream. These belong in tools/, not repo-registry, and are listed here for completeness."
confidence: 0.85
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-05"
---

# Consolidated: tool installs and upstream clones (not projects)

These folders under `C:\Projects` are installed tools, downloaded models, or clean upstream
clones used as references. They are NOT projects and get individual `tools/` entries where
they are load-bearing execution dependencies. They are enumerated here so the system map is
complete and nothing is mistaken for abandoned work.

## Runtime tools and installs

- `BlueStacks X`, `BlueStacks_nxt`: the BlueStacks Android emulator. Install, not a project.
- `ComfyUI`: the node-based Stable Diffusion UI. Forked clone; the runtime serves the
  AI-media and art work. Tool entry: `tools/comfyui.md`.
- `LM Studio`: local LLM runner. Tool entry candidate.
- `Unity`: the Unity game engine install, supporting game-modding and G.A.C.E work.
- `Sunshine`: the game-stream host (LizardByte). Paired with a Moonlight client.
- `GitHub CLI`: the `gh` command-line tool. Install.
- `EaseUS`, `HitPaw`: commercial media or data utilities. Installs.
- `vtk`: the Visualization Toolkit install or bindings.
- `ScaleWay IOS Cloud Mac`: a remote macOS build host for iOS app building. Important for
  the iOS app shipping flow; tool entry candidate.

## Models and upstream clones

- `Dolphin3.0-Llama3.1-8B`: a HuggingFace model download, not a project.
- `expo`: a clean clone of `expo/expo`, the Expo framework upstream. Reference only; the
  ADHD-OS dashboard app consumes Expo.

## Workspace artifacts (ignore)

- `.vs`, `_codex_backups`, `Cursor - Cloned Repos`: workspace and backup artifacts, not
  projects. Exclude from the system map.

## Digestion or Migration Posture

- Working posture: `tool-install` or `upstream-clone`. Promote specific ones to `tools/`
  entries when a real consumer depends on them.
