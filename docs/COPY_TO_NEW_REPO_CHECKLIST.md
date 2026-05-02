# Copy to New Repository Checklist

When copying open-tools-starter to create a new project, follow this checklist.

## Must Change Files

### 1. package.json

| Field | Change |
|-------|--------|
| `name` | Rename to new project name (kebab-case) |
| `version` | Reset to `0.1.0` or `1.0.0` |
| `description` | Update to describe new project |
| `author` | Update to your name/email |
| `repository.url` | Update to new repo URL if known |

### 2. README.md

- [ ] Update title (first line) to new project name.
- [ ] Update description in first paragraph.
- [ ] Remove "在线演示" section or update to new URL.
- [ ] Update project structure section if needed.
- [ ] Update "当前未做内容" to match new project scope.
- [ ] Update any references to `open-tools-starter` in code examples.

### 3. index.html

| Element | Change |
|---------|--------|
| `<title>` | New project title |
| `meta[name="description"]` | New project description |
| `meta[name="keywords"]` | New relevant keywords |
| `meta[name="theme-color"]` | Optional new theme color |
| `meta[property="og:title"]` | New OpenGraph title |
| `meta[property="og:description"]` | New OpenGraph description |
| `meta[property="og:url"]` | New GitHub Pages URL |
| `meta[property="og:image"]` | New image URL |
| `meta[name="twitter:title"]` | New Twitter title |
| `meta[name="twitter:description"]` | New Twitter description |
| `meta[name="twitter:image"]` | New Twitter image |
| `<link rel="canonical">` | New canonical URL |

### 4. public/manifest.webmanifest

| Field | Change |
|-------|--------|
| `name` | Full project name |
| `short_name` | Short name for app launcher |
| `description` | Project description |
| `theme_color` | Match index.html theme-color |
| `background_color` | Match light theme background |

### 5. public/sw.js

- [ ] Update `CACHE_NAME` to new version (e.g., `my-new-project-v0.1.0`)
- [ ] Update console messages to reference new project name

### 6. src/lib/registerServiceWorker.ts

- [ ] Update console message to reference new project name

### 7. src/App.tsx

- [ ] Update `open-tools-starter.theme` localStorage key to new name
- [ ] Update `open-tools-starter.language` localStorage key to new name
- [ ] Update manifest JSON in `useMemo` to reflect new project info
- [ ] Update any hardcoded references to open-tools-starter

## Files You Can Remove

Depending on chosen C/B/A level:

- `docs/RELEASE_CHECKLIST.md` - optional for C-level
- `docs/NEW_PROJECT_START_GUIDE.md` - optional for C-level
- `docs/PROJECT_SPEC_TEMPLATE.md` - optional for C-level

## Files You Should Keep

- `README.md` - always keep, update content
- `RELEASE_NOTES.md` - always keep, update for new project
- `.github/workflows/pages.yml` - keep for deployment
- `src/config/projectProfiles.ts` - keep but may customize
- `src/config/moduleRegistry.ts` - keep but may customize
- `docs/PROJECT_LEVELS.md` - keep, useful reference
- `docs/MODULE_MATRIX.md` - keep, useful reference

## After Copying

1. Run `npm install`
2. Run `npm run build` - ensure build passes
3. Update GitHub repo settings:
   - Enable GitHub Pages
   - Source: GitHub Actions
4. Push and verify deployment
5. Run browser self-test at `/self-test.html`
6. Run `npm run preflight` to verify health

## PWA/SEO Config Quick Ref

| File | Key Fields to Update |
|------|---------------------|
| `index.html` | title, description, og:* |
| `manifest.webmanifest` | name, short_name, description |
| `sw.js` | CACHE_NAME, console messages |