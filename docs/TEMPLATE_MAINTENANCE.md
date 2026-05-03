# Template Maintenance Guide

This document explains how to maintain and upgrade the open-tools-starter template.

## Version History

| Version | Date | Focus |
|---------|------|-------|
| v0.1.0 | 2026-04 | Foundation: Vite + React + TypeScript, A/B/C level system |
| v0.2.0 | 2026-05 | PWA, SEO, ErrorBoundary, Template Health, enhanced docs |
| v0.2.1 | 2026-05 | Self-Test & Pressure Check system |
| v0.2.2 | 2026-05 | Template Hardening: LICENSE, preview/OG images, siteMeta, enhanced preflight, test:ci |
| v0.2.3 | 2026-05 | Quality Fix: privacy/static false-positive fixes, cross-platform pressure rounds, stronger siteMeta checks |
| v0.2.4 | 2026-05 | Documentation & CI Polish: siteMeta docs, Node.js 20 warning, README sync, COPY_TO_NEW_REPO_CHECKLIST update |

## SiteMeta - Single Source of Truth

`src/config/siteMeta.ts` 是项目元信息的单一来源。复制新项目时，优先修改 siteMeta.ts，它包含：

- `name` - 项目名称
- `shortName` - 短名称
- `version` - 版本号
- `description` - 项目描述
- `repositoryUrl` - 仓库地址
- `demoUrl` - 在线演示地址
- `author` - 作者
- `license` - 许可证
- `keywords` - 关键词数组
- `localStoragePrefix` - localStorage key 前缀

其他文件（如 index.html、manifest.webmanifest、App.tsx）中的配置应与 siteMeta.ts 保持一致。

## GitHub Actions Node.js 20 Warning

当前项目使用 Node.js 20 作为 GitHub Actions 的运行环境，主要为了保证 Vite/React 构建的稳定性。

> 注意：GitHub Actions 的 JavaScript action runtime 可能会显示 Node 20 deprecation warning，这是 GitHub 内部的运行时警告，不是项目本身的问题。

后续关注：

- 如果 GitHub Actions 持续显示 Node 20 warning，可考虑设置 runner 环境变量 `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true`。
- 如有必要，升级到更新的 `actions/checkout`、`actions/setup-node` 版本。
- **不要盲目把项目构建 Node 版本改成 24**，除非本地和 CI 全部验证通过。

## How to Upgrade Version

1. Update `package.json` version field.
2. Update `src/config/siteMeta.ts` version to match.
3. Update `RELEASE_NOTES.md` with new section.
4. Update `public/sw.js` CACHE_NAME to include new version.
5. Update `public/manifest.webmanifest` version (optional).
6. Update `App.tsx` manifest version if hardcoded.
7. Run pre-release checks (see below).
8. Commit with version tag.
9. Push and verify GitHub Pages deployment.

## Pre-Release Check Procedure

Before each release, run the complete test chain:

```bash
# 1. Version consistency check
npm run preflight

# 2. Static test
npm run test:static

# 3. Config test
npm run test:config

# 4. Docs test
npm run test:docs

# 5. Health test
npm run test:health

# 6. Privacy boundary test
npm run test:privacy

# 7. Usability test
npm run test:usability

# 8. Build
npm run build

# 9. Self-test
npm run self-test

# 10. Dist test
npm run test:dist

# 11. UI contract test
npm run test:ui

# 12. Preflight
npm run preflight

# 13. Full test (no pressure)
npm run test:all

# 14. Pressure test (default 3 rounds)
npm run test:pressure

# 15. CI simulation (with pressure)
npm run test:ci

# 16. Cross-platform 2-round pressure check
npm run test:pressure -- --rounds=2

# 17. Manual verification
# - npm run dev
# - Open http://localhost:5173/self-test.html
# - Check all test groups pass
# - Check theme toggle, language switch work
# - Verify browser console for errors
```

Or simply run:
```bash
npm run test:ci
```

If any test fails, fix before releasing.

## Local and CI Test Order

Recommended local order:

1. `npm ci` or `npm install`
2. `npm run test:static`
3. `npm run test:config`
4. `npm run test:docs`
5. `npm run test:health`
6. `npm run test:privacy`
7. `npm run test:usability`
8. `npm run build`
9. `npm run self-test`
10. `npm run test:dist`
11. `npm run test:ui`
12. `npm run preflight`
13. `npm run test:all`
14. `npm run test:pressure`
15. `npm run test:ci`

GitHub Actions should run the same quality gates before deployment, using `npm run test:pressure -- --rounds=2` for the CI pressure check. WARN output is allowed to continue; FAIL output must stop deployment.

## Profile and Module Registry Sync

When updating module definitions:

1. Edit `src/config/moduleRegistry.ts` - add/remove/modify modules.
2. Edit `src/config/projectProfiles.ts` - update module assignments per level.
3. Run build and verify homepage reflects changes.
4. Update `docs/MODULE_MATRIX.md` if needed.

## README Updates

When making template changes:

1. Update online demo link if GitHub Pages URL changes.
2. Document new capabilities in appropriate sections.
3. Update "当前未做内容" section if scope changes.
4. Update local run / build instructions if needed.

## RELEASE_NOTES Updates

For each release:

1. Create new section `## vX.Y.Z`.
2. List `Added`, `Changed`, `Checks`, `Notes`, `Next`.
3. Keep "Still out of scope" accurate.
4. Update dates.

## GitHub Pages Verification

After each push:

1. Wait for GitHub Actions workflow to complete.
2. Check Pages URL loads correctly.
3. Verify theme toggle, language switch, level cards work.
4. Check browser console for errors.

## Avoiding Template Creep

The template must remain a "starter", not a business project.

Do:

- Keep PWA light, no complex offline logic.
- Keep SEO basic, no heavy meta tag management.
- Keep ErrorBoundary simple, only catch runtime errors.
- Keep Template Health declarative, no actual system checks.

Don't:

- Add business logic (PDF, image processing, file conversion).
- Add login, user accounts, database.
- Add backend API calls.
- Add heavy dependencies.

## Upgrading from v0.1.0 to v0.2.0

Key changes in v0.2.0:

- Added `public/manifest.webmanifest` for PWA installability.
- Added `public/icon.svg` for PWA icons.
- Added `public/sw.js` for lightweight static caching.
- Added `src/lib/registerServiceWorker.ts` for SW registration.
- Added `src/components/ErrorBoundary.tsx` for runtime error catch.
- Added `Template Health` section on homepage.
- Enhanced `index.html` with complete SEO / OpenGraph.
- Added `docs/TEMPLATE_MAINTENANCE.md`.
- Added `docs/COPY_TO_NEW_REPO_CHECKLIST.md`.
- Added `docs/VERSIONING_GUIDE.md`.
- Enhanced `preflight.mjs` to check PWA/SEO files.
- Enhanced `self-test` to verify PWA/SEO presence.

## Upgrading from v0.2.0/v0.2.1 to v0.2.2

Key changes in v0.2.2:

- Added `LICENSE` file (MIT).
- Added `src/config/siteMeta.ts` for unified project metadata.
- Added `docs/assets/preview.svg` for README preview.
- Added `public/og-image.svg` for OpenGraph/Twitter sharing.
- Added `package-lock.json` for consistent installs.
- Refactored `package.json` scripts: added `test:ci`.
- Enhanced `preflight.mjs` checks: LICENSE, version consistency, sw.js cache version, og-image, preview, package-lock.json, test:all, test:ci.
- Enhanced `test-docs.mjs`: adds preview and license checks.
- Updated README with badges and preview image.
- Updated `COPY_TO_NEW_REPO_CHECKLIST.md` with siteMeta and image asset guidance.
- Updated `TEMPLATE_MAINTENANCE.md` with pre-release check procedure.

## Upgrading from v0.2.2 to v0.2.3

Key changes in v0.2.3:

- Updated version references to `0.2.3` in `package.json`, `package-lock.json`, `src/config/siteMeta.ts`, `public/sw.js`, `public/manifest.webmanifest`, README, preview SVG, and OG image.
- Fixed `scripts/test-privacy-boundary.mjs` path normalization so ignored governance scripts are skipped on Windows and Linux/macOS.
- Fixed `scripts/test-static.mjs` by replacing shell-string execution with `spawn(process.execPath, ["--check", file])`.
- Updated `scripts/pressure-test.mjs` to accept `--rounds=2` and avoid Linux-only inline environment variables.
- Strengthened `scripts/preflight.mjs` and `scripts/test-project-health.mjs` checks for siteMeta fields and package metadata.
- Updated `.github/workflows/pages.yml` to run `npm run test:pressure -- --rounds=2`.
- Reworded documentation planning checks to use explicit Roadmap / Planned / Future language.
