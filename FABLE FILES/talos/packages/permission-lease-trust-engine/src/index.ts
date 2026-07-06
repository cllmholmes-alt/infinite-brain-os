import { uid, nowIso, sha256, isHuman, type ActorRef } from "../../core/src/index.js";
import type { AuthorityDecision, RiskLevel, ActionClass } from "../../schema/src/enums.js";
import type { Taint } from "../../evidence/src/index.js";

export interface Lease {
  id: string;
  actor: ActorRef;
  toolId: string;
  missionId: string;
  actionClass: ActionClass;
  maxRisk: RiskLevel;
  expiresAt: number;
  revoked: boolean;
}
const riskRank: Record<RiskLevel, number> = { none: 0, low: 1, medium: 2, high: 3, critical: 4 };

export class LeaseManager {
  private leases = new Map<string, Lease>();
  issue(p: {
    actor: ActorRef;
    toolId: string;
    missionId: string;
    actionClass: ActionClass;
    maxRisk: RiskLevel;
    ttlMs: number;
  }): Lease {
    const l: Lease = { id: uid("lease"), ...p, expiresAt: Date.now() + p.ttlMs, revoked: false };
    this.leases.set(l.id, l);
    return l;
  }
  revoke(id: string) {
    const l = this.leases.get(id);
    if (l) l.revoked = true;
  }
  validate(
    id: string,
    ctx: { toolId: string; missionId: string; actionClass: ActionClass; risk: RiskLevel },
  ): { ok: true } | { ok: false; reason: string } {
    const l = this.leases.get(id);
    if (!l) return { ok: false, reason: "lease_not_found" };
    if (l.revoked) return { ok: false, reason: "lease_revoked" };
    if (Date.now() > l.expiresAt) return { ok: false, reason: "lease_expired" };
    if (
      l.toolId !== ctx.toolId ||
      l.missionId !== ctx.missionId ||
      l.actionClass !== ctx.actionClass
    )
      return { ok: false, reason: "scope_mismatch" };
    if (riskRank[ctx.risk] > riskRank[l.maxRisk])
      return { ok: false, reason: "risk_exceeds_lease" };
    return { ok: true };
  }
}

export interface Challenge {
  approvalId: string;
  nonce: string;
  phrase: string;
  expiresAt: number;
  used: boolean;
}
export class ExactPhrase {
  private ch = new Map<string, Challenge>();
  generate(approvalId: string, ttlMs = 10 * 60_000): Challenge {
    const nonce = uid("nonce");
    const c: Challenge = {
      approvalId,
      nonce,
      phrase: `APPROVE ${nonce.slice(-6).toUpperCase()}`,
      expiresAt: Date.now() + ttlMs,
      used: false,
    };
    this.ch.set(approvalId, c);
    return c;
  }
  peek(approvalId: string) {
    return this.ch.get(approvalId);
  }
  validate(approvalId: string, phrase: string): { ok: true } | { ok: false; reason: string } {
    const c = this.ch.get(approvalId);
    if (!c) return { ok: false, reason: "no_challenge" };
    if (c.used) return { ok: false, reason: "replay_denied" };
    if (Date.now() > c.expiresAt) return { ok: false, reason: "challenge_expired" };
    if (phrase !== c.phrase) return { ok: false, reason: "phrase_mismatch" };
    c.used = true;
    return { ok: true };
  }
}

export function decideAuthority(p: {
  actor: ActorRef;
  actionClass: ActionClass;
  risk: RiskLevel;
  toolRegistered: boolean;
  instructionTaint: Taint;
}): AuthorityDecision {
  if (!p.toolRegistered) return "DENY";
  if (p.instructionTaint === "external-tainted") return "DENY";
  if (p.actionClass === "law_change" || p.actionClass === "payment") return "REQUIRE_HUMAN_ONLY";
  const external = [
    "external_send",
    "publish",
    "deploy",
    "permission_grant",
    "memory_promote",
  ].includes(p.actionClass);
  if (p.risk === "critical" || p.actionClass === "deploy") return "REQUIRE_EXACT_PHRASE";
  if (external) return "REQUIRE_APPROVAL";
  if (p.risk === "high") return "REQUIRE_APPROVAL";
  if (p.risk === "medium") return "ALLOW_WITH_NOTICE";
  return "ALLOW";
}

export interface AuditRow {
  i: number;
  at: string;
  type: string;
  data: unknown;
  prevHash: string;
  rowHash: string;
}
export class AuditChain {
  rows: AuditRow[] = [];
  append(type: string, data: unknown): AuditRow {
    const prevHash = this.rows.length ? this.rows[this.rows.length - 1].rowHash : "GENESIS";
    const at = nowIso();
    const rowHash = sha256(prevHash + at + type + JSON.stringify(data));
    const row: AuditRow = { i: this.rows.length, at, type, data, prevHash, rowHash };
    this.rows.push(row);
    return row;
  }
  verify(): boolean {
    let prev = "GENESIS";
    for (const r of this.rows) {
      if (
        r.prevHash !== prev ||
        r.rowHash !== sha256(r.prevHash + r.at + r.type + JSON.stringify(r.data))
      )
        return false;
      prev = r.rowHash;
    }
    return true;
  }
}
export { isHuman };
