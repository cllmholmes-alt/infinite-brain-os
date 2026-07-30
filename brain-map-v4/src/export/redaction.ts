import type {
  EvidenceEnvelope,
  FactValue,
  FactValueSet,
  GraphDocument,
  NodeRecord,
} from '../schema/types';

type ExportPolicy = 'public' | 'internal' | 'confidential';

const SECRET_KEY =
  /(?:^|[-_])(token|api[-_]?key|password|secret|authorization|cookie|private[-_]?key|credential)(?:$|[-_])/i;
const PRIVATE_LOCATOR = /^(?:file:\/\/|\/(?:Users|home|root|private|etc)\/|[A-Za-z]:\\)/;

function redactValue(value: unknown, level: ExportPolicy): unknown {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  ) {
    if (level === 'public' && typeof value === 'string' && PRIVATE_LOCATOR.test(value)) {
      return '[redacted-locator]';
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, level));
  }

  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, item]) => {
      if (SECRET_KEY.test(key)) {
        output[key] = '[redacted]';
        return;
      }
      output[key] = redactValue(item, level);
    });
    return output;
  }

  return '[redacted]';
}

function redactEvidence(evidence: EvidenceEnvelope, policy: ExportPolicy): EvidenceEnvelope {
  const redacted: EvidenceEnvelope = {
    ...evidence,
    evidenceHandle: policy === 'public' ? '[redacted]' : evidence.evidenceHandle,
  };
  if (evidence.notes) redacted.notes = String(redactValue(evidence.notes, policy));
  return redacted;
}

function redactFact<T>(fact: FactValue<T>, policy: ExportPolicy): FactValue<T> {
  return {
    ...fact,
    value: redactValue(fact.value, policy) as T,
    evidence: redactEvidence(fact.evidence, policy),
  };
}

function redactFactSet<T>(facts: FactValueSet<T>, policy: ExportPolicy): FactValueSet<T> {
  return Array.isArray(facts)
    ? facts.map((fact) => redactFact(fact, policy))
    : redactFact(facts, policy);
}

function allowedSensitivity(node: NodeRecord, policy: ExportPolicy): boolean {
  if (node.sensitivity === 'prohibited') return false;
  if (policy === 'public') return node.sensitivity === 'public';
  if (policy === 'internal') {
    return node.sensitivity === 'public' || node.sensitivity === 'internal';
  }
  return true;
}

function redactNode(node: NodeRecord, policy: ExportPolicy): NodeRecord {
  const redacted: NodeRecord = {
    ...node,
    aliases: policy === 'public' ? [] : node.aliases,
    facts: Object.fromEntries(
      Object.entries(node.facts).map(([key, fact]) => [key, redactFactSet(fact, policy)]),
    ),
  };
  if (policy === 'public') {
    delete redacted.ownerId;
    delete redacted.localEvidenceSource;
  }
  return redacted;
}

export function redactGraph(
  document: GraphDocument,
  policy: ExportPolicy = 'internal',
): GraphDocument {
  const nodes = document.nodes
    .filter((node) => allowedSensitivity(node, policy))
    .map((node) => redactNode(node, policy));
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = document.edges.filter(
    (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target),
  );
  const clusters = document.clusters
    .map((cluster) => ({
      ...cluster,
      nodeIds: cluster.nodeIds.filter((nodeId) => nodeIds.has(nodeId)),
    }))
    .filter((cluster) => cluster.nodeIds.length > 0);
  const facts = Object.fromEntries(
    Object.entries(document.facts).map(([key, fact]) => [key, redactFactSet(fact, policy)]),
  );
  const runtimeFacts = document.runtimeFacts
    ? Object.fromEntries(
        Object.entries(document.runtimeFacts).map(([key, fact]) => [
          key,
          redactFactSet(fact, policy),
        ]),
      )
    : null;
  const sources = document.sources.map((source) =>
    policy === 'public' ? { ...source, owner: '[redacted]' } : source,
  );

  return {
    ...document,
    nodes,
    edges,
    clusters,
    sources,
    facts,
    ...(runtimeFacts ? { runtimeFacts } : {}),
  };
}

export function exportManifest(document: GraphDocument, policy: ExportPolicy) {
  const redacted = redactGraph(document, policy);
  return {
    exportedAt: new Date().toISOString(),
    policy,
    redactionApplied: true,
    document: redacted,
  };
}
