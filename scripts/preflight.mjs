import { readFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();
let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}`);
    failed++;
  }
}

function readFile(path) {
  try {
    return readFileSync(join(ROOT, path), "utf-8");
  } catch {
    return "";
  }
}

console.log("\n🚀 Repo Galaxy Studio — Preflight Check\n");

// Required files exist
check("README.md exists", existsSync(join(ROOT, "README.md")));
check("RELEASE_NOTES.md exists", existsSync(join(ROOT, "RELEASE_NOTES.md")));
check("LICENSE exists", existsSync(join(ROOT, "LICENSE")));
check("package.json exists", existsSync(join(ROOT, "package.json")));
check("index.html exists", existsSync(join(ROOT, "index.html")));
check("manifest.webmanifest exists", existsSync(join(ROOT, "public/manifest.webmanifest")));
check("sw.js exists", existsSync(join(ROOT, "public/sw.js")));

// No Open Tools Starter contamination
const allText = [
  readFile("package.json"),
  readFile("index.html"),
  readFile("README.md"),
  readFile("RELEASE_NOTES.md"),
  readFile("src/config/siteMeta.ts"),
  readFile("public/manifest.webmanifest"),
  readFile("public/sw.js"),
].join("\n");

check("No 'open-tools-starter' in key files", !allText.toLowerCase().includes("open-tools-starter"));
check("No 'Open Tools Starter' in key files", !allText.includes("Open Tools Starter"));
check("No 'open-tools' references", !allText.includes("open-tools"));

// No wrong homepage
check("No wrong homepage URL", !allText.includes("w0nderful666.github.io/open-tools-starter"));

// No token leaks
const srcFiles = [
  readFile("src/App.tsx"),
  readFile("src/lib/github.ts"),
  readFile("src/lib/storage.ts"),
  readFile("src/lib/export.ts"),
  readFile("src/components/TokenSettings.tsx"),
  readFile("scripts/run-self-test.mjs"),
].join("\n");

check("No hardcoded token in source", !srcFiles.includes("ghp_"));
check("No token in export logic", !readFile("src/lib/export.ts").includes("token"));

// No empty button text (check for buttons with no visible text)
check("No vercel.app references", !allText.includes("vercel.app"));

// README quality
const readme = readFile("README.md");
check("README has badges section", readme.includes("![") || readme.includes("badge"));
check("README has online URL", readme.includes("w0nderful666.github.io/repo-galaxy-studio"));
check("README has privacy section", readme.includes("隐私") || readme.includes("Privacy") || readme.includes("privacy"));
check("README has local run instructions", readme.includes("npm run dev"));

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
