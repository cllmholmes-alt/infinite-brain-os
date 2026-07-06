import { readFileSync, existsSync } from "node:fs";
const law = "TALOS_SYSTEM_LAW.md";
if (!existsSync(law)) {
  console.error("FAIL: law missing");
  process.exit(1);
}
const txt = readFileSync(law, "utf8");
const required = [
  "No claim without evidence",
  "No autonomy without permissions",
  "No completion without traceability",
  "no agent self-approval",
  "never command",
];
const missing = required.filter((r) => !txt.includes(r));
if (missing.length) {
  console.error("FAIL missing:", missing);
  process.exit(1);
}
if (!existsSync("tests/security/governance.test.ts")) {
  console.error("FAIL: enforcement tests missing");
  process.exit(1);
}
console.log("verify:system-law PASS");
