import { uid, nowIso, type Ctx, type ActorRef } from "../../core/src/index.js";
import type { Mission, Task } from "../../schema/src/index.js";
import { EvidenceLedger, type Taint } from "../../evidence/src/index.js";
import {
  LeaseManager,
  ExactPhrase,
  decideAuthority,
  AuditChain,
} from "../../permission-lease-trust-engine/src/index.js";
import { ApprovalEngine } from "../../approvals/src/index.js";
import { ToolRegistry, buildSafeTools } from "../../tools/src/index.js";
import registry from "../../agents/src/registry/agent-registry.v0.json" with { type: "json" };

type AgentDef = { id: string; allowedToolIds: string[] };
const agents: AgentDef[] = (registry as any).agents;

export class ExecutionCoordinator {
  missions = new Map<string, Mission>();
  tasks = new Map<string, Task>();
  audit = new AuditChain();
  phrases = new ExactPhrase();
  approvals = new ApprovalEngine(this.phrases);
  leases = new LeaseManager();
  tools = new ToolRegistry();
  constructor(
    public evidence: EvidenceLedger,
    root: string,
  ) {
    for (const t of buildSafeTools(root)) this.tools.register(t);
  }

  /** Command Chat entry: intent -> mission -> task graph. Instruction itself becomes evidence. */
  handleCommand(ctx: Ctx, text: string, taint: Taint = "trusted-human"): Mission {
    const mission: Mission = {
      id: uid("msn"),
      workspaceId: ctx.workspaceId,
      title: text.slice(0, 60),
      intent: text,
      state: "SCOPED",
      taskIds: [],
      correlationId: ctx.correlationId,
    };
    this.missions.set(mission.id, mission);
    this.evidence.write(ctx, {
      sourceType: "user_instruction",
      title: "command",
      content: text,
      missionId: mission.id,
      taint,
    });
    const lower = text.toLowerCase();
    const mk = (t: Omit<Task, "id" | "missionId" | "state" | "evidenceRefs">) => {
      const task: Task = {
        ...t,
        id: uid("tsk"),
        missionId: mission.id,
        state: "queued",
        evidenceRefs: [],
      };
      this.tasks.set(task.id, task);
      mission.taskIds.push(task.id);
      return task;
    };
    if (lower.includes("deploy"))
      mk({
        title: "Deploy to production",
        toolId: "deploy.production",
        toolInput: { service: "command-center" },
        actionClass: "deploy",
        risk: "critical",
        agentId: "release-manager",
      });
    else if (lower.includes("outreach") || lower.includes("email"))
      mk({
        title: "Send outreach email",
        toolId: "email.sendDraftedOutreach",
        toolInput: { to: "lead@example.com", subject: "Hello", body: "Draft body" },
        actionClass: "external_send",
        risk: "high",
        agentId: "gtm-architect",
      });
    else
      mk({
        title: "Draft internal note",
        toolId: "file.writeDraft",
        toolInput: { name: `note-${Date.now()}.md`, content: `# Note\n${text}` },
        actionClass: "internal_write",
        risk: "low",
        agentId: "backend-engineer",
      });
    mission.state = "RUNNING";
    this.audit.append("mission.created", { missionId: mission.id, taint });
    return mission;
  }

  /** Full governed pipeline for one task. UI/API may ONLY call this — never tools. */
  async runTask(ctx: Ctx, taskId: string): Promise<Task> {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error("task_not_found");
    const mission = this.missions.get(task.missionId)!;
    const agent = agents.find((a) => a.id === task.agentId);
    const tool = this.tools.get(task.toolId);
    const agentAllowed = !!agent && agent.allowedToolIds.includes(task.toolId);
    const instr = this.evidence
      .list()
      .find((e) => e.missionId === mission.id && e.sourceType === "user_instruction");
    const decision = decideAuthority({
      actor: `agent:${task.agentId}`,
      actionClass: task.actionClass,
      risk: task.risk,
      toolRegistered: !!tool && agentAllowed,
      instructionTaint: instr?.taint ?? "external-tainted",
    });
    this.audit.append("authority.decision", { taskId, decision });
    if (decision === "DENY" || decision === "QUARANTINE") {
      task.state = "blocked";
      mission.state = "BLOCKED";
      return task;
    }
    if (
      decision === "REQUIRE_APPROVAL" ||
      decision === "REQUIRE_EXACT_PHRASE" ||
      decision === "REQUIRE_HUMAN_ONLY"
    ) {
      const klass =
        decision === "REQUIRE_EXACT_PHRASE"
          ? "exact_phrase_approval"
          : decision === "REQUIRE_HUMAN_ONLY"
            ? "human_only"
            : "standard_approval";
      const dryRun = tool ? tool.simulate(task.toolInput) : "n/a";
      const apr = this.approvals.request({
        workspaceId: ctx.workspaceId,
        missionId: mission.id,
        taskId,
        requestedBy: `agent:${task.agentId}`,
        action: task.actionClass,
        risk: task.risk,
        klass,
        why: task.title,
        rollbackPath: "revoke lease + discard draft",
      });
      const ev = this.evidence.write(ctx, {
        sourceType: "approval_record",
        title: `approval requested: ${apr.id}`,
        content: JSON.stringify({ apr, dryRun }),
        missionId: mission.id,
        taskId,
      });
      task.evidenceRefs.push(ev.id);
      task.approvalId = apr.id;
      task.state = "awaiting_approval";
      mission.state = "AWAITING_APPROVAL";
      this.audit.append("approval.requested", { aprId: apr.id, dryRun });
      return task;
    }
    return this.executeGoverned(ctx, task, decision === "ALLOW_WITH_NOTICE");
  }

  /** Called after a human decision; re-checks approval status at execution time (TOCTOU close). */
  async resumeAfterApproval(ctx: Ctx, approvalId: string): Promise<Task> {
    const apr = this.approvals.get(approvalId);
    if (!apr) throw new Error("approval_not_found");
    const task = this.tasks.get(apr.taskId)!;
    if (apr.status !== "approved") {
      task.state = "blocked";
      this.audit.append("execution.blocked", { approvalId, status: apr.status });
      return task;
    }
    const ev = this.evidence.write(ctx, {
      sourceType: "approval_record",
      title: `approval decided: ${approvalId}`,
      content: JSON.stringify(apr),
      missionId: task.missionId,
      taskId: task.id,
    });
    task.evidenceRefs.push(ev.id);
    return this.executeGoverned(ctx, task, false);
  }

  private async executeGoverned(ctx: Ctx, task: Task, notice: boolean): Promise<Task> {
    const mission = this.missions.get(task.missionId)!;
    const tool = this.tools.get(task.toolId)!;
    const lease = this.leases.issue({
      actor: `agent:${task.agentId}`,
      toolId: task.toolId,
      missionId: mission.id,
      actionClass: task.actionClass,
      maxRisk: task.risk,
      ttlMs: 60_000,
    });
    const lv = this.leases.validate(lease.id, {
      toolId: task.toolId,
      missionId: mission.id,
      actionClass: task.actionClass,
      risk: task.risk,
    });
    if (!lv.ok) {
      task.state = "blocked";
      this.audit.append("lease.denied", { taskId: task.id, reason: lv.reason });
      return task;
    }
    task.state = "running";
    const input = tool.input.parse(task.toolInput); // schema in
    const out = tool.output.parse(await tool.execute(input)); // schema out
    const runEv = this.evidence.write(ctx, {
      sourceType: "tool_output",
      title: `${task.toolId} result`,
      content: JSON.stringify(out),
      missionId: mission.id,
      taskId: task.id,
    });
    task.evidenceRefs.push(runEv.id);
    this.audit.append("tool.run", {
      taskId: task.id,
      toolId: task.toolId,
      leaseId: lease.id,
      notice,
      evidenceId: runEv.id,
    });
    // Independent verifier (verify-by-redo: re-hash CAS content)
    const verified = this.evidence.verifyHash(runEv.id);
    const verEv = this.evidence.write(ctx, {
      sourceType: "verification_record",
      title: "verifier: hash re-check",
      content: JSON.stringify({ evidenceId: runEv.id, verified, by: "agent:code-reviewer" }),
      missionId: mission.id,
      taskId: task.id,
      status: verified ? "verified" : "rejected",
    });
    task.evidenceRefs.push(verEv.id);
    // Completion gate: evidence + verifier required
    if (!verified || this.evidence.forTask(task.id).length === 0) {
      task.state = "blocked";
      return task;
    }
    task.state = "COMPLETE_VERIFIED";
    if (mission.taskIds.every((id) => this.tasks.get(id)!.state === "COMPLETE_VERIFIED"))
      mission.state = "COMPLETE_VERIFIED";
    this.audit.append("task.complete_verified", { taskId: task.id, evidence: task.evidenceRefs });
    return task;
  }
}
