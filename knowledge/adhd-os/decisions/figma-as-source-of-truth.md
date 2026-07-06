---
id: "knowledge-adhd-os-decisions-figma-as-source-of-truth"
aliases: ["knowledge-adhd-os-decisions-figma-as-source-of-truth", "figma-as-source-of-truth", "adhd-os-figma-source-of-truth", "figma-visual-authority"]
type: "Knowledge"
namespace: "adhd-os"
lifecycle_state: "scratch"
summary: "Records the decision that the Figma design at https://www.figma.com/design/QNmiv2oZ9Jyz08orjDb7Cl/The-New-ADHD-OS is the canonical visual source of truth for ADHD-OS. The public website is generated from it via Figma Make. Design tokens must mirror 1:1 between code and Figma. The Figma file architecture mirrors the monorepo with exactly three permanent files: Design System (sacred), Core App, and R&D Lab (experimental)."
confidence: 0.9
retrieval_class: "domain"
export_class: "internal"
created: "2026-07-06"
edges:
  - target: "[[adhd-os-core-doctrine]]"
    relation: "decision_in"
    confidence: 0.9
  - target: "[[cognitive-load-is-structural]]"
    relation: "derived_from"
    confidence: 0.7
  - target: "[[component-architecture]]"
    relation: "governs"
    confidence: 0.8
---

# Figma as the visual source of truth

## The decision

The Figma design at `https://www.figma.com/design/QNmiv2oZ9Jyz08orjDb7Cl/The-New-ADHD-OS`
is the canonical visual source of truth for ADHD-OS. Every visual decision must
be traceable back to this Figma file. The public website was generated from it
via Figma Make. Design tokens defined in code must mirror the Figma design
tokens 1:1, with no ad-hoc values allowed on either side.

## Options considered

### Option A: Figma as the visual source of truth (chosen)

The Figma file is the authoritative visual reference. All visual rules
(colors, typography, spacing, density, motion, emotional tone) originate
there. Code implements what Figma specifies. Design tokens in code are a
mirror, not an independent source.

### Option B: Code as the visual source of truth

Design tokens live in `packages/design-tokens` as the canonical source. Figma
is a design tool; the runtime is what ships. This was rejected because the
Figma file contains behavioral and emotional rules (the cognitive state model,
density scaling per state, motion speed per state, emotional tone) that are
not expressible as simple design tokens. The Figma Cognitive Visual Canon is
a richer specification than a token file can capture.

### Option C: Dual authority

Figma and code are co-equal; drift is resolved case by case. This was rejected
because it creates ambiguity. When Figma says one thing and code says another,
there is no tiebreaker. A single source of truth prevents drift fatigue.

## Reasoning

The Figma file was chosen as the source of truth for these reasons:

1. **The Figma file is a richer surface than code alone.** It contains the
   four-state cognitive model (FLOW/FRAGILE/LOW_ENERGY/OVERLOADED) with
   full visual, motion, and emotional specifications per state. These rules
   govern more than colors and spacing: they govern which elements appear,
   how fast they animate, and what emotional tone they carry. This is the
   "Cognitive Visual Canon" -- a design system that encodes behavioral and
   emotional rules, not just visual tokens.

2. **The website was literally generated from Figma.** The Artsyled Website
   carries the package name `@figma/my-make-file` and its README points
   directly to the Figma URL. The generation pipeline (Figma -> Figma Make ->
   Vite + React project) establishes Figma as the upstream source by
   construction.

3. **The Figma file architecture mirrors the monorepo.** The blueprint in the
   Master Reference Database specifies exactly three permanent Figma files
   that map to the code architecture:

   | Figma File               | Code Equivalent            |
   |--------------------------|----------------------------|
   | Design System (Sacred)   | `packages/design-tokens`   |
   | Core App                 | `src/app/` (dashboard)     |
   | R&D Lab (Experimental)   | feature branches / drafts  |

   This mirroring makes Figma a structural peer of the codebase, not a
   downstream artifact.

4. **Design token parity is enforced by rule.** The Figma Cognitive Visual
   Canon states: "All tokens defined in `packages/design-tokens` must be
   mirrored 1:1 in Figma. No ad-hoc hex codes allowed." The canonical
   Figma-to-Tailwind checklist in the Master Reference Database provides a
   verification procedure for this parity. The governance system
   (`governance:typography`, `governance:density`, `governance:tone`)
   enforces the code side.

5. **The Figma file is the shared language.** When an AI agent needs to
   understand how ADHD-OS should look and feel, the Figma Cognitive Visual
   Canon (held in the Master Reference Database as a 2048-line text document)
   provides the most complete answer. Code files can show what is implemented;
   the Figma canon shows what is intended.

## What this means in practice

### Design changes flow: Figma first, then code

When a visual change is needed, the Figma file is updated first, then code is
brought into alignment. The three-file Figma architecture enforces a workflow:
experiment in R&D Lab, validate against all four cognitive states, create the
component in the Design System file, pull an instance into the Core App file,
then implement in code.

### Design tokens are a mirror, not an origin

Code-level design tokens (colors, spacing, typography scales, radii, motion
durations) derive from the Figma Design System file. If they drift, the Figma
file wins and the code must be corrected. The governance scripts
(`governance:typography:refresh`, `governance:density:refresh`) provide a
baseline-update mechanism for this.

### The website is a snapshot, not a living mirror

The Artsyled Website was generated from Figma once via Figma Make. It is not
continuously synced. Drift between the Figma design and the generated website
is a known risk. The Dashboard App (which is actively developed, not generated)
has its own governance scripts to enforce parity. The website does not yet
have equivalent drift detection.

### The cognitive state model lives in Figma

The four-state model (FLOW, FRAGILE, LOW_ENERGY, OVERLOADED) with its density
scaling rules, accent colors, motion speeds, and emotional tone specifications
is defined in the Figma Cognitive Visual Canon. The code implements these rules
but the specification is held in the Figma document. If the code's capacity
modes (Augment/Guide/Carry) diverge from the Figma states, the Figma model is
authoritative on the visual and behavioral intent.

## Conditions for revisiting this decision

This decision should be revisited if:

1. A live, automated Figma-to-code sync pipeline is implemented. At that point,
   the relationship changes from "Figma as source, code as mirror" to "Figma
   and code as synchronized peers," which may merit a dual-authority model.

2. The design token system grows rich enough to encode behavioral and emotional
   rules (not just visual tokens). If `packages/design-tokens` can express "in
   OVERLOADED state, the sidebar is hidden and motion is 400ms," then code
   could become the source of truth.

3. The website is rebuilt outside the Figma pipeline. If a future website
   version is built directly in code, the generated-website argument for Figma
   authority weakens.

## Provenance

Drawn from:
- `C:\Projects\AdhdosArtsyledWebsite-clone\README.md` (Figma link, generation via Figma Make)
- `C:\Projects\AdhdosArtsyledWebsite-clone\package.json` (package name `@figma/my-make-file`)
- `C:\Projects\ADHD-OS - Master Reference Database\Back-End Feature Roadmap Addons\Figma todos post-redesign.txt`
  (Cognitive Visual Canon, Figma file architecture blueprint, design token parity rules,
  component validation checklist, 3-file Figma structure)
- `C:\Projects\ADHD-OS - Master Reference Database\Back-End Feature Roadmap Addons\CANONICAL 1to1 FIGMA -> VS Code (Next.js + Tailwind) CHECKLIST.txt`
  (Figma-to-code verification procedure)
- `C:\Projects\Figmaadhdosuserdashboard\package.json` (governance scripts enforcing design parity)
- `C:\Projects\Figmaadhdosuserdashboard\README.md` (dashboard app design system tokens)
