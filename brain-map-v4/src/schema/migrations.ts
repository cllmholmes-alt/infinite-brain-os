import type { GraphDocument, NodeClass } from './types';
import { canonicalizeGraph } from '../graph/document';
import { validateGraphDocument } from '../security/validate';
import { isSafeCollectorPayload } from '../security/sanitize';

export const COMPATIBILITY_MANIFEST = {
  current: '4.0.0',
  supportedMajors: [4],
  migrations: [{ from: '3.0.0', to: '4.0.0', id: 'migration-v3-to-v4-1' }],
} as const;

export interface LegacyV3Graph {
  schemaVersion: '3.0.0';
  generatedAt: string;
  nodes: Array<{ id: string; label: string; type?: string }>;
  links: Array<{ id?: string; source: string; target: string; relation?: string }>;
}

const NODE_CLASSES = new Set<NodeClass>([
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

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function migrateLegacyV3(input: LegacyV3Graph): GraphDocument {
  if (!isSafeCollectorPayload(input)) throw new Error('graph-import-unsafe');
  if (input.schemaVersion !== '3.0.0' || !Number.isFinite(Date.parse(input.generatedAt))) {
    throw new Error('legacy-v3-header-invalid');
  }
  if (!Array.isArray(input.nodes) || !Array.isArray(input.links))
    throw new Error('legacy-v3-shape-invalid');
  const sourceId = 'migration.v3';
  const evidence = {
    sourceId,
    observedAt: input.generatedAt,
    collectedAt: input.generatedAt,
    expiresAt: null,
    method: 'legacy-v3-import',
    confidence: 'medium' as const,
    authority: 'derived' as const,
    collectorVersion: 'migration-v3-to-v4-1',
    environment: 'import',
    evidenceHandle: `migration:${input.generatedAt}`,
  };
  const document: GraphDocument = {
    schemaVersion: '4.0.0',
    manifestVersion: 'migration-v3-to-v4-1',
    generatedAt: input.generatedAt,
    sources: [
      {
        id: sourceId,
        label: 'Legacy Brain Map v3 import',
        kind: 'manifest',
        owner: 'migration',
        authorityRank: 20,
        activeSince: input.generatedAt,
        policy: 'derived-import-only',
      },
    ],
    nodes: input.nodes.map((node) => {
      if (!node.id?.trim() || !node.label?.trim()) throw new Error('legacy-v3-node-invalid');
      const nodeClass = NODE_CLASSES.has(node.type as NodeClass)
        ? (node.type as NodeClass)
        : 'service';
      return {
        id: node.id,
        aliases: [],
        class: nodeClass,
        name: node.label,
        lifecycle: 'active',
        facts: { legacyImport: { value: true, evidence: structuredClone(evidence) } },
        createdAt: input.generatedAt,
        updatedAt: input.generatedAt,
        sensitivity: 'internal',
        tags: ['legacy-v3'],
        summary: 'Migrated from the supported v3 graph interchange shape.',
        localEvidenceSource: sourceId,
      };
    }),
    edges: input.links.map((link, index) => {
      if (!link.source?.trim() || !link.target?.trim()) throw new Error('legacy-v3-link-invalid');
      return {
        id: link.id?.trim() || `legacy-edge-${index + 1}`,
        source: link.source,
        target: link.target,
        relation: 'calls',
        direction: 'outbound',
        criticality: 'medium',
        confidence: 'medium',
        evidenceId: `${evidence.evidenceHandle}:edge:${index + 1}`,
        lifecycle: 'active',
        isDirected: true,
        relationLabel: link.relation?.trim() || 'legacy dependency',
      };
    }),
    clusters: [],
    health: {},
    facts: {
      migration: {
        value: { from: '3.0.0', id: 'migration-v3-to-v4-1' },
        evidence,
      },
    },
  };
  return canonicalizeGraph(document);
}

export function importGraphDocument(input: unknown): GraphDocument {
  if (!isSafeCollectorPayload(input)) throw new Error('graph-import-unsafe');
  const record = asRecord(input);
  if (!record || typeof record.schemaVersion !== 'string')
    throw new Error('graph-import-version-missing');
  if (record.schemaVersion === '3.0.0')
    return migrateLegacyV3(structuredClone(input) as LegacyV3Graph);
  if (!/^4\.\d+\.\d+$/.test(record.schemaVersion))
    throw new Error('graph-import-version-unsupported');
  const document = structuredClone(input) as GraphDocument;
  validateGraphDocument(document);
  return canonicalizeGraph(document);
}
