# Brain Map v4: 100 High-Value Improvements Plan

> **For Hermes:** Use council-of-agents and subagent-driven-development to implement this plan in dependency waves. Preserve the v3 artifact until each v4 acceptance gate passes.

**Goal:** Turn Brain Map v3 from a sophisticated visualisation into a truthful, temporal, explainable, and safely actionable operating model of the entire ecosystem, while establishing a reusable semantic and visual foundation for ADHD-OS Constellation/Brain Mirror.

**Architecture:** Separate graph truth, event history, analytics, rendering, interaction, and governed actions. Keep a portable static snapshot export, but make the primary application consume evidence-bearing adapters through a canonical graph contract. Share graph semantics, confidence handling, accessibility patterns, and renderer principles with Constellation without mixing infrastructure data with personal ADHD-OS data.

**Current baseline:** `brain-map-v3.html` at commit `f89e12f`: 3,936-line single-file Canvas2D application; 26 nodes, 36 edges, 7 clusters; six layouts; custom physics; particles; cluster hulls; minimap; search; command palette; health/cost overlays; centrality/PageRank; cascade simulation; exports; accessibility controls; and simulated live activity.

**Plan boundary:** This is a net-new v4 plan. Existing v3 features do not count unless the item replaces a simulated, static, or unauditable implementation with production-grade behavior.

---

## North-star outcomes

1. **Truthful:** Every visible fact identifies its source, observed time, freshness, and confidence.
2. **Temporal:** The operator can reconstruct what changed, when, why, and with what consequence.
3. **Decisive:** The graph surfaces risk, priority, drift, and next-best action rather than merely topology.
4. **Safe to operate:** Actions are dry-run first, authority-gated, evidence-bound, verified, and reversible.
5. **Calm to use:** Semantic zoom and progressive disclosure prevent the graph becoming visual noise.
6. **Shared but separated:** Brain Map and Brain Mirror share graph language and craft, never sensitive data or inappropriate operational semantics.
7. **Portable:** A complete, redacted, read-only snapshot remains exportable as a single offline artifact.
8. **Measurable:** Each wave has objective acceptance gates; no simulated status can be presented as live truth.

---

# The 100 improvements

## Workstream 1 - Canonical truth and provenance (1-10)

1. **Canonical graph contract** - Define versioned `Node`, `Edge`, `Cluster`, `Source`, `Observation`, `Event`, and `EvidenceRef` schemas so every adapter and renderer speaks one validated language. **Value:** eliminates hand-maintained drift and creates the reusable seam for Brain Mirror.
2. **Stable ecosystem identity registry** - Give every repo, service, agent, domain, deployment, dataset, and governed artifact a durable ID with aliases and lifecycle state. **Value:** history survives renames, moves, and environment changes.
3. **Source-authority hierarchy** - Declare which source wins for each fact type: provider state, Git, runtime health, deployment manifest, registry, generated report, or human declaration. **Value:** contradictory data becomes resolvable rather than silently merged.
4. **Evidence envelope on every field** - Attach `source`, `observedAt`, `collectedAt`, `expiresAt`, collector version, environment, method, confidence, and evidence handle to operational facts; classify each value as observed, derived, declared, or unknown. **Value:** every status is inspectable and auditable.
5. **Freshness as a first-class visual state** - Distinguish fresh, ageing, stale, unknown, blocked, and unreachable data independently from healthy/degraded/down. **Value:** stale green can never masquerade as current health.
6. **Unknown-by-default policy** - Require positive evidence before rendering healthy, deployed, synced, compliant, or complete states. **Value:** removes false confidence from missing data.
7. **Conflict reconciliation surface** - When sources disagree, show the competing claims, authority ranking, timestamps, and required resolution. **Value:** turns data drift into visible work.
8. **Schema migration and compatibility layer** - Version graph documents and provide deterministic migrations with fixture tests. **Value:** v4 can evolve without breaking saved snapshots or Brain Mirror consumers.
9. **Redaction and sensitivity classification** - Classify fields as public, internal, confidential, secret locator, or prohibited; redact exports and shared views by policy. **Value:** operational visibility without credential or personal-data leakage.
10. **Truth-quality and evidence-weighted health scorecard** - Measure coverage, freshness, source confidence, conflicts, unknowns, SLOs, incidents, drift, Git-to-production parity, and orphaned identities. Show component contributions and refuse a definitive rollup when evidence is insufficient. **Value:** the graph reports how trustworthy it is before reporting ecosystem health.

## Workstream 2 - Temporal system memory (11-20)

11. **Append-only ecosystem event log** - Persist commits, deploys, health transitions, incidents, approvals, configuration changes, owner updates, and graph edits as immutable events. **Value:** creates factual history rather than synthetic animation.
12. **Deterministic snapshot builder** - Reconstruct graph state at any timestamp from the event log and source snapshots. **Value:** true time travel and reproducible investigations.
13. **Before/after diff engine** - Compare any two snapshots across nodes, edges, metadata, ownership, health, risk, cost, and evidence. **Value:** answers “what changed?” in one view.
14. **Change attribution** - Link graph changes to commits, PRs, deploy IDs, agents, run IDs, decisions, or external provider events. **Value:** operators see cause and responsibility, not just effect.
15. **Release-bound topology views** - Freeze and compare topology for named releases or deployment manifests. **Value:** makes release review and rollback reasoning concrete.
16. **Incident reconstruction mode** - Replay the minutes before and after an incident with synchronized health, deploy, log, and dependency events. **Value:** shortens diagnosis and produces credible retrospectives.
17. **Temporal query language** - Support questions such as “what became stale after release v31?” and “which dependencies changed before the outage?” **Value:** history becomes explorable without manual log correlation.
18. **Lifecycle model** - Represent proposed, experimental, active, degraded, deprecated, retired, and archived states with explicit transitions. **Value:** the map shows where systems are going, not only where they are.
19. **Retention and compaction policy** - Preserve high-value events, aggregate noisy telemetry, and document retention rules. **Value:** useful long-term memory without uncontrolled storage or privacy risk.
20. **Evidence-bound historical exports** - Export a snapshot or incident view with source manifest, timestamps, redaction policy, and reproducible hash. **Value:** creates reviewable evidence rather than decorative screenshots.

## Workstream 3 - Live observability and drift intelligence (21-30)

21. **Real adapter ingestion** - Replace embedded status and simulated pulses with adapters for Git/CI, VPS host metrics, systemd, Docker, ports, HTTP health, immutable release manifests, Cloudflare, App Store Connect, agent/workflow runs, and governed local registries. **Value:** Brain Map becomes operationally current.
22. **Collection health plane** - Model each collector itself, including last success, latency, errors, permissions, and next run. **Value:** distinguishes a broken system from a broken observer.
23. **Multi-layer health model** - Separate liveness, readiness, semantic canary, durability, dependency health, and user-path health. **Value:** HTTP 200 is no longer treated as proof of correctness.
24. **Service-level objectives** - Add SLOs, error budgets, breach state, and burn rate per service or user path. **Value:** health becomes outcome-based and prioritized.
25. **Configuration drift detector** - Compare declared configuration, Git source, built artifact, deployment manifest, and live runtime. **Value:** catches stale `dist`, wrong environment, and partial deployment failures.
26. **Git and CI estate intelligence** - Show branch, local/upstream/deployed SHAs, dirty state, ahead/behind, diverged remotes, unpushed commits, branch policy, worktrees, open PRs, failing checks, release tags, and unsaved IDE buffers where available. **Value:** “up to date” becomes an evidence-backed statement.
27. **Dependency and version drift** - Detect incompatible shared dependencies, runtime versions, API contracts, and stale generated clients. **Value:** surfaces hidden integration risk before failure.
28. **User-path synthetic probes** - Model end-to-end semantic checks such as inference streaming, authenticated dashboard use, and data persistence as graph paths. **Value:** verifies outcomes across multiple healthy-looking nodes.
29. **Incident and alert correlation** - Group related alerts into one topology-aware incident with probable origin and affected user paths. **Value:** reduces alert noise and focuses response.
30. **Adaptive collection budgets** - Increase observation frequency around changes or degradation and back off during stable periods. **Value:** fresher evidence where it matters without wasteful polling.

## Workstream 4 - Graph decision intelligence (31-40)

31. **Typed dependency semantics** - Model calls, imports, deploys-to, authenticates-through, stores-in, monitors, funds, governs, and blocks as distinct relations with direction and criticality. **Value:** topology conveys meaning rather than generic connectivity.
32. **Outcome and capability graph** - Represent user outcomes and operational capabilities as first-class nodes spanning their supporting systems. **Value:** shifts the map from components to delivered value.
33. **Single-point-of-failure analysis** - Compute articulation points, bridges, minimum cut sets, and missing redundancy. **Value:** identifies the smallest failures capable of breaking critical workflows.
34. **Probabilistic blast-radius model** - Calculate direct, transitive, expected, and worst-case impact from dependency type, redundancy, health, and historical propagation; expose confidence ranges and assumptions. **Value:** impact review becomes specific before changes are made.
35. **Critical-path, capacity, and flow reliability** - Combine topology, SLOs, freshness, failure history, queue age, throughput, and constrained handoffs to find the weakest or saturated links in each workflow. **Value:** directs hardening effort to the highest-value path.
36. **Change-risk and propagation forecasting** - Estimate which services, interfaces, tests, docs, owners, and workflows a change can affect from touched topology, instability, evidence, reversibility, and ownership; recommend canary and rollback boundaries. **Value:** release scrutiny and sequencing scale with actual risk.
37. **Counterfactual scenario and Pareto studio** - Compare single or correlated failures, provider/region outages, migrations, cost reductions, capacity changes, owner unavailability, and architectural options across resilience, cost, speed, compliance, and complexity without hiding trade-offs in one score. **Value:** planning becomes visual and evidence-led.
38. **Constraint-aware priority command queue** - Rank recommendations as act now, schedule, monitor, or dismiss; sequence the smallest feasible interventions by prerequisite, owner, maintenance window, cumulative risk reduction, cost, authority, and compliance. **Value:** converts diagnosis into a defensible action order.
39. **Explainable and counterfactual recommendation cards** - Every recommendation lists evidence, assumptions, confidence, affected paths, rejected alternatives, verification criteria, and the smallest change that would alter the conclusion. **Value:** AI assistance remains reviewable rather than authoritative by assertion.
40. **Decision quality feedback loop** - Record accepted/rejected recommendations and measured outcomes to calibrate future ranking. **Value:** the map learns from operational reality without silently rewriting history.

## Workstream 5 - Spatial sensemaking and visual refinement (41-50)

41. **Three explicit modes: Observe, Explain, Act** - Give each mode a constrained information and interaction budget. **Value:** prevents a monitoring surface, analytical canvas, and control plane from competing at once.
42. **Three-level semantic zoom and density grammar** - Treat overview, neighbourhood, and detail as distinct compositions; aggregate dense regions intentionally and make the minimap show cluster geography, viewport, focus, and off-screen results rather than a tiny unreadable graph. **Value:** preserves orientation and legibility at every scale.
43. **Stable mental-map layout** - Keep unchanged nodes spatially anchored across refreshes and snapshots, with controlled movement for changes. **Value:** operators notice change instead of relearning the graph.
44. **Focus tunnel with contextual dimming** - Keep the selected node and one/two-hop context clear while progressively muting unrelated content without blur or loss of orientation. **Value:** reduces cognitive load during diagnosis.
45. **Path tracing and route comparison** - Animate and compare two dependency or user paths with bottlenecks and evidence. **Value:** complex flows become understandable in seconds.
46. **Question-led topology lenses and semantic grammar** - Switch the same graph through operational, deployment, data, security, financial, governance, and user-path questions; assign each visual channel one job and keep a view-aware legend. **Value:** one source of truth answers different questions without duplicating maps or ambiguous encodings.
47. **Label, territory, and relationship legibility engine** - Use priority collision avoidance, horizontal label backplates, quiet cluster territories and summaries, relationship hierarchy, endpoint-safe bundling, and an inspectable “why connected?” interaction showing type, direction, source, strength, and recency. **Value:** meaning survives graph growth without visual clutter.
48. **Strict change-focused motion budget** - Reserve ember, pulses, particles, glows, shadows, and force motion for new risk, state change, required action, or current focus; diminish them during reading and remove them below perceptual usefulness. **Value:** animation communicates instead of decorating.
49. **Evidence drawer with spatial anchoring** - Open source records, logs, manifests, diffs, and decisions beside the selected object without losing graph context. **Value:** investigation stays grounded in topology.
50. **Narrative walkthroughs** - Save ordered viewpoints, annotations, evidence, and transitions as reusable incident, architecture, or stakeholder stories. **Value:** Brain Map becomes a communication and onboarding tool, not only a personal dashboard.

## Workstream 6 - Governed operational command surface (51-60)

51. **Action capability registry** - Declare available actions, target types, required authority, risk level, dry-run support, verifier, rollback, and evidence contract. **Value:** control-plane boundaries are explicit.
52. **Dry-run-first interactions** - Preview commands, affected nodes, predicted blast radius, required approvals, and rollback path before mutation. **Value:** prevents accidental live changes.
53. **Authority-aware action gating** - Separate operator intent, owner approval, provider permission, human-presence requirements, and legal/professional attestations. **Value:** Brain Map never treats access as authority.
54. **Runbook-bound actions** - Link operational buttons to versioned runbooks with prerequisites, abort conditions, and verification. **Value:** actions follow known-safe procedures rather than ad hoc commands.
55. **Semantic canary templates** - Define real behavior checks for each service and user path, not generic health checks. **Value:** post-action verification proves the intended outcome.
56. **Automatic rollback contracts** - Require rollback trigger, artifact, authority, and success proof for high-risk changes. **Value:** failed changes recover predictably.
57. **Executable dispatch and live operation timeline** - Promote approved recommendations into tasks, reviews, incidents, or capability-registry commands, then show actor, target, approvals, progress, heartbeats, output, canary, and final state as one trace. **Value:** work begins from the map and remains transparent and auditable.
58. **Incident workspace** - Create a focused graph view with severity, commander, timeline, evidence, hypotheses, actions, and resolution state. **Value:** response coordination happens around the real dependency model.
59. **Blocker and owner handoff packets** - Generate exact, evidence-linked requests when an action is blocked by owner, provider, credential, legal, or A5 authority. **Value:** blocked work remains actionable without unsafe bypasses.
60. **Action/read separation** - Make read-only exploration visually and technically distinct from state-changing control, with explicit confirmation boundaries. **Value:** users can investigate freely without mutation anxiety.

## Workstream 7 - Knowledge, governance, and portfolio intelligence (61-70)

61. **Living documentation graph** - Link systems to architecture docs, runbooks, ADRs, specs, policies, and evidence, with freshness and ownership. **Value:** documentation becomes navigable and accountable.
62. **Documentation drift analysis** - Compare documented claims with current source and runtime facts. **Value:** stale diagrams and release claims become visible defects.
63. **Ownership and stewardship map** - Track accountable owner, maintainer, reviewer, escalation path, and bus-factor risk. **Value:** every important object has a human or governed agent path.
64. **Decision ledger** - Attach decisions, alternatives, rationale, authority, date, and supersession to affected graph objects. **Value:** future changes retain context.
65. **Risk and control overlay** - Map risks, mitigations, control evidence, residual exposure, and expiry to topology. **Value:** governance becomes operational rather than a separate spreadsheet.
66. **Compliance-bound data-flow view** - Trace personal, special-category, credential, financial, and public data across systems and processors. **Value:** privacy and security reviews use the actual architecture.
67. **External dependency register** - Model providers, domains, app stores, vendors, certificates, subscriptions, and renewal dates. **Value:** owner/provider dependencies stop being invisible.
68. **Goal-to-graph and cross-objective alignment** - Relate systems to products, capabilities, verified customer/revenue evidence, costs, constraints, and strategic objectives; show what advances, obstructs, duplicates, or consumes resources without supporting each goal, including conflicts between goals. **Value:** engineering effort can be weighed against business value without fabricating traction.
69. **Technical-debt and retirement view** - Show debt items, migration paths, dead systems, duplicate capability, and decommission blockers. **Value:** the ecosystem becomes simpler over time.
70. **Readiness and completion contracts** - Define what “built,” “verified,” “deployed,” “live,” “compliant,” and “complete” mean for each object class. **Value:** completion language becomes consistent and evidence-bound.

## Workstream 8 - Collaboration, communication, and reusable views (71-80)

71. **Versioned shared views** - Save immutable or live views with scope, filters, redaction, source snapshot, and owner. **Value:** collaborators see the intended evidence, not a moving target.
72. **Anchored review comments** - Attach comments and decisions to nodes, edges, paths, time ranges, or evidence records. **Value:** feedback stays connected to context.
73. **Decision cockpit and decision-room sessions** - Package a question, relevant topology, evidence strength, constraints, options, reversibility, unresolved questions, votes, dissent, authority, rationale, and outcome. **Value:** the graph supports faster, structured, accountable judgment.
74. **Role-specific briefing modes** - Generate operator, engineering, governance, investor, customer-impact, and onboarding views from the same truth model. **Value:** communication adapts without forking facts.
75. **Early-warning and exception inbox** - Present only significant topology, risk, cost, ownership, evidence, fragile-path, stalled-commitment, or conflicting-priority changes that require review; keep routine stability quiet. **Value:** operator attention is reserved for exceptions.
76. **Outcome watchlists and triggered reassessment** - Watch nodes, paths, decisions, assumptions, risks, or evidence freshness with explicit success, failure, review, digest, and escalation triggers. **Value:** attention follows responsibility and important decisions are revisited when evidence changes.
77. **Embeddable read-only surfaces** - Provide signed, scoped, expiring embeds for docs or dashboards with no operational authority. **Value:** the map can travel safely.
78. **Evidence-rich report generator** - Produce architecture reviews, incident retrospectives, deployment proofs, and portfolio summaries with source references and hashes. **Value:** exports become decision artifacts.
79. **Graph API and query SDK** - Expose validated read contracts for other tools, agents, CI, and ADHD-OS adapters. **Value:** Brain Map becomes infrastructure, not an isolated page.
80. **Operational briefings and human-readable change narrative** - Generate start-of-day, end-of-day, and weekly briefs from graph diffs, decisions, risks, completed outcomes, and next moves while clearly separating observed facts, inference, and unknowns. **Value:** change becomes an operating rhythm rather than an occasional graph inspection.

## Workstream 9 - Brain Map ↔ ADHD-OS Constellation/Brain Mirror foundation (81-90)

81. **Shared platform-pure graph semantics** - Extract domain-neutral graph types, temporal events, confidence, provenance, and layout inputs that work in web, iOS, and static export. **Value:** both products improve from one tested foundation.
82. **Strict domain isolation** - Keep operator infrastructure observations and personal ADHD-OS signals in separate stores, adapters, permissions, analytics, and exports. **Value:** shared technology never becomes cross-domain surveillance.
83. **Shared visual and relationship grammar with domain-safe meaning** - Reuse spatial hierarchy, calm physics, focus tunnels, semantic zoom, and particle restraint; give Brain Mirror relations such as correlates, precedes, leads-to, and inhibits distinct accessible styles and plain-language caveats. **Value:** coherent identity without misleading or causal metaphors.
84. **Qualitative confidence without personal scoring** - Carry Constellation’s emerging/repeating/context-dependent/changing/strong model into uncertain inference; never import ecosystem health scores, failure framing, or diagnostic prediction into Brain Mirror. **Value:** uncertainty is comprehensible without fake precision or judgment.
85. **Constitutional wording layer** - Apply explicit language rules to recommendations, alerts, and summaries; extend Brain Mirror’s non-shaming, non-diagnostic, non-urgent wording protections. **Value:** the system informs without pressuring or pathologising.
86. **Consent and purpose-bound lenses** - Every Brain Mirror data source and Aurora use remains consented, revocable, purpose-specific, and DPIA-gated. **Value:** richer visualisation cannot expand data use silently.
87. **Local-first personal graph, annotations, and sharing** - Keep raw signals, graph construction, and private notes on-device by default; separate annotations from detector evidence and Aurora context; preview and redact user-reviewed exports; sync only consented abstractions with deletion controls. **Value:** trust and privacy improve without losing insight.
88. **Calm-start and question-led interaction profile** - Start Brain Mirror with only a few strongest/recently changed patterns, offer explicit progressive disclosure and question-led views such as “what supports me?”, and provide reduced motion, fewer labels, no urgency cues, and simple recovery navigation. **Value:** both operator and ADHD users can reduce cognitive load.
89. **User-correctable pattern-to-response exploration** - Adapt counterfactuals into a non-prescriptive view: “when this context appears, which support has helped before?” Let users rename, hide, mark not-about-me/not-useful, and undo without rewriting detector evidence. **Value:** topology becomes personally owned self-understanding, not scoring.
90. **Reciprocal usefulness and learning contract** - Maintain a governed backlog of renderer, accessibility, temporal, privacy, and explanation transfers; capture whether insights helped, suppress repeatedly unhelpful analysis, and require explicit acceptance tests in both domains. **Value:** the two systems evolve together without accidental coupling or engagement pressure.

## Workstream 10 - Architecture, quality, accessibility, and scale (91-100)

91. **Modular TypeScript source with a single-file release** - Separate versioned `GraphDocument` from mutable `RuntimeState`, centralize serializable commands, and split schema, adapters, store, analytics, layout, renderer, interactions, accessibility, export, and actions; still bundle a hashed self-contained `brain-map-v4.html`. **Value:** development becomes deterministic, testable, and maintainable without losing portability.
92. **Renderer abstraction with benchmark gate** - Keep Canvas2D initially, define a stable render contract, and adopt WebGL/WebGPU only when measured graph-size or effect budgets require it. **Value:** avoids an expensive rewrite driven by aesthetics rather than evidence.
93. **Worker-based deterministic layout and analytics** - Move physics and graph analytics off the main thread with fixed timesteps, seeded randomness, stable ordering, revision-safe transferable buffers, Barnes-Hut/spatial collision paths when benchmarks justify them, and exact small-graph fallback fixtures. **Value:** responsive UI and reproducible layouts.
94. **Adapter plugin architecture** - Load collectors through capability-scoped plugins with schema validation, timeouts, redaction, and failure isolation. **Value:** new systems integrate without destabilising the core.
95. **Offline-first snapshot application** - Cache the shell and last validated snapshot; clearly mark offline/stale state and queue no unsafe actions. **Value:** the map remains useful during outages without lying.
96. **Graph-scale performance budgets and scheduler** - Set device-class frame-time, interaction-latency, memory, load-time, and label-legibility gates for 26, 250, 1,000, and 10,000 nodes; benchmark dirty-state rendering, cached display lists, typed arrays, spatial indexes, and quality tiers before adopting them. **Value:** scalability claims and optimizations become evidence-led.
97. **Accessibility as a graph model** - Provide roving spatial arrow-key navigation, concise screen-reader neighbourhood/path summaries, synchronized table/tree alternatives, focus restoration, mobile list-first mode, 44px gesture-independent controls, contrast, text scaling, and a persistent pause-all-motion control. **Value:** accessibility covers graph meaning, not just controls.
98. **Neurodivergent cognitive-load and recovery controls** - Add calm-start complexity limits, three-step progressive detail, persistent orientation and navigation history, one-focus mode, low-load presets, interruption-safe “continue where you left off,” undo, plain-language labels, and optional density levels. **Value:** complex topology remains usable under variable attention and capacity.
99. **Security, privacy, and destructive-action threat model** - Test adapter boundaries, URL imports, shared links, exports, action authority, prompt injection, secret leakage, personal-data handling, denial-of-service, correction conflicts, and protected stop/delete/recovery flows. **Value:** the control plane fails closed.
100. **Evidence-bound release certification** - Require schema, unit, integration, replay, visual-regression, accessibility, performance, security, redaction, semantic-canary, rollback, and final-candidate hash checks before v4 replaces v3. **Value:** “complete” means demonstrably ready.

---

# Council synthesis

## Consensus map - adopt as written

- Truth, provenance, freshness, and unknown-by-default must precede new analytics or visuals.
- The event ledger and deterministic snapshots are the foundation for genuine time travel, diffs, incidents, and learning.
- Stable spatial memory, semantic zoom, focus tunnels, label hierarchy, and scarce motion are the correct visual direction.
- Decision value outranks spectacle: operator queues, decision cockpits, scenario comparison, and outcome triggers come before 3D, VR, or ambient effects.
- Brain Map and Brain Mirror should share platform-pure graph semantics, accessibility, confidence, and rendering principles while keeping data and domain logic strictly isolated.
- Modular TypeScript development should still produce a portable, self-contained HTML release.
- Accessibility, privacy, evidence, performance, and rollback are release gates, not follow-up polish.

## Debate map - decisions resolved

| Debate | Council tension | Decision |
|---|---|---|
| Renderer migration | WebGL/WebGPU could expand scale; current 26-node graph does not justify a rewrite | Keep Canvas2D behind a renderer contract. Promote another renderer only after representative benchmark failure. |
| Ecosystem score | One score is legible; one score can hide uncertainty and create false authority | Use a transparent multidimensional scorecard. Calculate a rollup only when evidence coverage passes a declared threshold. Never transfer the score to Brain Mirror. |
| Operational actions | Action dispatch creates operator value; direct mutation creates severe authority risk | Ship read-only Observe and Explain first. Admit Act features only through capability registry, dry run, authority, semantic canary, and rollback. |
| Shared foundation | Reuse prevents duplicated graph work; shared data or semantics could create surveillance or diagnostic harm | Share domain-neutral types, temporal primitives, confidence, accessibility, and renderer contracts only. Keep stores, adapters, analytics, permissions, and exports separate. |
| Per-item estimates | The plan needs ownership and kill rules; detailed estimates before technical discovery would be invented precision | Bind workstream owners and admission rules now. Require a completed item admission card before any item enters an implementation wave. |

## Novelty map - strongest council additions

- Priority command queue with act-now, schedule, monitor, and dismiss states.
- Goal-to-graph alignment and cross-objective conflict detection.
- Correlated multi-node failure and owner-unavailability scenarios.
- Pareto decision comparison instead of one composite score.
- Decision cockpit with authority, reversibility, unresolved questions, and outcome learning.
- Outcome watchlists that trigger reassessment when assumptions or evidence change.
- Calm-start Brain Mirror with question-led views and user-correctable interpretations.
- Operational briefings generated from real graph diffs and evidence.

## Red-flag map - must fail closed

- Simulated, cached, or configured values presented as live observations.
- Missing evidence rendered as green, healthy, verified, or complete.
- Raw logs, secrets, internal URLs, or personal signals escaping classification and redaction.
- AI recommendations presented without assumptions, uncertainty, evidence, and alternatives.
- Personal cognitive patterns rendered as diagnostic, failing, ranked, or objectively scored.
- State-changing actions available from read-only exploration or without authority and rollback.
- Renderer or infrastructure rewrites approved without measured bottlenecks.
- Motion, density, or canvas-only interactions that degrade reading, keyboard, screen-reader, touch, or reduced-motion paths.

---

# Twenty mandatory quality gates

- **G01 - Real capability:** Every item must change a user outcome, system capability, reliability property, or measurable performance characteristic. Cosmetic renames do not count.
- **G02 - Baseline subtraction:** State the exact v3 gap. Existing layouts, exports, command palette, timeline controls, accessibility modes, and basic analytics cannot be repackaged as new.
- **G03 - Stub replacement first:** Correct hardcoded or synthetic status, activity, health, cost, and score data before adding dependent visualisation.
- **G04 - Truth provenance:** Every fact has source, retrieval time, freshness policy, evidence, and observed/derived/declared/unknown classification.
- **G05 - No false live:** “Live,” “healthy,” “verified,” “predictive,” and “auto-discovered” require an executable end-to-end data path and test.
- **G06 - Unknown over green:** Failed requests, missing credentials, unsupported providers, and absent data render unavailable or unknown, never healthy.
- **G07 - Dependency reality:** External APIs, telemetry, logs, collaboration, or models require a named provider, auth boundary, contract, owner, cost, and degraded behavior.
- **G08 - End-to-end acceptance:** Tests cover source input, transformation, interface behavior, and failure behavior. A visible button is not completion.
- **G09 - Evidence artifact:** Completion produces an inspectable fixture, test, benchmark, accessibility report, screenshot comparison, export, receipt, or canary record.
- **G10 - Non-overlap:** Every item has one primary outcome and distinct acceptance evidence. Coupled work remains one vertical slice rather than padded entries.
- **G11 - Vertical-slice priority:** A small truthful source-to-decision workflow outranks generic event buses, plugin systems, renderer rewrites, or speculative analytics.
- **G12 - Decision-value ranking:** Frequency multiplied by consequence outranks cinematic effects, sonification, VR, multiplayer cursors, and demo-only modes.
- **G13 - Shared-core proof:** Core work states what can safely serve both products and what remains domain-specific.
- **G14 - Domain separation:** Infrastructure state and human cognitive patterns never share misleading health, failure, diagnosis, or prediction semantics.
- **G15 - Privacy and secret safety:** Classification, redaction, least privilege, and explicit export boundaries cover logs, paths, notes, signals, tokens, URLs, and metadata.
- **G16 - Write safety:** Canonical or external writes require validation, preview, explicit authority, audit history, conflict handling, semantic verification, and rollback.
- **G17 - Performance evidence:** Workers, WebGL, WebGPU, Barnes-Hut, typed arrays, caches, and culling require a benchmark naming dataset, device, frame time, latency, memory, and regression threshold.
- **G18 - Accessibility before spectacle:** Keyboard, text alternative, focus, screen reader, reduced motion, touch, contrast, and scaling gates must remain green before effects ship.
- **G19 - Phased dependencies:** Order is truth/schema, read-only decisions, reliability/accessibility, safe persistence/export, measured scaling, then experiments.
- **G20 - Capacity and kill rule:** Before implementation, every item receives owner, effort, dependencies, risk, acceptance evidence, target wave, defer criteria, and drop criteria. Items that cannot pass are merged, deferred, or removed rather than padded.

---

# Delivery ownership and admission matrix

| Items | Target wave | Accountable owner role | Indicative effort | Required preceding evidence | Primary risk | Required acceptance class | Defer/drop rule |
|---|---|---|---|---|---|---|---|
| 1-10 | Wave 1 | Graph/Data Architect | M-L | v3 baseline and source inventory | False authority or schema churn | Schema fixtures, migrations, redaction tests, truth report | Defer if authority hierarchy lacks owner; drop if no field-level consumer |
| 11-20 | Wave 2 | Temporal Data Lead | M-L | Items 1-10 green | Irreproducible or over-retained history | Replay fixtures, snapshot hashes, diff tests, retention test | Defer until source identity is stable; drop events with no decision value |
| 21-30 | Wave 2 | SRE/Observability Lead | M-XL | Truth kernel and provider contracts | False-live state or credential exposure | Adapter integration tests, collector-failure tests, semantic probes | Defer unavailable providers; drop collectors without owner or freshness policy |
| 31-40 | Wave 3 | Graph Analytics Lead | M-XL | Valid topology, temporal evidence, typed relations | Confident but unsupported inference | Golden graph fixtures, uncertainty tests, explanation review | Defer weak data; drop analysis that cannot change a decision |
| 41-50 | Wave 4 | Product Design + Frontend Lead | S-L | Stable semantics and v3 visual baseline | Visual noise or lost orientation | Visual regression, legibility, interaction, reduced-motion evidence | Defer if semantics are unsettled; drop effects without unique meaning |
| 51-60 | Wave 4 | Platform Governance Lead | L-XL | Read-only flows, capability registry, authority model | Unsafe or irreversible mutation | Dry-run, approval, canary, heartbeat, rollback, audit trace | Defer without authority/rollback; drop direct writes outside registry |
| 61-70 | Wave 3 | Knowledge/Governance Lead | M-L | Identity, evidence, ownership sources | Stale claims or invented business truth | Drift fixtures, source reconciliation, policy and data-flow review | Defer ownerless sources; drop claims lacking authority evidence |
| 71-80 | Wave 4 | Product/Collaboration Lead | M-L | Snapshots, redaction, scoped identity | Moving evidence or oversharing | Immutable-view hash, permission, export, narrative accuracy tests | Defer server features without real need; drop engagement-only mechanics |
| 81-90 | Wave 5 | Constellation + Privacy Lead | M-XL | Shared semantic contract and domain-isolation proof | Surveillance, diagnosis, shame, or consent expansion | Platform-pure tests, constitution, consent, deletion, redacted export review | Defer while DPIA gate blocks use; drop any cross-domain data coupling |
| 91-100 | Waves 0, 1, 6 | Platform/Quality Lead | M-XL | v3 frozen baseline and representative benchmarks | Premature rewrite or unverifiable release | Determinism, browser, accessibility, performance, threat, canary, rollback certification | Defer optimisations without benchmark; drop architecture with no vertical-slice consumer |

## Mandatory item admission card

Before an item moves from this plan into execution, its owner must record:

```yaml
item_id: 1-100
owner: named human or accountable agent role
effort: S | M | L | XL
dependencies: exact item IDs and external authorities
risk: primary failure or harm mode
acceptance_test: reproducible end-to-end command or scenario
evidence_artifact: exact expected path, report, receipt, screenshot set, or benchmark
target_wave: 0-6
defer_if: explicit condition
drop_if: explicit condition
rollback_or_fallback: required for mutations and migrations
```

No item is implementation-ready until this card is complete and G01-G20 pass.

---

# Dependency-wave implementation roadmap

## Wave 0 - Preserve and measure the v3 baseline

**Purpose:** Prevent a rewrite from destroying the qualities the user approved.

- Freeze screenshots, interaction recordings, graph fixtures, performance numbers, accessibility behavior, and exports for `f89e12f`.
- Create a v3 capability matrix and mark each feature as preserve, replace, or retire.
- Establish visual acceptance: Meridian palette, calm force physics, particles used as meaning, cluster topology, stable focus, and Constellation relationship.
- Do not replace `brain-map-v3.html`; keep it as the fallback and portable reference.

**Gate:** v3 can be loaded and behavior-tested independently throughout v4 work.

## Wave 1 - Truth kernel

**Items:** 1-10, 81-82, 91, 94, 99.

- Implement canonical schema, identity registry, authority rules, evidence envelope, freshness, redaction, and modular boundaries.
- Build fixture adapters before live providers.
- Define the strict Brain Map/Brain Mirror data separation contract.

**Gate:** Every rendered operational field resolves to a validated source record or explicit unknown; no static “live” claim remains.

## Wave 2 - Temporal and live evidence

**Items:** 11-30, 95.

- Add event storage, snapshots, diffs, adapters, collection health, drift, multi-layer health, and user-path probes.
- Replace simulation-only health/deploy/log behavior with fixture mode plus real adapter mode.

**Gate:** A release and controlled fault can be replayed from source evidence, with stale collectors distinguished from unhealthy targets.

## Wave 3 - Decision intelligence

**Items:** 31-40, 61-70.

- Add typed relations, capability paths, reliability/risk analysis, scenarios, recommendations, documentation drift, ownership, and readiness contracts.
- Bind every inference to evidence and uncertainty.

**Gate:** The system identifies a seeded single point of failure and configuration drift, explains both, and proposes a bounded verified response without overstating confidence.

## Wave 4 - Spatial product and safe operations

**Items:** 41-60, 71-80.

- Implement Observe/Explain/Act, semantic zoom, focus tunnels, lenses, evidence drawer, action registry, dry runs, runbooks, canaries, rollback, incident workspace, and shared decision views.

**Gate:** An operator can investigate, dry-run, authorize, execute, verify, and if needed roll back one low-risk test action from a single trace, while read-only mode remains incapable of mutation.

## Wave 5 - Constellation/Brain Mirror transfer

**Items:** 83-90, 97-98.

- Port only domain-neutral semantics and verified interaction patterns.
- Keep the existing Constellation platform-pure leaf, constitution, confidence model, consent, and DPIA gate authoritative.
- Validate web, iOS/Skia, and text alternatives separately.

**Gate:** Shared fixtures produce equivalent topology semantics across Brain Map web, Brain Mirror web, and iOS without sharing operational or personal source data.

## Wave 6 - Scale and release certification

**Items:** 92-93, 96, 100.

- Benchmark Canvas2D, then make an evidence-led renderer decision.
- Add worker layout, scale fixtures, complete security/accessibility/performance tests, and final immutable review.

**Gate:** The unchanged final candidate passes all certification checks and v3 remains an immediate fallback until semantic canaries prove v4 in use.

---

# Prioritisation model

Score every item from 0-5 on:

- **Decision value** - changes a real operator or user decision.
- **Truth gain** - improves freshness, provenance, evidence, or uncertainty.
- **Risk reduction** - prevents failure, privacy harm, false completion, or unsafe action.
- **Cross-product transfer** - benefits both Brain Map and Constellation/Brain Mirror safely.
- **Frequency** - supports a common workflow rather than a rare showcase.
- **Effort** - inverse scored; smaller verified increments rank higher.
- **Dependency enablement** - enables multiple later items.

**Priority formula:** `(2 × decision value) + (2 × truth gain) + (2 × risk reduction) + cross-product transfer + frequency + dependency enablement + effort`.

**P0 foundation:** 1-7, 9-12, 21-26, 41-44, 81-86, 91, 94, 99-100.

**P1 operator value:** 13-20, 27-40, 45-60, 61-66, 70-80, 87-90, 93, 95, 97-98.

**P2 scale/portfolio:** 67-69, 92, 96. Promote when benchmarks or operating scale justify them.

---

# Acceptance scorecard

| Dimension | v4 release requirement |
|---|---|
| Truth | 100% of rendered operational facts have evidence metadata or explicit unknown state |
| Freshness | Stale data is detected and visually distinct; no stale green status |
| Replay | Same snapshot + seed produces the same topology state and analytical outputs |
| Drift | Seeded source/build/runtime mismatch is detected and explained |
| Safety | No state-changing action works from read-only mode; high-risk actions require declared authority, dry run, canary, and rollback |
| Privacy | Secret fixtures and personal-data fixtures never appear in unauthorized exports or links |
| Accessibility | Core investigation workflow is complete by keyboard and text/tree view; screen reader paths are understandable |
| Cognitive load | One-focus and low-stimulation modes preserve full essential meaning without particles or nonessential motion |
| Performance | Published frame-time, latency, memory, and load budgets pass at each supported graph scale |
| Visual quality | Stable layout, label legibility, focus hierarchy, and Meridian design pass screenshot and interaction regression review |
| Constellation | Shared semantics pass platform-pure tests; personal data remains consented, purpose-bound, and DPIA-gated |
| Operations | Controlled action produces one trace containing intent, authority, command, progress, canary, outcome, and rollback evidence |
| Release | Final review is bound to the unchanged candidate hash; v3 rollback remains proven |

---

# Likely files and modules

The exact structure should be confirmed during Wave 1, but the plan assumes:

- Preserve: `brain-map-v3.html`
- Create: `brain-map-v4/` application shell
- Create: `brain-map-v4/src/schema/`
- Create: `brain-map-v4/src/identity/`
- Create: `brain-map-v4/src/adapters/`
- Create: `brain-map-v4/src/events/`
- Create: `brain-map-v4/src/graph/`
- Create: `brain-map-v4/src/analytics/`
- Create: `brain-map-v4/src/layout/`
- Create: `brain-map-v4/src/render/`
- Create: `brain-map-v4/src/interactions/`
- Create: `brain-map-v4/src/actions/`
- Create: `brain-map-v4/src/accessibility/`
- Create: `brain-map-v4/src/export/`
- Create: `brain-map-v4/src/security/`
- Create: `brain-map-v4/tests/fixtures/`
- Create: `brain-map-v4/tests/replay/`
- Create: `brain-map-v4/tests/visual/`
- Coordinate shared types with ADHD-OS `src/app/constellation/` only through a reviewed platform-pure contract; do not import application UI or data across repos.

---

# Risks and controls

1. **Dashboard sprawl:** Enforce Observe/Explain/Act modes and semantic zoom budgets.
2. **False live state:** Unknown-by-default, collection health, freshness expiry, and evidence envelopes.
3. **Unsafe control plane:** Capability registry, authority separation, dry runs, canaries, rollback, and read/action isolation.
4. **AI overclaiming:** Evidence-bound recommendations, qualitative confidence, explicit assumptions, and human authority.
5. **Visual noise:** Stable mental map, progressive disclosure, motion reserved for meaning, and low-stimulation mode.
6. **Premature renderer rewrite:** Renderer abstraction and benchmark gate before WebGL/WebGPU adoption.
7. **Sensitive-data leakage:** Strict domain stores, redaction classes, scoped links, export tests, and Constellation consent/DPIA gates.
8. **Monolith replacement risk:** Strangler migration, v3 fallback, fixture parity, and wave-level acceptance.
9. **Identity/history corruption:** Stable IDs, aliases, versioned schemas, and deterministic migrations.
10. **Shared-core overreach:** Share domain-neutral semantics and craft only; keep operator and personal analytics separate.

---

# Definition of “100% up to date” for Brain Map v4

The phrase must mean all of the following, not merely “the HTML file was recently edited”:

- The canonical inventory matches current discoverable systems and approved registries.
- Every collector reports its own health and last successful observation.
- Every visible status is fresh enough for its declared policy or marked stale/unknown.
- Git, built artifacts, deployment manifests, provider state, and live runtime are reconciled.
- Open conflicts and owner/provider blockers are visible with evidence handles.
- The current graph snapshot is hash-bound and reproducible.
- Brain Map and Brain Mirror shared contracts are version-aligned.
- No unauthorised sensitive field is present in the current view or export.
- The release candidate has passed its semantic canaries and rollback proof.
- The UI displays the exact observation timestamp and truth-quality status.

---

# Planning verdict

The highest-value next move is **not more visual effects**. It is the **truth kernel**: canonical identities, evidence envelopes, freshness, source authority, event history, and real adapters. That foundation turns the approved force-physics/particle experience into an operating instrument and gives ADHD-OS Constellation/Brain Mirror a trustworthy shared graph language. Visual refinements should follow the data semantics so every pulse, edge, colour, and motion has a defensible meaning.
