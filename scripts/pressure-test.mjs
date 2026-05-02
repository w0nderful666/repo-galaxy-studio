import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const root = process.cwd();
const rounds = parseInt(process.env.PRESSURE_ROUNDS || "3", 10);

const maxRounds = 20;
const validRounds = Math.min(Math.max(rounds, 1), maxRounds);

console.log("Pressure Test - High Intensity Quality Check");
console.log("===============================================");
console.log(`Running ${validRounds} round(s) of tests`);
console.log("");

let failedRound = null;
let totalFailures = 0;

const testCommands = [
  { name: "test:static", cmd: "node scripts/test-static.mjs" },
  { name: "test:config", cmd: "node scripts/test-config.mjs" },
  { name: "test:docs", cmd: "node scripts/test-docs.mjs" },
  { name: "preflight", cmd: "npm run preflight" },
];

if (existsSync("dist")) {
  testCommands.push({ name: "test:dist", cmd: "node scripts/test-dist.mjs" });
}

for (let round = 1; round <= validRounds; round++) {
  console.log(`--- Round ${round}/${validRounds} ---`);

  for (const test of testCommands) {
    try {
      execSync(test.cmd, { cwd: root, stdio: "pipe" });
      console.log(`  ${test.name}: PASS`);
    } catch (err) {
      const stderr = err.stderr?.toString() || "";
      console.error(`  ${test.name}: FAIL`);
      if (stderr) {
        console.error(stderr.slice(0, 500));
      }
      failedRound = round;
      totalFailures++;
      break;
    }
  }

  if (failedRound !== null) {
    break;
  }

  console.log("");
}

console.log("===============================================");

if (failedRound !== null) {
  console.error(`Pressure Test FAILED at round ${failedRound}`);
  console.error(`Total failures: ${totalFailures}`);
  process.exit(1);
}

console.log(`Pressure Test PASSED - ${validRounds} round(s) completed`);
console.log("All tests passed consistently across multiple runs");