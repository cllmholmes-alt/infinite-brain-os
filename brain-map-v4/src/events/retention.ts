import { ObservableEvent } from '../schema/types';

export interface RetentionPolicy {
  maxEvents: number;
  maxAgeDays?: number;
}

export function compactEvents(
  events: ObservableEvent[],
  policy: RetentionPolicy,
): ObservableEvent[] {
  const sorted = [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  let compacted = sorted.slice(0, policy.maxEvents);

  if (policy.maxAgeDays !== undefined) {
    const cutoff = Date.now() - policy.maxAgeDays * 24 * 60 * 60 * 1000;
    compacted = compacted.filter((event) => Date.parse(event.timestamp) >= cutoff);
  }

  return compacted.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
