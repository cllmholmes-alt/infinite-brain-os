import {
  EvidenceClassification,
  EvidenceEnvelope,
  FactValueSet,
  GraphDocument,
  NodeClass,
  RelationshipType,
  SourceRecord,
} from '../schema/types';

const BASE_TIME = '2026-07-30T10:00:00.000Z';
const NOW = Date.parse(BASE_TIME);

type EnvelopeInput = {
  sourceId: string;
  observedOffsetMinutes: number;
  expiresAfterMs?: number;
  authority?: EvidenceClassification;
  confidence?: 'high' | 'medium' | 'low' | 'unknown';
  method?: string;
  notes?: string;
  noEvidence?: boolean;
  unavailable?: boolean;
};

function envelope(input: EnvelopeInput): EvidenceEnvelope {
  const observedAt = input.noEvidence
    ? null
    : new Date(NOW - input.observedOffsetMinutes * 60_000).toISOString();
  const expiresAt = input.noEvidence
    ? null
    : new Date(NOW + (input.expiresAfterMs ?? 12 * 60_000)).toISOString();
  return {
    sourceId: input.sourceId,
    observedAt,
    collectedAt: BASE_TIME,
    expiresAt,
    method: input.method ?? 'collector.read',
    confidence: input.confidence ?? 'high',
    authority: input.authority ?? 'observed',
    collectorVersion: '1.0.0',
    environment: 'local',
    evidenceHandle: `ev-${input.sourceId}-${String(input.observedOffsetMinutes).padStart(3, '0')}`,
    ...(input.notes ? { notes: input.notes } : {}),
    expiresAfterMs: input.expiresAfterMs ?? 12 * 60_000,
    sourceRank: input.unavailable ? 0 : 10,
  };
}

function fact<T>(value: T, input: EnvelopeInput) {
  return {
    value,
    evidence: envelope(input),
  };
}

function conflictingFact<T>(value: T, input: EnvelopeInput, valueOverride: T) {
  return [
    fact(value, input),
    fact(valueOverride, {
      ...input,
      observedOffsetMinutes: input.observedOffsetMinutes + 1,
      notes: 'operator correction path',
      method: 'manual.review',
    }),
  ];
}

const localCollectorSource: SourceRecord = {
  id: 'collector.local.runtime',
  label: 'Local runtime collector',
  kind: 'runtime',
  owner: 'operator',
  authorityRank: 30,
  activeSince: BASE_TIME,
};

const gitCollectorSource: SourceRecord = {
  id: 'collector.git.local',
  label: 'Local git collector',
  kind: 'git',
  owner: 'operator',
  authorityRank: 20,
  activeSince: BASE_TIME,
};

const httpCollectorSource: SourceRecord = {
  id: 'collector.http.health',
  label: 'Local health probes',
  kind: 'provider',
  owner: 'operator',
  authorityRank: 15,
  activeSince: BASE_TIME,
};

function node(
  id: string,
  name: string,
  className: NodeClass,
  clusterId: string,
  alias: string,
  facts: Record<string, FactValueSet<unknown>> = {},
) {
  return {
    id,
    aliases: [alias],
    class: className,
    name,
    lifecycle: 'active' as const,
    clusterId,
    createdAt: BASE_TIME,
    updatedAt: BASE_TIME,
    ownerId: 'operator',
    sensitivity: 'internal' as const,
    localEvidenceSource: localCollectorSource.id,
    summary: `${name} from ${clusterId}`,
    tags: [clusterId],
    facts,
  };
}

const clusters = [
  {
    id: 'infra',
    label: 'Infrastructure',
    summary: 'Compute, host, and routing surfaces',
    nodeIds: ['vps', 'fusion', 'aurora', 'hermes', 'nginx'],
  },
  {
    id: 'agentic',
    label: 'Agentic Systems',
    summary: 'Agent-led runtime and orchestration',
    nodeIds: ['talos', 'company-os', 'ib', 'rtk', 'graphify'],
  },
  {
    id: 'adhd',
    label: 'ADHD-OS Brand',
    summary: 'Delivery surfaces and documentation for ADHD-OS',
    nodeIds: ['adhd-web', 'adhd-dash', 'adhd-mdb', 'design-sys', 'adhd-dpia'],
  },
  {
    id: 'platform',
    label: 'Platform Tools',
    summary: 'Search, model, and utility services',
    nodeIds: ['searxng', 'ollama', 'comfyui', 'elevenlabs'],
  },
  {
    id: 'revenue',
    label: 'Revenue',
    summary: 'Revenue and lead flow surfaces',
    nodeIds: ['hrio', 'grr', 'fiverr'],
  },
  {
    id: 'media',
    label: 'AI Media',
    summary: 'Video and authoring tools',
    nodeIds: ['aivid', 'glm-ui'],
  },
  {
    id: 'mods',
    label: 'Game Modding',
    summary: 'Game tooling and asset creation',
    nodeIds: ['cdmf', 'gace'],
  },
] as const;

function relation(
  id: string,
  source: string,
  target: string,
  relationType: RelationshipType,
  criticality: 'low' | 'medium' | 'high' | 'critical',
  evidenceSourceId = localCollectorSource.id,
) {
  return {
    id,
    source,
    target,
    relation: relationType,
    direction: 'outbound' as const,
    criticality,
    confidence: 'high' as const,
    evidenceId: `${evidenceSourceId}-${id}`,
    lifecycle: 'active' as const,
    isDirected: true,
    relationLabel: relationType,
    relationStrength: criticality === 'critical' ? 4 : criticality === 'high' ? 3 : 2,
  };
}

export const v3ScaleBaseGraph: GraphDocument = {
  schemaVersion: '4.0.0',
  manifestVersion: 'v4-platform-pure-1.0',
  generatedAt: BASE_TIME,
  nodes: [
    node('vps', 'Netcup VPS', 'service', 'infra', 'ib-vps', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 3 },
        ),
      ],
      health: [
        fact(
          { state: 'fresh', score: 96 },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 3 },
        ),
      ],
    }),
    node('fusion', 'Fusion API', 'service', 'infra', 'fusion-api', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 4 },
        ),
      ],
    }),
    node('aurora', 'Aurora API', 'service', 'infra', 'aurora-api', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 4 },
        ),
      ],
    }),
    node('hermes', 'Hermes Agent', 'agent', 'infra', 'hermes-agent', {
      topology: [
        fact(
          { status: 'stale', reason: 'collector-expiry' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 360, expiresAfterMs: 30_000 },
        ),
      ],
    }),
    node('nginx', 'Nginx', 'service', 'infra', 'nginx-proxy', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 2 },
        ),
      ],
    }),
    node('talos', 'TALOS', 'agent', 'agentic', 'talos', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 2 },
        ),
      ],
    }),
    node('company-os', 'Company-OS', 'repository', 'agentic', 'company-os', {
      topology: [
        fact(
          { status: 'stale', reason: 'collector-expiry' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 240, expiresAfterMs: 60_000 },
        ),
      ],
    }),
    node('ib', 'Infinite Brain', 'repository', 'agentic', 'ib-repo', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 1 },
        ),
      ],
      topologyConflict: conflictingFact(
        { status: 'online', source: 'local' },
        { sourceId: gitCollectorSource.id, observedOffsetMinutes: 8 },
        { status: 'blocked', source: 'git-probe' },
      ),
    }),
    node('rtk', 'RTK', 'service', 'agentic', 'rtk', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 3 },
        ),
      ],
    }),
    node('graphify', 'Graphify', 'workflow', 'agentic', 'graphify', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 3 },
        ),
      ],
    }),
    node('adhd-web', 'ADHD-OS Web', 'service', 'adhd', 'adhd-web', {
      topology: [
        fact(
          { status: 'amber', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 15, confidence: 'medium' },
        ),
      ],
    }),
    node('adhd-dash', 'ADHD-OS Mobile', 'service', 'adhd', 'adhd-mobile', {
      topology: [
        fact(
          { status: 'amber', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 15, confidence: 'medium' },
        ),
      ],
    }),
    node('adhd-mdb', 'Master Ref DB', 'data-store', 'adhd', 'adhd-mdb', {
      topology: [
        fact(
          { status: 'stale', reason: 'delta-lag' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 210, expiresAfterMs: 60_000 },
        ),
      ],
    }),
    node('design-sys', 'Design System', 'workflow', 'adhd', 'design-system', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 2 },
        ),
      ],
    }),
    node('adhd-dpia', 'DPIA', 'incident', 'adhd', 'adhd-dpia', {
      topology: conflictingFact(
        { compliance: 'signed', status: 'complete' },
        { sourceId: localCollectorSource.id, observedOffsetMinutes: 11, confidence: 'low' },
        { compliance: 'pending', status: 'blocked' },
      ),
    }),
    node('searxng', 'SearXNG', 'service', 'platform', 'searxng', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 5 },
        ),
      ],
    }),
    node('ollama', 'Ollama', 'external-provider', 'platform', 'ollama', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 4 },
        ),
      ],
    }),
    node('comfyui', 'ComfyUI', 'external-provider', 'platform', 'comfyui'),
    node('elevenlabs', 'ElevenLabs', 'external-provider', 'platform', 'elevenlabs', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 6 },
        ),
      ],
    }),
    node('hrio', 'Revenue OS', 'service', 'revenue', 'hrio', {
      topology: [
        fact(
          { status: 'unavailable', reason: 'no-health-payload' },
          {
            sourceId: localCollectorSource.id,
            observedOffsetMinutes: 0,
            noEvidence: false,
            authority: 'unknown',
            method: 'manual',
            confidence: 'low',
            unavailable: true,
            expiresAfterMs: 0,
            notes: 'manual-unavailable-marker',
          },
        ),
      ],
    }),
    node('grr', 'GetReviewReady', 'workflow', 'revenue', 'grr', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 6 },
        ),
      ],
    }),
    node('fiverr', 'Fiverr', 'service', 'revenue', 'fiverr'),
    node('aivid', 'AI Video Upscaler', 'external-provider', 'media', 'aivid', {
      topology: [
        fact(
          { status: 'stale', reason: 'probe-lag' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 240, expiresAfterMs: 40_000 },
        ),
      ],
    }),
    node('glm-ui', 'GLM 5 Coder UI', 'service', 'media', 'glm-ui', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 7 },
        ),
      ],
    }),
    node('cdmf', 'Crimson Desert Forge', 'service', 'mods', 'cdmf', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 9 },
        ),
      ],
    }),
    node('gace', 'G.A.C.E', 'service', 'mods', 'gace', {
      topology: [
        fact(
          { status: 'online', source: 'local' },
          { sourceId: localCollectorSource.id, observedOffsetMinutes: 8 },
        ),
      ],
    }),
  ],
  edges: [
    relation('e1', 'vps', 'fusion', 'hosts', 'critical'),
    relation('e2', 'vps', 'aurora', 'hosts', 'critical'),
    relation('e3', 'vps', 'searxng', 'hosts', 'medium'),
    relation('e4', 'vps', 'ollama', 'hosts', 'high'),
    relation('e5', 'nginx', 'fusion', 'proxy', 'high'),
    relation('e6', 'nginx', 'aurora', 'proxy', 'high'),
    relation('e7', 'nginx', 'searxng', 'proxy', 'medium'),
    relation('e8', 'fusion', 'aurora', 'inference', 'high'),
    relation('e9', 'hermes', 'vps', 'reads', 'medium'),
    relation('e10', 'hermes', 'fusion', 'operates', 'medium'),
    relation('e11', 'hermes', 'talos', 'operates', 'high'),
    relation('e12', 'hermes', 'ib', 'reads', 'high'),
    relation('e13', 'hermes', 'searxng', 'searches', 'medium'),
    relation('e14', 'hermes', 'ollama', 'fallback', 'medium'),
    relation('e15', 'hermes', 'elevenlabs', 'inference', 'medium'),
    relation('e16', 'fusion', 'talos', 'deploys-to', 'high'),
    relation('e17', 'talos', 'graphify', 'calls', 'low'),
    relation('e18', 'talos', 'ib', 'governs', 'high'),
    relation('e19', 'rtk', 'talos', 'token-proxy', 'medium'),
    relation('e20', 'rtk', 'company-os', 'token-proxy', 'medium'),
    relation('e21', 'ib', 'talos', 'governs', 'high'),
    relation('e22', 'ib', 'adhd-mdb', 'feeds', 'medium'),
    relation('e23', 'searxng', 'talos', 'searches', 'medium'),
    relation('e24', 'elevenlabs', 'talos', 'feeds', 'low'),
    relation('e25', 'adhd-mdb', 'adhd-web', 'feeds', 'high'),
    relation('e26', 'adhd-mdb', 'adhd-dash', 'feeds', 'high'),
    relation('e27', 'design-sys', 'adhd-web', 'tokens', 'medium'),
    relation('e28', 'design-sys', 'adhd-dash', 'tokens', 'medium'),
    relation('e29', 'design-sys', 'talos', 'meridian', 'low'),
    relation('e30', 'adhd-dpia', 'adhd-dash', 'blocks', 'critical'),
    relation('e31', 'fusion', 'adhd-web', 'calls', 'high'),
    relation('e32', 'aurora', 'adhd-dash', 'inference', 'high'),
    relation('e33', 'talos', 'adhd-dpia', 'compliance', 'medium'),
    relation('e34', 'hrio', 'grr', 'lead-flow', 'medium'),
    relation('e35', 'grr', 'fiverr', 'overlap', 'low'),
    relation('e36', 'fiverr', 'hrio', 'income', 'low'),
  ],
  clusters: clusters.map((cluster) => ({
    id: cluster.id,
    label: cluster.label,
    summary: cluster.summary,
    nodeIds: [...cluster.nodeIds],
  })),
  sources: [
    localCollectorSource,
    {
      id: gitCollectorSource.id,
      label: gitCollectorSource.label,
      kind: gitCollectorSource.kind,
      owner: gitCollectorSource.owner,
      authorityRank: gitCollectorSource.authorityRank,
      activeSince: gitCollectorSource.activeSince,
    },
    {
      id: httpCollectorSource.id,
      label: httpCollectorSource.label,
      kind: httpCollectorSource.kind,
      owner: httpCollectorSource.owner,
      authorityRank: httpCollectorSource.authorityRank,
      activeSince: httpCollectorSource.activeSince,
    },
  ],
  health: {
    topology: {
      namespace: 'topology',
      value: 'unknown',
      freshness: 'aging',
      evidenceId: 'collector.local.runtime',
      sourceId: localCollectorSource.id,
      notes: 'reference snapshot only; semantic health requires a live collector',
    },
  },
  facts: {
    truthQuality: [
      {
        value: {
          score: 83,
          state: 'partial',
        },
        evidence: envelope({
          sourceId: localCollectorSource.id,
          observedOffsetMinutes: 1,
          method: 'local-evidence-benchmark',
          confidence: 'medium',
        }),
      },
    ],
  },
  runtimeFacts: {
    localCollector: [
      {
        value: {
          available: true,
          status: 'online',
        },
        evidence: envelope({
          sourceId: localCollectorSource.id,
          observedOffsetMinutes: 1,
          method: 'collector.health',
        }),
      },
      {
        value: {
          available: false,
          status: 'stale',
          reason: 'older-adapter',
        },
        evidence: envelope({
          sourceId: localCollectorSource.id,
          observedOffsetMinutes: 180,
          expiresAfterMs: 60_000,
          method: 'collector.age',
          confidence: 'low',
          notes: 'reduced-frequency collection',
        }),
      },
    ],
  },
};

export const baseGraph = v3ScaleBaseGraph;

function buildStressGraph(nodeCount: number, edgeCount: number): GraphDocument {
  const nodes = Array.from({ length: nodeCount }, (_, index) => {
    const template = v3ScaleBaseGraph.nodes[index % v3ScaleBaseGraph.nodes.length]!;
    const ordinal = index + 1;
    return {
      ...template,
      id: `${template.id}.stress.${ordinal}`,
      name: `${template.name} ${ordinal}`,
      aliases: template.aliases.map((alias) => `${alias}-${ordinal}`),
      facts: ordinal % 5 === 0 ? {} : template.facts,
    };
  });
  const edges = Array.from({ length: edgeCount }, (_, index) => {
    const template = v3ScaleBaseGraph.edges[index % v3ScaleBaseGraph.edges.length]!;
    const source = nodes[index % nodes.length]!;
    const target = nodes[(index * 17 + 11) % nodes.length]!;
    return {
      ...template,
      id: `stress-edge-${index + 1}`,
      source: source.id,
      target: target.id === source.id ? nodes[(index + 1) % nodes.length]!.id : target.id,
      evidenceId: `stress-fixture-${index + 1}`,
    };
  });
  const clusters = v3ScaleBaseGraph.clusters.map((cluster) => ({
    ...cluster,
    nodeIds: nodes.filter((node) => node.clusterId === cluster.id).map((node) => node.id),
  }));
  return {
    ...v3ScaleBaseGraph,
    manifestVersion: `v4-stress-${nodeCount}-${edgeCount}`,
    nodes,
    edges,
    clusters,
    health: {
      topology: {
        namespace: 'topology',
        value: 'unknown',
        freshness: 'unknown',
        evidenceId: 'stress-fixture',
        sourceId: 'fixture.deterministic',
        notes: 'synthetic stress topology; not operational evidence',
      },
    },
  };
}

export const denseGraph = buildStressGraph(250, 600);
export const stressGraph = buildStressGraph(1000, 3000);
