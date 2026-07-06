---
id: "tool-unity"
aliases: ["tool-unity", "unity"]
type: "Tool"
namespace: "personal-operator"
lifecycle_state: "research"
summary: "The Unity game engine install. Supports game-modding workflows, G.A.C.E. asset creation, and interactive 3D projects."
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
created: "2026-07-06"
---

# Unity

## What this tool does

Unity is a cross-platform game engine and real-time 3D development environment.
It provides authoring tools, a rendering pipeline, physics, and a C# scripting
runtime for building games, simulations, and interactive experiences.

## Why it matters in this OS

Unity is the execution surface for game-modding projects and the G.A.C.E. (Game
Asset Creation Engine) pipeline. It is the runtime where 3D assets created in
the AI-media pipeline are composed, tested, and built.

## System fit class

`department-local-tool` (candidate: `game-modding`, `ai-content-pipeline`).

## Runtime and source location

- Local install: `C:\Projects\Unity`
- Stack: native application (C++ core, C# scripting, .NET runtime)
- Runtime: Unity Editor for development, standalone player builds for
  distribution

## Auth and credential boundary

Unity Editor requires a Unity license (Personal or subscription tier). License
credentials live in the external secret backend, referenced from `secrets/`.
Unity Asset Store authentication may be needed for purchased assets.

## Risks and limitations

- Version lock-in: projects are tightly coupled to a Unity LTS version; major
  upgrades carry migration cost.
- License tier changes can gate build platform access and cloud services.
- Large project sizes and asset imports can strain local disk and memory.

## Next integration step

Register the Unity license tier in `secrets/` and link this tool from the
`game-modding` and `ai-content-pipeline` department entries.
