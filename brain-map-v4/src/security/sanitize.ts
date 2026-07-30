const PRIVATE_V4 = [
  /^0\./,
  /^10\./,
  /^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
  /^127\./,
  /^169\.254\./,
  /^172\.(?:1[6-9]|2\d|3[01])\./,
  /^192\.0\.0\./,
  /^192\.0\.2\./,
  /^192\.168\./,
  /^198\.(?:1[89])\./,
  /^198\.51\.100\./,
  /^203\.0\.113\./,
  /^(?:22[4-9]|23\d)\./,
  /^(?:24\d|25[0-5])\./,
];

function normalizedHostname(parsed: URL): string {
  return parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
}

function isPrivateOrSpecialHost(hostname: string): boolean {
  if (hostname === 'localhost' || hostname.endsWith('.localhost')) return true;
  if (hostname === '::' || hostname === '::1' || hostname.startsWith('fe80:')) return true;
  if (hostname.startsWith('fc') || hostname.startsWith('fd')) return true;
  if (hostname.startsWith('::ffff:')) {
    return isPrivateOrSpecialHost(hostname.slice('::ffff:'.length));
  }
  return PRIVATE_V4.some((pattern) => pattern.test(hostname));
}

export function sanitizeUrl(candidate: string): boolean {
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'https:') return false;
    if (parsed.username || parsed.password) return false;
    if (parsed.port && parsed.port !== '443') return false;
    const hostname = normalizedHostname(parsed);
    return Boolean(hostname) && !isPrivateOrSpecialHost(hostname);
  } catch {
    return false;
  }
}

export function isAllowedLoopbackHttpUrl(candidate: string): boolean {
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    if (parsed.username || parsed.password) return false;
    const hostname = normalizedHostname(parsed);
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  } catch {
    return false;
  }
}

export function sanitizeHtml(raw: string): string {
  return raw
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;')
    .replaceAll('/', '&#x2F;');
}

const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function safeDescriptors(value: object): PropertyDescriptorMap | null {
  if (Reflect.ownKeys(value).some((key) => typeof key === 'symbol')) return null;
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (FORBIDDEN_KEYS.has(key) || descriptor.get || descriptor.set) return null;
  }
  return descriptors;
}

export function deepCloneSafe(value: unknown, depth = 0): unknown {
  if (depth > 6) throw new Error('payload-depth-limit');
  if (value === null || typeof value !== 'object') return value;

  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype) throw new Error('payload-prototype-risk');
    return value.map((entry) => deepCloneSafe(entry, depth + 1));
  }

  const prototype: object | null = Object.getPrototypeOf(value) as object | null;
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error('payload-prototype-risk');
  }
  const descriptors = safeDescriptors(value);
  if (!descriptors) throw new Error('payload-prototype-risk');
  const out: Record<string, unknown> = {};
  for (const [key, descriptor] of Object.entries(descriptors)) {
    out[key] = deepCloneSafe(descriptor.value, depth + 1);
  }
  return out;
}

export function isSafeCollectorPayload(value: unknown, depth = 0): boolean {
  if (depth > 20) return false;
  if (typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return true;
  if (value === null) return true;
  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype || !safeDescriptors(value)) return false;
    return value.every((entry) => isSafeCollectorPayload(entry, depth + 1));
  }
  if (typeof value === 'object') {
    const prototype: object | null = Object.getPrototypeOf(value) as object | null;
    if (prototype !== Object.prototype && prototype !== null) return false;
    const descriptors = safeDescriptors(value);
    if (!descriptors) return false;
    return Object.values(descriptors).every((descriptor) =>
      isSafeCollectorPayload(descriptor.value, depth + 1),
    );
  }
  return false;
}
