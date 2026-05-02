# Versioning Guide

This guide explains the versioning strategy for open-tools-starter.

## Version Format

Format: `vMAJOR.MINOR.PATCH`

- **MAJOR**: Incompatible template changes (rare, should not happen)
- **MINOR**: New capabilities while maintaining backward compatibility
- **PATCH**: Bug fixes, documentation updates, small improvements

## Release Cadence

| Version | Type | When |
|---------|------|------|
| v0.1.0 | Minor | Initial foundation (April 2026) |
| v0.2.0 | Minor | PWA, SEO, ErrorBoundary, Health (May 2026) |
| v0.3.0 | Minor | First C-level example project (planned) |

## Version Focus Areas

### v0.1.0: Foundation

Goal: Establish reusable template skeleton.

- Vite + React + TypeScript skeleton
- A/B/C project level system
- Profile and Module Registry
- Basic UI components
- Theme and i18n
- GitHub Pages configuration
- GitHub Actions workflow
- Basic self-test and preflight

### v0.2.0: Template Enhancement

Goal: Add template-level quality features.

- PWA: manifest, service worker, icon
- SEO: Complete OpenGraph and meta tags
- ErrorBoundary: Runtime error catching
- Template Health: Homepage capability display
- Enhanced preflight: Check PWA/SEO files
- Enhanced self-test: Verify PWA/SEO presence
- New documentation: Maintenance, Copy Checklist, Version Guide

### v0.3.0: First Example Project

Goal: Provide a working C-level example.

- Add first C-level example tool (e.g., simple text helper)
- Demonstrate real button actions
- Show README template for business project
- Keep template separate from example

## Writing RELEASE_NOTES

Each release should include:

```markdown
## vX.Y.Z

[Date]

Added:
- [New feature 1]
- [New feature 2]

Changed:
- [Behavior change 1]

Checks:
- [Test updates]
- [Build improvements]

Notes:
- [Known limitations]
- [Migration notes]

Next:
- [Planned for next version]
```

## What Belongs in Template vs Business Project

The template should never include:

- Actual business logic (PDF processing, image manipulation)
- File upload endpoints
- Backend services
- User authentication
- Database connections

These belong in projects created FROM the template, not in the template itself.

## Semantic Versioning Exceptions

This is a template, not a library. We use relaxed semver:

- MINOR versions may add new capabilities without guaranteed backward compatibility
- PATCH may include breaking bug fixes if necessary
- We prioritize template simplicity over strict API stability

## Updating Version

1. Update `package.json` version
2. Update `RELEASE_NOTES.md`
3. Update `public/sw.js` CACHE_VERSION if changed
4. Update `public/manifest.webmanifest` version
5. Create Git tag
6. Push and verify deployment