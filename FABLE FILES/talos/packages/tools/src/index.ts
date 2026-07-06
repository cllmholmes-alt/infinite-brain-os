import { z } from "zod";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import type { RiskLevel, ActionClass } from "../../schema/src/enums.js";

export interface ToolContract<I = unknown, O = unknown> {
  id: string;
  risk: RiskLevel;
  actionClass: ActionClass;
  input: z.ZodType<I>;
  output: z.ZodType<O>;
  simulate: (input: I) => string; // dry-run plan/diff (mandatory)
  execute: (input: I) => Promise<O>;
}
export class ToolRegistry {
  private tools = new Map<string, ToolContract<any, any>>();
  register(t: ToolContract<any, any>) {
    this.tools.set(t.id, t);
  }
  get(id: string) {
    return this.tools.get(id);
  }
  has(id: string) {
    return this.tools.has(id);
  }
}
export function buildSafeTools(root: string): ToolContract<any, any>[] {
  const scoped = (p: string) => {
    const abs = resolve(root, p);
    if (!abs.startsWith(resolve(root))) throw new Error("path_escape_blocked");
    return abs;
  };
  const draftDir = join(root, "data", "drafts");
  mkdirSync(draftDir, { recursive: true });
  return [
    {
      id: "file.read",
      risk: "low",
      actionClass: "internal_read",
      input: z.object({ path: z.string() }),
      output: z.object({ content: z.string() }),
      simulate: (i) => `READ ${i.path}`,
      execute: async (i) => ({ content: readFileSync(scoped(i.path), "utf8") }),
    },
    {
      id: "file.writeDraft",
      risk: "low",
      actionClass: "internal_write",
      input: z.object({ name: z.string().regex(/^[\w.-]+$/), content: z.string() }),
      output: z.object({ path: z.string() }),
      simulate: (i) => `DRAFT ${i.name} (${i.content.length} chars)`,
      execute: async (i) => {
        const p = join(draftDir, i.name);
        writeFileSync(p, i.content);
        return { path: p };
      },
    },
    {
      id: "email.sendDraftedOutreach",
      risk: "high",
      actionClass: "external_send",
      input: z.object({ to: z.string().email(), subject: z.string(), body: z.string() }),
      output: z.object({ sent: z.boolean(), transport: z.string() }),
      simulate: (i) => `WOULD SEND email to ${i.to}: "${i.subject}" (approval-gated; SMTP stubbed)`,
      execute: async () => ({ sent: false, transport: "STUB_BLOCKED_B_SMTP_UNCONFIGURED" }),
    }, // stub: never actually sends
    {
      id: "deploy.production",
      risk: "critical",
      actionClass: "deploy",
      input: z.object({ service: z.string() }),
      output: z.object({ deployed: z.boolean() }),
      simulate: (i) => `WOULD DEPLOY ${i.service} (exact-phrase gated; infra stubbed)`,
      execute: async () => ({ deployed: false }),
    },
  ];
}
