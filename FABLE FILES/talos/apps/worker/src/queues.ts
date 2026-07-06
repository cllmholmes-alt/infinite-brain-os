/** BullMQ contract (BLOCKED in build env — no Redis; see UNKNOWN_BLOCKED_REGISTER B1).
 * Target queues: mission, agent, tool, approval, evidence, research, memory, audit, automation, telemetry.
 * Job envelope: { jobId, idempotencyKey, correlationId, workspaceId, missionId?, taskId?, leaseId, payload }.
 * Workers must re-check approval status at execution time and fail closed on schema mismatch. */
export const QUEUES = [
  "mission",
  "agent",
  "tool",
  "approval",
  "evidence",
  "research",
  "memory",
  "audit",
  "automation",
  "telemetry",
] as const;
