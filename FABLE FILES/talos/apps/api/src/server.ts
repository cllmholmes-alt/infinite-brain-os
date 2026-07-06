import Fastify from "fastify";
import { uid, type Ctx } from "../../../packages/core/src/index.js";
import { EvidenceLedger } from "../../../packages/evidence/src/index.js";
import { ExecutionCoordinator } from "../../../packages/orchestrator/src/index.js";

const root = process.cwd();
const coordinator = new ExecutionCoordinator(new EvidenceLedger(`${root}/data/evidence`), root);
const app = Fastify();
const ok = (data: unknown, correlationId: string) => ({ ok: true, data, correlationId });
const err = (code: string, message: string, correlationId: string) => ({
  ok: false,
  error: { code, message, details: {}, correlationId },
});
const ctxOf = (req: any): Ctx => ({
  workspaceId: "ws_local",
  correlationId: (req.headers["x-correlation-id"] as string) ?? uid("cor"),
  actor: `human:${(req.headers["x-user"] as string) ?? "operator"}`,
});

app.get("/api/v2/health", async (req) =>
  ok({ status: "up", auditChainValid: coordinator.audit.verify() }, ctxOf(req).correlationId),
);

app.post("/api/v2/command/message", async (req, reply) => {
  const ctx = ctxOf(req);
  const body = req.body as { text?: string };
  if (!body?.text)
    return reply.code(400).send(err("BAD_REQUEST", "text required", ctx.correlationId));
  const mission = coordinator.handleCommand(ctx, body.text);
  const tasks = [];
  for (const id of mission.taskIds) tasks.push(await coordinator.runTask(ctx, id));
  return ok(
    {
      mission,
      tasks,
      approvals: coordinator.approvals.list().filter((a) => a.missionId === mission.id),
    },
    ctx.correlationId,
  );
});

app.get("/api/v2/missions", async (req) =>
  ok([...coordinator.missions.values()], ctxOf(req).correlationId),
);
app.get("/api/v2/approvals", async (req) =>
  ok(coordinator.approvals.list(), ctxOf(req).correlationId),
);
app.post("/api/v2/approvals/:id/approve", async (req, reply) => {
  const ctx = ctxOf(req);
  const { id } = req.params as { id: string };
  const { phrase } = (req.body ?? {}) as { phrase?: string };
  const r = coordinator.approvals.approve(id, ctx.actor, phrase);
  if (!r.ok) return reply.code(403).send(err("APPROVAL_DENIED", r.reason, ctx.correlationId));
  const task = await coordinator.resumeAfterApproval(ctx, id);
  return ok({ approval: r.approval, task }, ctx.correlationId);
});
app.post("/api/v2/approvals/:id/reject", async (req) => {
  const ctx = ctxOf(req);
  const { id } = req.params as { id: string };
  return ok(coordinator.approvals.reject(id, ctx.actor), ctx.correlationId);
});
app.get("/api/v2/evidence", async (req) =>
  ok(coordinator.evidence.list(), ctxOf(req).correlationId),
);
app.get("/api/v2/audit/chain-verify", async (req) =>
  ok(
    { valid: coordinator.audit.verify(), rows: coordinator.audit.rows.length },
    ctxOf(req).correlationId,
  ),
);

app.listen({ port: 4200, host: "127.0.0.1" }).then(() => console.log("TALOS api :4200"));
