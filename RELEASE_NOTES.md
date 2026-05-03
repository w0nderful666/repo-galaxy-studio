# Release Notes

## v0.2.4

Documentation & CI Polish release (May 2026).

Added:

- `src/config/siteMeta.ts` as single source of truth for project metadata.
- Documentation updates: README.md now lists all test scripts in project structure.
- `docs/COPY_TO_NEW_REPO_CHECKLIST.md` now emphasizes prioritizing `siteMeta.ts` modifications.
- `docs/TEMPLATE_MAINTENANCE.md` added:
  - SiteMeta section explaining it as single source of truth.
  - GitHub Actions Node.js 20 warning explanation.
  - v0.2.4 entry in version history.

Changed:

- README.md "复制到新项目后的 PWA / SEO 配置" table now lists `src/config/siteMeta.ts` first.
- README.md project structure now lists all test scripts.
- Version upgraded to v0.2.4 across package.json, siteMeta.ts, sw.js, manifest.webmanifest, self-test.html.

Notes:

- Node.js 20 in GitHub Actions is for Vite/Build stability; the Node 20 deprecation warning is a GitHub internal runtime issue, not a project problem.
- Don't blindly upgrade project build to Node 24 unless local and CI are fully validated.
- v0.2.x is now a stable template baseline for v0.3.0 first C-level example tool.

Next:

- v0.3.0 can add first C-level example project.

## v0.2.3

Quality Fix / Test Chain Hardening release (May 2026).

Added:

- Cross-platform pressure test rounds via `npm run test:pressure -- --rounds=2`.
- Stronger `siteMeta.ts` field checks in health and preflight scripts.
- package metadata for repository, homepage, and keywords.

Changed:

- Updated package, siteMeta, manifest, Service Worker cache, README badge, preview assets, and OpenGraph image text to v0.2.3.
- `App.tsx` now reads project name, version, demo URL, repository URL, and localStorage prefix from `siteMeta.ts`.
- GitHub Actions now uses the same cross-platform pressure test argument style as `test:ci`.
- Documentation planning wording now uses explicit Roadmap / Planned / Future language instead of ambiguous marker text.

Fixed:

- `test:privacy` no longer self-matches its own detection rules on Windows path separators.
- `test:static` now uses `child_process.spawn` without `shell: true`, avoiding `cmd.exe EPERM` false failures.
- `test:ci` no longer depends on Linux-only inline environment variable syntax.
- Project health no longer misses `src/config/siteMeta.ts` because of absolute path handling.

Checks:

- `test:all` covers static, config, docs, health, privacy, usability, build, self-test, dist, UI contract, and preflight.
- `test:ci` runs `test:all` plus 2 pressure rounds.
- preflight checks LICENSE, README, RELEASE_NOTES, package metadata, version consistency, Service Worker cache version, README principles, upload keywords, and suspicious secrets.

Next:

- v0.3.0 can add the first C-level example project after the quality chain remains stable.

## v0.2.2

Template Hardening release (May 2026).

Added:

- Unified project meta configuration at `src/config/siteMeta.ts`.
- LICENSE file (MIT) added to repository root.
- Project preview SVG at `docs/assets/preview.svg`.
- OpenGraph image at `public/og-image.svg`.
- Enhanced preflight checks: LICENSE, version consistency, sw.js cache version, og-image, preview, package-lock.json, test:all, test:ci.
- Refactored package.json scripts: `test:all` now covers static, config, docs, build, self-test, dist, preflight. `test:ci` covers full GitHub Actions pipeline including pressure test.

New Test Scripts (v0.2.2):

- `scripts/test-project-health.mjs` - comprehensive project health check with score
- `scripts/test-privacy-boundary.mjs` - scans for external API calls, sensitive data, upload endpoints
- `scripts/test-template-usability.mjs` - validates template can be copied to new projects
- `scripts/test-ui-contract.mjs` - verifies build output and SEO meta

Scripts:

- `npm run test:health` - project health check
- `npm run test:privacy` - privacy boundary scan
- `npm run test:usability` - template usability check
- `npm run test:ui` - UI contract verification

GitHub Actions enhanced:

- Now runs test:health, test:privacy, test:usability, test:ui in CI pipeline

Changed:

- package.json version corrected from 0.1.0 to 0.2.2.
- Service Worker cache version updated to v0.2.2.
- README.md updated with preview image, license section, and comprehensive test documentation.
- App.tsx version aligned with package.json.

Checks:

- All existing tests pass (test:static, test:config, test:docs, test:health, test:privacy, test:usability, build, self-test, test:dist, test:ui, preflight, test:pressure).
- Version consistency verified across package.json, App.tsx, sw.js, manifest, siteMeta.ts.
- Privacy boundary verified - no external API calls or sensitive data leaks detected.

Next:

- v0.3.0 can add first C-level example project.

## v0.2.1

Self-Test & Pressure Check release (May 2026).

Added:

- Unified test entry points in package.json.
- Static test script `scripts/test-static.mjs` - checks JS syntax and required files.
- Config test script `scripts/test-config.mjs` - verifies C/B/A profiles and module registry.
- Docs test script `scripts/test-docs.mjs` - validates documentation quality and presence.
- Dist test script `scripts/test-dist.mjs` - checks build output for issues.
- Pressure test script `scripts/pressure-test.mjs` - runs repeated checks for consistency.
- Enhanced preflight to verify new test scripts exist.
- GitHub Actions now runs full test chain: static, config, docs, build, self-test, dist, preflight, pressure.

Scripts:

- `npm run test:static` - static syntax and file checks
- `npm run test:config` - profile and registry validation
- `npm run test:docs` - documentation quality checks
- `npm run test:dist` - build output validation
- `npm run test:pressure` - repeated stress testing (default 3 rounds)
- `npm run test:all` - runs all tests sequentially

Notes:

- Test scripts use native Node.js capabilities, no extra dependencies.
- Pressure test can be customized with `npm run test:pressure -- --rounds=10`.
- Dist test gracefully handles missing build output with clear warnings.

Next:

- v0.3.0 can add first C-level example project.

## v0.2.0

Template enhancement release (May 2026).

Added:

- PWA support: `public/manifest.webmanifest`, `public/icon.svg`, `public/sw.js`, `src/lib/registerServiceWorker.ts`.
- Complete SEO / OpenGraph configuration in `index.html`.
- ErrorBoundary component at `src/components/ErrorBoundary.tsx`.
- Template Health section on homepage displaying capability status.
- Enhanced preflight checks: PWA files, SEO meta tags, new documentation, workflow commands, sensitive file detection.
- Enhanced self-test: PWA file checks, Template Health region, ErrorBoundary root, language toggle behavior.
- New documentation: `docs/TEMPLATE_MAINTENANCE.md`, `docs/COPY_TO_NEW_REPO_CHECKLIST.md`, `docs/VERSIONING_GUIDE.md`.
- i18n updates for Template Health section.

Changed:

- `index.html` now includes complete OpenGraph and Twitter meta tags.
- `sw.js` uses versioned cache `open-tools-starter-v0.2.0`.

Checks:

- `npm run preflight` now includes PASS/WARN/FAIL categories.
- `npm run self-test` verifies new PWA and Health components.

Notes:

- Service worker provides lightweight static caching only.
- ErrorBoundary catches React runtime errors without leaking environment details.
- Template Health is declarative, showing capability status (all currently Ready).

Next:

- v0.3.0 can start the first C-level example project.

Still out of scope:

- Concrete PDF, image, QR code, or file conversion tools.
- File Bento, PDF Desk Lite, Image Desk Lite, or other business projects.
- Backend, database, login, or user file upload.

## v0.1.0

Initial foundation release for Open Tools Starter.

Added:

- Vite + React + TypeScript project skeleton.
- GitHub Pages ready build configuration with relative asset paths.
- A / B / C project level system.
- Module matrix documentation.
- opencode preset prompts.
- Release checklist documentation.
- Reusable UI primitives: Button, Card, Modal, Toast, EmptyState, ErrorState, CopyButton, DownloadButton.
- Theme switching with localStorage persistence.
- Chinese / English switching with localStorage persistence.
- Local-first starter homepage.
- Browser self-test entry.
- Command-line self-test smoke script.

Not included yet:

- PDF tools.
- Image tools.
- QR code tools.
- File conversion tools.
- PWA.
- Backend, database, login, or user file upload.
