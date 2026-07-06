import { createHash, randomUUID } from "node:crypto";
export const uid = (p: string) => `${p}_${randomUUID().slice(0, 12)}`;
export const nowIso = () => new Date().toISOString();
export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export type ActorRef = `human:${string}` | `agent:${string}` | `system:${string}`;
export const isHuman = (a: ActorRef) => a.startsWith("human:");
export interface Ctx {
  workspaceId: string;
  correlationId: string;
  actor: ActorRef;
}
