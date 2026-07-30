export type SafeMode = 'observe' | 'explain' | 'act';
export type SafeZoom = 'overview' | 'neighborhood' | 'detail';
export type SafeLens =
  'operations' | 'deployment' | 'data' | 'security' | 'governance' | 'user-path';
export type SafePreset =
  | 'normal'
  | 'loading'
  | 'empty'
  | 'unknown'
  | 'stale'
  | 'unavailable'
  | 'conflict'
  | 'error'
  | 'dense'
  | 'stress';

export interface SafeViewState {
  mode: SafeMode;
  zoom: SafeZoom;
  lens: SafeLens;
  preset: SafePreset;
  selected?: string;
}

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return value !== null && allowed.includes(value as T) ? (value as T) : fallback;
}

export function parseViewState(query: string): SafeViewState {
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  const selected = params.get('selected');
  return {
    mode: pick(params.get('mode'), ['observe', 'explain', 'act'] as const, 'observe'),
    zoom: pick(params.get('zoom'), ['overview', 'neighborhood', 'detail'] as const, 'overview'),
    lens: pick(
      params.get('lens'),
      ['operations', 'deployment', 'data', 'security', 'governance', 'user-path'] as const,
      'operations',
    ),
    preset: pick(
      params.get('state'),
      [
        'normal',
        'loading',
        'empty',
        'unknown',
        'stale',
        'unavailable',
        'conflict',
        'error',
        'dense',
      ] as const,
      'normal',
    ),
    ...(selected && /^[a-z0-9][a-z0-9._:-]{0,127}$/i.test(selected) ? { selected } : {}),
  };
}
