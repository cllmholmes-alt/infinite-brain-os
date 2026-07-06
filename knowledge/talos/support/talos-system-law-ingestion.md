# TALOS_SYSTEM_LAW.md ingestion record

## Provenance

- **Source**: `TALOS_SYSTEM_LAW.md` at the root of `C:\Projects\TALOS - Total Agentic Lifecycle Orchestration System`
- **Ingested by**: operator cllmholmes (via agent), 2026-07-06
- **Source status**: BINDING in the TALOS repo; this document is a provenance record, not a copy
- **Also read**: TALOS repo `README.md`, `docs/handoff/README.md`, `FABLE FILES/talos/TALOS_SYSTEM_LAW.md`, `FABLE FILES/talos/README.md`, `FABLE FILES/talos/apps/command-center/README.md`

## Extracted primary law clauses

The six clauses of the Primary Operating Law (TALOS_SYSTEM_LAW.md section 2), binding and non-negotiable:

1. **No claim without evidence.** Every assertion must reference append-only evidence; the evidence ledger is immutable. Evidence can be superseded but never silently deleted.
2. **No code without tests.** Every code artefact must carry tests; no untested code may enter the system. Corollary: no fabricated completion, no fabricated test execution.
3. **No deployment without gates.** Every deployment path must pass release gates. Deploying to production without passing release gates is forbidden.
4. **No autonomy without permissions.** Agents never own execution authority. Capability is not authority. No agent self-approval; no client-settable authority.
5. **No learning without rollback.** Every learning event must record a rollback path. No memory promotion without source plus rollback evidence. No self-evolution acceptance without human sign-off.
6. **No completion without traceability.** Every completion must record commit, build, release, and rollback refs. Audit trail is mandatory. Unknowns must remain visible; unverifiable claims must carry a visible status marker.

Supporting laws referenced but not fully ingested here: Evidence Law (section 7), Brain Harness Law (section 8), Memory Law (section 9), Manus External Execution Law (section 12), TALOS App Simulator Operating Law (section 13).

## Extracted mediation dimensions

From TALOS_SYSTEM_LAW.md section 3 and the README system boundaries: every agent action must be expressible through all eight mediators or it MUST NOT execute:

| Dimension | Source reference | Meaning |
|-----------|-----------------|---------|
| task state | sec 3, binding | What phase the task occupies; determines which gates apply |
| risk level | sec 3, sec 6 | Mapped to a mandatory approval posture (autonomous_allowed through forbidden) |
| role permission | sec 3, sec 5 | What the agent's role permits; agents may never expand their own permissions |
| tool contract | sec 3, sec 5 | Each tool declares a bounded capability with an enforced contract |
| evidence requirement | sec 3, sec 7 | Claims are gated on evidence; the evidence ledger is append-only |
| approval posture | sec 3, sec 4, sec 6 | One of six ordered postures: autonomous_allowed, draft_only, scope_based_edit, approval_gated, human_only, forbidden |
| gate status | sec 3, sec 11 | Release gates enforced by the orchestrator state machine and gatekeeper |
| audit log | sec 3, sec 7 | Every action records an audit entry; every approval records the decision-maker and reason |

## Approval postures (least to most restrictive)

| Posture | Meaning |
|---------|---------|
| autonomous_allowed | May execute without human sign-off |
| draft_only | May produce output, but it stays a draft until approved |
| scope_based_edit | May edit within a declared scope; out-of-scope requires approval |
| approval_gated | Requires explicit human approval before execution |
| human_only | Only a human may execute; agents may only request |
| forbidden | Structurally unreachable; never executes under any condition |

## Risk-to-posture mapping (binding)

| Condition | Required posture |
|-----------|-----------------|
| Reads source/docs/repo | autonomous_allowed |
| Drafts internal report | autonomous_allowed |
| Drafts public copy | draft_only |
| Edits docs/test files | scope_based_edit |
| Edits source code | scope_based_edit |
| Edits auth/payment/security/database | approval_gated |
| Sends email/public message | approval_gated |
| Deploys production | approval_gated |
| Rotates secrets | human_only |
| Deletes customer data | human_only |
| Fabricates evidence | forbidden |
| Bypasses gate | forbidden |
| Expands own permissions | forbidden |

## Forbidden actions (structurally unreachable)

Extracted from TALOS_SYSTEM_LAW.md section 5. These must be impossible by design, not merely blocked at runtime:

- Fabricating completion, test execution, approvals, or deployment status
- Changing production config or secrets without approval
- Deploying to production without passing release gates
- Deleting user or customer data without approval
- Modifying legal, pricing, or contractual artefacts autonomously
- Bypassing a failed security, compliance, or release gate
- Using prohibited or incompatible licences without review
- Creating malware, credential-theft tooling, phishing kits, or unauthorised-target exploit automation
- Expanding TALOS's own permissions

## Additional TALOS system-law clauses

**Evidence Law (section 7):** The evidence ledger is append-only. Evidence can be superseded but never silently deleted. Every claim must reference evidence. Every generated artefact must record its source inputs. Every approval must record the decision-maker and reason. Every deployment must record commit, build, release, and rollback refs. Every unknown must remain visible.

**Brain Harness Law (section 8):** No silent brain (model) substitution. Brain selection is policy-driven per agent. Substitution events are recorded and blocked when forbidden. Outputs failing validation enter quarantine until review accepts. Review brains issue audit packets before downstream propagation.

**Memory Law (section 9):** Policy memory outranks project memory. Evidence memory outranks normal generated text. Working memory expires. Learning memory requires postmortem or eval evidence. No memory write can change permissions, override source authority, or hide unknowns.

**Manus External Execution Law (section 12):** Manus is an external autonomous execution surface inside TALOS. TALOS may delegate scoped tasks to Manus but all usage must be task-bound, permission-bound, connector-bound, evidence-logged, rate-limited, and approval-gated where sensitive. No Manus output may become accepted truth, canonical memory, or release artefact until TALOS evidence, review, testing, and approval gates pass. One-line principle: Manus does the external work; TALOS governs the work.

**TALOS App Simulator Operating Law (section 13):** App Simulator is a governed, web-first mobile-app simulation cockpit. All actions are project-bound, device-bound, runtime-bound, and evidence-linked. Simulator controls Xcode and Apple tooling only through approved tool contracts. A simulator pass alone yields `simulator_pass_only`, never `submit_candidate`. One-line principle: App Simulator rehearses the app; TALOS governs what may ship.

## Runtime locality (section 2.1)

TALOS runs local-only on the operator machine, never for public view. No Vercel, no public URL, no internet-exposed Command Centre or API. Deployment gates are satisfied by local verify plus operator-controlled runtime, not public hosting.

## Source authority legend (section 10)

| Tag | Meaning | Build rule |
|-----|---------|------------|
| SOURCE-DIRECT | Present in supplied or inspected source | Binding |
| SOURCE-INFERRED | Reasonably inferred from multiple sources | Implementable; record as synthesis |
| IMPLEMENTATION-SYNTHESIS | Required to build but not in source | Allowed only when labelled |
| UNKNOWN/BLOCKED | Not readable, provided, or verifiable | Must not be invented |
| DECISION-LOCK | Final decision to remove ambiguity | Recorded in decision register |

## Enforcement (section 11)

This law is enforced by the orchestrator state machine (Phase 3), agent capability enforcement (Phase 4), the tool contract layer (Phase 5), the gatekeeper plus approval engine, the evidence ledger (Phase 2), and the eval and red-team harness (Phase 11). A change to this law requires a DECISION-LOCK entry in `IMPLEMENTATION_DECISION_REGISTER.md`.
