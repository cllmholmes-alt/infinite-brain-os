export const MissionState = [
  "DRAFT",
  "SCOPED",
  "READY",
  "RUNNING",
  "AWAITING_EVIDENCE",
  "AWAITING_APPROVAL",
  "BLOCKED",
  "FAILED",
  "PARTIAL",
  "COMPLETE_VERIFIED",
  "CANCELLED",
  "ARCHIVED",
] as const;
export type MissionState = (typeof MissionState)[number];
export const RiskLevel = ["none", "low", "medium", "high", "critical"] as const;
export type RiskLevel = (typeof RiskLevel)[number];
export const AuthorityDecision = [
  "ALLOW",
  "ALLOW_WITH_NOTICE",
  "REQUIRE_APPROVAL",
  "REQUIRE_EXACT_PHRASE",
  "REQUIRE_STEP_UP_AUTH",
  "REQUIRE_HUMAN_ONLY",
  "DENY",
  "QUARANTINE",
  "REVOKE_AND_ESCALATE",
] as const;
export type AuthorityDecision = (typeof AuthorityDecision)[number];
export const EvidenceStatus = [
  "verified",
  "observed",
  "inferred",
  "recommended",
  "unknown",
  "rejected",
  "blocked",
] as const;
export type EvidenceStatus = (typeof EvidenceStatus)[number];
export const ApprovalClass = [
  "not_required",
  "notice_only",
  "standard_approval",
  "exact_phrase_approval",
  "step_up_authentication",
  "human_only",
  "blocked",
] as const;
export type ApprovalClass = (typeof ApprovalClass)[number];
export const ActionClass = [
  "internal_read",
  "internal_write",
  "external_send",
  "publish",
  "deploy",
  "payment",
  "permission_grant",
  "memory_promote",
  "law_change",
] as const;
export type ActionClass = (typeof ActionClass)[number];
export const TaskState = [
  "queued",
  "running",
  "awaiting_approval",
  "blocked",
  "failed",
  "complete_candidate",
  "COMPLETE_VERIFIED",
] as const;
export type TaskState = (typeof TaskState)[number];
