import type { GovernanceAuthority, GovernedActionDefinition } from './governance';
import { ActionRegistry } from './governance';

export function buildActionReadBoundary(
  definition: GovernedActionDefinition,
  authority: GovernanceAuthority,
  capabilities: string[],
): {
  readCapabilities: Array<'inspect' | 'redacted-export' | 'dry-run'>;
  actionCapabilities: string[];
  mutationAvailable: boolean;
  blockedReasons: string[];
} {
  const registry = new ActionRegistry();
  registry.register(definition);
  const authorization = registry.authorize(definition.kind, authority, capabilities);
  return {
    readCapabilities: ['inspect', 'redacted-export', 'dry-run'],
    actionCapabilities: authorization.authorized ? [definition.kind] : [],
    mutationAvailable: authorization.authorized,
    blockedReasons: authorization.reasons,
  };
}
