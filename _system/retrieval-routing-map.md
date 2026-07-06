# Retrieval Routing Map

Operative contract for selecting namespaces by task class. This file sits one level above
`_system/retrieval-load-order-policy.md`: that policy governs the load order inside a
namespace; this map decides which namespaces to enter at all. The reasoning behind
minimal, query-class-driven retrieval lives in [[retrieval-over-raw-memory]].

## The contract

- Agents consult this map after reading `knowledge/ai-architecture/canon/doctrine-card.md`,
  whenever the task touches a knowledge domain. Tasks that touch no knowledge domain (a
  mechanical file fix, a sprint scaffold, a session closeout) skip the map entirely.
- The map routes; namespaces own their internal load order. After this map names a
  namespace, enter through its `INDEX.md` and sequence the canon read via its
  `canon/agent-load-order.md`, per the LOAD rules in
  `_system/retrieval-load-order-policy.md`.
- Load the primary sequence in order, stop when the task is answerable, and open secondary
  namespaces only when the task genuinely crosses into them. Never pre-load a whole row.
- The scaffolds under `knowledge/_examples/` are pattern references, not retrieval targets
  for domain questions. Load one only when building a new namespace of that profile.
- The registry under `_system/namespaces/` is the source of truth for what each namespace
  is; this map is re-grounded against it when namespaces are added or retired.

## Task classes

The starter ships two registered namespaces, so the map starts small. Extend it with a task
class per namespace as you register more; treat each extension as a contract change.

### Architecture, contract, and canon work

- Primary: `ai-architecture` (the doctrine card you already read, then
  `canon/core-doctrine.md` whole, with `_system/README.md` for the operative contract).
- Secondary: the specific `_system/` rule file the task touches (namespace registration,
  surface contracts, validation), entered directly rather than scanned.
- Skip the deep read when the task implements an already-settled contract (schema edits,
  validator fixes, scaffolding); the doctrine card plus the relevant `_system/` rule suffice.

### Operator goals, priorities, and review cadence

- Primary: `personal-operator` (the operator's goals, priorities, review cadence, and
  operating notes), entered through its `INDEX.md`.
- Secondary: `ai-architecture` only when the operator question turns into a system-design
  question (for example, changing how reviews are routed rather than running one).
- Skip `ai-architecture` for routine planning and review execution; the operator namespace
  is enough.

### ADHD-OS product doctrine and component architecture

- Primary: `adhd-os` (the product's founding claim, posture, and component architecture),
  entered through its `INDEX.md` and `canon/core-doctrine.md`.
- Secondary: `repo-registry/` entries for per-component ownership and posture, and
  `parties/brands/adhd-os.md` for brand identity.
- Skip the deep read for a mechanical component fix; the canon card plus the relevant
  repo-registry entry suffice.

### TALOS governance and lifecycle orchestration

- Primary: `talos` (the primary law, the mediation model, and the lifecycle architecture),
  entered through its `INDEX.md` and `canon/core-doctrine.md`.
- Secondary: `ai-architecture` when the question is the TALOS-to-brain relationship or
  governance-model comparison, since that is a cross-system synthesis question.
- Skip `ai-architecture` for routine TALOS lifecycle execution; the `talos` namespace is
  enough.

### Game-modding domain doctrine and tool architecture

- Primary: `game-modding` (the domain's founding claim, posture, and tool architecture),
  entered through its `INDEX.md` and `canon/core-doctrine.md`.
- Secondary: `repo-registry/` entries for per-component ownership and posture (Crimson Desert
  Mod Forge, G.A.C.E, and the rest).
- Skip the deep read for a mechanical tool fix or pipeline run; the canon card plus the
  relevant repo-registry entry suffice.

### AI media toolchain doctrine and pipeline architecture

- Primary: `ai-media` (the domain's founding claim, tool posture, and pipeline architecture),
  entered through its `INDEX.md` and `canon/core-doctrine.md`.
- Secondary: `repo-registry/ai-media-pipeline.md` for per-component ownership and posture, and
  `tools/comfyui.md` for the shared generation runtime.
- Skip the deep read for a mechanical tool fix; the canon card plus the relevant
  repo-registry entry suffice.

### Revenue-intelligence pipeline doctrine, metrics, and human-gate rules

- Primary: `revenue-intelligence` (the pipeline's founding claim, metric definitions, and the
  human-in-the-loop money gate), entered through its `INDEX.md` and `canon/core-doctrine.md`.
- Secondary: `personal-operator` when an operator goal or review cadence intersects a revenue
  decision, and `repo-registry/hrio.md` or `repo-registry/getreviewreadycom.md` for
  per-component posture.
- Skip the deep read for a mechanical HRIO code fix; the canon card plus the relevant metric
  node suffice.

### Building a new namespace

- Primary: the matching profile scaffold under `knowledge/_examples/` (one of
  `doctrine-example`, `tool-contract-example`, `data-system-example`,
  `design-system-example`, `component-library-example`, `content-strategy-example`,
  `operating-library-example`, `intake-fabric-example`), read as a shape reference.
- Secondary: `knowledge/ai-architecture/concepts/namespace-profiles.md` for the reasoning,
  and `_system/namespace-profiles.md` plus `_system/namespaces/INDEX.md` for the
  registration mechanics.
- The scaffold is copied, never written into; the new namespace registers in
  `_system/namespaces/` and earns its own row in this map.

## When the task fits no class

Match to the nearest class and confirm via `_system/namespaces/INDEX.md` (the catalog with
one-line purposes). If the task plausibly creates a new namespace or changes this map, treat
the map change as a contract change, not an improvisation: route it through the architecture
class above and update `_system/namespaces/INDEX.md`, this map, and
`intake/routing/namespace-routing-map.md` together.
