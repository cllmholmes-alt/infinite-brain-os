import { RuntimeState } from '../schema/types';

export const defaultRuntimeState: RuntimeState = {
  mode: 'observe',
  zoomLevel: 'overview',
  selectedNodeId: null,
  focusNodeId: null,
  focusedClusterId: null,
  unknownItems: [],
  staleItems: [],
  unavailableItems: [],
  conflictItems: [],
  activeLenses: ['operations'],
  selectedPath: [],
  searchQuery: '',
  actionQueue: [],
  priorityQueue: [],
  goalQueue: [],
  exceptionQueue: [],
  decisionLog: [],
  savedViews: [],
  focusTunnelDepth: 2,
  evidenceDrawerOpen: true,
  operationTimelineOpen: true,
  incidentWorkspaceOpen: false,
  timelineFilter: 'all',
  lastUpdatedAt: new Date().toISOString(),
  environment: 'stable',
};

export function withRuntimeState(state: RuntimeState, patch: Partial<RuntimeState>): RuntimeState {
  return {
    ...state,
    ...patch,
    lastUpdatedAt: new Date().toISOString(),
  };
}

export function setMode(state: RuntimeState, mode: RuntimeState['mode']): RuntimeState {
  return withRuntimeState(state, { mode });
}

export function setZoomLevel(state: RuntimeState, level: RuntimeState['zoomLevel']): RuntimeState {
  return withRuntimeState(state, { zoomLevel: level });
}

export function setSelectedNode(state: RuntimeState, nodeId: string | null): RuntimeState {
  return withRuntimeState(state, {
    selectedNodeId: nodeId,
    focusNodeId: nodeId,
    focusedClusterId: null,
    selectedPath: [],
  });
}
