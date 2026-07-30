import type { EdgeRecord, GraphDocument, RuntimeState } from '../schema/types';
import { graphHash } from '../graph/document';
import { deriveTruthStateFromFacts } from '../domain/truth';
import { computeGraphAnalysis, bottleneckEdges } from '../analytics/algorithms';
import { computeRisk } from '../analytics/risk';

export interface DocumentationRecord {
  id: string;
  title: string;
  nodeIds: string[];
  lastReviewedAt: string;
  graphRevision?: string;
}

export function buildLivingDocumentationGraph(
  graph: GraphDocument,
  documents: DocumentationRecord[],
): {
  links: { documentId: string; nodeId: string }[];
  orphanReferences: { documentId: string; nodeId: string }[];
} {
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  const links: { documentId: string; nodeId: string }[] = [];
  const orphanReferences: { documentId: string; nodeId: string }[] = [];
  for (const document of documents) {
    for (const nodeId of [...new Set(document.nodeIds)].sort()) {
      (nodeIds.has(nodeId) ? links : orphanReferences).push({ documentId: document.id, nodeId });
    }
  }
  return { links, orphanReferences };
}

export function detectDocumentationDrift(
  graph: GraphDocument,
  documents: DocumentationRecord[],
  now = Date.now(),
  maxReviewAgeMs = 90 * 86_400_000,
): { documentId: string; reasons: string[] }[] {
  const revision = graphHash(graph);
  const nodeIds = new Set(graph.nodes.map((node) => node.id));
  return documents
    .map((document) => {
      const reasons: string[] = [];
      if (document.graphRevision && document.graphRevision !== revision)
        reasons.push('graph-revision');
      for (const nodeId of document.nodeIds) {
        if (!nodeIds.has(nodeId)) reasons.push(`missing-node:${nodeId}`);
      }
      const reviewedAt = Date.parse(document.lastReviewedAt);
      if (!Number.isFinite(reviewedAt)) reasons.push('review-timestamp-invalid');
      else if (reviewedAt > now || now - reviewedAt > maxReviewAgeMs)
        reasons.push('review-expired');
      return { documentId: document.id, reasons };
    })
    .filter((entry) => entry.reasons.length > 0);
}

function scalarFact(graph: GraphDocument, nodeId: string, key: string): unknown {
  const factSet = graph.nodes.find((node) => node.id === nodeId)?.facts[key];
  if (!factSet || Array.isArray(factSet)) return undefined;
  return factSet.value;
}

export function buildStewardshipMap(graph: GraphDocument): {
  byOwner: Record<string, string[]>;
  unownedNodeIds: string[];
} {
  const byOwner: Record<string, string[]> = {};
  const unownedNodeIds: string[] = [];
  for (const node of [...graph.nodes].sort((left, right) => left.id.localeCompare(right.id))) {
    const owner = scalarFact(graph, node.id, 'owner');
    if (typeof owner !== 'string' || !owner.trim()) {
      unownedNodeIds.push(node.id);
      continue;
    }
    (byOwner[owner] ??= []).push(node.id);
  }
  return { byOwner, unownedNodeIds };
}

export interface DecisionRecord {
  id: string;
  title: string;
  decidedAt: string;
  actorId: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'superseded';
  rationale: string;
  evidenceHandles: string[];
  affectedNodeIds: string[];
  supersedesId?: string;
}

export class DecisionLedger {
  private records: DecisionRecord[] = [];

  append(record: DecisionRecord): void {
    if (this.records.some((entry) => entry.id === record.id))
      throw new Error('duplicate-decision-id');
    if (!Number.isFinite(Date.parse(record.decidedAt)))
      throw new Error('decision-timestamp-invalid');
    if (!record.actorId.trim() || !record.rationale.trim())
      throw new Error('decision-attribution-invalid');
    if (!record.evidenceHandles.length || record.evidenceHandles.some((handle) => !handle.trim())) {
      throw new Error('decision-evidence-required');
    }
    if (record.supersedesId && !this.records.some((entry) => entry.id === record.supersedesId)) {
      throw new Error('decision-supersedes-missing');
    }
    this.records.push(structuredClone(record));
  }

  list(): DecisionRecord[] {
    return structuredClone(this.records);
  }
}

export interface RiskRegisterEntry {
  id: string;
  title: string;
  score: number;
  state: 'open' | 'monitor';
  evidence: string[];
  affectedNodeIds: string[];
}

export function buildRiskRegister(
  graph: GraphDocument,
  runtime: RuntimeState,
): RiskRegisterEntry[] {
  const risk = computeRisk(graph, runtime.unknownItems, runtime.staleItems, runtime.conflictItems);
  const register: RiskRegisterEntry[] = [
    {
      id: 'risk-truth-integrity',
      title: 'Truth integrity and observability',
      score: Math.max(0, Math.min(100, 100 - risk.overallScore)),
      state: risk.overallScore < 75 ? 'open' : 'monitor',
      evidence: [`graph-generated:${graph.generatedAt}`],
      affectedNodeIds: [
        ...new Set([
          ...runtime.unknownItems,
          ...runtime.staleItems,
          ...runtime.conflictItems,
          ...runtime.unavailableItems,
        ]),
      ].sort(),
    },
  ];
  for (const edge of bottleneckEdges(graph, 5)) {
    if (edge.impact <= 0) continue;
    register.push({
      id: `risk-bottleneck:${edge.edgeId}`,
      title: `Dependency bottleneck ${edge.edgeId}`,
      score: edge.impact,
      state: edge.impact >= 50 ? 'open' : 'monitor',
      evidence: [`edge:${edge.edgeId}`, `confidence:${edge.confidence}`],
      affectedNodeIds: [edge.source, edge.target].sort(),
    });
  }
  return register.sort(
    (left, right) => right.score - left.score || left.id.localeCompare(right.id),
  );
}

export function buildComplianceFlow(graph: GraphDocument): {
  nodeIds: string[];
  edges: EdgeRecord[];
} {
  const edges = graph.edges.filter(
    (edge) => edge.relation === 'compliance' || edge.relation === 'governs',
  );
  return {
    nodeIds: [...new Set(edges.flatMap((edge) => [edge.source, edge.target]))].sort(),
    edges: structuredClone(edges).sort((left, right) => left.id.localeCompare(right.id)),
  };
}

export interface DependencyContext {
  edgeId: string;
  nodeId: string;
  relation: EdgeRecord['relation'];
  confidence: EdgeRecord['confidence'];
  lifecycle: EdgeRecord['lifecycle'];
}

export function buildDependencyView(
  graph: GraphDocument,
  nodeId: string,
): { inbound: DependencyContext[]; outbound: DependencyContext[] } {
  const map = (edge: EdgeRecord, other: string): DependencyContext => ({
    edgeId: edge.id,
    nodeId: other,
    relation: edge.relation,
    confidence: edge.confidence,
    lifecycle: edge.lifecycle,
  });
  return {
    inbound: graph.edges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => map(edge, edge.source))
      .sort((left, right) => left.edgeId.localeCompare(right.edgeId)),
    outbound: graph.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => map(edge, edge.target))
      .sort((left, right) => left.edgeId.localeCompare(right.edgeId)),
  };
}

export function evaluateGoalProgress(graph: GraphDocument): Array<{
  nodeId: string;
  progress: number | null;
  state: 'on-track' | 'at-risk' | 'complete' | 'unknown';
  linkedOutcomeIds: string[];
}> {
  return graph.nodes
    .filter((node) => node.class === 'goal')
    .map((node) => {
      const raw = scalarFact(graph, node.id, 'progress');
      const progress =
        typeof raw === 'number' && Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : null;
      const truth = node.facts.progress
        ? deriveTruthStateFromFacts({ progress: node.facts.progress })
        : 'unknown';
      const state: 'on-track' | 'at-risk' | 'complete' | 'unknown' =
        progress === null || ['unknown', 'unavailable', 'stale', 'conflict'].includes(truth)
          ? 'unknown'
          : progress >= 100
            ? 'complete'
            : progress >= 60
              ? 'on-track'
              : 'at-risk';
      const linkedOutcomeIds = graph.edges
        .filter((edge) => edge.source === node.id || edge.target === node.id)
        .flatMap((edge) => [edge.source, edge.target])
        .filter(
          (id) =>
            id !== node.id &&
            graph.nodes.find((candidate) => candidate.id === id)?.class === 'outcome',
        );
      return {
        nodeId: node.id,
        progress,
        state,
        linkedOutcomeIds: [...new Set(linkedOutcomeIds)].sort(),
      };
    })
    .sort((left, right) => left.nodeId.localeCompare(right.nodeId));
}

export function findTechnicalDebtHotspots(graph: GraphDocument): Array<{
  nodeId: string;
  score: number;
  reasons: string[];
}> {
  const analysis = computeGraphAnalysis(graph);
  const articulation = new Set(analysis.articulationPoints);
  const bridgeEndpoints = new Set(
    graph.edges
      .filter((edge) => analysis.bridges.includes(edge.id))
      .flatMap((edge) => [edge.source, edge.target]),
  );
  return graph.nodes
    .map((node) => {
      const reasons: string[] = [];
      let score = 0;
      if (node.lifecycle === 'degraded') {
        score += 60;
        reasons.push('degraded');
      }
      if (node.lifecycle === 'deprecated') {
        score += 80;
        reasons.push('deprecated');
      }
      if (node.lifecycle === 'experimental') {
        score += 20;
        reasons.push('experimental');
      }
      if (articulation.has(node.id)) {
        score += 20;
        reasons.push('articulation-point');
      }
      if (bridgeEndpoints.has(node.id)) {
        score += 10;
        reasons.push('bridge-endpoint');
      }
      return { nodeId: node.id, score: Math.min(100, score), reasons };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score || left.nodeId.localeCompare(right.nodeId));
}

export function evaluateLaunchReadiness(
  graph: GraphDocument,
  runtime: RuntimeState,
): { state: 'ready' | 'blocked'; blockers: string[]; checkedAt: string; graphRevision: string } {
  const blockers = [
    ...runtime.unknownItems.map((id) => `unknown:${id}`),
    ...runtime.staleItems.map((id) => `stale:${id}`),
    ...runtime.conflictItems.map((id) => `conflict:${id}`),
    ...runtime.unavailableItems.map((id) => `unavailable:${id}`),
    ...graph.nodes
      .filter((node) => node.lifecycle === 'degraded')
      .map((node) => `degraded:${node.id}`),
  ].sort();
  return {
    state: blockers.length ? 'blocked' : 'ready',
    blockers,
    checkedAt: runtime.lastUpdatedAt,
    graphRevision: graphHash(graph),
  };
}
