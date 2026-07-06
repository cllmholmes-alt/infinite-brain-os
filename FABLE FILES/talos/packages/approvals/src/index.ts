import { uid, nowIso, isHuman, type ActorRef } from "../../core/src/index.js";
import { ExactPhrase } from "../../permission-lease-trust-engine/src/index.js";
import type { ApprovalClass, RiskLevel, ActionClass } from "../../schema/src/enums.js";

export interface Approval {
  id: string;
  workspaceId: string;
  missionId: string;
  taskId: string;
  requestedBy: ActorRef;
  action: ActionClass;
  risk: RiskLevel;
  klass: ApprovalClass;
  why: string;
  rollbackPath: string;
  status: "pending" | "approved" | "rejected" | "expired";
  decidedBy?: ActorRef;
  decidedAt?: string;
  phraseHint?: string;
  deadline: string;
}
export class ApprovalEngine {
  private items = new Map<string, Approval>();
  constructor(private phrases: ExactPhrase) {}
  request(
    p: Omit<Approval, "id" | "status" | "klass" | "phraseHint" | "deadline"> & {
      klass: ApprovalClass;
    },
  ): Approval {
    const a: Approval = {
      ...p,
      id: uid("apr"),
      status: "pending",
      deadline: new Date(Date.now() + 24 * 3600e3).toISOString(),
    };
    if (a.klass === "exact_phrase_approval") a.phraseHint = this.phrases.generate(a.id).phrase;
    this.items.set(a.id, a);
    return a;
  }
  get(id: string) {
    return this.items.get(id);
  }
  list() {
    return [...this.items.values()];
  }
  approve(
    id: string,
    by: ActorRef,
    phrase?: string,
  ): { ok: true; approval: Approval } | { ok: false; reason: string } {
    const a = this.items.get(id);
    if (!a) return { ok: false, reason: "not_found" };
    if (a.status !== "pending") return { ok: false, reason: "replay_denied_already_decided" };
    if (!isHuman(by)) return { ok: false, reason: "human_only_approver" };
    if (by === a.requestedBy) return { ok: false, reason: "self_approval_blocked" };
    if (a.klass === "exact_phrase_approval") {
      const v = this.phrases.validate(id, phrase ?? "");
      if (!v.ok) return { ok: false, reason: v.reason };
    }
    a.status = "approved";
    a.decidedBy = by;
    a.decidedAt = nowIso();
    return { ok: true, approval: a };
  }
  reject(id: string, by: ActorRef) {
    const a = this.items.get(id);
    if (a && a.status === "pending") {
      a.status = "rejected";
      a.decidedBy = by;
      a.decidedAt = nowIso();
    }
    return a;
  }
}
