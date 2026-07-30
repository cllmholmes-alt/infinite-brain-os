import { ObservableEvent } from '../schema/types';

export interface TemporalQuery {
  before?: string;
  after?: string;
  type?: ObservableEvent['type'];
  actorId?: string;
  targetId?: string;
}

export function runTemporalQuery(
  events: ObservableEvent[],
  query: TemporalQuery,
): ObservableEvent[] {
  return events.filter((event) => {
    if (query.before && event.timestamp >= query.before) {
      return false;
    }
    if (query.after && event.timestamp <= query.after) {
      return false;
    }
    if (query.type && event.type !== query.type) {
      return false;
    }
    if (query.actorId && event.actorId !== query.actorId) {
      return false;
    }
    if (query.targetId && event.targetId !== query.targetId) {
      return false;
    }
    return true;
  });
}
