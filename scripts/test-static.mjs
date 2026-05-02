import { readFile, access } from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function pass(msg) {
  console.log(`PASS ${msg}`);
}

function warn(msg) {
  console.warn(`WARN ${msg}`);
  warnings.push(msg);
}

function fail(msg) {
  console.error(`FAIL ${msg}`);
  failures.push(msg);
}

async function checkFileExists(filePath) {
  try {
    await access(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

async function checkSyntax(filePath) {
  try {
    execSync(`node --check ${filePath}`, { cwd: root, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

async function run() {
  console.log("Static Test - Syntax and File Checks");
  console.log("=====================================");

  const jsFiles = [
    "public/self-test.js",
    "scripts/run-self-test.mjs",
    "scripts/preflight.mjs",
    "scripts/test-config.mjs",
    "scripts/test-docs.mjs",
    "scripts/test-dist.mjs",
    "scripts/pressure-test.mjs",
  ];

  for (const file of jsFiles) {
    const exists = await checkFileExists(file);
    if (!exists) {
      fail(`file missing: ${file}`);
      continue;
    }

    const syntaxOk = await checkSyntax(file);
    if (syntaxOk) {
      pass(`syntax OK: ${file}`);
    } else {
      fail(`syntax error: ${file}`);
    }
  }

  const requiredFiles = [
    "package.json",
    "vite.config.ts",
    "index.html",
    "src/App.tsx",
  ];

  for (const file of requiredFiles) {
    const exists = await checkFileExists(file);
    if (exists) {
      pass(`file exists: ${file}`);
    } else {
      fail(`file missing: ${file}`);
    }
  }

  try {
    const pkgContent = await readFile(path.join(root, "package.json"), "utf8");
    JSON.parse(pkgContent);
    pass("package.json is valid JSON");
  } catch {
    fail("package.json is not valid JSON");
  }

  console.log("=====================================");
  if (failures.length > 0) {
    console.error(`Static Test FAIL: ${failures.length} issue(s)`);
    process.exit(1);
  }
  if (warnings.length > 0) {
    console.warn(`Static Test WARN: ${warnings.length} warning(s)`);
  }
  console.log("Static Test PASS");
}

run().catch((err) => {
  console.error("Static Test error:", err.message);
  process.exit(1);
});