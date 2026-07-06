import { z } from "zod";
export * from "./enums.js";
import { RiskLevel, ActionClass, TaskState } from "./enums.js";
export const zRisk = z.enum(RiskLevel);
export const zAction = z.enum(ActionClass);
export const MissionCreate = z.object({
  workspaceId: z.string(),
  title: z.string().min(3),
  intent: z.string(),
});
export interface Task {
  id: string;
  missionId: string;
  title: string;
  toolId: string;
  toolInput: Record<string, unknown>;
  actionClass: ActionClass;
  risk: RiskLevel;
  state: TaskState;
  evidenceRefs: string[];
  approvalId?: string;
  agentId: string;
}
export interface Mission {
  id: string;
  workspaceId: string;
  title: string;
  intent: string;
  state: MissionState;
  taskIds: string[];
  correlationId: string;
}
import type { MissionState } from "./enums.js";
