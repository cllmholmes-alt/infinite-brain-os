import type { GraphDocument, RuntimeState } from '../schema/types';
import { buildTreeProjection } from './list-tree';
import { buildSummary } from './screenReader';

export function buildAccessibleGraphModel(
  graph: GraphDocument,
  runtime: RuntimeState,
): {
  tree: ReturnType<typeof buildTreeProjection>;
  list: Array<{ id: string; name: string; class: string; lifecycle: string }>;
  summary: string;
  focusOrder: string[];
} {
  const list = graph.nodes
    .map((node) => ({ id: node.id, name: node.name, class: node.class, lifecycle: node.lifecycle }))
    .sort((left, right) => left.name.localeCompare(right.name) || left.id.localeCompare(right.id));
  return {
    tree: buildTreeProjection(graph),
    list,
    summary: buildSummary(graph, runtime),
    focusOrder: list.map((node) => node.id),
  };
}
