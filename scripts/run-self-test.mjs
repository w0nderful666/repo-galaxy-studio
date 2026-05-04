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

console.log("\n🧪 Repo Galaxy Studio — Self-Test\n");

// 1. package.json
const pkg = JSON.parse(readFile("package.json"));
check("package.json name is repo-galaxy-studio", pkg.name === "repo-galaxy-studio");
check("package.json version is 1.2.0", pkg.version === "1.2.0");

// 2. index.html
const indexHtml = readFile("index.html");
check("index.html title contains Repo Galaxy Studio", indexHtml.includes("Repo Galaxy Studio"));
check("index.html has correct canonical URL", indexHtml.includes("w0nderful666.github.io/repo-galaxy-studio"));
check("index.html does NOT contain open-tools-starter", !indexHtml.toLowerCase().includes("open-tools-starter"));

// 3. manifest
const manifest = JSON.parse(readFile("public/manifest.webmanifest"));
check("manifest name is Repo Galaxy Studio", manifest.name === "Repo Galaxy Studio");

// 4. sw.js
const sw = readFile("public/sw.js");
check("sw.js cache name contains repo-galaxy-studio", sw.includes("repo-galaxy-studio"));

// 5. dist exists (after build)
check("dist/index.html exists", existsSync(join(ROOT, "dist/index.html")));

// 6. Source code checks
const appTsx = readFile("src/App.tsx");
check("App.tsx contains GalaxyCanvas", appTsx.includes("GalaxyCanvas"));
check("App.tsx contains fetchGitHubData or fetchUser", appTsx.includes("fetchUser") || appTsx.includes("fetchGitHubData"));

const galaxyTsx = readFile("src/components/GalaxyCanvas.tsx");
check("GalaxyCanvas.tsx exists and has Canvas", galaxyTsx.includes("Canvas") || galaxyTsx.includes("galaxy"));

const fallback = readFile("src/components/WebGLFallback.tsx");
check("WebGLFallback.tsx exists", fallback.length > 100);

// 7. No contamination
const readme = readFile("README.md");
check("README does NOT contain open-tools-starter", !readme.toLowerCase().includes("open-tools-starter"));
check("README does NOT contain vercel.app", !readme.includes("vercel.app"));
check("README contains correct online URL", readme.includes("w0nderful666.github.io/repo-galaxy-studio"));

// 8. No master branch references
check("No master branch deployment references", !readme.includes("master branch"));
check("No /docs folder deployment references", !readme.includes("/docs folder"));

// 9. Dist contamination check
if (existsSync(join(ROOT, "dist"))) {
  try {
    const distIndex = readFile("dist/index.html");
    check("dist/index.html does NOT contain open-tools-starter", !distIndex.toLowerCase().includes("open-tools-starter"));
  } catch {
    // dist might not have index.html
  }
}

// 10. siteMeta
const siteMeta = readFile("src/config/siteMeta.ts");
check("siteMeta name is Repo Galaxy Studio", siteMeta.includes('"Repo Galaxy Studio"'));
check("siteMeta localStoragePrefix is repo-galaxy-studio", siteMeta.includes('"repo-galaxy-studio"'));

// Summary
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
