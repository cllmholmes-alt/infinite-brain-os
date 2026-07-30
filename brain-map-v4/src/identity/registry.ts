export interface StableIdentity {
  id: string;
  canonicalAlias: string;
  aliases: string[];
  lifecycleState: 'active' | 'inactive' | 'retired';
  previousIds?: string[];
  createdAt: string;
  updatedAt: string;
}

function cloneIdentity(identity: StableIdentity): StableIdentity {
  return structuredClone(identity);
}

function identityAliases(identity: StableIdentity): string[] {
  return [
    identity.id,
    identity.canonicalAlias,
    ...identity.aliases,
    ...(identity.previousIds ?? []),
  ];
}

function validateIdentity(identity: StableIdentity): void {
  const aliases = identityAliases(identity);
  if (aliases.some((alias) => !alias.trim())) throw new Error('identity-alias-empty');
  if (
    !Number.isFinite(Date.parse(identity.createdAt)) ||
    !Number.isFinite(Date.parse(identity.updatedAt))
  ) {
    throw new Error('identity-timestamp-invalid');
  }
  if (Date.parse(identity.updatedAt) < Date.parse(identity.createdAt)) {
    throw new Error('identity-timestamp-order');
  }
}

export class IdentityRegistry {
  private byAlias = new Map<string, string>();
  private identities = new Map<string, StableIdentity>();

  constructor(ids: StableIdentity[]) {
    ids.forEach((identity) => this.register(identity));
  }

  register(identity: StableIdentity): void {
    validateIdentity(identity);
    const stored = cloneIdentity(identity);
    const aliases = identityAliases(stored);
    for (const alias of aliases) {
      const owner = this.byAlias.get(alias);
      if (owner && owner !== stored.id) throw new Error(`identity-alias-collision:${alias}`);
    }

    const previous = this.identities.get(stored.id);
    if (previous) {
      for (const alias of identityAliases(previous)) {
        if (this.byAlias.get(alias) === stored.id) this.byAlias.delete(alias);
      }
    }

    this.identities.set(stored.id, stored);
    for (const alias of aliases) this.byAlias.set(alias, stored.id);
  }

  resolve(aliasOrId: string): StableIdentity | undefined {
    const id = this.byAlias.get(aliasOrId);
    const identity = id ? this.identities.get(id) : undefined;
    return identity ? cloneIdentity(identity) : undefined;
  }

  has(aliasOrId: string): boolean {
    return this.byAlias.has(aliasOrId);
  }

  ids(): string[] {
    return Array.from(this.identities.keys()).sort();
  }

  asMap(): Record<string, StableIdentity> {
    const out: Record<string, StableIdentity> = {};
    this.identities.forEach((identity, id) => {
      out[id] = cloneIdentity(identity);
    });
    return out;
  }
}
