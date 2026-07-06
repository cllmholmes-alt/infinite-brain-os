---
id: "knowledge-adhd-os-concepts-capacity-aware-execution-layer"
aliases: ["knowledge-adhd-os-concepts-capacity-aware-execution-layer", "capacity-aware-execution-layer", "adhd-os-execution-layer", "augment-guide-carry"]
type: "Knowledge"
namespace: "adhd-os"
lifecycle_state: "scratch"
summary: "The capacity-aware execution layer is the central architectural mechanism of ADHD-OS: an adaptive UI and behavioral engine that modulates interface density, available actions, and system behavior in response to the user's current cognitive state. It spans two converging models: the Augment/Guide/Carry execution modes from the dashboard app and the FLOW/FRAGILE/LOW_ENERGY/OVERLOADED cognitive state model from the Figma Cognitive Visual Canon."
confidence: 0.8
retrieval_class: "domain"
export_class: "internal"
created: "2026-07-06"
edges:
  - target: "[[cognitive-load-is-structural]]"
    relation: "implements"
    confidence: 0.9
  - target: "[[adhd-os-core-doctrine]]"
    relation: "part_of"
    confidence: 0.9
---

# Capacity-Aware Execution Layer

## What it is

The capacity-aware execution layer is the architectural core of ADHD-OS. It is
the mechanism that mediates every interaction through the user's current
cognitive state rather than through an idealized, unlimited user. It is the
practical implementation of the founding claim in [[cognitive-load-is-structural]]:
if cognitive load is a structural issue, the structure must adapt to the load
the user can carry right now.

## Two converging models

The execution layer is described through two related models that converge on
the same principle. They come from different sources and use different labels,
but they are not in conflict: one is the runtime execution model, the other is
the visual and behavioral design model.

### Augment / Guide / Carry (dashboard app model)

This is the execution-mode model from the dashboard app README. It defines three
operating modes that the system selects based on detected capacity:

- **Augment (High Capacity)**: Full interface density. All modules available,
  full sidebar expanded, all widgets visible. The system assumes the user can
  handle complexity and offers the complete tool surface.
- **Guide (Medium Capacity)**: Balanced spacing, moderate cognitive load.
  Sidebar remains expanded but secondary widgets reduce. The system provides
  structured guidance rather than full autonomy.
- **Carry (Low Capacity)**: Minimal interface. Advisory messages replace
  decision prompts. All non-essential elements are hidden. The system carries
  the cognitive load on behalf of the user, presenting only what is strictly
  needed.

These three modes are enforced by the Automated Density Enforcement System
(ADES), which applies hard rules: maximum visible actions enforced, 60-70%
whitespace requirement, single-primary CTA rule, and mode-based simplification.

### FLOW / FRAGILE / LOW_ENERGY / OVERLOADED (Figma Cognitive Visual Canon model)

This is the four-state cognitive model from the Figma design system document. It
is more granular and governs visual appearance, motion behavior, and emotional
tone per state:

- **FLOW**: High energy and high momentum. Accent color green (#4ade80). Up to
  7 visible tasks. Sidebar expanded. Full widget count. Motion at 120-220ms.
  Emotional tone: "Protect this window." Not hype, not celebration. Focused
  confidence.
- **FRAGILE**: Baseline state, limited capacity. Accent color blue (#60a5fa).
  4-5 visible tasks. Slightly reduced density. Reduced micro-animations. Motion
  at 220ms. Emotional tone: "One step at a time." This is the default mode.
- **LOW ENERGY**: Energy depleted, reduced capacity. Accent color purple
  (#a78bfa). 2-3 visible tasks. Increased whitespace. Larger click targets.
  Sidebar auto-collapses. Motion slowed to 300ms. Emotional tone: "Low energy
  is real." No urgency cues. No red badges.
- **OVERLOADED**: Load exceeded capacity, minimal capacity. Accent color red
  (#f87171, warm, not alarming). 1 visible task. Analytics hidden. Widgets
  collapsed. Full stabilization overlay at Severity 3. Typography slightly
  larger. Generous whitespace. Motion at 400ms. Emotional tone: "Load exceeded
  capacity." Never "You're behind."

### How the models relate

The three-mode Augment/Guide/Carry model is the runtime execution layer: it
determines what the system allows and how it behaves. The four-state
FLOW/FRAGILE/LOW_ENERGY/OVERLOADED model is the visual and interaction design
layer: it determines what the user sees and how it feels.

They map approximately as:
- Augment maps to FLOW.
- Guide maps to FRAGILE.
- Carry maps to LOW_ENERGY and OVERLOADED, with the distinction that OVERLOADED
  triggers the full stabilization overlay (Severity 3 in the overwhelm runtime).

## How capacity is detected

Both models rely on the system detecting the user's current state. The dashboard
app model specifies the detection inputs: sleep estimate, mood log, task backlog
pressure, calendar density, time of day, and prior failure signals. The Figma
model is a design contract that assumes a capacity signal exists and defines
what to do with it. The detection engine itself is part of the behavioral
telemetry system, which is local-first and does not infer emotions or label
mental states.

## Density scaling rules

The core rule enforced across both models: density must decrease as cognitive
capacity decreases. The system must visibly feel different per state:
- FLOW: dynamic.
- FRAGILE: stable.
- LOW_ENERGY: softened.
- OVERLOADED: quiet.

If density does not shift, the system fails its founding claim. This is enforced
by ADES in the runtime and by the state-variant component validation rule in the
Figma canon: "No component without state variants. If it doesn't adapt, it
doesn't ship."

## The Overwhelm Runtime

The Overwhelm Runtime is the most critical surface in the capacity-aware
execution layer. It activates when the system detects that load has exceeded
capacity and operates at three severity levels:

- **Severity 1 (Soft Collapse)**: Subtle red accent border, reduced visible
  tasks, banner message. No overlay. No lock.
- **Severity 2 (Hard Collapse)**: Single task, add-task disabled, Reset CTA
  prominent, background slightly muted.
- **Severity 3 (Full Stabilization)**: Full-screen overlay. Aurora indicator
  pulsing softly. One micro-task. Four recovery options: complete one small
  task, 4-4-6 breathing reset, brain dump, rest day. No navigation visible.
  Must feel quiet, spacious, stable, and safe. Never urgent, error-like,
  or harsh.

## Relationship to free-will design

The capacity-aware execution layer is the practical expression of a product
posture that treats executive-function difficulty as a structure to fix, not a
failure to punish. A feature that reduces structural load aligns with the
founding claim. A feature that adds load, captures attention, or moralises
struggle violates it. The execution layer is the enforcement mechanism for this
principle.

## Provenance

Drawn from:
- `C:\Projects\Figmaadhdosuserdashboard\README.md` (the Augment/Guide/Carry
  model and ADES definition)
- `C:\Projects\ADHD-OS - Master Reference Database\Back-End Feature Roadmap Addons\Figma todos post-redesign.txt`
  (the four-state cognitive model, density scaling rules, Overwhelm Runtime)
- `C:\Projects\AdhdosArtsyledWebsite-clone\src\imports\adhd-os-spec.md`
  (HIGH/MEDIUM/LOW capacity modes and behavioral engine outputs)
- `C:\Projects\AdhdosArtsyledWebsite-clone\src\imports\adhd-os-user-dashboard.md`
  (Capacity Engine detection inputs and Next Best Action scoring)
