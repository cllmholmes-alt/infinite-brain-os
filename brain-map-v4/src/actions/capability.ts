export type ActionType =
  'verify' | 'rollback' | 'restart' | 'scale' | 'deactivate' | 'open-runbook';

export type AuthorityRole = 'owner' | 'operator' | 'provider' | 'emergency';

export interface ActionCapability {
  id: string;
  action: ActionType;
  targetType: string;
  requiredAuthority: AuthorityRole;
  requiresDryRun: boolean;
  requiresCanary: boolean;
  supportsRollback: boolean;
}

export interface ActionContext {
  actorId: string;
  actorRole: AuthorityRole;
  ownerApprovalId: string;
  runbookVersion: string;
  canaryId?: string | undefined;
  rollbackId?: string | undefined;
  sourceRevision: string;
  normalizedParametersHash: string;
}

export interface ActionAttempt {
  id: string;
  capabilityId: string;
  actorId: string;
  targetId: string;
  dryRun: boolean;
  approved: boolean;
  createdAt: string;
  completedAt?: string | undefined;
  success?: boolean | undefined;
  details: string;
  blockedReasons: string[];
  context?: ActionContext | undefined;
}

export const registry: ActionCapability[] = [
  {
    id: 'capability.restart-service',
    action: 'restart',
    targetType: 'service',
    requiredAuthority: 'operator',
    requiresDryRun: true,
    requiresCanary: true,
    supportsRollback: true,
  },
  {
    id: 'capability.scale-service',
    action: 'scale',
    targetType: 'service',
    requiredAuthority: 'operator',
    requiresDryRun: true,
    requiresCanary: false,
    supportsRollback: true,
  },
  {
    id: 'capability.deactivate-provider-link',
    action: 'deactivate',
    targetType: 'external-provider',
    requiredAuthority: 'owner',
    requiresDryRun: true,
    requiresCanary: true,
    supportsRollback: false,
  },
];

export function resolveCapability(
  targetType: string,
  action: ActionType,
): ActionCapability | undefined {
  return registry.find((entry) => entry.targetType === targetType && entry.action === action);
}

export function hasAuthority(capability: ActionCapability, actorRole: string): boolean {
  return actorRole === capability.requiredAuthority || actorRole === 'emergency';
}

export function dryRunCapability(
  capability: ActionCapability,
  targetId: string,
  context?: ActionContext,
): ActionAttempt {
  const blockedReasons: string[] = [];
  if (!context) {
    blockedReasons.push('actor authority is not evidenced');
    blockedReasons.push('owner approval is not evidenced');
    blockedReasons.push('versioned runbook is not attached');
    if (capability.requiresCanary) blockedReasons.push('semantic canary is not attached');
    if (capability.supportsRollback) blockedReasons.push('rollback contract is not attached');
  } else {
    if (!hasAuthority(capability, context.actorRole)) {
      blockedReasons.push(
        `actor role ${context.actorRole} does not satisfy ${capability.requiredAuthority}`,
      );
    }
    if (!context.ownerApprovalId) blockedReasons.push('owner approval is not evidenced');
    if (!context.runbookVersion) blockedReasons.push('versioned runbook is not attached');
    if (!context.sourceRevision) blockedReasons.push('source revision is not bound');
    if (!context.normalizedParametersHash)
      blockedReasons.push('normalized parameters are not bound');
    if (capability.requiresCanary && !context.canaryId)
      blockedReasons.push('semantic canary is not attached');
    if (capability.supportsRollback && !context.rollbackId)
      blockedReasons.push('rollback contract is not attached');
  }

  const approved = blockedReasons.length === 0;
  const createdAt = new Date().toISOString();
  return {
    id: `attempt-${capability.id}-${targetId}-${createdAt}`,
    capabilityId: capability.id,
    actorId: context?.actorId ?? 'unverified-actor',
    targetId,
    dryRun: true,
    approved,
    createdAt,
    details: approved
      ? `dry-run prerequisites satisfied for ${capability.action} on ${targetId}; no mutation executed`
      : `blocked: ${blockedReasons.join('; ')}`,
    blockedReasons,
    ...(context ? { context } : {}),
  };
}

export function verifyActionAttemptBinding(
  attempt: ActionAttempt,
  current: Pick<ActionContext, 'sourceRevision' | 'normalizedParametersHash'>,
): boolean {
  return Boolean(
    attempt.approved &&
    attempt.dryRun &&
    attempt.context?.sourceRevision === current.sourceRevision &&
    attempt.context.normalizedParametersHash === current.normalizedParametersHash,
  );
}
