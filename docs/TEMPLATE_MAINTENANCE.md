# Template Maintenance Guide

This document explains how to maintain and upgrade the open-tools-starter template.

## Version History

| Version | Date | Focus |
|---------|------|-------|
| v0.1.0 | 2026-04 | Foundation: Vite + React + TypeScript, A/B/C level system |
| v0.2.0 | 2026-05 | PWA, SEO, ErrorBoundary, Template Health, enhanced docs |

## How to Upgrade Version

1. Update `package.json` version field.
2. Update `RELEASE_NOTES.md` with new section.
3. Update `public/sw.js` cache version if changed.
4. Update `public/manifest.webmanifest` version.
5. Run `npm run build`, `npm run self-test`, `npm run preflight`.
6. Commit with version tag.
7. Push and verify GitHub Pages deployment.

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