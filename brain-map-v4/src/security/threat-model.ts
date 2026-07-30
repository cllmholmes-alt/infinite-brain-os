export interface ThreatModelProbes {
  schemaValidation: boolean;
  prototypeSafety: boolean;
  xssEscaping: boolean;
  ssrfBoundary: boolean;
  exportRedaction: boolean;
  actionAuthority: boolean;
  mirrorIsolation: boolean;
}

export function evaluateThreatModel(probes: ThreatModelProbes): {
  passed: boolean;
  probes: ThreatModelProbes;
  unmitigated: string[];
} {
  const unmitigated = Object.entries(probes)
    .filter(([, passed]) => !passed)
    .map(([id]) => id)
    .sort();
  return { passed: unmitigated.length === 0, probes: structuredClone(probes), unmitigated };
}
