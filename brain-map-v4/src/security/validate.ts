import { isSafeCollectorPayload } from './sanitize';
import type { EvidenceEnvelope, FactValueSet, GraphDocument, NodeRecord } from '../schema/types';

export interface GraphResourceLimits {
  maxNodes: number;
  maxEdges: number;
  maxClusters: number;
  maxLabelLength: number;
  maxSerializedBytes: number;
  maxDepth: number;
}

const defaults: GraphResourceLimits = {
  maxNodes: 10_000,
  maxEdges: 40_000,
  maxClusters: 500,
  maxLabelLength: 512,
  maxSerializedBytes: 20_000_000,
  maxDepth: 20,
};

const NODE_CLASSES = new Set([
  'repository',
  'service',
  'agent',
  'workflow',
  'capability',
  'outcome',
  'data-store',
  'external-provider',
  'goal',
  'incident',
]);
const LIFECYCLES = new Set([
  'proposed',
  'experimental',
  'active',
  'degraded',
  'deprecated',
  'retired',
  'archived',
]);
const SENSITIVITIES = new Set([
  'public',
  'internal',
  'confidential',
  'secret-locator',
  'prohibited',
]);
const RELATIONS = new Set([
  'calls',
  'imports',
  'deploys-to',
  'authenticates-through',
  'stores-in',
  'monitors',
  'funds',
  'governs',
  'blocks',
  'hosts',
  'proxy',
  'routes',
  'operates',
  'reads',
  'searches',
  'fallback',
  'feeds',
  'token-proxy',
  'tokens',
  'meridian',
  'inference',
  'compliance',
  'lead-flow',
  'overlap',
  'income',
]);
const DIRECTIONS = new Set(['inbound', 'outbound', 'bidirectional']);
const CONFIDENCE = new Set(['high', 'medium', 'low', 'unknown']);
const AUTHORITIES = new Set(['observed', 'derived', 'declared', 'unknown']);
const SOURCE_KINDS = new Set(['provider', 'git', 'runtime', 'manifest', 'human']);

function record(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function unique(values: string[], error: string): Set<string> {
  if (values.some((value) => !value.trim())) throw new Error(`${error}-empty`);
  const set = new Set(values);
  if (set.size !== values.length) throw new Error(error);
  return set;
}

function validateEvidence(evidence: EvidenceEnvelope, sourceIds: Set<string>): void {
  if (!record(evidence)) throw new Error('graph-evidence-invalid');
  if (!sourceIds.has(evidence.sourceId) && evidence.sourceId !== 'unknown') {
    throw new Error('graph-evidence-source-missing');
  }
  if (evidence.observedAt !== null && !validDate(evidence.observedAt)) {
    throw new Error('graph-evidence-observed-at-invalid');
  }
  if (!validDate(evidence.collectedAt)) throw new Error('graph-evidence-collected-at-invalid');
  if (evidence.expiresAt !== null && !validDate(evidence.expiresAt)) {
    throw new Error('graph-evidence-expires-at-invalid');
  }
  if (!AUTHORITIES.has(evidence.authority)) throw new Error('graph-evidence-authority-invalid');
  if (!CONFIDENCE.has(evidence.confidence)) throw new Error('graph-evidence-confidence-invalid');
  if (
    evidence.expiresAfterMs !== undefined &&
    evidence.expiresAfterMs !== null &&
    (!Number.isFinite(evidence.expiresAfterMs) || evidence.expiresAfterMs < 0)
  ) {
    throw new Error('graph-evidence-freshness-invalid');
  }
}

function validateFacts(facts: Record<string, FactValueSet<unknown>>, sourceIds: Set<string>): void {
  for (const [key, factSet] of Object.entries(facts)) {
    if (!key.trim()) throw new Error('graph-fact-key-empty');
    const values = Array.isArray(factSet) ? factSet : [factSet];
    if (values.length === 0) throw new Error('graph-fact-empty');
    for (const fact of values) {
      if (!record(fact) || !('value' in fact) || !record(fact.evidence)) {
        throw new Error('graph-fact-invalid');
      }
      validateEvidence(fact.evidence, sourceIds);
    }
  }
}

function validateNode(node: unknown, sourceIds: Set<string>): void {
  if (!record(node)) throw new Error('graph-node-invalid');
  if (typeof node.id !== 'string' || !node.id.trim()) throw new Error('graph-node-id-invalid');
  if (typeof node.name !== 'string' || !node.name.trim()) {
    throw new Error('graph-node-name-invalid');
  }
  if (!Array.isArray(node.aliases) || node.aliases.some((alias) => typeof alias !== 'string')) {
    throw new Error('graph-node-aliases-invalid');
  }
  if (!record(node.facts)) throw new Error('graph-node-facts-invalid');
  if (!NODE_CLASSES.has(String(node.class))) throw new Error('graph-node-class-invalid');
  if (!LIFECYCLES.has(String(node.lifecycle))) throw new Error('graph-node-lifecycle-invalid');
  if (!SENSITIVITIES.has(String(node.sensitivity))) {
    throw new Error('graph-node-sensitivity-invalid');
  }
  if (!validDate(node.createdAt) || !validDate(node.updatedAt)) {
    throw new Error('graph-node-timestamp-invalid');
  }
  if (Date.parse(String(node.updatedAt)) < Date.parse(String(node.createdAt))) {
    throw new Error('graph-node-timestamp-order');
  }
  unique(node.aliases as string[], 'graph-duplicate-node-alias');
  validateFacts(node.facts as Record<string, FactValueSet<unknown>>, sourceIds);
}

export function validateNoPrototypePollution(value: unknown): void {
  if (!isSafeCollectorPayload(value)) throw new Error('prototype-pollution-risk');
}

export function validateGraphDocument(input: unknown): asserts input is GraphDocument {
  validateNoPrototypePollution(input);
  if (!record(input)) throw new Error('graph-document-invalid');
  if (typeof input.schemaVersion !== 'string' || !/^4\.\d+\.\d+$/.test(input.schemaVersion)) {
    throw new Error('graph-schema-version-unsupported');
  }
  if (!validDate(input.generatedAt)) throw new Error('graph-generated-at-invalid');
  if (
    !Array.isArray(input.nodes) ||
    !Array.isArray(input.edges) ||
    !Array.isArray(input.sources) ||
    !Array.isArray(input.clusters) ||
    !record(input.facts) ||
    !record(input.health)
  ) {
    throw new Error('graph-structure-invalid');
  }

  const sourceIds = unique(
    input.sources.map((source) =>
      record(source) && typeof source.id === 'string' ? source.id : '',
    ),
    'graph-duplicate-source-id',
  );
  for (const source of input.sources) {
    if (
      !record(source) ||
      !SOURCE_KINDS.has(String(source.kind)) ||
      !validDate(source.activeSince) ||
      !Number.isFinite(source.authorityRank)
    ) {
      throw new Error('graph-source-invalid');
    }
  }

  const nodes = input.nodes as unknown[];
  for (const node of nodes) validateNode(node, sourceIds);
  const typedNodes = nodes as NodeRecord[];
  const nodeIds = unique(
    typedNodes.map((node) => node.id),
    'graph-duplicate-node-id',
  );
  const aliases = new Map<string, string>();
  for (const node of typedNodes) {
    for (const alias of [node.id, ...node.aliases]) {
      const owner = aliases.get(alias);
      if (owner && owner !== node.id) throw new Error('graph-node-alias-collision');
      aliases.set(alias, node.id);
    }
  }

  const clusterValues: unknown[] = input.clusters;
  const clusterIds = unique(
    clusterValues.map((cluster) =>
      record(cluster) && typeof cluster.id === 'string' ? cluster.id : '',
    ),
    'graph-duplicate-cluster-id',
  );
  const parentByCluster = new Map<string, string | null>();
  for (const cluster of clusterValues) {
    if (
      !record(cluster) ||
      typeof cluster.id !== 'string' ||
      !cluster.id.trim() ||
      typeof cluster.label !== 'string' ||
      !cluster.label.trim() ||
      !Array.isArray(cluster.nodeIds) ||
      cluster.nodeIds.some((nodeId: unknown) => typeof nodeId !== 'string')
    ) {
      throw new Error('graph-cluster-invalid');
    }
    const nodeIdsInCluster = cluster.nodeIds as string[];
    unique(nodeIdsInCluster, 'graph-duplicate-cluster-node');
    if (nodeIdsInCluster.some((nodeId) => !nodeIds.has(nodeId))) {
      throw new Error('graph-cluster-node-missing');
    }
    const parent = cluster.parentClusterId;
    if (parent !== undefined && parent !== null && typeof parent !== 'string') {
      throw new Error('graph-cluster-parent-invalid');
    }
    if (typeof parent === 'string' && !clusterIds.has(parent)) {
      throw new Error('graph-cluster-parent-missing');
    }
    parentByCluster.set(cluster.id, typeof parent === 'string' ? parent : null);
  }
  for (const [clusterId, initialParent] of parentByCluster) {
    const seen = new Set<string>();
    let parent = initialParent;
    while (parent) {
      if (seen.has(parent) || parent === clusterId) throw new Error('graph-cluster-cycle');
      seen.add(parent);
      parent = parentByCluster.get(parent) ?? null;
    }
  }
  for (const node of typedNodes) {
    if (node.clusterId && !clusterIds.has(node.clusterId))
      throw new Error('graph-node-cluster-missing');
  }

  unique(
    input.edges.map((edge) => (record(edge) && typeof edge.id === 'string' ? edge.id : '')),
    'graph-duplicate-edge-id',
  );
  for (const edge of input.edges) {
    if (!record(edge)) throw new Error('graph-edge-invalid');
    if (!nodeIds.has(String(edge.source)) || !nodeIds.has(String(edge.target))) {
      throw new Error('graph-dangling-edge');
    }
    if (!RELATIONS.has(String(edge.relation))) throw new Error('graph-edge-relation-invalid');
    if (!DIRECTIONS.has(String(edge.direction))) throw new Error('graph-edge-direction-invalid');
    if (!LIFECYCLES.has(String(edge.lifecycle))) throw new Error('graph-edge-lifecycle-invalid');
    if (!CONFIDENCE.has(String(edge.confidence))) throw new Error('graph-edge-confidence-invalid');
    if (typeof edge.evidenceId !== 'string' || !edge.evidenceId.trim()) {
      throw new Error('graph-edge-evidence-invalid');
    }
  }

  validateFacts(input.facts as Record<string, FactValueSet<unknown>>, sourceIds);
  if (input.runtimeFacts !== undefined) {
    if (!record(input.runtimeFacts)) throw new Error('graph-runtime-facts-invalid');
    validateFacts(input.runtimeFacts as Record<string, FactValueSet<unknown>>, sourceIds);
  }
  for (const signal of Object.values(input.health)) {
    if (!record(signal) || !sourceIds.has(String(signal.sourceId))) {
      throw new Error('graph-health-source-missing');
    }
  }
}

function validateFiniteAndDepth(
  value: unknown,
  maxDepth: number,
  depth = 0,
  seen = new WeakSet<object>(),
): void {
  if (depth > maxDepth) throw new Error('graph-nesting-limit');
  if (typeof value === 'number' && !Number.isFinite(value)) {
    throw new Error('graph-non-finite-number');
  }
  if (!value || typeof value !== 'object') return;
  if (seen.has(value)) throw new Error('graph-cyclic-input');
  seen.add(value);
  for (const nested of Array.isArray(value)
    ? value
    : Object.values(value as Record<string, unknown>)) {
    validateFiniteAndDepth(nested, maxDepth, depth + 1, seen);
  }
  seen.delete(value);
}

export function validateGraphResourceLimits(
  graph: GraphDocument,
  limits: Partial<GraphResourceLimits> = {},
): void {
  const policy = { ...defaults, ...limits };
  validateNoPrototypePollution(graph);
  if (graph.nodes.length > policy.maxNodes) throw new Error('graph-node-limit');
  if (graph.edges.length > policy.maxEdges) throw new Error('graph-edge-limit');
  if (graph.clusters.length > policy.maxClusters) throw new Error('graph-cluster-limit');
  validateFiniteAndDepth(graph, policy.maxDepth);
  validateGraphDocument(graph);
  if (graph.nodes.some((node) => node.name.length > policy.maxLabelLength)) {
    throw new Error('graph-label-limit');
  }
  if (new TextEncoder().encode(JSON.stringify(graph)).byteLength > policy.maxSerializedBytes) {
    throw new Error('graph-byte-limit');
  }
}

export function validateActionCanary(required: boolean, canaryRun: boolean): void {
  if (required && !canaryRun) throw new Error('canary-missing');
}
