import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const failures = [];
const warnings = [];
const passes = [];

function pass(msg) {
  console.log(`PASS ${msg}`);
  passes.push(msg);
}

function warn(msg) {
  console.warn(`WARN ${msg}`);
  warnings.push(msg);
}

function fail(msg) {
  console.error(`FAIL ${msg}`);
  failures.push(msg);
}

const ignoredDirs = new Set(["node_modules", "dist", ".git", ".github"]);
const textExtensions = new Set([".js", ".ts", ".tsx", ".jsx", ".json", ".md", ".html", ".css", ".mjs"]);
const ignoredFiles = new Set([
  "scripts/test-privacy-boundary.mjs",
  "scripts/preflight.mjs",
  "scripts/test-config.mjs",
  "scripts/test-docs.mjs",
  "scripts/test-static.mjs",
  "scripts/test-dist.mjs",
  "scripts/pressure-test.mjs",
]);

const dangerousPatterns = [
  { pattern: /fetch\s*\(\s*['"]https?:\/\/(?!localhost|127\.0\.0\.1)[^'"]+api/i, type: "external API call", severity: "fail" },
  { pattern: /axios\.\w+\s*\(/i, type: "axios request", severity: "fail" },
  { pattern: /XMLHttpRequest/i, type: "XMLHttpRequest", severity: "fail" },
  { pattern: /new\s+WebSocket/i, type: "WebSocket", severity: "fail" },
  { pattern: /navigator\.sendBeacon/i, type: "sendBeacon", severity: "fail" },
  { pattern: /FormData/i, type: "FormData (file upload)", severity: "warn" },
  { pattern: /api\/upload/i, type: "upload endpoint", severity: "fail" },
  { pattern: /uploadEndpoint/i, type: "upload endpoint", severity: "fail" },
  { pattern: /uploadTo/i, type: "upload function", severity: "fail" },
  { pattern: /handleUpload/i, type: "upload handler", severity: "warn" },
  { pattern: /multipart\/form-data/i, type: "multipart upload", severity: "warn" },
];

const sensitivePatterns = [
  { pattern: /secret[_-]?key/i, type: "secret key", severity: "fail" },
  { pattern: /password\s*[=:]\s*['"][^'"]+['"]/i, type: "hardcoded password", severity: "fail" },
  { pattern: /Authorization\s*:\s*Bearer/i, type: "Authorization header", severity: "fail" },
  { pattern: /Bearer\s+[a-zA-Z0-9]{20,}/i, type: "Bearer token", severity: "fail" },
  { pattern: /ghp_[a-zA-Z0-9]{36}/i, type: "GitHub token (ghp_)", severity: "fail" },
  { pattern: /github_pat_[a-zA-Z0-9_]{22,}/i, type: "GitHub PAT", severity: "fail" },
  { pattern: /xox[baprs]-[a-zA-Z0-9]{10,}/i, type: "Slack/Discord token", severity: "fail" },
];

const localhostPatterns = [
  { pattern: /https?:\/\/localhost:[0-9]+\/(?!self-test|preview)/i, type: "localhost URL (non-test)", severity: "warn" },
  { pattern: /https?:\/\/127\.0\.0\.1:[0-9]+/i, type: "127.0.0.1 URL", severity: "warn" },
];

const docsIgnorePatterns = [
  /don't.*upload/i,
  /no.*upload/i,
  /不要.*上传/i,
  /privacy/i,
  /local.?first/i,
  /no.?backend/i,
];

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else if (textExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function isInDocsContext(content, lineIndex) {
  const lines = content.split("\n");
  const contextStart = Math.max(0, lineIndex - 5);
  const contextEnd = Math.min(lines.length, lineIndex + 3);
  const context = lines.slice(contextStart, contextEnd).join(" ");

  return docsIgnorePatterns.some((pattern) => pattern.test(context));
}

function redactSensitive(text) {
  return text.replace(/ghp_[a-zA-Z0-9]{36}/gi, "ghp_***")
    .replace(/github_pat_[a-zA-Z0-9_]{22,}/gi, "github_pat_***")
    .replace(/xox[baprs]-[a-zA-Z0-9]{10,}/gi, "xox***")
    .replace(/Bearer\s+[a-zA-Z0-9]{20,}/gi, "Bearer ***");
}

async function run() {
  console.log("Privacy Boundary Test - Local First / No Backend Checks");
  console.log("==========================================================");

  const files = await collectFiles(root);

  for (const file of files) {
    const relPath = path.relative(root, file);
    if (relPath.startsWith("scripts/") && ignoredFiles.has(relPath)) continue;

    const content = await readFile(file, "utf8");
    const lines = content.split("\n");

    for (const pattern of dangerousPatterns) {
      lines.forEach((line, index) => {
        if (pattern.pattern.test(line)) {
          const isDocs = relPath.startsWith("docs/") || relPath.endsWith(".md");
          const inDocsContext = isDocs && isInDocsContext(content, index);

          if (inDocsContext) {
            warn(`${relPath}:${index + 1}: "${pattern.type}" in documentation context (allowed)`);
          } else if (pattern.severity === "fail") {
            fail(`${relPath}:${index + 1}: found ${pattern.type}`);
          } else {
            warn(`${relPath}:${index + 1}: found ${pattern.type} (review recommended)`);
          }
        }
      });
    }

    for (const pattern of sensitivePatterns) {
      lines.forEach((line, index) => {
        if (pattern.pattern.test(line)) {
          fail(`${relPath}:${index + 1}: 发现疑似敏感信息 (${pattern.type})`);
        }
      });
    }

    for (const pattern of localhostPatterns) {
      lines.forEach((line, index) => {
        if (pattern.pattern.test(line) && !line.includes("test") && !line.includes("demo")) {
          warn(`${relPath}:${index + 1}: found ${pattern.type}`);
        }
      });
    }
  }

  const readmePath = path.join(root, "README.md");
  if (await readFile(readmePath, "utf8").then(r => r).catch(() => null)) {
    pass("README.md exists - privacy principles can be documented");
  }

  const privacyKeywords = ["Local First", "No Backend", "Privacy Friendly", "Privacy", "隐私", "本地优先", "无后端"];
  const hasPrivacyMention = privacyKeywords.some(kw =>
    content => content.toLowerCase().includes(kw.toLowerCase())
  );

  if (passes.length > 0 || failures.length === 0) {
    pass("Privacy boundary check completed");
  }

  console.log("==========================================================");
  const total = passes.length + warnings.length + failures.length;
  console.log(`\nSummary:`);
  console.log(`  PASS: ${passes.length}`);
  console.log(`  WARN: ${warnings.length}`);
  console.log(`  FAIL: ${failures.length}`);

  if (failures.length > 0) {
    console.error(`\nPrivacy Boundary Test FAIL: ${failures.length} issue(s)`);
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn(`\nPrivacy Boundary Test passed with ${warnings.length} warning(s)`);
  } else {
    console.log(`\nPrivacy Boundary Test PASS`);
  }
}

run().catch((err) => {
  console.error("Privacy Boundary Test error:", err.message);
  process.exit(1);
});