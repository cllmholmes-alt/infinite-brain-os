import { ActionAttempt } from './capability';

export interface OperationEvent {
  id: string;
  type: 'queued' | 'blocked' | 'authorized' | 'executed' | 'verified' | 'rolled-back' | 'failed';
  timestamp: string;
  message: string;
}

export interface ActionTrace {
  attempt: ActionAttempt;
  events: OperationEvent[];
}

export function createTrace(attempt: ActionAttempt): ActionTrace {
  return {
    attempt,
    events: [
      {
        id: `${attempt.id}-queued`,
        type: 'queued',
        timestamp: attempt.createdAt,
        message: 'Action queued',
      },
      {
        id: `${attempt.id}-${attempt.approved ? 'authorized' : 'blocked'}`,
        type: attempt.approved ? 'authorized' : 'blocked',
        timestamp: attempt.createdAt,
        message: attempt.approved ? 'Authority verified' : 'Action awaiting approval',
      },
    ],
  };
}

export function appendEvent(trace: ActionTrace, event: Omit<OperationEvent, 'id'>): ActionTrace {
  return {
    attempt: structuredClone(trace.attempt),
    events: [
      ...trace.events.map((existing) => ({ ...existing })),
      { id: `${trace.attempt.id}-${trace.events.length + 1}`, ...event },
    ],
  };
}
