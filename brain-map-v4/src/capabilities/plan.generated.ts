export interface PlanCapability {
  id: number;
  title: string;
  workstream: string;
  source: string;
  test: string;
  testId: string;
  state: 'verified' | 'blocked';
  evidenceNote: string;
}

export const planCapabilities: PlanCapability[] = [
  {
    "id": 1,
    "title": "Canonical graph contract",
    "workstream": "Truth and identity",
    "source": "src/identity/registry.ts",
    "test": "tests/plan/truth-001-010.test.ts",
    "testId": "plan-001",
    "state": "verified",
    "evidenceNote": "plan-001: src/identity/registry.ts#export class IdentityRegistry is exercised by tests/plan/truth-001-010.test.ts."
  },
  {
    "id": 2,
    "title": "Stable ecosystem identity registry",
    "workstream": "Truth and identity",
    "source": "src/evidence/truth.ts",
    "test": "tests/plan/truth-001-010.test.ts",
    "testId": "plan-002",
    "state": "verified",
    "evidenceNote": "plan-002: src/evidence/truth.ts#export function evidenceHash is exercised by tests/plan/truth-001-010.test.ts."
  },
  {
    "id": 3,
    "title": "Source-authority hierarchy",
    "workstream": "Truth and identity",
    "source": "src/evidence/truth.ts",
    "test": "tests/plan/truth-001-010.test.ts",
    "testId": "plan-003",
    "state": "verified",
    "evidenceNote": "plan-003: src/evidence/truth.ts#export function deriveTruthState is exercised by tests/plan/truth-001-010.test.ts."
  },
  {
    "id": 4,
    "title": "Evidence envelope on every field",
    "workstream": "Truth and identity",
    "source": "src/domain/truth.ts",
    "test": "tests/plan/truth-001-010.test.ts",
    "testId": "plan-004",
    "state": "verified",
    "evidenceNote": "plan-004: src/domain/truth.ts#export function resolveAuthoritativeFact is exercised by tests/plan/truth-001-010.test.ts."
  },
  {
    "id": 5,
    "title": "Freshness as a first-class visual state",
    "workstream": "Truth and identity",
    "source": "src/domain/truth.ts",
    "test": "tests/plan/truth-001-010.test.ts",
    "testId": "plan-005",
    "state": "verified",
    "evidenceNote": "plan-005: src/domain/truth.ts#export function buildConflictAwareState is exercised by tests/plan/truth-001-010.test.ts."
  },
  {
    "id": 6,
    "title": "Unknown-by-default policy",
    "workstream": "Truth and identity",
    "source": "src/domain/truth.ts",
    "test": "tests/plan/truth-001-010.test.ts",
    "testId": "plan-006",
    "state": "verified",
    "evidenceNote": "plan-006: src/domain/truth.ts#export function combineTruthStates is exercised by tests/plan/truth-001-010.test.ts."
  },
  {
    "id": 7,
    "title": "Conflict reconciliation surface",
    "workstream": "Truth and identity",
    "source": "src/events/ledger.ts",
    "test": "tests/plan/truth-001-010.test.ts",
    "testId": "plan-007",
    "state": "verified",
    "evidenceNote": "plan-007: src/events/ledger.ts#export class EventLedger is exercised by tests/plan/truth-001-010.test.ts."
  },
  {
    "id": 8,
    "title": "Schema migration and compatibility layer",
    "workstream": "Truth and identity",
    "source": "src/events/temporal.ts",
    "test": "tests/plan/truth-001-010.test.ts",
    "testId": "plan-008",
    "state": "verified",
    "evidenceNote": "plan-008: src/events/temporal.ts#export class SnapshotStore is exercised by tests/plan/truth-001-010.test.ts."
  },
  {
    "id": 9,
    "title": "Redaction and sensitivity classification",
    "workstream": "Truth and identity",
    "source": "src/schema/migrations.ts",
    "test": "tests/plan/truth-001-010.test.ts",
    "testId": "plan-009",
    "state": "verified",
    "evidenceNote": "plan-009: src/schema/migrations.ts#export function importGraphDocument is exercised by tests/plan/truth-001-010.test.ts."
  },
  {
    "id": 10,
    "title": "Truth-quality and evidence-weighted health scorecard",
    "workstream": "Truth and identity",
    "source": "src/schema/migrations.ts",
    "test": "tests/plan/truth-001-010.test.ts",
    "testId": "plan-010",
    "state": "verified",
    "evidenceNote": "plan-010: src/schema/migrations.ts#export const COMPATIBILITY_MANIFEST is exercised by tests/plan/truth-001-010.test.ts."
  },
  {
    "id": 11,
    "title": "Append-only ecosystem event log",
    "workstream": "Adapters and evidence",
    "source": "src/adapters/telemetry.ts",
    "test": "tests/plan/adapters-011-020.test.ts",
    "testId": "plan-011",
    "state": "verified",
    "evidenceNote": "plan-011: src/adapters/telemetry.ts#export function buildCollectionHealth is exercised by tests/plan/adapters-011-020.test.ts."
  },
  {
    "id": 12,
    "title": "Deterministic snapshot builder",
    "workstream": "Adapters and evidence",
    "source": "src/adapters/telemetry.ts",
    "test": "tests/plan/adapters-011-020.test.ts",
    "testId": "plan-012",
    "state": "verified",
    "evidenceNote": "plan-012: src/adapters/telemetry.ts#export function evaluateCollectionSlo is exercised by tests/plan/adapters-011-020.test.ts."
  },
  {
    "id": 13,
    "title": "Before/after diff engine",
    "workstream": "Adapters and evidence",
    "source": "src/adapters/telemetry.ts",
    "test": "tests/plan/adapters-011-020.test.ts",
    "testId": "plan-013",
    "state": "verified",
    "evidenceNote": "plan-013: src/adapters/telemetry.ts#export function detectConfigurationDrift is exercised by tests/plan/adapters-011-020.test.ts."
  },
  {
    "id": 14,
    "title": "Change attribution",
    "workstream": "Adapters and evidence",
    "source": "src/adapters/telemetry.ts",
    "test": "tests/plan/adapters-011-020.test.ts",
    "testId": "plan-014",
    "state": "verified",
    "evidenceNote": "plan-014: src/adapters/telemetry.ts#export function buildGitCiState is exercised by tests/plan/adapters-011-020.test.ts."
  },
  {
    "id": 15,
    "title": "Release-bound topology views",
    "workstream": "Adapters and evidence",
    "source": "src/adapters/telemetry.ts",
    "test": "tests/plan/adapters-011-020.test.ts",
    "testId": "plan-015",
    "state": "verified",
    "evidenceNote": "plan-015: src/adapters/telemetry.ts#export function evaluateRuntimeServiceHealth is exercised by tests/plan/adapters-011-020.test.ts."
  },
  {
    "id": 16,
    "title": "Incident reconstruction mode",
    "workstream": "Adapters and evidence",
    "source": "src/adapters/telemetry.ts",
    "test": "tests/plan/adapters-011-020.test.ts",
    "testId": "plan-016",
    "state": "verified",
    "evidenceNote": "plan-016: src/adapters/telemetry.ts#export function detectDependencyDrift is exercised by tests/plan/adapters-011-020.test.ts."
  },
  {
    "id": 17,
    "title": "Temporal query language",
    "workstream": "Adapters and evidence",
    "source": "src/adapters/telemetry.ts",
    "test": "tests/plan/adapters-011-020.test.ts",
    "testId": "plan-017",
    "state": "verified",
    "evidenceNote": "plan-017: src/adapters/telemetry.ts#export function buildWorkflowExecutionGraph is exercised by tests/plan/adapters-011-020.test.ts."
  },
  {
    "id": 18,
    "title": "Lifecycle model",
    "workstream": "Adapters and evidence",
    "source": "src/adapters/telemetry.ts",
    "test": "tests/plan/adapters-011-020.test.ts",
    "testId": "plan-018",
    "state": "verified",
    "evidenceNote": "plan-018: src/adapters/telemetry.ts#export function collectSupportedExternalStatus is exercised by tests/plan/adapters-011-020.test.ts."
  },
  {
    "id": 19,
    "title": "Retention and compaction policy",
    "workstream": "Adapters and evidence",
    "source": "src/adapters/telemetry.ts",
    "test": "tests/plan/adapters-011-020.test.ts",
    "testId": "plan-019",
    "state": "verified",
    "evidenceNote": "plan-019: src/adapters/telemetry.ts#export function unsupportedProviderState is exercised by tests/plan/adapters-011-020.test.ts."
  },
  {
    "id": 20,
    "title": "Evidence-bound historical exports",
    "workstream": "Adapters and evidence",
    "source": "src/adapters/telemetry.ts",
    "test": "tests/plan/adapters-011-020.test.ts",
    "testId": "plan-020",
    "state": "verified",
    "evidenceNote": "plan-020: src/adapters/telemetry.ts#export function correlateOperationalSignals is exercised by tests/plan/adapters-011-020.test.ts."
  },
  {
    "id": 21,
    "title": "Real adapter ingestion",
    "workstream": "Temporal memory",
    "source": "src/events/temporal.ts",
    "test": "tests/plan/temporal-021-030.test.ts",
    "testId": "plan-021",
    "state": "verified",
    "evidenceNote": "plan-021: src/events/temporal.ts#export class ObservationLog is exercised by tests/plan/temporal-021-030.test.ts."
  },
  {
    "id": 22,
    "title": "Collection health plane",
    "workstream": "Temporal memory",
    "source": "src/events/temporal.ts",
    "test": "tests/plan/temporal-021-030.test.ts",
    "testId": "plan-022",
    "state": "verified",
    "evidenceNote": "plan-022: src/events/temporal.ts#export function validateLifecycleTransition is exercised by tests/plan/temporal-021-030.test.ts."
  },
  {
    "id": 23,
    "title": "Multi-layer health model",
    "workstream": "Temporal memory",
    "source": "src/events/temporal.ts",
    "test": "tests/plan/temporal-021-030.test.ts",
    "testId": "plan-023",
    "state": "verified",
    "evidenceNote": "plan-023: src/events/temporal.ts#capture(graph is exercised by tests/plan/temporal-021-030.test.ts."
  },
  {
    "id": 24,
    "title": "Service-level objectives",
    "workstream": "Temporal memory",
    "source": "src/events/temporal.ts",
    "test": "tests/plan/temporal-021-030.test.ts",
    "testId": "plan-024",
    "state": "verified",
    "evidenceNote": "plan-024: src/events/temporal.ts#at(timestamp is exercised by tests/plan/temporal-021-030.test.ts."
  },
  {
    "id": 25,
    "title": "Configuration drift detector",
    "workstream": "Temporal memory",
    "source": "src/events/diff.ts",
    "test": "tests/plan/temporal-021-030.test.ts",
    "testId": "plan-025",
    "state": "verified",
    "evidenceNote": "plan-025: src/events/diff.ts#export function diffSnapshots is exercised by tests/plan/temporal-021-030.test.ts."
  },
  {
    "id": 26,
    "title": "Git and CI estate intelligence",
    "workstream": "Temporal memory",
    "source": "src/events/temporal.ts",
    "test": "tests/plan/temporal-021-030.test.ts",
    "testId": "plan-026",
    "state": "verified",
    "evidenceNote": "plan-026: src/events/temporal.ts#export function buildIncidentPlayback is exercised by tests/plan/temporal-021-030.test.ts."
  },
  {
    "id": 27,
    "title": "Dependency and version drift",
    "workstream": "Temporal memory",
    "source": "src/events/temporal.ts",
    "test": "tests/plan/temporal-021-030.test.ts",
    "testId": "plan-027",
    "state": "verified",
    "evidenceNote": "plan-027: src/events/temporal.ts#export class DeterministicCommandExecutor is exercised by tests/plan/temporal-021-030.test.ts."
  },
  {
    "id": 28,
    "title": "User-path synthetic probes",
    "workstream": "Temporal memory",
    "source": "src/events/temporal.ts",
    "test": "tests/plan/temporal-021-030.test.ts",
    "testId": "plan-028",
    "state": "verified",
    "evidenceNote": "plan-028: src/events/temporal.ts#export function allocateCollectionBudget is exercised by tests/plan/temporal-021-030.test.ts."
  },
  {
    "id": 29,
    "title": "Incident and alert correlation",
    "workstream": "Temporal memory",
    "source": "src/events/temporal.ts",
    "test": "tests/plan/temporal-021-030.test.ts",
    "testId": "plan-029",
    "state": "verified",
    "evidenceNote": "plan-029: src/events/temporal.ts#export function chooseDegradationMode is exercised by tests/plan/temporal-021-030.test.ts."
  },
  {
    "id": 30,
    "title": "Adaptive collection budgets",
    "workstream": "Temporal memory",
    "source": "src/events/temporal.ts",
    "test": "tests/plan/temporal-021-030.test.ts",
    "testId": "plan-030",
    "state": "verified",
    "evidenceNote": "plan-030: src/events/temporal.ts#export class CollectorTrace is exercised by tests/plan/temporal-021-030.test.ts."
  },
  {
    "id": 31,
    "title": "Typed dependency semantics",
    "workstream": "Graph intelligence",
    "source": "src/analytics/decision-intelligence.ts",
    "test": "tests/plan/analytics-031-040.test.ts",
    "testId": "plan-031",
    "state": "verified",
    "evidenceNote": "plan-031: src/analytics/decision-intelligence.ts#export function buildOutcomeGraph is exercised by tests/plan/analytics-031-040.test.ts."
  },
  {
    "id": 32,
    "title": "Outcome and capability graph",
    "workstream": "Graph intelligence",
    "source": "src/analytics/algorithms.ts",
    "test": "tests/plan/analytics-031-040.test.ts",
    "testId": "plan-032",
    "state": "verified",
    "evidenceNote": "plan-032: src/analytics/algorithms.ts#export function probabilisticBlastRadius is exercised by tests/plan/analytics-031-040.test.ts."
  },
  {
    "id": 33,
    "title": "Single-point-of-failure analysis",
    "workstream": "Graph intelligence",
    "source": "src/analytics/decision-intelligence.ts",
    "test": "tests/plan/analytics-031-040.test.ts",
    "testId": "plan-033",
    "state": "verified",
    "evidenceNote": "plan-033: src/analytics/decision-intelligence.ts#export function clusterCorrelatedRisk is exercised by tests/plan/analytics-031-040.test.ts."
  },
  {
    "id": 34,
    "title": "Probabilistic blast-radius model",
    "workstream": "Graph intelligence",
    "source": "src/analytics/decision-intelligence.ts",
    "test": "tests/plan/analytics-031-040.test.ts",
    "testId": "plan-034",
    "state": "verified",
    "evidenceNote": "plan-034: src/analytics/decision-intelligence.ts#export function analyzeCriticalPath is exercised by tests/plan/analytics-031-040.test.ts."
  },
  {
    "id": 35,
    "title": "Critical-path, capacity, and flow reliability",
    "workstream": "Graph intelligence",
    "source": "src/analytics/decision-intelligence.ts",
    "test": "tests/plan/analytics-031-040.test.ts",
    "testId": "plan-035",
    "state": "verified",
    "evidenceNote": "plan-035: src/analytics/decision-intelligence.ts#export function scoreOperationalBottlenecks is exercised by tests/plan/analytics-031-040.test.ts."
  },
  {
    "id": 36,
    "title": "Change-risk and propagation forecasting",
    "workstream": "Graph intelligence",
    "source": "src/analytics/decision-intelligence.ts",
    "test": "tests/plan/analytics-031-040.test.ts",
    "testId": "plan-036",
    "state": "verified",
    "evidenceNote": "plan-036: src/analytics/decision-intelligence.ts#export function computeFlowMetrics is exercised by tests/plan/analytics-031-040.test.ts."
  },
  {
    "id": 37,
    "title": "Counterfactual scenario and Pareto studio",
    "workstream": "Graph intelligence",
    "source": "src/analytics/decision-intelligence.ts",
    "test": "tests/plan/analytics-031-040.test.ts",
    "testId": "plan-037",
    "state": "verified",
    "evidenceNote": "plan-037: src/analytics/decision-intelligence.ts#export function simulateScenario is exercised by tests/plan/analytics-031-040.test.ts."
  },
  {
    "id": 38,
    "title": "Constraint-aware priority command queue",
    "workstream": "Graph intelligence",
    "source": "src/analytics/decision-intelligence.ts",
    "test": "tests/plan/analytics-031-040.test.ts",
    "testId": "plan-038",
    "state": "verified",
    "evidenceNote": "plan-038: src/analytics/decision-intelligence.ts#export function backtestForecasts is exercised by tests/plan/analytics-031-040.test.ts."
  },
  {
    "id": 39,
    "title": "Explainable and counterfactual recommendation cards",
    "workstream": "Graph intelligence",
    "source": "src/analytics/scenarios.ts",
    "test": "tests/plan/analytics-031-040.test.ts",
    "testId": "plan-039",
    "state": "verified",
    "evidenceNote": "plan-039: src/analytics/scenarios.ts#export function paretoRank is exercised by tests/plan/analytics-031-040.test.ts."
  },
  {
    "id": 40,
    "title": "Decision quality feedback loop",
    "workstream": "Graph intelligence",
    "source": "src/analytics/decision-intelligence.ts",
    "test": "tests/plan/analytics-031-040.test.ts",
    "testId": "plan-040",
    "state": "verified",
    "evidenceNote": "plan-040: src/analytics/decision-intelligence.ts#export function rankDecisionRecommendations is exercised by tests/plan/analytics-031-040.test.ts."
  },
  {
    "id": 41,
    "title": "Three explicit modes: Observe, Explain, Act",
    "workstream": "Spatial sensemaking",
    "source": "src/visualization/view-model.ts",
    "test": "tests/plan/visualization-041-050.test.ts",
    "testId": "plan-041",
    "state": "verified",
    "evidenceNote": "plan-041: src/visualization/view-model.ts#export function buildSemanticViewModel is exercised by tests/plan/visualization-041-050.test.ts."
  },
  {
    "id": 42,
    "title": "Three-level semantic zoom and density grammar",
    "workstream": "Spatial sensemaking",
    "source": "src/visualization/view-model.ts",
    "test": "tests/plan/visualization-041-050.test.ts",
    "testId": "plan-042",
    "state": "verified",
    "evidenceNote": "plan-042: src/visualization/view-model.ts#visibleFactKeys is exercised by tests/plan/visualization-041-050.test.ts."
  },
  {
    "id": 43,
    "title": "Stable mental-map layout",
    "workstream": "Spatial sensemaking",
    "source": "src/layout/seed.ts",
    "test": "tests/plan/visualization-041-050.test.ts",
    "testId": "plan-043",
    "state": "verified",
    "evidenceNote": "plan-043: src/layout/seed.ts#export function layoutNodes is exercised by tests/plan/visualization-041-050.test.ts."
  },
  {
    "id": 44,
    "title": "Focus tunnel with contextual dimming",
    "workstream": "Spatial sensemaking",
    "source": "src/visualization/view-model.ts",
    "test": "tests/plan/visualization-041-050.test.ts",
    "testId": "plan-044",
    "state": "verified",
    "evidenceNote": "plan-044: src/visualization/view-model.ts#export function computeConvexHull is exercised by tests/plan/visualization-041-050.test.ts."
  },
  {
    "id": 45,
    "title": "Path tracing and route comparison",
    "workstream": "Spatial sensemaking",
    "source": "src/visualization/view-model.ts",
    "test": "tests/plan/visualization-041-050.test.ts",
    "testId": "plan-045",
    "state": "verified",
    "evidenceNote": "plan-045: src/visualization/view-model.ts#export function buildFocusTunnel is exercised by tests/plan/visualization-041-050.test.ts."
  },
  {
    "id": 46,
    "title": "Question-led topology lenses and semantic grammar",
    "workstream": "Spatial sensemaking",
    "source": "src/visualization/view-model.ts",
    "test": "tests/plan/visualization-041-050.test.ts",
    "testId": "plan-046",
    "state": "verified",
    "evidenceNote": "plan-046: src/visualization/view-model.ts#export function buildPathBreadcrumb is exercised by tests/plan/visualization-041-050.test.ts."
  },
  {
    "id": 47,
    "title": "Label, territory, and relationship legibility engine",
    "workstream": "Spatial sensemaking",
    "source": "src/visualization/view-model.ts",
    "test": "tests/plan/visualization-041-050.test.ts",
    "testId": "plan-047",
    "state": "verified",
    "evidenceNote": "plan-047: src/visualization/view-model.ts#export function applyGraphLenses is exercised by tests/plan/visualization-041-050.test.ts."
  },
  {
    "id": 48,
    "title": "Strict change-focused motion budget",
    "workstream": "Spatial sensemaking",
    "source": "src/visualization/view-model.ts",
    "test": "tests/plan/visualization-041-050.test.ts",
    "testId": "plan-048",
    "state": "verified",
    "evidenceNote": "plan-048: src/visualization/view-model.ts#export function evidenceVisualEncoding is exercised by tests/plan/visualization-041-050.test.ts."
  },
  {
    "id": 49,
    "title": "Evidence drawer with spatial anchoring",
    "workstream": "Spatial sensemaking",
    "source": "src/visualization/view-model.ts",
    "test": "tests/plan/visualization-041-050.test.ts",
    "testId": "plan-049",
    "state": "verified",
    "evidenceNote": "plan-049: src/visualization/view-model.ts#export class PinStore is exercised by tests/plan/visualization-041-050.test.ts."
  },
  {
    "id": 50,
    "title": "Narrative walkthroughs",
    "workstream": "Spatial sensemaking",
    "source": "src/visualization/view-model.ts",
    "test": "tests/plan/visualization-041-050.test.ts",
    "testId": "plan-050",
    "state": "verified",
    "evidenceNote": "plan-050: src/visualization/view-model.ts#export function motionPreset is exercised by tests/plan/visualization-041-050.test.ts."
  },
  {
    "id": 51,
    "title": "Action capability registry",
    "workstream": "Governed actions",
    "source": "src/actions/governance.ts",
    "test": "tests/plan/actions-051-060.test.ts",
    "testId": "plan-051",
    "state": "verified",
    "evidenceNote": "plan-051: src/actions/governance.ts#export class ActionRegistry is exercised by tests/plan/actions-051-060.test.ts."
  },
  {
    "id": 52,
    "title": "Dry-run-first interactions",
    "workstream": "Governed actions",
    "source": "src/actions/governance.ts",
    "test": "tests/plan/actions-051-060.test.ts",
    "testId": "plan-052",
    "state": "verified",
    "evidenceNote": "plan-052: src/actions/governance.ts#export function createDryRunPreview is exercised by tests/plan/actions-051-060.test.ts."
  },
  {
    "id": 53,
    "title": "Authority-aware action gating",
    "workstream": "Governed actions",
    "source": "src/actions/governance.ts",
    "test": "tests/plan/actions-051-060.test.ts",
    "testId": "plan-053",
    "state": "verified",
    "evidenceNote": "plan-053: src/actions/governance.ts#export function buildApprovalPack is exercised by tests/plan/actions-051-060.test.ts."
  },
  {
    "id": 54,
    "title": "Runbook-bound actions",
    "workstream": "Governed actions",
    "source": "src/actions/governance.ts",
    "test": "tests/plan/actions-051-060.test.ts",
    "testId": "plan-054",
    "state": "verified",
    "evidenceNote": "plan-054: src/actions/governance.ts#export function mapActionToRunbook is exercised by tests/plan/actions-051-060.test.ts."
  },
  {
    "id": 55,
    "title": "Semantic canary templates",
    "workstream": "Governed actions",
    "source": "src/actions/governance.ts",
    "test": "tests/plan/actions-051-060.test.ts",
    "testId": "plan-055",
    "state": "verified",
    "evidenceNote": "plan-055: src/actions/governance.ts#export async function runCanaryChecks is exercised by tests/plan/actions-051-060.test.ts."
  },
  {
    "id": 56,
    "title": "Automatic rollback contracts",
    "workstream": "Governed actions",
    "source": "src/actions/governance.ts",
    "test": "tests/plan/actions-051-060.test.ts",
    "testId": "plan-056",
    "state": "verified",
    "evidenceNote": "plan-056: src/actions/governance.ts#export async function executeRollback is exercised by tests/plan/actions-051-060.test.ts."
  },
  {
    "id": 57,
    "title": "Executable dispatch and live operation timeline",
    "workstream": "Governed actions",
    "source": "src/actions/governance.ts",
    "test": "tests/plan/actions-051-060.test.ts",
    "testId": "plan-057",
    "state": "verified",
    "evidenceNote": "plan-057: src/actions/governance.ts#export async function dispatchGovernedAction is exercised by tests/plan/actions-051-060.test.ts."
  },
  {
    "id": 58,
    "title": "Incident workspace",
    "workstream": "Governed actions",
    "source": "src/actions/governance.ts",
    "test": "tests/plan/actions-051-060.test.ts",
    "testId": "plan-058",
    "state": "verified",
    "evidenceNote": "plan-058: src/actions/governance.ts#export class IncidentWorkspace is exercised by tests/plan/actions-051-060.test.ts."
  },
  {
    "id": 59,
    "title": "Blocker and owner handoff packets",
    "workstream": "Governed actions",
    "source": "src/actions/governance.ts",
    "test": "tests/plan/actions-051-060.test.ts",
    "testId": "plan-059",
    "state": "verified",
    "evidenceNote": "plan-059: src/actions/governance.ts#export function buildPostmortem is exercised by tests/plan/actions-051-060.test.ts."
  },
  {
    "id": 60,
    "title": "Action/read separation",
    "workstream": "Governed actions",
    "source": "src/actions/governance.ts",
    "test": "tests/plan/actions-051-060.test.ts",
    "testId": "plan-060",
    "state": "verified",
    "evidenceNote": "plan-060: src/actions/governance.ts#export function createEscalation is exercised by tests/plan/actions-051-060.test.ts."
  },
  {
    "id": 61,
    "title": "Living documentation graph",
    "workstream": "Operator operations",
    "source": "src/product/operations.ts",
    "test": "tests/plan/product-061-070.test.ts",
    "testId": "plan-061",
    "state": "verified",
    "evidenceNote": "plan-061: src/product/operations.ts#export function buildLivingDocumentationGraph is exercised by tests/plan/product-061-070.test.ts."
  },
  {
    "id": 62,
    "title": "Documentation drift analysis",
    "workstream": "Operator operations",
    "source": "src/product/operations.ts",
    "test": "tests/plan/product-061-070.test.ts",
    "testId": "plan-062",
    "state": "verified",
    "evidenceNote": "plan-062: src/product/operations.ts#export function detectDocumentationDrift is exercised by tests/plan/product-061-070.test.ts."
  },
  {
    "id": 63,
    "title": "Ownership and stewardship map",
    "workstream": "Operator operations",
    "source": "src/product/operations.ts",
    "test": "tests/plan/product-061-070.test.ts",
    "testId": "plan-063",
    "state": "verified",
    "evidenceNote": "plan-063: src/product/operations.ts#export function buildStewardshipMap is exercised by tests/plan/product-061-070.test.ts."
  },
  {
    "id": 64,
    "title": "Decision ledger",
    "workstream": "Operator operations",
    "source": "src/product/operations.ts",
    "test": "tests/plan/product-061-070.test.ts",
    "testId": "plan-064",
    "state": "verified",
    "evidenceNote": "plan-064: src/product/operations.ts#export class DecisionLedger is exercised by tests/plan/product-061-070.test.ts."
  },
  {
    "id": 65,
    "title": "Risk and control overlay",
    "workstream": "Operator operations",
    "source": "src/product/operations.ts",
    "test": "tests/plan/product-061-070.test.ts",
    "testId": "plan-065",
    "state": "verified",
    "evidenceNote": "plan-065: src/product/operations.ts#export function buildRiskRegister is exercised by tests/plan/product-061-070.test.ts."
  },
  {
    "id": 66,
    "title": "Compliance-bound data-flow view",
    "workstream": "Operator operations",
    "source": "src/product/operations.ts",
    "test": "tests/plan/product-061-070.test.ts",
    "testId": "plan-066",
    "state": "verified",
    "evidenceNote": "plan-066: src/product/operations.ts#export function buildComplianceFlow is exercised by tests/plan/product-061-070.test.ts."
  },
  {
    "id": 67,
    "title": "External dependency register",
    "workstream": "Operator operations",
    "source": "src/product/operations.ts",
    "test": "tests/plan/product-061-070.test.ts",
    "testId": "plan-067",
    "state": "verified",
    "evidenceNote": "plan-067: src/product/operations.ts#export function buildDependencyView is exercised by tests/plan/product-061-070.test.ts."
  },
  {
    "id": 68,
    "title": "Goal-to-graph and cross-objective alignment",
    "workstream": "Operator operations",
    "source": "src/product/operations.ts",
    "test": "tests/plan/product-061-070.test.ts",
    "testId": "plan-068",
    "state": "verified",
    "evidenceNote": "plan-068: src/product/operations.ts#export function evaluateGoalProgress is exercised by tests/plan/product-061-070.test.ts."
  },
  {
    "id": 69,
    "title": "Technical-debt and retirement view",
    "workstream": "Operator operations",
    "source": "src/product/operations.ts",
    "test": "tests/plan/product-061-070.test.ts",
    "testId": "plan-069",
    "state": "verified",
    "evidenceNote": "plan-069: src/product/operations.ts#export function findTechnicalDebtHotspots is exercised by tests/plan/product-061-070.test.ts."
  },
  {
    "id": 70,
    "title": "Readiness and completion contracts",
    "workstream": "Operator operations",
    "source": "src/product/operations.ts",
    "test": "tests/plan/product-061-070.test.ts",
    "testId": "plan-070",
    "state": "verified",
    "evidenceNote": "plan-070: src/product/operations.ts#export function evaluateLaunchReadiness is exercised by tests/plan/product-061-070.test.ts."
  },
  {
    "id": 71,
    "title": "Versioned shared views",
    "workstream": "Collaboration and reporting",
    "source": "src/product/collaboration.ts",
    "test": "tests/plan/product-071-080.test.ts",
    "testId": "plan-071",
    "state": "verified",
    "evidenceNote": "plan-071: src/product/collaboration.ts#export class SavedViewStore is exercised by tests/plan/product-071-080.test.ts."
  },
  {
    "id": 72,
    "title": "Anchored review comments",
    "workstream": "Collaboration and reporting",
    "source": "src/product/collaboration.ts",
    "test": "tests/plan/product-071-080.test.ts",
    "testId": "plan-072",
    "state": "verified",
    "evidenceNote": "plan-072: src/product/collaboration.ts#export class AnnotationThreadStore is exercised by tests/plan/product-071-080.test.ts."
  },
  {
    "id": 73,
    "title": "Decision cockpit and decision-room sessions",
    "workstream": "Collaboration and reporting",
    "source": "src/product/collaboration.ts",
    "test": "tests/plan/product-071-080.test.ts",
    "testId": "plan-073",
    "state": "verified",
    "evidenceNote": "plan-073: src/product/collaboration.ts#export function buildDecisionCockpit is exercised by tests/plan/product-071-080.test.ts."
  },
  {
    "id": 74,
    "title": "Role-specific briefing modes",
    "workstream": "Collaboration and reporting",
    "source": "src/product/collaboration.ts",
    "test": "tests/plan/product-071-080.test.ts",
    "testId": "plan-074",
    "state": "verified",
    "evidenceNote": "plan-074: src/product/collaboration.ts#export function buildExecutiveBriefing is exercised by tests/plan/product-071-080.test.ts."
  },
  {
    "id": 75,
    "title": "Early-warning and exception inbox",
    "workstream": "Collaboration and reporting",
    "source": "src/product/collaboration.ts",
    "test": "tests/plan/product-071-080.test.ts",
    "testId": "plan-075",
    "state": "verified",
    "evidenceNote": "plan-075: src/product/collaboration.ts#export function buildOperationsInbox is exercised by tests/plan/product-071-080.test.ts."
  },
  {
    "id": 76,
    "title": "Outcome watchlists and triggered reassessment",
    "workstream": "Collaboration and reporting",
    "source": "src/product/collaboration.ts",
    "test": "tests/plan/product-071-080.test.ts",
    "testId": "plan-076",
    "state": "verified",
    "evidenceNote": "plan-076: src/product/collaboration.ts#export class WatchlistStore is exercised by tests/plan/product-071-080.test.ts."
  },
  {
    "id": 77,
    "title": "Embeddable read-only surfaces",
    "workstream": "Collaboration and reporting",
    "source": "src/product/collaboration.ts",
    "test": "tests/plan/product-071-080.test.ts",
    "testId": "plan-077",
    "state": "verified",
    "evidenceNote": "plan-077: src/product/collaboration.ts#export function createEmbedPayload is exercised by tests/plan/product-071-080.test.ts."
  },
  {
    "id": 78,
    "title": "Evidence-rich report generator",
    "workstream": "Collaboration and reporting",
    "source": "src/product/collaboration.ts",
    "test": "tests/plan/product-071-080.test.ts",
    "testId": "plan-078",
    "state": "verified",
    "evidenceNote": "plan-078: src/product/collaboration.ts#export function exportExecutiveReport is exercised by tests/plan/product-071-080.test.ts."
  },
  {
    "id": 79,
    "title": "Graph API and query SDK",
    "workstream": "Collaboration and reporting",
    "source": "src/product/collaboration.ts",
    "test": "tests/plan/product-071-080.test.ts",
    "testId": "plan-079",
    "state": "verified",
    "evidenceNote": "plan-079: src/product/collaboration.ts#export function queryGraph is exercised by tests/plan/product-071-080.test.ts."
  },
  {
    "id": 80,
    "title": "Operational briefings and human-readable change narrative",
    "workstream": "Collaboration and reporting",
    "source": "src/product/collaboration.ts",
    "test": "tests/plan/product-071-080.test.ts",
    "testId": "plan-080",
    "state": "verified",
    "evidenceNote": "plan-080: src/product/collaboration.ts#export function buildNarrativeWalkthrough is exercised by tests/plan/product-071-080.test.ts."
  },
  {
    "id": 81,
    "title": "Shared platform-pure graph semantics",
    "workstream": "Brain Mirror boundary",
    "source": "src/shared/graph-contract.ts",
    "test": "tests/plan/mirror-081-090.test.ts",
    "testId": "plan-081",
    "state": "verified",
    "evidenceNote": "plan-081: src/shared/graph-contract.ts#export function toSharedGraphNode is exercised by tests/plan/mirror-081-090.test.ts."
  },
  {
    "id": 82,
    "title": "Strict domain isolation",
    "workstream": "Brain Mirror boundary",
    "source": "src/shared/graph-contract.ts",
    "test": "tests/plan/mirror-081-090.test.ts",
    "testId": "plan-082",
    "state": "verified",
    "evidenceNote": "plan-082: src/shared/graph-contract.ts#export class DomainBoundaryStore is exercised by tests/plan/mirror-081-090.test.ts."
  },
  {
    "id": 83,
    "title": "Shared visual and relationship grammar with domain-safe meaning",
    "workstream": "Brain Mirror boundary",
    "source": "src/shared/graph-contract.ts",
    "test": "tests/plan/mirror-081-090.test.ts",
    "testId": "plan-083",
    "state": "verified",
    "evidenceNote": "plan-083: src/shared/graph-contract.ts#export function buildSharedRelationship is exercised by tests/plan/mirror-081-090.test.ts."
  },
  {
    "id": 84,
    "title": "Qualitative confidence without personal scoring",
    "workstream": "Brain Mirror boundary",
    "source": "src/shared/graph-contract.ts",
    "test": "tests/plan/mirror-081-090.test.ts",
    "testId": "plan-084",
    "state": "verified",
    "evidenceNote": "plan-084: src/shared/graph-contract.ts#export function qualitativeConfidenceLabel is exercised by tests/plan/mirror-081-090.test.ts."
  },
  {
    "id": 85,
    "title": "Constitutional wording layer",
    "workstream": "Brain Mirror boundary",
    "source": "src/shared/graph-contract.ts",
    "test": "tests/plan/mirror-081-090.test.ts",
    "testId": "plan-085",
    "state": "verified",
    "evidenceNote": "plan-085: src/shared/graph-contract.ts#export function validateConstitutionalWording is exercised by tests/plan/mirror-081-090.test.ts."
  },
  {
    "id": 86,
    "title": "Consent and purpose-bound lenses",
    "workstream": "Brain Mirror boundary",
    "source": "src/shared/graph-contract.ts",
    "test": "tests/plan/mirror-081-090.test.ts",
    "testId": "plan-086",
    "state": "verified",
    "evidenceNote": "plan-086: src/shared/graph-contract.ts#export function applyConsentLens is exercised by tests/plan/mirror-081-090.test.ts."
  },
  {
    "id": 87,
    "title": "Local-first personal graph, annotations, and sharing",
    "workstream": "Brain Mirror boundary",
    "source": "src/shared/graph-contract.ts",
    "test": "tests/plan/mirror-081-090.test.ts",
    "testId": "plan-087",
    "state": "verified",
    "evidenceNote": "plan-087: src/shared/graph-contract.ts#export class MirrorLocalStore is exercised by tests/plan/mirror-081-090.test.ts."
  },
  {
    "id": 88,
    "title": "Calm-start and question-led interaction profile",
    "workstream": "Brain Mirror boundary",
    "source": "src/shared/graph-contract.ts",
    "test": "tests/plan/mirror-081-090.test.ts",
    "testId": "plan-088",
    "state": "verified",
    "evidenceNote": "plan-088: src/shared/graph-contract.ts#export function buildCalmInteractionProfile is exercised by tests/plan/mirror-081-090.test.ts."
  },
  {
    "id": 89,
    "title": "User-correctable pattern-to-response exploration",
    "workstream": "Brain Mirror boundary",
    "source": "src/shared/graph-contract.ts",
    "test": "tests/plan/mirror-081-090.test.ts",
    "testId": "plan-089",
    "state": "verified",
    "evidenceNote": "plan-089: src/shared/graph-contract.ts#export function applyUserCorrection is exercised by tests/plan/mirror-081-090.test.ts."
  },
  {
    "id": 90,
    "title": "Reciprocal usefulness and learning contract",
    "workstream": "Brain Mirror boundary",
    "source": "src/shared/graph-contract.ts",
    "test": "tests/plan/mirror-081-090.test.ts",
    "testId": "plan-090",
    "state": "verified",
    "evidenceNote": "plan-090: src/shared/graph-contract.ts#export class ReciprocalLearningLedger is exercised by tests/plan/mirror-081-090.test.ts."
  },
  {
    "id": 91,
    "title": "Modular TypeScript source with a single-file release",
    "workstream": "Platform and release",
    "source": "src/platform/release.ts",
    "test": "tests/plan/platform-091-100.test.ts",
    "testId": "plan-091",
    "state": "verified",
    "evidenceNote": "plan-091: src/platform/release.ts#export function createModuleReleaseManifest is exercised by tests/plan/platform-091-100.test.ts."
  },
  {
    "id": 92,
    "title": "Renderer abstraction with benchmark gate",
    "workstream": "Platform and release",
    "source": "src/platform/release.ts",
    "test": "tests/plan/platform-091-100.test.ts",
    "testId": "plan-092",
    "state": "verified",
    "evidenceNote": "plan-092: src/platform/release.ts#export class RendererRegistry is exercised by tests/plan/platform-091-100.test.ts."
  },
  {
    "id": 93,
    "title": "Worker-based deterministic layout and analytics",
    "workstream": "Platform and release",
    "source": "src/workers/graph-worker.ts",
    "test": "tests/plan/platform-091-100.test.ts",
    "testId": "plan-093",
    "state": "verified",
    "evidenceNote": "plan-093: src/workers/graph-worker.ts#export function acceptBoundWorkerResult is exercised by tests/plan/platform-091-100.test.ts."
  },
  {
    "id": 94,
    "title": "Adapter plugin architecture",
    "workstream": "Platform and release",
    "source": "src/adapters/plugins.ts",
    "test": "tests/plan/platform-091-100.test.ts",
    "testId": "plan-094",
    "state": "verified",
    "evidenceNote": "plan-094: src/adapters/plugins.ts#export class AdapterPluginRegistry is exercised by tests/plan/platform-091-100.test.ts."
  },
  {
    "id": 95,
    "title": "Offline-first snapshot application",
    "workstream": "Platform and release",
    "source": "src/offline/snapshot-cache.ts",
    "test": "tests/plan/platform-091-100.test.ts",
    "testId": "plan-095",
    "state": "verified",
    "evidenceNote": "plan-095: src/offline/snapshot-cache.ts#export class OfflineSnapshotCache is exercised by tests/plan/platform-091-100.test.ts."
  },
  {
    "id": 96,
    "title": "Graph-scale performance budgets and scheduler",
    "workstream": "Platform and release",
    "source": "src/platform/scheduler.ts",
    "test": "tests/plan/platform-091-100.test.ts",
    "testId": "plan-096",
    "state": "verified",
    "evidenceNote": "plan-096: src/platform/scheduler.ts#export class GraphWorkScheduler is exercised by tests/plan/platform-091-100.test.ts."
  },
  {
    "id": 97,
    "title": "Accessibility as a graph model",
    "workstream": "Platform and release",
    "source": "src/accessibility/model.ts",
    "test": "tests/plan/platform-091-100.test.ts",
    "testId": "plan-097",
    "state": "verified",
    "evidenceNote": "plan-097: src/accessibility/model.ts#export function buildAccessibleGraphModel is exercised by tests/plan/platform-091-100.test.ts."
  },
  {
    "id": 98,
    "title": "Neurodivergent cognitive-load and recovery controls",
    "workstream": "Platform and release",
    "source": "src/accessibility/cognitive-load.ts",
    "test": "tests/plan/platform-091-100.test.ts",
    "testId": "plan-098",
    "state": "verified",
    "evidenceNote": "plan-098: src/accessibility/cognitive-load.ts#export class CognitiveLoadController is exercised by tests/plan/platform-091-100.test.ts."
  },
  {
    "id": 99,
    "title": "Security, privacy, and destructive-action threat model",
    "workstream": "Platform and release",
    "source": "src/security/threat-model.ts",
    "test": "tests/plan/platform-091-100.test.ts",
    "testId": "plan-099",
    "state": "verified",
    "evidenceNote": "plan-099: src/security/threat-model.ts#export function evaluateThreatModel is exercised by tests/plan/platform-091-100.test.ts."
  },
  {
    "id": 100,
    "title": "Evidence-bound release certification",
    "workstream": "Platform and release",
    "source": "src/certification/evidence.ts",
    "test": "tests/plan/platform-091-100.test.ts",
    "testId": "plan-100",
    "state": "verified",
    "evidenceNote": "plan-100: src/certification/evidence.ts#export function evaluateReleaseEvidence is exercised by tests/plan/platform-091-100.test.ts."
  }
] as PlanCapability[];
