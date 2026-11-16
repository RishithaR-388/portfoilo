# Customizing Rishitha’s portfolio

## Preview and build

Use Node.js 22.12+ (the workspace includes a portable runtime at `../.local/node/bin`). From this directory:

```sh
export PATH="/Users/rishitha/Downloads/portfolio/.local/node/bin:$PATH"
npm ci
npm run dev
```

Preview: http://127.0.0.1:4030. The server serves `dist/`. After edits, run `npm run build` in another terminal and refresh the browser. No framework, runtime package dependency, remote font, analytics, or image service is needed.

## Single source of content

Edit `terminal-config.js`, then run `npm run build`. The build generates both `index.html` (semantic content available without JavaScript) and a runtime-only `dist/` directory. Do not edit generated `index.html` directly. `npm run check:generated` detects stale generated HTML.

- `profile`: display/full name, role, label, introduction, expanded biography, email, GitHub username, résumé path, optional phone and availability.
- `links`: professional link names and HTTPS URLs. These also become commands automatically.
- `metrics`: change or reorder contextual highlights; set `visible: false` to hide one. Keep contribution context alongside each metric.
- `experience`: order companies and roles, change date labels, summaries and bullet strings. Remove a bullet to hide it. Do not attribute the whole skills list to an employer without evidence.
- `projects`: a unique lowercase `id`, title, subtitle, description, tags, three conceptual steps, problem, approach, outcome, and optional source/demo/image. Do not add nonexistent demo links. `id` powers hash links and command completion.
- `skills` and `education`: category lists and degree details.
- `features`: optional ASCII artwork/banner, motion, GitHub extras, easter egg, theme selector, and phone visibility. `showPhone` is false by default.
- `theme.defaultTheme`: `system`, `graphite`, or `paper`. Visitor selection takes precedence. `theme.accent` optionally overrides the dark accent with a six-digit hex color; recheck contrast after changing it. `theme.font` accepts `system` (default) or `mono`.

The GitHub version deliberately excludes résumé PDFs. `profile.resume` is empty, so the site offers the résumé by email. All PDFs are ignored by Git and excluded from `dist/`; the original document remains local. To intentionally enable a public download in the future, set `profile.resume`, adjust the PDF exclusion in `scripts/build.mjs`, and explicitly opt that file into Git. Do not do this unless you want the PDF published.

## Design and behavior

- `css/themes.css`: palette variables, font stacks, system fallback.
- `css/base.css`: typography, shared spacing, focus styles, responsive foundations, motion preferences.
- `css/components.css`: workstation, hero, project cards, timeline, terminal, footer and responsive components.
- `scripts/page.mjs`: safe static HTML templates and config validation.
- `js/commands.js`: registry, parsing, argument suggestions, bounded history.
- `js/main.js`: event wiring, shared navigation, command execution, clipboard, GitHub loading.
- `js/render.js`: safe dynamic DOM and transcript rendering.
- `js/theme.js`: system preference and persistent explicit theme selection.
- `js/github.js`: lazy API loading, timeout, short session cache, response validation.

There is no boot delay. Input is native; Tab retains normal focus navigation. Alt+Right completes a suggestion. Enter runs a command; Up/Down browse history and restore a draft. `clear` clears the transcript synchronously, preserving page sections. History lasts for the current page session, up to 100 commands; transcript retains 30 entries. No command executes shell code or calls an AI service.

The old generator, legacy themes, and old helpers are retained as upstream reference only. They are excluded from `dist/`; **do not replace the new configuration with the old generator output**. That schema cannot express the new content. Current customization uses the module configuration above.

## Checks

```sh
npm run build
npm run check:generated
npm test
npm run lint
npm run test:browser
```

Browser checks require local Chrome and Playwright WebKit (`npx playwright install webkit`). The preview must already be running. Set `PORTFOLIO_URL` to test a different URL, including a project subdirectory. Browser test screenshots are in `test-results/` and are ignored by Git.

## Publication preparation

Only deploy `dist/`, never the repository root. `npm run build` packages an allowlist of runtime files and assets. CI uses the lockfile, checks generated content, tests, lint, and audit. The Pages workflow builds and uploads `dist/` when manually triggered. Nothing has been published by this implementation.

Once you select the real host URL, add a canonical URL and absolute social-image URL in `scripts/page.mjs`. A PNG social card is included; keep its source SVG in sync when identity/role changes. GitHub Pages project paths work because application assets and imports are relative and navigation uses hashes. Retain the MIT license and source credit.

## Content review before public release

The local implementation uses the supplied résumé. Confirm current job dates and employer metric suitability before publication. The eight-nines availability figure is deliberately replaced by a qualitative resilience statement. GitHub profile ownership is inferred from the supplied project URL. The ambiguous Scholar link is omitted. Research accuracy is contextualized as a reported résumé result. No live demos, project screenshots, or unpublished implementation details are invented.
