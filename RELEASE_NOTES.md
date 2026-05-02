# Release Notes

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
- Pressure test can be customized via `PRESSURE_ROUNDS` environment variable.
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
