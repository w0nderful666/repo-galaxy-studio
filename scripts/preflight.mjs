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
  "docs/TEMPLATE_MAINTENANCE.md",
  "docs/COPY_TO_NEW_REPO_CHECKLIST.md",
  "docs/VERSIONING_GUIDE.md",
  "self-test.html",
  "public/self-test.js",
  "src/config/projectProfiles.ts",
  "src/config/moduleRegistry.ts",
  "src/components/ErrorBoundary.tsx",
  "public/manifest.webmanifest",
  "public/icon.svg",
  "public/sw.js",
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

const failures = [];
const warnings = [];

async function fileExists(filePath) {
  try {
    await stat(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(dir, includeDist = false) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  const dirsToSkip = includeDist ? new Set([".git"]) : ignoredDirs;

  for (const entry of entries) {
    if (dirsToSkip.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, includeDist)));
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

function warn(message, details = []) {
  console.warn(`WARN ${message}`);
  warnings.push(message);
  for (const detail of details) {
    console.warn(`  - ${detail}`);
  }
}

function fail(message, details = []) {
  console.error(`FAIL ${message}`);
  failures.push(message);
  for (const detail of details) {
    console.error(`  - ${detail}`);
  }
}

async function checkRequiredFiles() {
  for (const file of requiredFiles) {
    if (await fileExists(file)) {
      pass(`required file exists: ${file}`);
    } else {
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
      fail(`package.json script exists: ${scriptName}`);
    }
  }
}

async function checkIndexHtmlSeo() {
  const indexPath = path.join(root, "index.html");
  const content = (await readFile(indexPath, "utf8")).replace(/\s+/g, " ");

  const checks = [
    { pattern: /<meta[^>]*name="description"/i, name: "description meta tag" },
    { pattern: /<meta[^>]*property="og:title"/i, name: "og:title meta tag" },
    { pattern: /<meta[^>]*name="theme-color"/i, name: "theme-color meta tag" },
  ];

  for (const check of checks) {
    if (check.pattern.test(content)) {
      pass(`index.html contains ${check.name}`);
    } else {
      fail(`index.html missing ${check.name}`);
    }
  }
}

async function checkWorkflowContent() {
  const workflowPath = path.join(root, ".github/workflows/pages.yml");
  const content = await readFile(workflowPath, "utf8");

  const requiredCommands = [
    { pattern: /npm run build/, name: "npm run build" },
    { pattern: /npm run self-test/, name: "npm run self-test" },
    { pattern: /npm run preflight/, name: "npm run preflight" },
  ];

  for (const cmd of requiredCommands) {
    if (cmd.pattern.test(content)) {
      pass(`workflow contains ${cmd.name}`);
    } else {
      fail(`workflow missing ${cmd.name}`);
    }
  }
}

async function checkSensitiveFiles() {
  const envFiles = [".env", ".env.local", ".env.development", ".env.production"];
  const foundEnvFiles = [];

  for (const envFile of envFiles) {
    if (await fileExists(envFile)) {
      foundEnvFiles.push(envFile);
    }
  }

  if (foundEnvFiles.length > 0) {
    warn(`found environment files (should not be committed): ${foundEnvFiles.join(", ")}`);
  } else {
    pass("no environment files found");
  }
}

async function checkDistCommitted() {
  const distExists = await fileExists("dist");
  if (distExists) {
    const entries = await readdir(path.join(root, "dist"));
    if (entries.length > 0) {
      warn("dist directory exists and contains files (should not be committed)");
    } else {
      pass("dist directory is empty");
    }
  } else {
    pass("dist directory not committed");
  }
}

async function checkNodeModulesCommitted() {
  const nodeModulesExists = await fileExists("node_modules");
  if (nodeModulesExists) {
    warn("node_modules directory exists (should not be committed)");
  } else {
    pass("node_modules not committed");
  }
}

async function checkTokensOrSecrets(files) {
  const sourceFiles = files.filter((file) => {
    const rel = relative(file);
    return rel.startsWith("src/") || rel.startsWith("public/") || rel.startsWith("scripts/");
  });

  const tokenPatterns = [
    /api[_-]?key/i,
    /secret[_-]?key/i,
    /access[_-]?token/i,
    /auth[_-]?token/i,
    /password/i,
    /private[_-]?key/i,
    /bearer\s+[a-zA-Z0-9]{20,}/i,
    /ghp_[a-zA-Z0-9]{36}/i,
    /gho_[a-zA-Z0-9]{36}/i,
  ];

  const allowedPatterns = [
    /https:\/\/api\.github\.com/,
    /github\.com.*\/actions\/secrets/,
    /docs\/RELEASE_CHECKLIST\.md/,
    /docs\/OPENCODE_PRESETS\.md/,
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
      if (tokenPatterns.some((pattern) => pattern.test(line))) {
        const isAllowed = allowedPatterns.some((pattern) => pattern.test(line) || rel.match(pattern));
        if (!isAllowed) {
          hits.push(`${rel}:${index + 1}`);
        }
      }
    });
  }

  if (hits.length === 0) {
    pass("no obvious tokens or secrets in source");
  } else {
    warn(`potential token/secret found (manual review recommended): ${hits.length} location(s)`, hits.slice(0, 5));
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
    fail("TODO/FIXME markers found", hits.slice(0, 5));
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
    fail("Suspicious upload endpoint keyword found", hits);
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
    fail("Hardcoded localhost URL found", hits.slice(0, 3));
  }
}

console.log("Open Tools Starter preflight");
console.log("--------------------------------");

await checkRequiredFiles();
await checkPackageScripts();
await checkIndexHtmlSeo();
await checkWorkflowContent();
await checkSensitiveFiles();
await checkDistCommitted();
await checkNodeModulesCommitted();

const files = await collectFiles(root, true);
await checkTodos(files);
await checkTokensOrSecrets(files);
await checkUploadKeywords(files);
await checkHardcodedLocalhost(files);

console.log("--------------------------------");

if (failures.length > 0) {
  console.error(`Preflight FAIL: ${failures.length} issue(s).`);
}

if (warnings.length > 0) {
  console.warn(`Preflight WARN: ${warnings.length} warning(s).`);
}

if (failures.length > 0) {
  process.exit(1);
}

if (warnings.length > 0) {
  console.log("Preflight passed with warnings.");
} else {
  console.log("Preflight passed.");
}