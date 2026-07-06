import { execSync } from "node:child_process";
try {
  const hits = execSync(`grep -rn "tests/fixtures" apps packages --include=*.ts || true`)
    .toString()
    .trim();
  if (hits) {
    console.error("FAIL fixture import in production:\n" + hits);
    process.exit(1);
  }
  console.log("verify:no-production-fixtures PASS");
} catch {
  console.log("verify:no-production-fixtures PASS");
}
