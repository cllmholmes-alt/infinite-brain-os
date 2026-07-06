---
id: "repo-registry-unclassified-local-wip"
aliases: ["repo-registry-unclassified-local-wip", "unclassified-local-wip"]
type: "Doc"
namespace: "ai-architecture"
lifecycle_state: "scratch"
summary: "Consolidated entry for local, non-versioned folders whose purpose is not yet confirmed by the operator: Nova-QPE, Grayzone Overlay, Atomic Chat, external-skills, Open Design, GLM 5 Ultra Coder, and Full Game Modding. Each needs classification before it earns an individual entry."
confidence: 0.5
retrieval_class: "identity"
export_class: "internal"
created: "2026-07-05"
---

# Consolidated: unclassified local WIP folders

These folders sit under `C:\Projects`, are not in version control, and have no clear README.
They are tracked here so nothing is silently lost, but each needs operator classification
(WIP, abandoned, or install) before it becomes load-bearing.

## Folders

- `Nova-QPE`: purpose unknown. QPE often means quaternion pose estimation or quantized
  parameter-efficient; operator must confirm.
- `Grayzone Overlay`: likely a graphics, streaming, or game overlay project. Confirm.
- `Atomic Chat`: likely a chat application. Confirm scope and stack.
- `external-skills`: likely a collection of agent skills or plugins. Confirm which system
  they extend (TALOS, openclaw, odysseus).
- `Open Design`: likely a design tool or design-system project. Confirm.
- `GLM 5 - Ultra Coder`: a `package.json` + `index.html` web project tied to the GLM model.
  Confirm whether it is a tooling UI or a model front-end.
- `Full Game Modding`: possibly a broader modding effort spanning multiple games. Confirm
  its relationship to `crimson-desert-mod-forge`.

## Current Registry Status

- Working status: `scratch`
- Operator confirmation required: yes for each

## Digestion or Migration Posture

- Working posture: `digestion-candidate` until each is classified

## Open Decisions and Risks

- Risk of silently abandoning real work. The operator should walk this list and classify
  each as WIP (promote to its own entry) or abandoned (mark accordingly).
