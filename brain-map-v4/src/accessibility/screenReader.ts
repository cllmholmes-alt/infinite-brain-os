import { GraphDocument, RuntimeState } from '../schema/types';

export function buildSummary(graph: GraphDocument, runtime: RuntimeState): string {
  const total = graph.nodes.length;
  const clusters = graph.clusters.length;
  return `Mode ${runtime.mode} with ${total} nodes in ${clusters} clusters. Zoom level ${runtime.zoomLevel}.`;
}

export function evidenceSummary(nodeId: string | null, graphNodeFacts: number): string {
  if (!nodeId) {
    return 'No node selected';
  }
  return `Node ${nodeId} has ${graphNodeFacts} evidence fields`;
}
