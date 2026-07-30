import { describe, expect, it } from 'vitest';
import {
  sanitizeUrl,
  sanitizeHtml,
  deepCloneSafe,
  isSafeCollectorPayload,
} from '../../src/security/sanitize';
import { validateNoPrototypePollution } from '../../src/security/validate';
import { validateGraphResourceLimits } from '../../src/security/validate';
import { parseViewState } from '../../src/security/view-state';
import { baseGraph } from '../../src/fixtures';

describe('security', () => {
  it('rejects unsafe urls', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe(false);
    expect(sanitizeUrl('file:///etc/passwd')).toBe(false);
    expect(sanitizeUrl('http://169.254.169.254/latest/meta-data')).toBe(false);
    expect(sanitizeUrl('https://user:pass@example.com/')).toBe(false);
    expect(sanitizeUrl('http://127.0.0.1:3000/health')).toBe(false);
    expect(sanitizeUrl('https://example.com')).toBe(true);
  });

  it('escapes HTML entities', () => {
    expect(sanitizeHtml('<img src=x onerror=alert(1)>')).toContain('&lt;');
  });

  it('strips prototype keys', () => {
    expect(() => validateNoPrototypePollution({ __proto__: { x: 1 }, value: 1 })).toThrow();
    expect(deepCloneSafe({ value: { x: 1 } })).toEqual({ value: { x: 1 } });
  });

  it('rejects hostile prototypes recursively and never returns deep untrusted references', () => {
    const hostile = Object.create({ isAdmin: true }) as Record<string, unknown>;
    hostile.value = 1;
    expect(isSafeCollectorPayload({ nested: hostile })).toBe(false);
    expect(() => validateNoPrototypePollution({ nested: hostile })).toThrow(
      'prototype-pollution-risk',
    );
    let tooDeep: unknown = hostile;
    for (let depth = 0; depth < 8; depth += 1) tooDeep = { nested: tooDeep };
    expect(() => deepCloneSafe(tooDeep)).toThrow('payload-depth-limit');
  });

  it('accepts safe payloads', () => {
    expect(isSafeCollectorPayload({ value: 1, nested: [1, 2] })).toBe(true);
  });

  it('security-contract rejects authority and invalid enum values from shared URL state', () => {
    const state = parseViewState('mode=admin&zoom=huge&role=owner&selected=ib');
    expect(state).toEqual({
      mode: 'observe',
      zoom: 'overview',
      lens: 'operations',
      preset: 'normal',
      selected: 'ib',
    });
    expect('role' in state).toBe(false);
  });

  it('security-contract rejects oversized or non-finite graph input before rendering', () => {
    expect(() =>
      validateGraphResourceLimits({
        ...baseGraph,
        nodes: Array.from({ length: 10001 }, () => baseGraph.nodes[0]!),
      }),
    ).toThrow('graph-node-limit');
    expect(() =>
      validateGraphResourceLimits({
        ...baseGraph,
        edges: [
          { ...baseGraph.edges[0]!, relationStrength: Number.NaN },
          ...baseGraph.edges.slice(1),
        ],
      }),
    ).toThrow('graph-non-finite-number');
  });
});
