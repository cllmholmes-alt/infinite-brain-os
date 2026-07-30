export type EvidenceClassification = 'observed' | 'derived' | 'declared' | 'unknown';
export type Confidence = 'high' | 'medium' | 'low' | 'unknown';
export type FreshnessState = 'fresh' | 'aging' | 'stale' | 'unknown' | 'unavailable' | 'conflict';

export type LifecycleState =
  'proposed' | 'experimental' | 'active' | 'degraded' | 'deprecated' | 'retired' | 'archived';

export type RelationDirection = 'inbound' | 'outbound' | 'bidirectional';

export type NodeClass =
  | 'repository'
  | 'service'
  | 'agent'
  | 'workflow'
  | 'capability'
  | 'outcome'
  | 'data-store'
  | 'external-provider'
  | 'goal'
  | 'incident';

export type RelationshipType =
  | 'calls'
  | 'imports'
  | 'deploys-to'
  | 'authenticates-through'
  | 'stores-in'
  | 'monitors'
  | 'funds'
  | 'governs'
  | 'blocks'
  | 'hosts'
  | 'proxy'
  | 'routes'
  | 'operates'
  | 'reads'
  | 'searches'
  | 'fallback'
  | 'feeds'
  | 'token-proxy'
  | 'tokens'
  | 'meridian'
  | 'inference'
  | 'compliance'
  | 'lead-flow'
  | 'overlap'
  | 'income';

export interface EvidenceEnvelope {
  sourceId: string;
  observedAt: string | null;
  collectedAt: string;
  expiresAt: string | null;
  method: string;
  confidence: Confidence;
  authority: EvidenceClassification;
  collectorVersion: string;
  environment: string;
  evidenceHandle: string;
  notes?: string | undefined;
  expiresAfterMs?: number | null | undefined;
  sourceRank?: number | undefined;
}

export interface FactValue<T> {
  value: T;
  evidence: EvidenceEnvelope;
}

export type FactValueSet<T> = FactValue<T> | FactValue<T>[];

export interface SourceRecord {
  id: string;
  label: string;
  kind: 'provider' | 'git' | 'runtime' | 'manifest' | 'human';
  owner: string;
  authorityRank: number;
  activeSince: string;
  policy?: string | undefined;
}

export interface NodeRecord {
  id: string;
  aliases: string[];
  class: NodeClass;
  name: string;
  lifecycle: LifecycleState;
  clusterId?: string | undefined;
  facts: Record<string, FactValueSet<unknown>>;
  createdAt: string;
  updatedAt: string;
  ownerId?: string | undefined;
  sensitivity: 'public' | 'internal' | 'confidential' | 'secret-locator' | 'prohibited';
  tags?: string[] | undefined;
  summary?: string | undefined;
  localEvidenceSource?: string | undefined;
}

export interface EdgeRecord {
  id: string;
  source: string;
  target: string;
  relation: RelationshipType;
  direction: RelationDirection;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  confidence: Confidence;
  evidenceId: string;
  lifecycle: LifecycleState;
  relationStrength?: number | undefined;
  relationLabel?: string | undefined;
  isDirected?: boolean | undefined;
}

export interface ClusterRecord {
  id: string;
  label: string;
  nodeIds: string[];
  summary: string;
  parentClusterId?: string | undefined;
}

export interface HealthSignal {
  namespace: string;
  value: 'red' | 'amber' | 'green' | 'blocked' | 'unknown';
  freshness: FreshnessState;
  evidenceId: string;
  sourceId: string;
  notes?: string | undefined;
}

export interface GraphDocument {
  schemaVersion: string;
  manifestVersion?: string | undefined;
  generatedAt: string;
  nodes: NodeRecord[];
  edges: EdgeRecord[];
  clusters: ClusterRecord[];
  sources: SourceRecord[];
  health: Record<string, HealthSignal>;
  facts: Record<string, FactValueSet<unknown>>;
  runtimeFacts?: Record<string, FactValueSet<unknown>> | undefined;
}

export interface RuntimeState {
  mode: 'observe' | 'explain' | 'act';
  zoomLevel: 'overview' | 'neighborhood' | 'detail';
  selectedNodeId: string | null;
  focusNodeId: string | null;
  focusedClusterId: string | null;
  unknownItems: string[];
  staleItems: string[];
  unavailableItems: string[];
  conflictItems: string[];
  activeLenses: ('operations' | 'deployment' | 'data' | 'security' | 'governance' | 'user-path')[];
  selectedPath: string[];
  searchQuery: string;
  actionQueue: string[];
  priorityQueue: string[];
  goalQueue: string[];
  exceptionQueue: string[];
  decisionLog: string[];
  savedViews: string[];
  focusTunnelDepth: number;
  evidenceDrawerOpen: boolean;
  operationTimelineOpen: boolean;
  incidentWorkspaceOpen: boolean;
  timelineFilter: 'all' | 'actions' | 'decisions' | 'errors';
  lastUpdatedAt: string;
  environment: 'stable' | 'reduced-motion' | 'light' | 'dark' | 'low-stimulation' | 'high-contrast';
}

export interface ObservableEvent {
  id: string;
  type:
    'commit' | 'deploy' | 'health-transition' | 'incident' | 'graph-edit' | 'decision' | 'action';
  timestamp: string;
  actorId: string;
  targetId: string;
  sourceEventId?: string | undefined;
  causeIds?: string[] | undefined;
  data: Record<string, unknown>;
}

export interface Snapshot {
  createdAt: string;
  graph: GraphDocument;
  runtime: RuntimeState;
  seed: string;
  hash: string;
}

export interface SharedIdentity {
  id: string;
  aliases: string[];
  name: string;
  type: string;
  lifecycle: LifecycleState;
  sensitivity: 'public' | 'internal' | 'confidential' | 'secret-locator' | 'prohibited';
}
