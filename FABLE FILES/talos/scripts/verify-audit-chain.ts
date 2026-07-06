import { AuditChain } from "../packages/permission-lease-trust-engine/src/index.js";
const a = new AuditChain();
a.append("x", { 1: 1 });
a.append("y", { 2: 2 });
if (!a.verify()) {
  console.error("FAIL");
  process.exit(1);
}
(a.rows[0] as any).data = { tampered: true };
if (a.verify()) {
  console.error("FAIL: tamper undetected");
  process.exit(1);
}
console.log("verify:audit-chain PASS (tamper detected)");
