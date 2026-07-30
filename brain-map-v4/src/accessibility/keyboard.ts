import { nextFocus } from './list-tree';

export type FocusDirection = 'up' | 'down' | 'home' | 'end';

export function moveFocusIndex(ids: string[], current: number, direction: FocusDirection): number {
  return nextFocus(ids, current, direction);
}

export function announceNode(id: string, container: string): string {
  return `${container}, ${id}, selected`;
}
