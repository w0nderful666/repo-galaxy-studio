# Release Notes

## v0.2.0

Reusable template upgrade.

Added:

- GitHub Actions workflow for installing dependencies, building, testing, preflighting, and deploying `dist/` to GitHub Pages.
- `.gitignore` entries for dependencies, build output, and local environment files.
- Project Profile configuration in `src/config/projectProfiles.ts`.
- Module Registry configuration in `src/config/moduleRegistry.ts`.
- Config-driven level cards, module matrix preview, status legend, and selected profile module lists.
- New project start guide.
- Project spec template.
- Lightweight preflight script.
- Enhanced browser and command-line self-test coverage.
- Expanded README reuse workflow.
- Additional opencode presets for creating and upgrading projects from the starter.

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
