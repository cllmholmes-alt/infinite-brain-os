# TALOS MAXIMUM CAPABILITY SPEC v2.0

## Total Agentic Lifecycle Orchestration System - Master Build Specification

### Source authority: TALOS one-shot build prompt (binding). Brand authority: Floral Stone brand kit + supplied visual references (binding for identity surfaces).

---

## 1. Executive Definition

**One paragraph.** TALOS is a local-first, governed, evidence-first agentic operating system that converts human intent - spoken once, in one chat - into long-horizon, verified, multi-agent execution across software builds, business workstreams, research, GTM, audits, and self-improvement, while making it structurally impossible for any agent, model, tool, or external content to act beyond an explicit, expiring, scoped permission lease, to claim completion without machine-verifiable evidence, or to touch the outside world (send, publish, deploy, pay, merge) without a human approval that cannot be replayed, forged, or self-granted. TALOS is "near-AGI-like" through orchestration, not through a new base model: frontier-model routing, planner→executor→independent-verifier loops, self-authored skills and MCP servers (eval-gated before use), a governed Obsidian-style memory graph with versioning and rollback, counterfactual replay, benchmark-gated agent promotion, and a hash-chained evidence ledger that makes every claim traceable from statement → evidence → source → approval.

**Technical architecture summary.** A pnpm/Turborepo TypeScript monorepo: Next.js App Router Command Centre (chat-first UI), Fastify `/api/v2` (Zod-validated, workspace-scoped, idempotent, audit-middleware on every mutation), PostgreSQL via Prisma as the single source of truth, Redis + BullMQ workers for all execution (ten domain queues), a content-addressable evidence store on local disk, a Markdown vault (`/brain/vault`) mirrored into a Graph IR in Postgres, and an authority spine - ExecutionCoordinator → Permission Lease + Trust Engine (PLTE) → Approval Engine → Resource Governor → Tool Contract Layer - through which **every** model call and tool call must pass. No UI-to-tool path exists. No agent-to-agent authority grant exists. All state-changing events are event-sourced (outbox pattern) and replayable; the audit log is append-only and hash-chained with periodic checkpoint anchors. Desktop (Tauri), voice, and mobile surfaces are thin clients over the same authority pipeline - they add zero new authority.

---

## 2. Non-Negotiable System Law (TALOS_SYSTEM_LAW.md - enforced by tests)

Prime Law (verbatim, protected, test-enforced):

1. **No claim without evidence.** Every factual/status claim links `claim → evidence_item(s) → source_ref` or carries an explicit uncertainty label (`EvidenceStatus: inferred | unknown`). Missing evidence blocks completion - `completion-gate.ts` fails closed.
2. **No code without tests.** Every mutation route, authority decision, state machine transition, and tool contract ships with tests. CI gate `verify:gates` blocks merge on uncovered mutation paths.
3. **No deployment without gates.** Release requires a Release Packet: passing tests, AURIS audit, security scan, rollback plan, human approval. `run-gates.ts` is the only path to a deployment record.
4. **No autonomy without permissions.** Every action resolves an AuthorityDecision through PLTE. Expired/revoked/out-of-scope/replayed/low-trust ⇒ fail closed (`DENY` or `QUARANTINE`).
5. **No learning without rollback.** Every memory mutation creates a version + rollback edge. Every SOP, skill, MCP, and agent-version promotion is reversible in one operation.
6. **No completion without traceability.** `COMPLETE_VERIFIED` requires a full Graph IR trace: task → agent runs → tool runs → evidence → verifier decision → (approval if required).

Expanded corollaries (all enforced, all tested):

- No fake completion; no fabricated evidence, tests, or citations (contentHash verification; `verify:evidence`).
- No hidden assumptions - undocumented inferences go to `IMPLEMENTATION_DECISION_REGISTER.md` or `UNKNOWN_BLOCKED_REGISTER.md`.
- No secret leakage: secret handles only; redaction pipeline runs pre-LLM and pre-log; `security/secret-redaction.test.ts`.
- No client-settable authority: workspace/role/risk resolved server-side only; client fields ignored.
- No raw unrestricted tool execution: unregistered tool ⇒ `DENY`; forbidden action ⇒ fail closed.
- No external/customer/public action (send, publish, deploy, pay, contact, post) without human approval; critical class requires nonce-bound exact phrase.
- No protected-branch merge, no production deploy, no gate weakening, no permission expansion, no system-law change without human sign-off. **Capability ≠ authority.**
- No memory promotion without source links, evidence, scope, confidence, and rollback edge.
- No self-evolution acceptance without human approval; self-evolution operates on branches only.
- No agent self-approval of its own high-risk authority - structurally blocked in `authority-decision-engine.ts` (requester identity ≠ approver identity, tested).
- No prompt-injection authority: external content (web, email, docs, tool output, screen text) can never grant, extend, or approve anything - content is data, never command (taint-tagged, tested).
- No CAPTCHA/MFA bypass, ever. Pause, create approval-class `human_only`, wait.
- No raw chain-of-thought exposure: agents emit safe thinking summaries only (objective, plan summary, blockers, next action, confidence, evidence links).

Mandatory honesty formats:

```
STATUS: DRAFTED / UNVERIFIED   Reason: [specific blocker]
STATUS: BLOCKED                Reason: [specific blocker]   Safe next action: [specific repair]
```

`verify:system-law` script asserts: law file exists and hash-matches registered version; protected rules have corresponding passing tests; any diff to the law file requires an approval record of class `human_only`.

---

## 3. Source Authority Map (SOURCE_AUTHORITY_MAP.md)

| Requirement                                                                                                                                                                                                                                                                                                                                             | Classification                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Prime Law, honesty formats, fail-closed rules                                                                                                                                                                                                                                                                                                           | SOURCE-DIRECT                                                                               |
| Stack (Next.js, Fastify, Prisma, Postgres, Redis/BullMQ, pnpm/Turbo, Vitest, Playwright)                                                                                                                                                                                                                                                                | SOURCE-DIRECT                                                                               |
| Repo tree, root file contracts, .env keys, docker-compose services                                                                                                                                                                                                                                                                                      | SOURCE-DIRECT                                                                               |
| Enums (LifecycleState, MissionState, RiskLevel, ApprovalPosture, AuthorityDecision, EvidenceStatus, AgentRunStatus)                                                                                                                                                                                                                                     | SOURCE-DIRECT                                                                               |
| Schema list, DB table list, API route list, queue list                                                                                                                                                                                                                                                                                                  | SOURCE-DIRECT                                                                               |
| ExecutionCoordinator pipeline and modules                                                                                                                                                                                                                                                                                                               | SOURCE-DIRECT                                                                               |
| PLTE lease types, decisions, rules, required tests                                                                                                                                                                                                                                                                                                      | SOURCE-DIRECT                                                                               |
| Approval classes, card fields, exact-phrase mechanics, approval-required action list                                                                                                                                                                                                                                                                    | SOURCE-DIRECT                                                                               |
| Evidence types/fields/rules; memory vault layout, authority levels 0-8, frontmatter                                                                                                                                                                                                                                                                     | SOURCE-DIRECT                                                                               |
| Graph node/edge types and required traces                                                                                                                                                                                                                                                                                                               | SOURCE-DIRECT                                                                               |
| Agent registry roster + contract fields; AgentMesh packet types + envelope                                                                                                                                                                                                                                                                              | SOURCE-DIRECT                                                                               |
| Model routing rules (non-standard output provisional; review tiers)                                                                                                                                                                                                                                                                                     | SOURCE-DIRECT                                                                               |
| Tool contract fields/categories/safe-tool list; workflow registry                                                                                                                                                                                                                                                                                       | SOURCE-DIRECT                                                                               |
| UI nav, page roles, board columns, tabs, card fields, empty states                                                                                                                                                                                                                                                                                      | SOURCE-DIRECT                                                                               |
| SOP suite, Deep Research Engine, SignalForge ladder (0-8, cap at 5 online), AURIS, ACE, Desktop Runtime scaffold                                                                                                                                                                                                                                        | SOURCE-DIRECT                                                                               |
| Security requirements, testing matrix, seed rules, phases G0-G10, acceptance criteria, final report format                                                                                                                                                                                                                                              | SOURCE-DIRECT                                                                               |
| Mythos Kernel, Live Work Observatory, OmniVision, App Simulator, Design Lab, Manus adapters, Voice Layer, Benchmark Suite, Resource Governor (named in output-structure source; internals unspecified)                                                                                                                                                  | SOURCE-INFERRED - internals designed here                                                   |
| Floral Stone palette/typography (Floral White #FAF7EF, Quiet Canvas #F2EFEA, Weather Stone #D8D1C5, Aged Brass #B49A63, Black Olive #32372C, Carbon Black #121314; display/body/mono token stack; dark-stone + marble + brass-hairline visual identity per reference images)                                                                            | SOURCE-DIRECT (brand kit + images)                                                          |
| Event sourcing/outbox, CAS evidence store, hash-chain checkpoints, sandboxing, semantic cache, SkillForge, MCP Factory, dry-run/blast-radius, shadow agents, counterfactual replay, trust decay, attention budget, kill switches, watchdogs, autonomy ladder, hybrid retrieval, benchmark harness, cost forecasting, crash-recovery journal, OTel spans | IMPLEMENTATION-SYNTHESIS (§ self-audit; each has decision-register entry + rollback impact) |
| Exact model vendor list at runtime; SMTP/Telegram creds; external MCP endpoints; production infra targets; legal/compliance jurisdictions                                                                                                                                                                                                               | UNKNOWN/BLOCKED (register entries; never invented)                                          |
| Postgres over SQLite; BullMQ over Temporal; local CAS over S3; Tauri over Electron; pgvector optional                                                                                                                                                                                                                                                   | DECISION-LOCK (recorded with alternatives rejected + rollback impact)                       |

---

## 4. Maximum Architecture - System of Systems

Layered. Arrows are the only legal data/authority paths. Anything not drawn does not exist.

```
HUMAN ──► Command Chat ─► Mythos Kernel ─► Lifecycle Orchestrator ─► Agent Workforce
   ▲            │                │                    │                    │ (AgentMesh)
   │            ▼                ▼                    ▼                    ▼
Approvals ◄─ Approval Engine ◄─ PLTE ◄────── Authority Gate ◄──── Tool Contract Layer
   │            │                │                    │                    │
   │            ▼                ▼                    ▼                    ▼
   └──── Evidence Ledger ◄── Execution Plane (BullMQ workers, sandboxes) ─► Tools/MCPs/Skills
                │                                                          │
                ▼                                                          ▼
        Obsidian Brain + Graph IR ◄── Verifiers ◄── Live Work Observatory (read-only telemetry)
```

1. **Command Chat** - the only human command surface. NL → intent → mission. Renders workstream/approval/evidence/routing cards. Never shows raw agent internals.
2. **Mythos Kernel** - the governed core runtime (name for the composed spine): intent classifier, mission compiler, risk classifier, task-graph builder, lifecycle state machine, ExecutionCoordinator, event-sourced command log (outbox), idempotency ledger, correlation/causation propagation (OTel-style spans), crash-recovery journal, kill-switch hierarchy (global halt → per-business halt → per-agent quarantine), watchdog heartbeats + duty-cycle governor.
3. **Lifecycle Orchestrator** - drives the 20-state LifecycleState machine per workstream; every transition validated, evidenced, and audit-logged; illegal transitions fail closed.
4. **Agent Workforce** - registry-defined agents (§6) with contracts, eval rubrics, versioning, shadow-mode candidates, benchmark-gated promotion, automatic demotion on eval regression.
5. **AgentMesh** - typed structured messaging (§ envelope from source); reference-not-repeat (`evidence://`, `task://`, `mission://`, `graph://`, `repo://`); blob refs for large payloads; messages carry zero authority; all state-affecting messages replayable from the event log.
6. **Tool Contract Layer** - every tool is a registered contract (schema-validated I/O, risk, posture, timeout, rollback strategy). Adds: **dry-run mode** (every mutating tool must implement `simulate()` producing a diff/plan artifact shown on approval cards) and **blast-radius estimator** (Graph IR query computing affected entities, attached to every authority decision).
7. **PLTE** - leases (time/mission/app/surface/data-class/action-class/tool/secret/desktop/location/sensor/communication/external-agent/self-evolution), trust scoring with **behavioral baseline + decay** (trust drops on anomaly: novel device, novel hour, novel action pattern, velocity spike), nonce-bound exact-phrase engine, revocation engine, lease-evidence recorder, hash-chained authority audit. **Progressive autonomy ladder:** posture per (agent, action-class) starts strict and relaxes only via evidence-backed track record; auto-demotes on failure/violation. Ladder changes above `notice_only` require human approval.
8. **Approval Engine** - classes `not_required → notice_only → standard → exact_phrase → step_up → human_only → blocked`; **human attention budget**: batched approval digests, per-class SLAs, escalation on expiry, "revise" round-trips; approval cards always show dry-run diff + blast radius + rollback path.
9. **Evidence Ledger** - content-addressable store (SHA-256 CAS under `/data/evidence`, dedup by hash), typed items, claim maps, contradiction detector, trace builder, redactor. Every tool run, test, build, approval, audit, deployment emits evidence. Evidence is rejectable, never silently deletable.
10. **Obsidian Brain** - governed Markdown vault + authority levels 0-8, promotion pipeline with approval at ≥5, versions + rollback edges, staleness marking (`refresh_due_at`), contradiction surfacing that **auto-triggers re-research missions** (draft-only). Hybrid retrieval: keyword (Postgres FTS) + optional pgvector; RAG answers are citation-required (uncited spans are labeled `unknown`).
11. **Graph IR** - nodes/edges per source; powers traces, blast radius, impact analysis, AURIS diffing, memory lineage.
12. **Live Work Observatory** - read-only real-time telemetry: worker roster, queue depths, token spend, active leases, approvals pending, incident feed. Strictly observational; zero controls that mutate state (buttons deep-link to governed actions elsewhere).
13. **Deep Research Engine** - planner → acquisition → normaliser → evidence extractor → claim builder → reliability scorer → contradiction engine → synthesis → research audit → brain/graph handoff. No fabricated citations; retrieved ≠ true.
14. **SignalForge** - demand-evidence compiler; validation ladder 0-8; online evidence caps at Level 5; 6-8 require real conversion evidence; all outreach draft-only until approved.
15. **AURIS** - intended-vs-actual build-reality auditor; runs as npm script, in CI, and on schedule; feeds System Watch + Evidence & Audits; writes remediation tasks.
16. **Standardisation Suite** - learning signals → SOP candidates → review → gate-enforced SOPs, exceptions, training, regression tests.
17. **Autonomous Codebase Evolution (ACE)** - repo observer → gap detector → scored candidates → branch-only implementation → tests + AURIS → approval packet (diff, blast radius, rollback plan) → human merge. Includes **counterfactual replay**: rerun recorded historical missions against candidate agent/code versions in sandbox and attach comparative evals to the packet.
18. **SkillForge (self-created skills)** - TALOS drafts skill definitions (procedure + schema + eval set) from repeated successful patterns; skills are versioned artifacts; a skill becomes usable only after passing its eval suite in sandbox + (risk≥medium) human approval; rollback = version pin revert.
19. **MCP Factory** - generates MCP server scaffolds from tool contracts; sandbox-tested against contract schemas; registered as tools with the same PLTE/approval posture; external/third-party MCPs are always `approval_gated` minimum and taint-tagged.
20. **OmniVision + Action Layer** - screen observation (`browser.observe`, future desktop observe) is read-only by default; any act-on-screen capability is a distinct `desktop-control` lease, dry-run-first, human-only for credentials/payment surfaces; screen text is tainted data (never command). CAPTCHA/MFA ⇒ stop + human.
21. **Desktop Runtime / Launch Kernel** - Tauri scaffold: portable root resolver, runtime manifest, preflight engine, service supervisor, resume engine, autonomous scheduler (only schedules pre-approved recurring automations), tray. Does not block web MVP.
22. **App Simulator** - sandboxed environment (Docker profile) where agents exercise built apps E2E via Playwright before release packets; simulator results are evidence.
23. **Design Lab / Claude Design Bridge** - governed design workspace: brand tokens (Floral Stone) as machine-readable `packages/design-system/tokens.json`; visual-QA auditor compares built UI screenshots against tokens/specs; external design tools connect via MCP adapters (draft-only writes).
24. **External Execution Adapters (Manus-class)** - any external agent/executor is wrapped as a tool contract with `external-agent` lease type, taint-tagged output, approval-gated external effects, and full evidence capture. External agents inherit zero TALOS authority.
25. **Business Operations Engine** - workstreams, boards, GTM workflows, CRM-handoff drafts, cost attribution per business/mission, budget forecasts + circuit breakers.
26. **Communication Layer** - notification service (internal first; email/Telegram optional creds), approval digests, incident pages. All outbound external comms approval-gated.
27. **Voice Layer** - STT/TTS thin client → same `POST /command/message`; voice adds a channel-trust factor in PLTE (voice channel cannot pass `exact_phrase` or `step_up` - those require typed/authenticated surfaces).
28. **Benchmark/Eval Suite** - golden-task suites per agent role; model evals; regression gates in CI; promotion/demotion inputs.
29. **Resource Governor** - per-mission/agent/model budgets (tokens, $, wall-clock, tool-call count), duty cycles, semantic cache (prompt-hash cache with staleness rules; cache hits recorded as evidence with provenance), circuit breakers that flip missions to `BLOCKED` with reason on budget exhaustion.
30. **Security/Anti-Exploitation Layer** - taint tracking on all external content; injection test corpus in CI; secret-handle vault; data-class labels on every evidence item and memory note; redaction pre-LLM/pre-log; SBOM + dependency audit in gates; append-only audit with hash-chain checkpoint anchors written as evidence.

---

## 5. Intelligence Model - "Near-AGI Through Orchestration"

TALOS never claims a new base model. Capability is composed:

1. **Frontier model router** (`packages/prompts` + `model-routing.schema.ts`): policy = Pareto(cost, latency, quality) per task class; routing modes `auto | pinned | economy | quality`; every brain run records `{agentId, taskId, selectedModel, standardBrainForAgent, isNonStandardBrain, reason, riskLevel, outputMode, reviewRequired, evidenceRefs, acceptanceDecision}`. Non-standard/cheap model output is **provisional**: cannot enter memory, repo, public artifacts, deployments, or accepted truth without review. Coding ⇒ technical review + tests. Strategic/public ⇒ reasoning review. High-risk (architecture/security/permissions/memory/law) ⇒ dual review + human approval.
2. **Planner → Executor → Independent Verifier loops**: verifier agents are distinct identities with **verify-by-redo** where feasible (re-run tests, re-fetch sources, re-compute diffs) rather than "looks good" review; verifier output is evidence.
3. **Self-play & shadow mode**: candidate agent versions run in shadow against live task streams (no side effects - dry-run tools only), scored against incumbents by the Benchmark Suite before promotion.
4. **Reward scoring & evals**: every agent run scored against its rubric; scores feed trust, autonomy ladder, and learning signals.
5. **Memory + Graph reasoning**: retrieval is hybrid, citation-required; contradictions spawn re-research; stale knowledge is flagged, never silently trusted.
6. **Tools, Skills, MCPs**: capability expansion is itself governed content (SkillForge, MCP Factory) - eval-gated, versioned, rollback-able.
7. **Counterfactual replay**: past missions re-runnable in sandbox against new agents/models/skills; deltas become evidence for promotion decisions.
8. **Human authority as the apex**: approvals, exact phrases, step-up auth, and human-only classes are the ceiling on every loop. Intelligence scales; authority does not.

---

## 6. Agent Workforce

Contract fields (every agent, in `packages/agents/src/registry/agent-registry.v0.json`):
`id, name, layer, purpose, owns, doesNotOwn, allowedToolIds, forbiddenToolIds, approvalPosture, maxRiskLevelWithoutApproval, promptPath, evalRubricPath, outputSchemaId, escalationAgentId, failureModes, defaultBrainProfile, allowedBrainProfiles, memoryScope, sopRequirements, version, benchmarkSuiteId, autonomyLadderState`.

Hierarchy (roster is SOURCE-DIRECT; per-agent contract summaries below - full contracts generated by `generate-agent-pack.ts`):

**Executive layer**

- `high-chair` - arbitration + final internal escalation. Owns: cross-mission conflict resolution. Does not own: external actions, approvals (human-only). Tools: memory.query, graph, evidence.write. Posture: draft_only. Escalates to: HUMAN. Failure modes: over-arbitration ⇒ SLA'd decisions.
- `executive-strategy` - portfolio strategy drafts. Draft_only; low risk max; escalation: high-chair.
- `risk-auditor` - risk classification review on medium+ missions. Read tools only. Cannot lower a risk level assigned by the classifier without dual review.
- `governance-auditor` - samples authority decisions/leases/approvals for law compliance; writes audit findings. Read + evidence.write only.

**Command layer**

- `command-interpreter` - NL → structured intent. Owns intent classification; does not own execution. Tools: none external. notice_only.
- `mission-compiler` - intent → mission + evidence requirements + risk posture. draft_only.
- `task-graph-planner` - mission → DAG with dependencies, gates, verifier nodes. draft_only.

**Product/build layer**

- `product-manager` (specs, acceptance criteria), `chief-architect` (ADRs; high-risk ⇒ dual review + human), `code-planner` (implementation plans), `frontend-engineer`, `backend-engineer`, `database-engineer` (migrations are approval_gated), `test-automation` (owns test authorship; cannot mark own tests as the verifier), `code-reviewer` (verifier identity; forbidden from authoring what it reviews), `release-manager` (assembles Release Packets; cannot deploy - deployment is human-approved, gate-run).

**Research/business layer**

- `deep-research-director`, `source-researcher` (acquisition; taint-tags all retrieved content), `signalforge-analyst` (ladder scoring; hard cap Level 5 from online evidence), `pain-point-identifier`, `offer-architect`, `gtm-architect`, `sales-copy-agent` (all customer-facing copy draft_only), `support-analyst`.

**Design layer**

- `design-authority` (token guardian; owns Floral Stone token enforcement), `ux-architect`, `ui-designer`, `accessibility-auditor` (WCAG AA gate), `visual-qa-auditor` (screenshot-vs-token diffs ⇒ evidence).

**Ops layer**

- `automation-operator` (runs pre-approved recurring automations only), `evidence-steward` (ledger hygiene, contradiction triage), `memory-steward` (promotion pipeline; cannot promote to ≥5 without approval), `sop-standardisation-agent`, `incident-manager` (may pause missions autonomously - pausing is always safe; may never resume high-risk without human).

**Security layer**

- `security-engineer` (threat models, scan triage), `permission-auditor` (lease/anomaly review; can trigger REVOKE_AND_ESCALATE), `secret-guardian` (secret-handle issuance; never exposes values; human_only for new secret creation/rotation).

**Special**

- `auris-build-reality-auditor` - intended-vs-actual audits; remediation queue writer.
- `autonomous-codebase-evolution-agent` - branch-only self-improvement; approval packets; forbidden: merge, deploy, gate/permission/law edits.

**QA/audit + worker agents** - generic queue executors bound to tool contracts; zero standing authority; identity = (agentId, version, leaseId) per run.

Universal agent rules (tested): no unregistered tools; no permission excess; no self-approval; no self-completion without evidence gate; no raw chain-of-thought - safe summaries only (objective, plan summary, blockers, next action, confidence, evidence links); eval regression ⇒ automatic autonomy demotion + learning signal.

---

## 7. Data Model

Prisma/PostgreSQL. Every mutation table: `workspaceId`, `createdAt`, `updatedAt`. Every action row: `actorRef` (`human:{userId}` | `agent:{agentId}@{version}` | `system:{service}`), `correlationId`, `causationId`. All FKs indexed; workspace isolation enforced by scoped queries + tests.

Domains and tables (SOURCE-DIRECT set, plus synthesis additions marked ✚):

- **Identity:** workspaces, users, roles, permissions, workspace_memberships, ✚devices (trust factors), ✚sessions.
- **Business/product:** businesses, products, projects, repositories, environments, services.
- **Execution:** missions, workstreams, tasks, task_dependencies, requirements, specifications, architecture_decisions, ✚event_log (append-only outbox: `{eventId, type, aggregate, payload, correlationId, causationId, occurredAt}`), ✚idempotency_keys, ✚recovery_journal.
- **Agents:** agents, agent_roles, agent_permissions, agent_runs, agent_messages, agent_handoffs, agent_evaluations, ✚agent_versions, ✚shadow_runs, ✚benchmark_results.
- **Tools/skills/MCPs:** tool_contracts, tool_runs, tool_permissions, tool_errors, ✚skills, ✚skill_versions, ✚skill_eval_results, ✚mcp_servers, ✚mcp_registrations, ✚dry_run_artifacts.
- **Evidence:** evidence_items (with `contentHash` → CAS path, `sensitivity` data-class), evidence_claims, evidence_links, artefacts, source_refs, verification_records, ✚taint_tags, ✚cas_objects.
- **Approvals/authority:** approval_requests, approval_decisions, approval_challenges (nonce, phrase, expiresAt, missionBinding, actionBinding), approval_events, permission_leases, trust_checks, authority_decisions, ✚autonomy_ladder_states, ✚blast_radius_estimates, ✚approval_digests.
- **Memory/brain:** memory_items, memory_versions, memory_scopes, memory_refresh_rules, memory_promotion_requests, rollback_edges, brain_notes, ✚contradiction_records, ✚retrieval_citations.
- **Graph:** graph_nodes, graph_edges (typed per §13 of source).
- **Automation:** automation_runs, scheduled_automations, automation_failures.
- **Gates/release:** gate_checks, release_packets, deployment_records, rollback_plans, ✚simulator_runs.
- **Audits:** audit_logs (append-only, `prevHash`, `rowHash`; ✚audit_checkpoints anchoring chain heads as evidence), audit_findings, build_reality_reports, business_audits, root_cause_analyses.
- **Learning/SOP:** learning_signals, standard_operating_procedures, sop_versions, sop_candidates, sop_compliance_records, sop_exceptions, sop_regression_tests.
- **Incidents:** incidents, postmortems, incident_events, ✚kill_switch_events.
- **Costs:** cost_events, usage_events, model_usage_events, token_usage_records, ✚budgets, ✚budget_alerts, ✚cost_forecasts, ✚semantic_cache_entries.
- **Telemetry:** runtime_events, notifications, system_health_snapshots, ✚heartbeats, ✚otel_spans.
- **Routing/eval:** model_routing_policies, ✚model_evals, ✚benchmark_suites.
- **Research/SignalForge:** research_missions, research_sources, research_evidence, research_claims, research_contradictions, demand_signals, opportunity_clusters, validation_statuses, false_positive_assessments, opportunity_scores.

Invariant rules (SOURCE-DIRECT): every completion has evidence refs; every critical approval has an unexpired nonce-bound challenge; every memory mutation versions + rollback edge; audit_logs append-only in normal flow (no UPDATE/DELETE grants; enforced at DB role level ✚).

Schemas: every entity in `packages/schema` exports TS type, Zod schema, createInput, updateInput (where relevant), public DTO. Schema list per source §5 plus ✚ `skill.schema.ts, mcp.schema.ts, benchmark.schema.ts, budget.schema.ts, device.schema.ts, event.schema.ts`.

---

## 8. Runtime Flow - Exact Execution Path

```
User intent (chat/voice/desktop - all → POST /api/v2/command/message)
→ evidence: user_instruction written (taint: trusted-human)
→ Command Chat session persists message
→ intent-classifier (command-interpreter agent)
→ mission-compiler → Mission (DRAFT→SCOPED) + evidence requirements
→ risk-classifier → RiskLevel + ApprovalPosture map per action class
→ task-graph-builder → DAG (tasks, deps, verifier nodes, gates)
→ model router → brain profile per task (auto/pinned; budget check via Resource Governor)
→ agent-router → agent assignment (registry contract match)
→ FOR EACH action:
   AuthN → workspace scope → PLTE lease resolve (issue/validate; trust check; anomaly scan)
   → Authority Gate → AuthorityDecision
      ALLOW / ALLOW_WITH_NOTICE → continue
      REQUIRE_APPROVAL / EXACT_PHRASE / STEP_UP / HUMAN_ONLY → approval_request + dry-run diff + blast radius → HALT until decision
      DENY / QUARANTINE / REVOKE_AND_ESCALATE → fail closed + evidence + (incident if escalate)
   → Resource Governor (budget, duty cycle, semantic cache lookup)
   → enqueue (BullMQ, idempotency key, correlationId)
   → worker → tool contract dispatch (schema-validate in → sandbox execute → schema-validate out)
   → tool_run + evidence written (CAS hash) + audit log (hash-chained)
→ verifier agent (verify-by-redo where possible) → verification_record evidence
→ completion-gate: evidence present? SOP gates met? verifier pass? → task COMPLETE_CANDIDATE → COMPLETE_VERIFIED
→ mission rollup → workstream lifecycle transition
→ memory proposal (level ≤2 auto; ≥3 needs evidence; ≥5 needs approval) + version + rollback edge
→ learning-signal writer → SOP candidate / regression test / watchlist (Standardisation Suite)
→ telemetry → Observatory; costs → attribution; notifications → digests
```

Failure paths: worker failure ⇒ recovery task + recovery_journal entry; schema mismatch ⇒ fail closed + tool_error; budget exhaustion ⇒ mission BLOCKED with reason; anomaly ⇒ trust drop, possible QUARANTINE; kill switch ⇒ drain queues, persist state, resume engine restores on restart.

---

## 9. UI / Product Surface

**Design system (binding - Floral Stone):**
Tokens (`packages/design-system/tokens.json` + CSS vars):
`--floral-white:#FAF7EF; --quiet-canvas:#F2EFEA; --weather-stone:#D8D1C5; --aged-brass:#B49A63; --black-olive:#32372C; --carbon-black:#121314;`
`--display` (editorial serif/display per kit), `--body`, `--mono` (all telemetry, IDs, hashes, evidence refs render in mono).
Direction per reference imagery: carbon/stone dark surfaces; marble-white content planes; hairline Aged Brass accents for traces, focus rings, and verified states; classical restraint - "governed intelligence," Atera-flat editorial minimalism. Light mode: Floral White / Quiet Canvas surfaces, Carbon Black ink, Black Olive secondary, Brass accents. Dark mode: Carbon Black surfaces, Floral White ink, Weather Stone secondary.
Forbidden (SOURCE-DIRECT): generic SaaS slop, blue/purple AI gradients, floating AI blobs, fake charts, random glassmorphism, default shadcn look, decorative cards without product logic, meaningless activity indicators, raw chain-of-thought panels.
Required: excellent empty/loading/error/blocked states everywhere; AA contrast; keyboard nav; reduced motion; semantic status badges (Risk, Evidence, Approval, Status); read-only telemetry labels.
Components: AppShell, LeftNav, TopSessionStrip, ExecutionChat, ChatMessage, WorkstreamCard, ApprovalCard (with DryRunDiff + BlastRadius panels ✚), EvidenceCard, RoutingSummary, BusinessBoard, WorkstreamColumn, AutomationRunTimeline, MemoryGraph, EvidenceLedgerTable, AuditWorkbench, WorkerRoster, WorkerDetailDrawer, ApprovalQueue, SystemWatchPanel, SettingsSection, StatusBadge, RiskBadge, EvidenceBadge, TraceLink, EmptyState, BlockedState, ErrorState, ✚KillSwitchBar, ✚TraceTimeline, ✚DiffViewer(Monaco).

Left nav (SOURCE-DIRECT): Execution Chat · Business Workstreams · Automation Activity · AI Memory · Evidence & Audits · AI Workers · Approvals · System Watch · Settings. Docs live under Settings → System Reference. Extended surfaces (Observatory, Research, Design Lab, App Simulator, Self-Evolution, SignalForge, Desktop Runtime) mount as sub-surfaces/tabs, not primary nav, to preserve the calm shell.

Per page - purpose / primary action / panels / data / approval-evidence behavior / states:

1. **Execution Chat** (`/`, `/command`, `/chat`, `/execution-chat`) - command TALOS. Primary action: type an outcome. Panels: chat stream; inline Workstream/Approval/Evidence/Routing cards; subtle strip "AI routing: Auto · N workers · N reviewers · evidence required". Data: command sessions API + SSE stream. Approvals render centrally in-stream. Empty: "Describe the outcome. TALOS will route models, agents, tools, evidence, and approvals behind the scenes."
2. **Business Workstreams** - Kanban board. Columns: Inbox, Scoping, Ready, In Progress, Waiting on Evidence, Waiting on Approval, Review/Audit, Done, Parked. Tabs: All Businesses, GetSubmitReady, ADHD-OS, TALOS, Future Business/New Venture, Archived. Card fields per source (title, business, priority, status, progress %, AI workers, evidence count, approval state, risk, due date, last activity, next action). Empty: "No active workstreams. Create one from Execution Chat."
3. **Automation Activity** - run log. Tabs: Live Runs, Scheduled, Completed, Failed/Blocked, Recurring, External Actions, Cost/Token Usage. Answers: what/when/which business/safe-or-gated/success/evidence/cost/retry. Empty: "No automation runs yet. Safe internal runs will appear here."
4. **AI Memory** - Obsidian-style graph; left filter rail, right inspector, bottom evidence strip. Tabs: Graph, Inbox, Ask Memory (citation-required answers), Projects, Decisions, Claims, Evidence Links, SOPs, Contradictions, Agent Memory. Promotion actions surface approval cards. Empty: "No governed memory yet. Accepted notes, claims, decisions, and evidence links will appear here."
5. **Evidence & Audits** - Tabs: Business Audits, Root-Cause Analysis, Internal TALOS Audits, Build-Reality Audits (AURIS reports), Evidence Ledger, Risk & Compliance, Performance Reviews, Audit History. Every row TraceLinks into Graph IR. Empty per source.
6. **AI Workers** - roster. Tabs: All, TALOS, GetSubmitReady, ADHD-OS, Idle, Blocked, Completed. Cards: worker, role, business/project, current task, status, last activity, output, evidence generated, blocker, model, tool, approval dependency, performance score. Safe summaries only. Empty per source.
7. **Approvals** - human-only queue. Tabs: All, External Actions, Deployments, Financial, Customer-Facing, Permissions, Legal/Compliance, High Risk, Expired/Rejected, History. Card: requested action, business, requester/worker, why, risk, evidence, if-approved, if-rejected, rollback path, deadline, phrase (if required), Approve/Reject/Revise/Hold - plus dry-run diff + blast radius. Empty: "No pending approvals. Risky actions will stop here before execution."
8. **System Watch** - Tabs: Runtime Health, Integrations, Model/API Usage, Queues, Permissions, Security, Costs, Incidents, Backups; ✚ AURIS status, kill-switch state, hash-chain checkpoint health. Read-only from API. Empty: "Runtime data unavailable until services are connected."
9. **Settings** - sections per source (Workspace…Developer/Advanced) incl. AI Models/LLM Routing, Approval Rules, Cost Budgets, System Reference.
10. **Live Work Observatory** (System Watch sub-surface) - real-time worker/queue/lease/spend wallboard; strictly read-only.
11. **Research** (Workstreams sub-surface) - research missions, source tables with reliability scores, claim maps, contradiction views.
12. **Design Lab** - token browser, visual-QA diffs, brand compliance reports.
13. **App Simulator** - simulator run history, Playwright artifacts, pass/fail evidence.
14. **Self-Evolution** - ACE candidates: score, diff, counterfactual replay results, approval packet; Approve routes to Approvals page.
15. **SignalForge** - opportunity clusters, ladder level (with hard "online cap L5" banner), experiment drafts.
16. **Desktop Runtime** (Settings sub-surface) - runtime manifest, preflight results, service supervisor status.

All pages: backed by API/DB only; no production fixtures; loading/error/blocked states mandatory.

---

## 10. Governance and Safety

- **Approval classes:** not_required, notice_only, standard_approval, exact_phrase_approval, step_up_authentication, human_only, blocked. Mandatory-approval actions (SOURCE-DIRECT): outreach emails, publish landing page, production deploy, pricing change, contact lead, paid-API spend over threshold, payment settings, memory→canonical, system-law change, worker permission grant, delete important files, merge, deploy, secret create/rotate.
- **Exact phrase:** nonce-bound, case/character-sensitive, time-limited, mission-bound, action-bound, device/channel trust-checked, audit-logged. No reuse - replay fails (tested).
- **Permission leases:** all 14 types; must expire; must define scope; cannot self-expand; agent cannot approve own high-risk authority; expired/revoked/mismatched/replayed/low-trust/out-of-scope ⇒ fail closed; every grant/use/denial/revocation evidence-logged.
- **Trust scoring:** device + channel + behavior baseline; decay over inactivity; anomaly detector (novel pattern, velocity, off-hours) lowers trust ⇒ stricter decisions; `REVOKE_AND_ESCALATE` on confirmed anomaly.
- **Risk levels:** none/low/medium/high/critical; classifier output reviewable by risk-auditor; risk can be raised unilaterally, lowered only via dual review.
- **Tool constraints:** contract-only execution; schema validation both directions; sandboxed (container profile: no network unless contract grants; FS scoped to mission workdir; CPU/mem/time caps); dry-run for all mutating tools; destructive shell and autonomous deployment not implemented - stubbed approval-gated.
- **External action rules:** anything leaving the machine or reaching a third party = external ⇒ approval-gated minimum; customer-facing/financial/legal ⇒ exact_phrase or human_only.
- **Desktop/screen control:** observe-only default; `desktop-control` lease per surface; act-on-screen dry-run-first; credential/payment surfaces human_only; screen text is tainted data.
- **Secret handling:** handles only; vault-resolved at tool-execution boundary inside sandbox; never in prompts, logs, memory, evidence bodies; redactor scans all outbound text; secret-like pattern detection blocks writes.
- **CAPTCHA/MFA:** never bypass; official API/OAuth/device flow only; else pause + human.
- **Self-evolution boundaries:** branch-only; protected branches untouchable; law/permission/memory-governance/model-routing/security changes require human approval; no self-approval; tests + AURIS mandatory in packet.
- **Memory promotion boundaries:** agent memory starts ≤1; ≥3 requires evidence; ≥5 requires approval; ≥7 human_only; every promotion versioned + rollback edge; contradictions surfaced, never hidden.
- **Kill switches:** global halt (human_only trigger, always available, never gated), per-business halt, per-agent quarantine; halting is always ALLOW for humans; resuming high-risk work requires approval.
- **Data classes:** public, internal, private, confidential, legal, financial, health-related, customer_data, credentials_secrets, security_sensitive, production_infrastructure - labeled on evidence/memory; class-aware redaction and lease matching.
- **Audit:** every authority event, tool run, approval, failure recorded; append-only; hash-chained; checkpoint anchors stored as evidence items (tamper-evident).

---

## 11. Build Architecture

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind (Floral Stone tokens), shadcn/ui as raw primitives only (fully restyled), TanStack Query, Zustand (light client state), React Flow (Memory graph / workstream graph / agent graph), Monaco (diffs, prompts, schemas only).
- **API:** Fastify `/api/v2`, TypeScript, Zod everywhere, Prisma → PostgreSQL, server-side auth + workspace scoping, correlation-ID + idempotency + audit middleware, standardized `{ok,data|error,correlationId}` envelopes.
- **Workers:** Node/Bun TS, Redis + BullMQ; 10 canonical queues; sandboxed tool execution (Docker exec profile).
- **Storage:** Postgres canonical; Redis queues/cache/locks; CAS evidence at `/data/evidence` (sha256 sharded dirs); Obsidian vault `/brain/vault`; optional pgvector (flagged); local-first, zero cloud dependency required.
- **Desktop:** Tauri scaffold (`apps/desktop-runtime`) - non-blocking.
- **Testing:** Vitest (unit/integration), Playwright (E2E + simulator), tsx verification scripts; fixtures never imported by production routes (verified).
- **Observability:** OTel-style spans on every request/job/tool run; correlation/causation IDs end-to-end.
- **CI gates:** lint, typecheck, test, build, verify:system-law, verify:no-production-fixtures, verify:evidence, verify:gates, auris:audit, security suite (injection corpus, secret-redaction, replay), benchmark regression gate.
- **Tooling:** pnpm workspace + Turborepo; eslint flat config; prettier; docker-compose (postgres, redis, optional pgadmin, optional minio).

## 12. Monorepo Structure

Per source §3 (binding), with synthesis additions marked ✚:

```
talos/
├─ README.md · TALOS_SYSTEM_LAW.md · SOURCE_AUTHORITY_MAP.md
├─ IMPLEMENTATION_DECISION_REGISTER.md · UNKNOWN_BLOCKED_REGISTER.md
├─ package.json · pnpm-workspace.yaml · turbo.json · tsconfig.base.json
├─ eslint.config.mjs · .prettierrc · .env.example · .gitignore · docker-compose.yml
├─ apps/
│  ├─ command-center/          # Next.js UI
│  ├─ api/                     # Fastify /api/v2
│  ├─ worker/                  # BullMQ processors
│  └─ desktop-runtime/         # Tauri scaffold
├─ packages/
│  ├─ core/ ├─ schema/ ├─ db/ ├─ orchestrator/ ├─ agents/ ├─ prompts/
│  ├─ tools/ ├─ evidence/ ├─ memory/ ├─ graph-ir/ ├─ approvals/
│  ├─ permission-lease-trust-engine/ ├─ gates/ ├─ workflows/
│  ├─ agentmesh-protocol/ ├─ deep-research-engine/ ├─ signalforge/
│  ├─ standardisation-suite/ ├─ auris/ ├─ autonomous-codebase-evolution/
│  ├─ design-system/ ├─ telemetry/ ├─ evals/
│  ├─ skillforge/ ✚ ├─ mcp-factory/ ✚ ├─ resource-governor/ ✚
│  ├─ security/ ✚ (taint, redaction, injection-corpus) └─ simulator/ ✚
├─ services/
│  ├─ trust-service/ ├─ evidence-service/ ├─ brain-service/ ├─ research-service/
│  ├─ worker-service/ ├─ telemetry-service/ └─ notification-service/
├─ db/ (prisma/ migrations/ seeds/ sql/)
├─ brain/ (vault/ indexes/ config/)          # vault: 00-inbox … 99-system per source §12
├─ data/ (evidence/ artefacts/ exports/ logs/)
├─ docs/ (architecture/ agent-system/ workflows/ data-model/ security/
│         approvals/ operator-manual/ standardisation/ runbooks/)
├─ tests/ (unit/ integration/ e2e/ security/ fixtures/ ✚benchmarks/)
├─ infra/ ✚ (docker profiles, sandbox seccomp, CI workflows)
└─ scripts/
   ├─ seed-demo-workspace.ts · verify-system-law.ts · verify-production-no-fixtures.ts
   ├─ validate-evidence.ts · run-gates.ts · generate-agent-pack.ts
   ├─ build-graph-ir.ts · export-operator-packet.ts
   └─ ✚ replay-mission.ts · ✚ verify-audit-chain.ts · ✚ run-benchmarks.ts
```

## 13. API Contract (Fastify, base `/api/v2`)

All routes: Zod I/O, auth, workspace scope, correlationId, idempotency on mutations, audit middleware, authority middleware on controlled actions. Envelopes per source §7.

- **Health:** GET /health · /runtime/health · /runtime/ready
- **Workspaces:** GET,POST /workspaces · GET /workspaces/:id
- **Businesses:** GET,POST /businesses · GET,PATCH /businesses/:id
- **Missions:** GET,POST /missions · GET,PATCH /missions/:id · POST /missions/:id/{start,pause,cancel,resume}
- **Workstreams:** GET,POST /workstreams · GET,PATCH /workstreams/:id · POST /workstreams/:id/transition · GET /workstreams/:id/timeline
- **Tasks:** GET,POST /tasks · GET,PATCH /tasks/:id · POST /tasks/:id/{claim,complete-candidate,block}
- **Command:** POST /command/{interpret,message,create-workstream} · GET /command/sessions/:sessionId (+SSE stream ✚)
- **Agents:** GET,POST /agents · GET /agents/:id · GET /agents/:id/runs · POST /agents/:id/{run,evaluate} · ✚ POST /agents/:id/shadow · ✚ POST /agents/:id/promote (approval-gated)
- **Tools:** GET,POST /tools/contracts · GET /tools/runs · POST /tools/request-run · POST /tools/runs/:id/cancel · ✚ POST /tools/:id/dry-run
- **Evidence:** GET,POST /evidence · GET /evidence/:id · POST /evidence/claims · POST /evidence/verify-claim · GET /evidence/trace/:entityType/:entityId
- **Approvals:** GET /approvals · POST /approvals/request · GET /approvals/:id · POST /approvals/:id/{approve,reject,revise,hold,exact-phrase} · ✚ GET /approvals/digest
- **Leases/Trust:** POST /leases/request · POST /leases/:id/{validate,use,revoke} · GET /leases · GET /leases/:id · POST /trust/check · GET /trust/session/:sessionId
- **Memory/Brain:** GET /memory · POST /memory/{propose,promote} · POST /memory/:id/rollback · GET,POST /brain/notes · GET /brain/graph · POST /brain/search · ✚ POST /brain/ask (citation-required)
- **Graph:** GET /graph/{nodes,edges} · POST /graph/query · GET /graph/trace/:entityType/:entityId · ✚ GET /graph/blast-radius/:entityType/:entityId
- **Automation:** GET /automation/{runs,scheduled,failures} · POST /automation/:runId/retry
- **Audits:** GET /audits · POST /audits/{build-reality,root-cause} · GET /audits/:id · ✚ GET /audits/chain-verify
- **Workers:** GET /workers/{live,history} · GET /workers/:id
- **System Watch:** GET /system-watch/{overview,queues,costs,incidents,security,backups} · ✚ /system-watch/kill-switch (GET; POST human_only)
- **Settings:** GET,PATCH /settings · GET,PATCH /settings/{model-routing,approval-rules} · ✚ /settings/budgets
- **✚ Skills/MCP:** GET,POST /skills · POST /skills/:id/{evaluate,promote} · GET,POST /mcp/servers · POST /mcp/servers/:id/test
- **✚ Research/SignalForge:** POST /research/missions · GET /research/missions/:id · GET /signalforge/opportunities · POST /signalforge/experiments (draft-only)
- **✚ Evolution:** GET /evolution/candidates · POST /evolution/candidates/:id/packet · POST /evolution/replay/:missionId

## 14. Worker/Queue Contract

Queues (BullMQ): mission, agent, tool, approval, evidence, research, memory, audit, automation, telemetry. Processors 1:1 (`*.processor.ts`).

Contract per job: `{jobId, idempotencyKey, correlationId, causationId, workspaceId, missionId?, taskId?, leaseId, payloadSchemaId, payload}`. Worker rules (tested): only registered tool contracts; cannot bypass approval state (re-checks approval status at execution time - approvals can be revoked between enqueue and run ✚); persists run logs; attaches evidence refs; fails closed on schema mismatch; failure ⇒ recovery task + journal entry; heartbeat every N sec (watchdog kills + quarantines silent workers ✚); duty-cycle + budget check before each model/tool call.

## 15. Test and Eval System

- **Unit:** all schemas; risk classifier; lifecycle machine (legal/illegal transitions); authority decision engine (full decision matrix); PLTE lease validation/expiry/scope; exact-phrase validate + replay denial; evidence validator + contentHash; memory versioning/rollback; graph trace builder; tool contract validation; ✚ blast-radius calc; ✚ semantic-cache staleness; ✚ audit hash-chain.
- **Integration:** chat→mission; mission→task graph; task→authority decision; low-risk allowed+evidenced; high-risk creates approval; approval decision→evidence; tool run→evidence; completion blocked without evidence; memory promotion→version+rollback; automation cost/status; worker failure→recovery task; ✚ revoked-approval-between-enqueue-and-run blocked; ✚ event-log replay reproduces state; ✚ idempotent double-submit no-ops.
- **E2E (Playwright):** chat creates workstream→board; evidence→ledger; approval card for external send; wrong phrase fails; correct phrase succeeds; rejection blocks action; System Watch shows queue/runtime; Workers page shows safe summaries only; ✚ kill switch drains and resume restores; ✚ Memory "Ask" returns cited answer.
- **Security:** prompt-injection corpus cannot grant permission; stale approval replay fails; external content cannot alter law; unregistered tool blocked; agent self-permission-expansion blocked; fixture import in production route fails verification; secret redaction; ✚ taint propagation (tool output marked, cannot reach authority engine as command); ✚ sandbox escape probes (network/FS caps); ✚ workspace isolation cross-tenant probes.
- **Visual:** visual-qa screenshot-vs-token diffs on core pages; a11y (axe) AA gate.
- **Agent evals:** per-agent rubric scoring on golden tasks; shadow-vs-incumbent comparisons; regression gate blocks promotion.
- **Model evals:** routing-policy quality/cost checks per task class; provisional-output review-path tests.
- **Benchmark suite:** `tests/benchmarks/` golden missions (build a CRUD feature, run a research mission, process an approval flow) with scored expected traces; run via `run-benchmarks.ts`; CI regression gate.
- **Acceptance gates:** all of §18 must be green or precisely registered as blocked.

## 16. Build Phases G0-G12

| Phase | Goal                        | Key tasks                                                                                                            | Exit criteria / evidence                                                                                                         |
| ----- | --------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| G0    | Repo foundation             | monorepo, configs, env, compose, law + authority docs, scripts stubs                                                 | `pnpm install` works; lint/typecheck baseline; no undocumented ambiguity. Evidence: command outputs.                             |
| G1    | Schemas + DB                | schema pkg, Prisma, migrations, seed, core types                                                                     | migrate + seed run; schemas compile; unit tests pass.                                                                            |
| G2    | API foundation              | Fastify, middleware chain, auth stub, scope, CRUD routes, audit, error envelope                                      | health + CRUD green; API tests pass.                                                                                             |
| G3    | Governance spine            | ExecutionCoordinator, PLTE, Approval Engine, Evidence Ledger (CAS), Tool Contracts                                   | high-risk⇒approval; low-risk⇒evidence; no direct tool path (test proves); decision-matrix tests pass.                            |
| G4    | Worker runtime              | Redis/BullMQ, queues, processors, sandbox profile, heartbeats, recovery                                              | queued mission executes; evidence written; failure⇒recovery task; watchdog kills silent worker.                                  |
| G5    | Command Chat                | UI + backend, mission creation, cards, SSE status                                                                    | message⇒mission/workstream; approval+evidence cards render; zero agent-management burden.                                        |
| G6    | Product pages               | Workstreams board, Automation, Memory, Evidence & Audits, Workers, Approvals, System Watch, Settings                 | all API/DB-backed; no fixtures; empty/loading/error states; nav works.                                                           |
| G7    | Memory/Graph/Audits         | vault, graph nodes/edges, trace viewer, AURIS, RCA                                                                   | claim→evidence trace; task→evidence→approval trace; AURIS report generated.                                                      |
| G8    | Research/business scaffolds | DRE, SignalForge, GTM workflows, draft-only external actions                                                         | research mission⇒evidence/claims; opportunity object; external actions gated.                                                    |
| G9    | SOP/learning/evolution      | Standardisation Suite, learning signals, SOP candidates, ACE candidates                                              | failure⇒signal⇒SOP candidate; evolution candidate requires approval.                                                             |
| G10   | Hardening + acceptance      | security tests, E2E, fixture verify, docs, final report                                                              | full gate set green; AURIS acceptable; report generated.                                                                         |
| G11 ✚ | Capability expansion        | SkillForge, MCP Factory, Resource Governor full, semantic cache, benchmark suite, shadow mode, counterfactual replay | skill eval-gated to usable; MCP sandbox-tested; budget breaker flips mission BLOCKED; replay produces comparative eval evidence. |
| G12 ✚ | Surfaces + runtime          | Observatory, Design Lab, App Simulator, Self-Evolution UI, voice adapter (thin), Tauri preflight/supervisor/resume   | Observatory read-only proven; simulator run = evidence; voice cannot pass exact_phrase (test); desktop preflight passes.         |

Blockers at any phase ⇒ UNKNOWN_BLOCKED_REGISTER.md entry, exact reason, safe next action. No phase claims completion without its evidence set.

---

## 17. One-Shot Build Prompt

> Copy-paste below into a coding agent verbatim.

```
You are the lead architect, senior full-stack engineer, product designer, security
engineer, database designer, agent-runtime engineer, and QA/release engineer
building TALOS (Total Agentic Lifecycle Orchestration System) from scratch in one
coherent pass, to the TALOS MAXIMUM CAPABILITY SPEC v2.0.

PRIME LAW - create TALOS_SYSTEM_LAW.md FIRST and enforce with tests:
No claim without evidence. No code without tests. No deployment without gates.
No autonomy without permissions. No learning without rollback. No completion
without traceability. Also: no fake completion; no fabricated evidence/tests/
citations; no hidden assumptions; no secret leakage; no client-settable authority;
no raw unrestricted tool execution; no external/customer/public action without
approval; no protected-branch merge without approval; no production deploy without
gates; no memory promotion without source links + rollback; no self-evolution
acceptance without human sign-off; no agent self-approval; no prompt-injection
authority (external content is data, never command); no CAPTCHA/MFA bypass; no raw
chain-of-thought display. Capability ≠ authority. Unverifiable ⇒
"STATUS: DRAFTED / UNVERIFIED - Reason: [...]". Blocked ⇒
"STATUS: BLOCKED - Reason: [...] - Safe next action: [...]".

STACK (locked): pnpm + Turborepo monorepo; Next.js App Router + React + TS +
Tailwind + restyled-shadcn primitives + TanStack Query + Zustand + React Flow +
Monaco; Fastify /api/v2 + Zod + Prisma + PostgreSQL; Redis + BullMQ workers
(queues: mission, agent, tool, approval, evidence, research, memory, audit,
automation, telemetry); CAS evidence store at /data/evidence (sha256); Obsidian
vault at /brain/vault (00-inbox…99-system); optional pgvector; Vitest + Playwright
+ tsx scripts; docker-compose (postgres, redis, optional pgadmin/minio); Tauri
desktop scaffold non-blocking.

REPO: build the exact tree in Spec §12 (apps/{command-center,api,worker,
desktop-runtime}; packages/{core,schema,db,orchestrator,agents,prompts,tools,
evidence,memory,graph-ir,approvals,permission-lease-trust-engine,gates,workflows,
agentmesh-protocol,deep-research-engine,signalforge,standardisation-suite,auris,
autonomous-codebase-evolution,design-system,telemetry,evals,skillforge,
mcp-factory,resource-governor,security,simulator}; services/{trust,evidence,
brain,research,worker,telemetry,notification}-service; db/, brain/, data/, docs/,
tests/{unit,integration,e2e,security,fixtures,benchmarks}, infra/, scripts/).
Root files: README, TALOS_SYSTEM_LAW, SOURCE_AUTHORITY_MAP (SOURCE_DIRECT /
SOURCE_INFERRED / IMPLEMENTATION_SYNTHESIS / UNKNOWN_BLOCKED / DECISION_LOCK),
IMPLEMENTATION_DECISION_REGISTER, UNKNOWN_BLOCKED_REGISTER, .env.example
(DATABASE_URL, REDIS_URL, TALOS_LOCAL_ROOT, TALOS_EVIDENCE_DIR, TALOS_BRAIN_DIR,
TALOS_AUTH_SECRET, OPENAI_API_KEY, ANTHROPIC_API_KEY, DEEPSEEK_API_KEY,
ZAI_GLM_API_KEY, MODEL_ROUTING_MODE, TELEGRAM_BOT_TOKEN?, SMTP?).

DOMAIN: implement all enums exactly (LifecycleState 20 states; MissionState 12;
RiskLevel 5; ApprovalPosture 9; AuthorityDecision 9; EvidenceStatus 7;
AgentRunStatus 7) and every schema in Spec §7 as Zod + TS type + createInput +
updateInput + DTO. Prisma tables per Spec §7 including event_log (append-only
outbox), idempotency_keys, audit_logs with prevHash/rowHash chain + checkpoints,
approval_challenges (nonce-bound), permission_leases, autonomy_ladder_states,
skills/skill_versions/skill_eval_results, mcp_servers, dry_run_artifacts,
blast_radius_estimates, budgets, semantic_cache_entries, shadow_runs,
benchmark_results, recovery_journal. Every mutation table has workspaceId; every
action has actorRef + correlationId; audit_logs append-only (revoke UPDATE/DELETE
at DB role).

AUTHORITY SPINE (build before any tool works): ExecutionCoordinator
(mission-compiler, intent-classifier, task-graph-builder, lifecycle-state-machine,
risk-classifier, authority-gate, agent-router, tool-dispatcher,
evidence/approval-requirement-resolvers, completion-gate,
learning-proposal-writer). PLTE (lease-manager/validator, trust-score-calculator
with behavioral baseline + decay + anomaly-detector, authority-decision-engine,
approval-integrity, exact-phrase generator/validator nonce-bound, revocation-
engine, lease-evidence-recorder, audit-hash-chain). Approval Engine (7 classes;
cards carry dry-run diff + blast radius + rollback path; digests + SLA
escalation). Evidence Ledger (CAS writer/reader, claim-map, validator,
trace-builder, contradiction-detector, redactor). Tool Contract Layer (contracts
per Spec; every mutating tool implements simulate(); sandboxed execution: scoped
FS, no default network, CPU/mem/time caps). HARD RULE: UI→API→Coordinator→PLTE→
Approvals→Queue→Worker→Tool. No other path may compile; write a test proving
direct tool invocation is impossible.

SAFE TOOLS to implement: repo.read, repo.search, file.read, file.writeDraft,
file.diff, terminal.safeTest, terminal.safeBuild, evidence.write,
approval.request, memory.query, memory.propose, graph.write,
notification.internal, browser.observe, browser.navigateDraft. Destructive
shell/deploy/payment/email-send: stubs, approval-gated, never autonomous.

AGENTS: registry JSON with full contracts for the roster in Spec §6 (executive,
command, product/build, research/business, design, ops, security, AURIS, ACE).
Rules enforced in code + tests: no unregistered tools; no permission excess; no
self-approval; no self-completion; safe thinking summaries only. AgentMesh typed
packets + envelope per spec; refs not repetition; messages carry zero authority;
replayable from event_log.

MODEL ROUTING: routing policies per task class (auto/pinned/economy/quality);
brain-run records with acceptanceDecision; provisional-output rules (cheap model
output cannot reach memory/repo/public/deploy without review; coding⇒tech review
+tests; strategic/public⇒reasoning review; high-risk⇒dual review + human).
Resource Governor: budgets per mission/agent/model, duty cycles, semantic cache
(hash-keyed, staleness rules, cache-hit provenance evidence), circuit breakers ⇒
mission BLOCKED with reason.

MEMORY/GRAPH: vault structure per spec; frontmatter schema per spec; authority
levels 0-8; promotion pipeline (≥3 evidence, ≥5 approval, ≥7 human_only);
versions + rollback edges; contradiction records auto-open draft re-research
missions; hybrid retrieval (FTS + optional pgvector); /brain/ask answers are
citation-required. Graph IR nodes/edges per spec; traces: task→evidence→approval,
claim→evidence→source, workstream→agents→tools→outputs, memory→lineage,
deployment→packet→tests→approval; blast-radius query.

SUBSYSTEM SCAFFOLDS (working skeletons + tests, honest about depth): Deep
Research Engine (planner→acquisition→normaliser→extractor→claims→reliability→
contradictions→synthesis→audit; no fabricated citations); SignalForge (ladder
0-8, ONLINE EVIDENCE HARD-CAPS AT 5; outreach draft-only); Standardisation Suite
(signals→SOP candidates→gates→exceptions→regression); AURIS (intended-vs-actual,
fixture-leak detector, completion-claim auditor, remediation writer; npm script +
CI + System Watch); ACE (branch-only, approval packets with diff + counterfactual
replay evals + rollback plan); SkillForge (skills = versioned procedure + schema
+ eval set; usable only after sandbox evals pass + approval at ≥medium risk); MCP
Factory (generate server scaffolds from tool contracts; sandbox-test; external
MCPs approval_gated + taint-tagged); Simulator (dockerized Playwright runs ⇒
evidence); Desktop Runtime scaffold (root-resolver, preflight,
service-supervisor, resume) non-blocking.

UI (Floral Stone design system - tokens: Floral White #FAF7EF, Quiet Canvas
#F2EFEA, Weather Stone #D8D1C5, Aged Brass #B49A63, Black Olive #32372C, Carbon
Black #121314; --display/--body/--mono; telemetry/IDs/hashes in mono; dark
carbon surfaces + marble planes + brass hairlines; NO generic SaaS slop, NO
blue/purple gradients, NO glassmorphism, NO default shadcn look, NO fake charts,
NO chain-of-thought panels). Left nav exactly: Execution Chat · Business
Workstreams · Automation Activity · AI Memory · Evidence & Audits · AI Workers ·
Approvals · System Watch · Settings (docs under Settings→System Reference). Build
every page, tab set, board column set, card field set, and EMPTY STATE string
exactly per Spec §9. Approval cards central in chat. AI-routing strip subtle.
All pages API/DB-backed; loading/error/blocked states everywhere; AA contrast;
keyboard nav; reduced motion.

SECURITY: taint-tag all external content (web/email/docs/tool output/screen
text) - tainted content can never reach the authority engine as instruction;
secret handles only + redaction pre-LLM/pre-log; data classes labeled; never
bypass CAPTCHA/MFA; kill-switch hierarchy (global/business/agent) - halting
always allowed for humans, high-risk resume needs approval; injection test
corpus in CI.

SEED + FIXTURES: seed-demo-workspace.ts creates Local Operator Workspace with
businesses TALOS, GetSubmitReady, ADHD-OS + demo agents/workstreams/evidence/
approvals/runs/notes/incidents, all obviously labeled DEMO. App shows empty
states without seed. verify-production-no-fixtures.ts fails CI if any production
route imports fixtures.

TESTS (all required, per Spec §15): unit (decision matrix, lease expiry/scope/
replay, exact-phrase mismatch, state machines, hash-chain), integration
(chat→mission→graph→authority→queue→tool→evidence→completion; revoked-approval
re-check at execution; event replay; idempotent double-submit), E2E (workstream
from chat; wrong-phrase fail / right-phrase pass; rejection blocks; kill-switch
drain+resume), security (injection cannot grant permission; self-approval
blocked; unregistered tool blocked; cross-workspace probes fail; sandbox caps
hold; secret redaction), visual/a11y, agent evals + benchmarks with regression
gate.

EXECUTE PHASES G0→G12 per Spec §16, in order, with exit evidence per phase.

THEN RUN: pnpm install · docker compose up -d · pnpm db:migrate · pnpm db:seed ·
pnpm lint · pnpm typecheck · pnpm test · pnpm test:integration · pnpm build ·
pnpm verify:system-law · pnpm verify:no-production-fixtures · pnpm
verify:evidence · pnpm auris:audit. Any failure: fix if feasible, else record
exact blocker in UNKNOWN_BLOCKED_REGISTER.md.

FINAL: output "# TALOS Build Report" with Verdict (COMPLETE/PARTIAL/BLOCKED),
What was built, Evidence (commands, test/build/migration results, AURIS path),
What works, What doesn't, Security posture, Known gaps, How to run, Safe next
action. Never claim complete unless tests/build pass, governance flow works,
evidence trace works, approval gate works, no production fixtures, no ungoverned
tool path, completion claims evidence-backed. If only foundation: say "TALOS
foundation built. Governed execution partially verified. Remaining blockers:
[list]." TALOS is proof-first.
```

---

## 18. Final Acceptance Criteria

- **Foundation complete:** G0-G2 exits green; law file + registers exist; migrate/seed/lint/typecheck pass.
- **Governed runtime complete:** G3-G4 exits green; decision matrix tested; no-direct-tool-path proven; high-risk⇒approval; completion blocked without evidence; worker failure⇒recovery; audit chain verifies.
- **Mythos-style shell complete:** G5-G7 exits green; chat creates workstreams; all nine primary pages API-backed with exact empty states; memory graph + traces + AURIS report live; Floral Stone tokens applied; visual-forbidden list clean.
- **Production-ready:** G8-G12 green; full security suite green (injection, replay, isolation, sandbox, redaction); benchmarks baselined with regression gate; kill switch + resume proven; Release Packet flow works end-to-end with human approval; docs (README, architecture, API, runbooks, operator manual) current; export-operator-packet produces a complete artifact.
- **Blocked/unverified:** any red gate ⇒ that scope reported as DRAFTED/UNVERIFIED or BLOCKED with register entries. No intermediate verdict may inflate.

## 19. Unknowns and Blockers (cannot be known from source pack)

1. Runtime model vendor availability/pricing per key (OPENAI/ANTHROPIC/DEEPSEEK/ZAI_GLM) - routing policies ship with placeholders; economy/quality tiers need live calibration.
2. SMTP/Telegram credentials and policy - notification adapters stubbed.
3. External MCP endpoints / third-party connectors (CRM, calendar, email providers) - contracts scaffolded, integrations UNKNOWN/BLOCKED until creds + terms confirmed.
4. Production infrastructure target (if ever non-local) - deployment records model exists; infra undefined.
5. Legal/compliance jurisdiction requirements for customer-facing/financial actions - approval classes enforce human review; specific policy text is human-supplied.
6. Real business data for GetSubmitReady / ADHD-OS workstreams - demo seed only.
7. Voice STT/TTS provider choice - adapter interface defined; provider UNKNOWN.
8. Desktop signing certificates / OS-specific packaging for TALOS.exe.
9. pgvector availability in target Postgres - feature-flagged.
10. Human approval SLAs/rota - defaults provided; real values operator-set.

## 20. Final Verdict

**COMPLETE BUILD SPEC** - for the local-first governed system: architecture, data model, API, queues, agents, governance, UI, tests, phases, and one-shot prompt are fully specified and buildable as written. The ten items in §19 are external inputs, not spec gaps; each is registered, stubbed safely, and fails closed. Nothing in this spec grants ungoverned autonomy; every capability upgrade added in v2.0 is lease-scoped, eval-gated, evidenced, reversible, and human-ceilinged.

---

## Appendix A - Self-Audit: 25 Strongest Upgrades (all integrated)

1. Event-sourced command log + outbox (replayable state) - §4.2, §7. 2. Idempotency keys on all mutations - §7, §13. 3. Hash-chained audit log + checkpoint anchors as evidence - §7, §10. 4. Content-addressable evidence store (sha256 CAS, dedup) - §4.9. 5. Independent verifier agents with verify-by-redo - §5.2. 6. Dry-run/simulate() on every mutating tool; diffs on approval cards - §4.6, §10. 7. Blast-radius estimator from Graph IR on every authority decision - §4.6, §13. 8. Sandboxed tool execution (scoped FS, no default net, resource caps) - §10, §15. 9. Taint tracking on all external content; injection corpus in CI - §4.30, §15. 10. Progressive autonomy ladder with automatic demotion - §4.7. 11. Trust decay + behavioral-baseline anomaly scoring - §4.7, §10. 12. Kill-switch hierarchy + watchdog heartbeats + duty-cycle governor - §4.2, §14. 13. Crash-recovery journal + resume engine (offline-first durability) - §4.2, §8. 14. Approval attention budget: digests, SLAs, escalation, revise loops - §4.8. 15. Semantic model-call cache with staleness rules + provenance evidence - §4.29. 16. Cost attribution + forecasts + budget circuit breakers per mission/business - §4.29, §7. 17. SkillForge: self-authored, versioned, eval-gated skills with rollback - §4.18. 18. MCP Factory: contract-derived, sandbox-tested MCP servers; external MCPs gated+tainted - §4.19. 19. Shadow-mode agent candidates scored against incumbents - §5.3. 20. Counterfactual mission replay feeding promotion/ACE packets - §4.17, §5.7. 21. Benchmark harness with golden missions + CI regression gate - §15. 22. Hybrid retrieval + citation-required RAG; contradiction-triggered re-research - §4.10. 23. Revoked-approval re-check at worker execution time (TOCTOU close) - §14. 24. Voice/mobile/desktop as thin clients adding zero authority; voice barred from exact_phrase/step_up - §4.27. 25. OTel-style spans + correlation/causation end-to-end; workspace-isolation security probes - §11, §15.

Each carries an IMPLEMENTATION_DECISION_REGISTER entry (reason, alternatives, rollback impact). None weakens a gate; several tighten existing ones.

- End of TALOS MAXIMUM CAPABILITY SPEC v2.0 -
