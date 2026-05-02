import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  ".github/workflows/pages.yml",
  ".gitignore",
  "README.md",
  "RELEASE_NOTES.md",
  "docs/PROJECT_LEVELS.md",
  "docs/MODULE_MATRIX.md",
  "docs/OPENCODE_PRESETS.md",
  "docs/NEW_PROJECT_START_GUIDE.md",
  "docs/PROJECT_SPEC_TEMPLATE.md",
  "self-test.html",
  "public/self-test.js",
  "src/config/projectProfiles.ts",
  "src/config/moduleRegistry.ts",
];

const ignoredDirs = new Set(["node_modules", "dist", ".git"]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
]);

async function fileExists(filePath) {
  try {
    await stat(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    if (textExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message, details = []) {
  console.error(`FAIL ${message}`);
  for (const detail of details) {
    console.error(`  - ${detail}`);
  }
}

const failures = [];

async function checkRequiredFiles() {
  for (const file of requiredFiles) {
    if (await fileExists(file)) {
      pass(`required file exists: ${file}`);
    } else {
      failures.push(`Missing required file: ${file}`);
      fail(`required file exists: ${file}`);
    }
  }
}

async function checkPackageScripts() {
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const scripts = packageJson.scripts ?? {};

  for (const scriptName of ["build", "self-test", "preflight"]) {
    if (typeof scripts[scriptName] === "string" && scripts[scriptName].length > 0) {
      pass(`package.json script exists: ${scriptName}`);
    } else {
      failures.push(`package.json is missing script: ${scriptName}`);
      fail(`package.json script exists: ${scriptName}`);
    }
  }
}

async function checkTodos(files) {
  const hits = [];

  for (const file of files) {
    const rel = relative(file);
    if (rel === "scripts/preflight.mjs") {
      continue;
    }

    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      const isChecklistText =
        (rel === "docs/RELEASE_CHECKLIST.md" || rel === "docs/OPENCODE_PRESETS.md") &&
        line.includes("TODO/FIXME");
      if (isChecklistText) {
        return;
      }

      if (/\b(TODO|FIXME)\b/i.test(line)) {
        hits.push(`${rel}:${index + 1}`);
      }
    });
  }

  if (hits.length === 0) {
    pass("no TODO/FIXME markers found");
  } else {
    failures.push("TODO/FIXME markers found");
    fail("no TODO/FIXME markers found", hits);
  }
}

async function checkUploadKeywords(files) {
  const sourceFiles = files.filter((file) => {
    const rel = relative(file);
    return rel.startsWith("src/") || rel.startsWith("public/") || rel.startsWith("scripts/");
  });
  const suspiciousPatterns = [
    /api\/upload/i,
    /server endpoint/i,
    /uploadEndpoint/i,
    /uploadUrl/i,
    /uploadFile/i,
    /uploadTo/i,
    /handleUpload/i,
    /fetch\s*\([^)]*upload/i,
  ];
  const hits = [];

  for (const file of sourceFiles) {
    const rel = relative(file);
    if (rel === "scripts/preflight.mjs") {
      continue;
    }

    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (suspiciousPatterns.some((pattern) => pattern.test(line))) {
        hits.push(`${rel}:${index + 1}`);
      }
    });
  }

  if (hits.length === 0) {
    pass("no obvious upload endpoint keywords in source");
  } else {
    failures.push("Suspicious upload endpoint keyword found");
    fail("no obvious upload endpoint keywords in source", hits);
  }
}

async function checkHardcodedLocalhost(files) {
  const hits = [];

  for (const file of files) {
    const rel = relative(file);
    if (rel.endsWith("README.md") || rel.startsWith("docs/")) {
      continue;
    }

    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/https?:\/\/(localhost|127\.0\.0\.1)/i.test(line)) {
        hits.push(`${rel}:${index + 1}`);
      }
    });
  }

  if (hits.length === 0) {
    pass("no hardcoded localhost production URLs");
  } else {
    failures.push("Hardcoded localhost URL found");
    fail("no hardcoded localhost production URLs", hits);
  }
}

console.log("Open Tools Starter preflight");
console.log("--------------------------------");

await checkRequiredFiles();
await checkPackageScripts();

const files = await collectFiles(root);
await checkTodos(files);
await checkUploadKeywords(files);
await checkHardcodedLocalhost(files);

console.log("--------------------------------");

if (failures.length > 0) {
  console.error(`Preflight failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("Preflight passed.");
