import { GraphDocument, GraphDocument as DocumentType } from '../schema/types';

export type SemanticView =
  'operations' | 'deployment' | 'security' | 'finance' | 'governance' | 'user-path';

export interface ProjectedEdge {
  source: string;
  target: string;
  relation: string;
  weight: number;
}

export interface SemanticProjection {
  name: SemanticView;
  nodes: string[];
  edges: ProjectedEdge[];
  summary: string;
}

export function buildProjection(graph: GraphDocument, view: SemanticView): SemanticProjection {
  const selected = graph.edges.filter((edge) => {
    if (view === 'operations') {
      return (
        edge.relation === 'calls' || edge.relation === 'deploys-to' || edge.relation === 'monitors'
      );
    }
    if (view === 'deployment') {
      return edge.relation === 'deploys-to' || edge.relation === 'imports';
    }
    if (view === 'security') {
      return edge.relation === 'authenticates-through' || edge.relation === 'blocks';
    }
    if (view === 'finance') {
      return edge.relation === 'funds';
    }
    if (view === 'governance') {
      return edge.relation === 'governs';
    }
    return true;
  });

  const nodeIds = new Set<string>();
  const edges = selected.map((edge) => {
    nodeIds.add(edge.source);
    nodeIds.add(edge.target);
    return {
      source: edge.source,
      target: edge.target,
      relation: edge.relation,
      weight: edge.criticality === 'critical' ? 4 : edge.criticality === 'high' ? 3 : 1,
    };
  });

  graph.nodes.forEach((node) => {
    if (node.class === 'goal') {
      nodeIds.add(node.id);
    }
  });

  return {
    name: view,
    nodes: Array.from(nodeIds),
    edges,
    summary: `${view} view with ${nodeIds.size} nodes and ${edges.length} relations`,
  };
}

export function compareViews(a: DocumentType, b: DocumentType): string[] {
  const issues: string[] = [];
  if (a.nodes.length !== b.nodes.length) {
    issues.push('node-count-delta');
  }
  if (a.edges.length !== b.edges.length) {
    issues.push('edge-count-delta');
  }
  if (a.clusters.length !== b.clusters.length) {
    issues.push('cluster-count-delta');
  }
  return issues;
}
