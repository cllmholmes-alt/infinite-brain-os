import { mkdirSync, writeFileSync, appendFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { sha256, uid, nowIso, type Ctx } from "../../core/src/index.js";
import type { EvidenceStatus } from "../../schema/src/enums.js";
export type Taint = "trusted-human" | "internal" | "external-tainted";
export interface EvidenceItem {
  id: string;
  workspaceId: string;
  missionId?: string;
  taskId?: string;
  sourceType: string;
  title: string;
  contentHash: string;
  casPath: string;
  status: EvidenceStatus;
  createdBy: string;
  capturedAt: string;
  taint: Taint;
}
export class EvidenceLedger {
  private items: EvidenceItem[] = [];
  constructor(private dir: string) {
    mkdirSync(dir, { recursive: true });
  }
  write(
    ctx: Ctx,
    p: {
      sourceType: string;
      title: string;
      content: string;
      status?: EvidenceStatus;
      missionId?: string;
      taskId?: string;
      taint?: Taint;
    },
  ): EvidenceItem {
    const hash = sha256(p.content);
    const shard = join(this.dir, hash.slice(0, 2));
    mkdirSync(shard, { recursive: true });
    const casPath = join(shard, hash);
    if (!existsSync(casPath)) writeFileSync(casPath, p.content);
    const item: EvidenceItem = {
      id: uid("ev"),
      workspaceId: ctx.workspaceId,
      missionId: p.missionId,
      taskId: p.taskId,
      sourceType: p.sourceType,
      title: p.title,
      contentHash: hash,
      casPath,
      status: p.status ?? "observed",
      createdBy: ctx.actor,
      capturedAt: nowIso(),
      taint: p.taint ?? "internal",
    };
    this.items.push(item);
    appendFileSync(join(this.dir, "ledger.jsonl"), JSON.stringify(item) + "\n");
    return item;
  }
  verifyHash(id: string): boolean {
    const i = this.get(id);
    return !!i && sha256(readFileSync(i.casPath, "utf8")) === i.contentHash;
  }
  get(id: string) {
    return this.items.find((i) => i.id === id);
  }
  forTask(taskId: string) {
    return this.items.filter((i) => i.taskId === taskId);
  }
  list() {
    return [...this.items];
  }
}
