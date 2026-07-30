import { GraphDocument } from '../schema/types';

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

export function buildTreeProjection(graph: GraphDocument): TreeNode[] {
  const clusters = graph.clusters;
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));

  if (clusters.length > 0) {
    return clusters.map((cluster) => ({
      id: cluster.id,
      name: cluster.label,
      children: cluster.nodeIds
        .filter((id) => byId.has(id))
        .map((nodeId) => ({ id: nodeId, name: byId.get(nodeId)?.name ?? nodeId })),
    }));
  }

  return graph.nodes.map((node) => ({ id: node.id, name: node.name }));
}

export function flattenTree(tree: TreeNode[]): string[] {
  const out: string[] = [];

  const walk = (nodes: TreeNode[]) => {
    nodes.forEach((node) => {
      out.push(node.id);
      if (node.children && node.children.length > 0) {
        walk(node.children);
      }
    });
  };

  walk(tree);
  return out;
}

export function nextFocus(
  ids: string[],
  currentIndex: number,
  direction: 'up' | 'down' | 'home' | 'end',
): number {
  if (ids.length === 0) {
    return -1;
  }

  if (direction === 'home') {
    return 0;
  }

  if (direction === 'end') {
    return ids.length - 1;
  }

  if (direction === 'up') {
    return Math.max(0, currentIndex - 1);
  }

  return Math.min(ids.length - 1, currentIndex + 1);
}
