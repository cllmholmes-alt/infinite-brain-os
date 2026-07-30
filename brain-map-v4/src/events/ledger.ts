import type { GraphDocument, ObservableEvent, RuntimeState, Snapshot } from '../schema/types';
import { projectEvent } from '../graph/document';
import { digestCanonical } from '../security/integrity';
import { isSafeCollectorPayload } from '../security/sanitize';

export interface EventFilter {
  from?: string;
  to?: string;
  type?: ObservableEvent['type'];
  targetId?: string;
}

function cloneEvent(event: ObservableEvent): ObservableEvent {
  if (!isSafeCollectorPayload(event)) throw new Error('unsafe-event-payload');
  return structuredClone(event);
}

function validateEvent(event: ObservableEvent): void {
  if (!event.id.trim()) throw new Error('invalid-event-id');
  if (!Number.isFinite(Date.parse(event.timestamp))) throw new Error('invalid-event-timestamp');
  if (!event.actorId.trim()) throw new Error('invalid-event-actor');
  if (!event.targetId.trim()) throw new Error('invalid-event-target');
  cloneEvent(event);
}

export class EventLedger {
  private events: ObservableEvent[] = [];

  constructor(initial: ObservableEvent[] = []) {
    for (const event of initial) this.append(event);
  }

  append(event: ObservableEvent): void {
    validateEvent(event);
    if (this.events.some((existing) => existing.id === event.id)) {
      throw new Error('duplicate-event-id');
    }
    this.events.push(cloneEvent(event));
    this.events.sort(
      (left, right) =>
        left.timestamp.localeCompare(right.timestamp) || left.id.localeCompare(right.id),
    );
  }

  list(filter: EventFilter = {}): ObservableEvent[] {
    return this.events
      .filter((event) => {
        if (filter.type && event.type !== filter.type) return false;
        if (filter.targetId && event.targetId !== filter.targetId) return false;
        if (filter.from && event.timestamp < filter.from) return false;
        if (filter.to && event.timestamp > filter.to) return false;
        return true;
      })
      .map(cloneEvent);
  }

  asAppendOnly(): ObservableEvent[] {
    return this.events.map(cloneEvent);
  }

  replay(graph: GraphDocument, runtime: RuntimeState, toTimestamp?: string): Snapshot {
    if (toTimestamp && !Number.isFinite(Date.parse(toTimestamp))) {
      throw new Error('invalid-replay-timestamp');
    }
    let document = structuredClone(graph);
    const events = (
      toTimestamp ? this.events.filter((event) => event.timestamp <= toTimestamp) : this.events
    ).map(cloneEvent);

    for (const event of events) {
      const projected = projectEvent(event, document);
      document = projected === document ? structuredClone(document) : projected;
      document.generatedAt = event.timestamp;
    }

    const runtimeCopy = structuredClone(runtime);
    const createdAt = toTimestamp ?? events.at(-1)?.timestamp ?? graph.generatedAt;
    const seed = `sha256-${digestCanonical({ graph, events })}`;
    const hash = `sha256-${digestCanonical({ graph: document, runtime: runtimeCopy, events })}`;
    return {
      createdAt,
      graph: structuredClone(document),
      runtime: runtimeCopy,
      seed,
      hash,
    };
  }

  diff(
    fromTimestamp: string,
    toTimestamp: string,
  ): { from: string; to: string; events: ObservableEvent[] } {
    if (!Number.isFinite(Date.parse(fromTimestamp)) || !Number.isFinite(Date.parse(toTimestamp))) {
      throw new Error('invalid-diff-timestamp');
    }
    return {
      from: fromTimestamp,
      to: toTimestamp,
      events: this.events
        .filter((event) => event.timestamp > fromTimestamp && event.timestamp <= toTimestamp)
        .map(cloneEvent),
    };
  }
}
