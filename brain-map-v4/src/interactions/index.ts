import { moveFocusIndex } from '../accessibility/keyboard';
import { GraphDocument, RuntimeState } from '../schema/types';

export function resolveSpatialTargets(
  graph: GraphDocument,
  current: string | null,
  direction: 'left' | 'right' | 'up' | 'down',
): string | null {
  const ids = graph.nodes.map((node) => node.id);
  if (!current) {
    return ids[0] ?? null;
  }
  const index = ids.indexOf(current);
  if (index < 0) {
    return ids[0] ?? null;
  }

  if (direction === 'left' || direction === 'up') {
    const next = moveFocusIndex(ids, index, 'up');
    return ids[next] ?? null;
  }

  const next = moveFocusIndex(ids, index, 'down');
  return ids[next] ?? null;
}

export function withState(state: RuntimeState, next: Partial<RuntimeState>): RuntimeState {
  return { ...state, ...next, lastUpdatedAt: new Date().toISOString() };
}
