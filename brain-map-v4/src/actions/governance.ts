import type { GraphDocument } from '../schema/types';
import { graphHash } from '../graph/document';
import { digestCanonical } from '../security/integrity';

export type GovernanceAuthority = 'viewer' | 'operator' | 'verifier' | 'provider' | 'owner';
export type ActionRisk = 'low' | 'medium' | 'high' | 'critical';

export interface GovernedActionDefinition {
  kind: string;
  title: string;
  requiredAuthority: GovernanceAuthority;
  requiredCapabilities: string[];
  risk: ActionRisk;
  runbookId: string;
  canaryRequired: boolean;
  rollbackRequired: boolean;
}

export class ActionRegistry {
  private definitions = new Map<string, GovernedActionDefinition>();

  register(definition: GovernedActionDefinition): void {
    if (this.definitions.has(definition.kind)) throw new Error('duplicate-action-kind');
    if (
      !definition.kind.trim() ||
      !definition.title.trim() ||
      !definition.runbookId.trim() ||
      !definition.requiredCapabilities.length
    ) {
      throw new Error('action-definition-invalid');
    }
    this.definitions.set(definition.kind, structuredClone(definition));
  }

  get(kind: string): GovernedActionDefinition | undefined {
    const definition = this.definitions.get(kind);
    return definition ? structuredClone(definition) : undefined;
  }

  authorize(
    kind: string,
    authority: GovernanceAuthority,
    capabilities: string[],
  ): { authorized: boolean; reasons: string[] } {
    const definition = this.definitions.get(kind);
    if (!definition) return { authorized: false, reasons: ['action-unregistered'] };
    const reasons: string[] = [];
    if (authority !== definition.requiredAuthority) reasons.push('authority-mismatch');
    for (const capability of definition.requiredCapabilities) {
      if (!capabilities.includes(capability)) reasons.push(`capability-missing:${capability}`);
    }
    return { authorized: reasons.length === 0, reasons };
  }
}

export interface DryRunPreview {
  actionKind: string;
  generatedAt: string;
  graphRevision: string;
  parameters: Record<string, unknown>;
  affectedNodeIds: string[];
  effects: string[];
  previewHash: string;
}

export function createDryRunPreview(
  definition: GovernedActionDefinition,
  parameters: Record<string, unknown>,
  graph: GraphDocument,
  generatedAt: string,
): DryRunPreview {
  if (!Number.isFinite(Date.parse(generatedAt))) throw new Error('dry-run-timestamp-invalid');
  const nodeId = typeof parameters.nodeId === 'string' ? parameters.nodeId : null;
  if (nodeId && !graph.nodes.some((node) => node.id === nodeId))
    throw new Error('dry-run-target-missing');
  const body = {
    actionKind: definition.kind,
    generatedAt,
    graphRevision: graphHash(graph),
    parameters: structuredClone(parameters),
    affectedNodeIds: nodeId ? [nodeId] : [],
    effects: [
      `would-run:${definition.kind}`,
      `canary:${definition.canaryRequired ? 'required' : 'not-required'}`,
      `rollback:${definition.rollbackRequired ? 'required' : 'not-required'}`,
    ],
  };
  return { ...body, previewHash: `sha256-${digestCanonical(body)}` };
}

export function buildApprovalPack(
  definition: GovernedActionDefinition,
  preview: DryRunPreview,
  evidenceHandles: string[],
  createdAt: string,
): {
  actionKind: string;
  previewHash: string;
  risk: ActionRisk;
  requiredApprovers: GovernanceAuthority[];
  evidenceHandles: string[];
  createdAt: string;
  integrity: string;
} {
  if (!evidenceHandles.length || evidenceHandles.some((handle) => !handle.trim())) {
    throw new Error('approval-evidence-required');
  }
  if (!Number.isFinite(Date.parse(createdAt))) throw new Error('approval-timestamp-invalid');
  const requiredApprovers: GovernanceAuthority[] =
    definition.risk === 'critical'
      ? ['operator', 'verifier', 'owner']
      : definition.risk === 'high'
        ? ['operator', 'verifier']
        : ['operator'];
  const body = {
    actionKind: definition.kind,
    previewHash: preview.previewHash,
    risk: definition.risk,
    requiredApprovers,
    evidenceHandles: [...new Set(evidenceHandles)].sort(),
    createdAt,
  };
  return { ...body, integrity: `sha256-${digestCanonical(body)}` };
}

export interface Runbook {
  id: string;
  version: string;
  steps: string[];
}

export function mapActionToRunbook(
  definition: GovernedActionDefinition,
  runbooks: Runbook[],
): Runbook {
  const runbook = runbooks.find((entry) => entry.id === definition.runbookId);
  if (!runbook || !runbook.version.trim() || !runbook.steps.length) {
    throw new Error('action-runbook-missing');
  }
  return structuredClone(runbook);
}

export interface CanaryCheck {
  id: string;
  description: string;
  run(): Promise<{ passed: boolean; evidenceHandle: string; detail?: string }>;
}

export async function runCanaryChecks(
  checks: CanaryCheck[],
  observedAt: string,
): Promise<{
  passed: boolean;
  observedAt: string;
  results: Array<{ id: string; passed: boolean; evidenceHandle: string; detail?: string }>;
}> {
  if (!checks.length) throw new Error('canary-checks-required');
  if (!Number.isFinite(Date.parse(observedAt))) throw new Error('canary-timestamp-invalid');
  const results = [];
  for (const check of checks) {
    const result = await check.run();
    if (!result.evidenceHandle.trim()) throw new Error(`canary-evidence-missing:${check.id}`);
    results.push({ id: check.id, ...result });
  }
  return { passed: results.every((result) => result.passed), observedAt, results };
}

export interface RollbackContract {
  id: string;
  actionKind: string;
  targetRevision: string;
  requiredAuthority: GovernanceAuthority;
  verify(): Promise<{ passed: boolean; evidenceHandle: string }>;
}

export async function executeRollback(
  contract: RollbackContract,
  authority: GovernanceAuthority,
  mutate: (targetRevision: string) => Promise<string>,
  startedAt: string,
): Promise<{
  state: 'verified' | 'verification-failed';
  rollbackHandle: string;
  evidenceHandle: string;
  startedAt: string;
}> {
  if (authority !== contract.requiredAuthority) throw new Error('rollback-authority-mismatch');
  if (!contract.targetRevision.trim() || !Number.isFinite(Date.parse(startedAt))) {
    throw new Error('rollback-contract-invalid');
  }
  const rollbackHandle = await mutate(contract.targetRevision);
  if (!rollbackHandle.trim()) throw new Error('rollback-handle-missing');
  const verification = await contract.verify();
  if (!verification.evidenceHandle.trim())
    throw new Error('rollback-verification-evidence-missing');
  return {
    state: verification.passed ? 'verified' : 'verification-failed',
    rollbackHandle,
    evidenceHandle: verification.evidenceHandle,
    startedAt,
  };
}

export interface DispatchEvent {
  id: string;
  type: 'queued' | 'authorized' | 'started' | 'succeeded' | 'failed' | 'blocked';
  timestamp: string;
  detail: string;
}

export async function dispatchGovernedAction(input: {
  definition: GovernedActionDefinition;
  authority: GovernanceAuthority;
  capabilities: string[];
  approved: boolean;
  previewHash: string;
  execute(): Promise<{ success: boolean; evidenceHandle: string }>;
  now: string;
}): Promise<{ state: 'succeeded' | 'failed' | 'blocked'; timeline: DispatchEvent[] }> {
  if (!Number.isFinite(Date.parse(input.now))) throw new Error('dispatch-timestamp-invalid');
  const timeline: DispatchEvent[] = [];
  const emit = (type: DispatchEvent['type'], detail: string): void => {
    timeline.push({
      id: `dispatch-${timeline.length + 1}-${type}`,
      type,
      timestamp: input.now,
      detail,
    });
  };
  emit('queued', `queued ${input.definition.kind}`);
  const registry = new ActionRegistry();
  registry.register(input.definition);
  const authorization = registry.authorize(
    input.definition.kind,
    input.authority,
    input.capabilities,
  );
  if (!authorization.authorized || !input.approved || !input.previewHash.startsWith('sha256-')) {
    emit(
      'blocked',
      [
        ...authorization.reasons,
        !input.approved ? 'approval-missing' : '',
        !input.previewHash.startsWith('sha256-') ? 'preview-invalid' : '',
      ]
        .filter(Boolean)
        .join(','),
    );
    return { state: 'blocked', timeline: structuredClone(timeline) };
  }
  emit('authorized', 'authority, capabilities, approval, and preview verified');
  emit('started', 'execution callback invoked');
  try {
    const result = await input.execute();
    if (!result.evidenceHandle.trim()) throw new Error('dispatch-evidence-missing');
    emit(result.success ? 'succeeded' : 'failed', result.evidenceHandle);
    return { state: result.success ? 'succeeded' : 'failed', timeline: structuredClone(timeline) };
  } catch (error) {
    emit('failed', (error as Error).message);
    return { state: 'failed', timeline: structuredClone(timeline) };
  }
}

export interface IncidentDefinition {
  id: string;
  title: string;
  openedAt: string;
  severity: 'sev-1' | 'sev-2' | 'sev-3';
  affectedNodeIds: string[];
}

export class IncidentWorkspace {
  private status: 'open' | 'mitigating' | 'monitoring' | 'resolved' = 'open';
  private updatedAt: string;
  private evidenceHandles: string[] = [];
  private actionIds: string[] = [];

  constructor(private definition: IncidentDefinition) {
    if (!definition.id.trim() || !Number.isFinite(Date.parse(definition.openedAt))) {
      throw new Error('incident-definition-invalid');
    }
    this.definition = structuredClone(definition);
    this.updatedAt = definition.openedAt;
  }

  addEvidence(handle: string): void {
    if (!handle.trim()) throw new Error('incident-evidence-invalid');
    if (!this.evidenceHandles.includes(handle)) this.evidenceHandles.push(handle);
  }

  addAction(actionId: string): void {
    if (!actionId.trim()) throw new Error('incident-action-invalid');
    if (!this.actionIds.includes(actionId)) this.actionIds.push(actionId);
  }

  setStatus(status: 'open' | 'mitigating' | 'monitoring' | 'resolved', updatedAt: string): void {
    if (!Number.isFinite(Date.parse(updatedAt))) throw new Error('incident-timestamp-invalid');
    this.status = status;
    this.updatedAt = updatedAt;
  }

  snapshot() {
    return {
      ...structuredClone(this.definition),
      status: this.status,
      updatedAt: this.updatedAt,
      evidenceHandles: [...this.evidenceHandles],
      actionIds: [...this.actionIds],
    };
  }
}

export interface PostmortemEvent {
  id: string;
  timestamp: string;
  summary: string;
  evidenceHandle: string;
}

export function buildPostmortem(
  incidentId: string,
  events: PostmortemEvent[],
): {
  incidentId: string;
  timeline: PostmortemEvent[];
  rootCause: 'unknown';
  contributingFactors: string[];
  evidenceHandles: string[];
} {
  if (!incidentId.trim()) throw new Error('postmortem-incident-invalid');
  for (const event of events) {
    if (!Number.isFinite(Date.parse(event.timestamp)) || !event.evidenceHandle.trim()) {
      throw new Error('postmortem-event-invalid');
    }
  }
  const timeline = structuredClone(events).sort(
    (left, right) =>
      Date.parse(left.timestamp) - Date.parse(right.timestamp) || left.id.localeCompare(right.id),
  );
  return {
    incidentId,
    timeline,
    rootCause: 'unknown',
    contributingFactors: [],
    evidenceHandles: [...new Set(timeline.map((event) => event.evidenceHandle))].sort(),
  };
}

export function createEscalation(input: {
  id: string;
  owner: 'provider' | 'repository-owner' | 'service-owner';
  request: string;
  evidenceHandles: string[];
  createdAt: string;
}): {
  id: string;
  owner: string;
  request: string;
  evidenceHandles: string[];
  createdAt: string;
  state: 'human-required';
  completedAt: null;
} {
  if (
    !input.id.trim() ||
    !input.request.trim() ||
    !input.evidenceHandles.length ||
    !Number.isFinite(Date.parse(input.createdAt))
  ) {
    throw new Error('escalation-invalid');
  }
  return { ...structuredClone(input), state: 'human-required', completedAt: null };
}
