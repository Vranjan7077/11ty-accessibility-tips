# Accessibility Tips

[![Netlify Status](https://api.netlify.com/api/v1/badges/8826848b-8a3f-4d7f-a297-71a9de69bd19/deploy-status)](https://app.netlify.com/sites/accessibilitytips/deploys)
[![Eleventy](https://img.shields.io/badge/Eleventy-3-black?logo=eleventy)](https://www.11ty.dev/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4)](https://prettier.io/)

An [Eleventy](https://www.11ty.dev/) site for publishing accessibility tips, patterns, and testing guides for front-end developers.

The site currently includes 31 posts: 27 tips/guides/patterns covering topics like semantic HTML, ARIA, keyboard access, color contrast, reduced motion, forms, media, and accessibility testing, plus 4 curated resource posts (books, podcasts, communities, and external articles).

## Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Content Model](#content-model)
- [Site Features](#site-features)
- [Local Development](#local-development)
- [Available Scripts](#available-scripts)
- [Build Notes](#build-notes)
- [Deployment](#deployment)

## Tech Stack

- [Eleventy 3](https://www.11ty.dev/)
- Nunjucks templates
- Markdown content
- Sass for authoring styles
- PostCSS with `autoprefixer` and `cssnano`
- `markdown-it` for Markdown rendering
- Eleventy plugins for RSS, navigation, syntax highlighting, and responsive image optimization (`@11ty/eleventy-img`)
- `luxon` for date formatting

## Project Structure

```text
.
|-- eleventy.config.mjs
|-- netlify.toml
|-- src/
|   |-- _11ty/                   # Custom collections, filters, shortcodes, transforms, markdown config
|   |   |-- collections/         # resources, sortedByDate, sortedByTitle, topicPages, wcagIndex
|   |   |-- filters/             # readableDate, htmlDateString, readingTime, relatedPosts, tableOfContents, featuredPosts, postUrl
|   |-- _data/                   # Site metadata + wcagCriteria.json (SC number -> name/level lookup), topicDescriptions.json
|   |-- _includes/               # Layouts, components, and Sass
|   |   |-- layouts/components/  # article-meta, toc, related-content, search, theme-toggle, breadcrumbs, postCard, ...
|   |-- assets/                  # Images, favicons, and assets/js/ (search.js, theme.js)
|   |-- posts/                   # Markdown posts (tips and resources, see Content Model below)
|   |-- tips/                    # Paginated listing of all tips
|   |-- resources/                # Paginated listing of all resource posts
|   |-- topics/                  # Single template that generates one archive page per topic (+ nav entry per topic for breadcrumbs)
|   |-- patterns/                # Lists posts with type: pattern
|   |-- test/                    # Curated accessibility-testing hub
|   |-- wcag/                    # WCAG success-criteria index, grouped by principle
|   |-- css/                     # Compiled CSS (source of truth: src/_includes/sass), served as a static asset
|   |-- index.njk                # Home page
|   |-- feed.njk                 # Atom feed
|   |-- search-index.njk         # Build-time JSON search index (/search-index.json)
|   |-- redirects.njk            # Generates /_redirects (old flat post URLs -> new nested ones)
|   |-- robots.njk
|   |-- sitemap.xml.njk
|   |-- 404.md
|-- public/                      # Generated site output
```

## Content Model

All posts live in `src/posts/*.md`. Shared defaults come from `src/posts/posts.11tydata.js`, which also normalizes a few optional front matter fields via `eleventyComputed` so older posts keep working without edits.

### Required front matter

```yaml
---
title: Accessible modals and dialogs
description: Building accessible modal dialogs with proper focus trapping, keyboard support, and screen reader announcements.
topics: HTML
---
```

`title` and `description` are required. `topics` can be a single string (legacy - still supported) or a YAML list:

```yaml
topics:
    - HTML
    - Keyboard
    - Focus
```

Either form is normalized into a `topicsList` array at build time, which drives topic-tag rendering, `/topics/<slug>/` archive generation, and related-content matching. Topic archive pages are grouped by **slug**, not the raw label, so differently-cased spellings of the same topic (`Javascript` vs `JavaScript`) still land on one archive page - keep topic spelling/casing consistent across posts, since it becomes part of the URL (see [Permalinks](#permalinks)).

### Optional front matter

```yaml
---
type: guide # tip (default) | guide | pattern | checklist | resource
technologies:
    - HTML
    - JavaScript
level: intermediate # beginner | intermediate | advanced
wcag:
    - 2.1.1
    - 2.4.3
lastUpdated: 2026-08-20 # only if meaningfully revised after first publish
---
```

None of these are required - the article template only renders the metadata (type badge, level, technologies, WCAG chips, "Updated" date) that's actually present on a given post, so existing posts don't need to be retrofitted.

- **`type`** replaces the old `topics: Blog` convention for marking a post as curated external reading. `type: resource` (or the legacy `topics: Blog`, which still maps to it automatically) routes a post into [`/resources/`](https://accessibilitytips.netlify.app/resources/) instead of [`/tips/`](https://accessibilitytips.netlify.app/tips/) and topic archives. Everything else (`tip`, `guide`, `pattern`, `checklist`) is a "tip" for routing purposes, just labeled differently in the UI.
- **`wcag`** should only be set when the mapping to a specific Success Criterion is genuinely accurate for that post's content - don't tag a post with a criterion just to populate the field. Criterion names/levels are looked up from `src/_data/wcagCriteria.json` (extend that file before referencing a new SC number). Posts with `wcag` set automatically appear on [`/wcag/`](https://accessibilitytips.netlify.app/wcag/), grouped by WCAG principle (Perceivable/Operable/Understandable/Robust).
- **`type: pattern`** is for implementation-pattern posts (e.g. a specific interactive widget) as opposed to general guides - see `accessible-modals-and-dialogs.md` for an example. There's no separate pattern template; it uses the same article layout with a different badge, and is listed at [`/patterns/`](https://accessibilitytips.netlify.app/patterns/).

### What each type routes to

| `type` | Listed in | Topic archives | `/wcag/` (if tagged) |
| --- | --- | --- | --- |
| `tip` (default), `guide`, `pattern`, `checklist` | `/tips/`, home teaser | Yes | Yes |
| `resource` | `/resources/` | No | Yes |

Both listings paginate automatically once they have enough posts, using a shared pagination component. The home page (`/`) shows a short teaser of the latest tips plus links into both sections; it is not a full archive.

### Permalinks

Tips/guides/patterns/checklists are nested under their **primary topic** - `topicsList[0]`, the first topic listed - e.g. `topics: [HTML, Keyboard, Focus]` on a post titled "Accessible modals and dialogs" produces `/topics/html/accessible-modals-and-dialogs/`. This is computed in `posts.11tydata.js` as a plain JS function inside `eleventyComputed` (not a templated string, and not a top-level key) - both are load-bearing:

- **Not a top-level key**: a top-level `permalink` resolves before sibling `eleventyComputed` fields (`topicsList`, `type`) exist, so it can't reference them.
- **Not a templated string**: an `eleventyComputed` permalink written as a Nunjucks template string (`"{% if ... %}"`) resolves inconsistently - pages built early (e.g. the homepage's featured-guides list) can see a different, stale URL for a post than the post's own rendered output uses. A plain function avoids this.

Resources (`type: resource`) and any post with no topic stay flat (`/post-slug/`), since they don't belong to the topic taxonomy the same way, and a single post can't have multiple canonical URLs if it has multiple topics.

**If you add or move a post, or change a post's primary topic**, its URL changes. `src/redirects.njk` auto-generates a Netlify `_redirects` entry for every non-resource post (`/old-flat-slug/ /new-nested-url/ 301`), covering old bookmarks and inbound links - but internal cross-links in post bodies (`[text](/some-post/)`) are NOT auto-updated and must point at the current URL directly.

### Adding a new article

1. Add a Markdown file to `src/posts/`, filled in per the front matter above.
2. Only add `wcag` entries you've verified against the actual WCAG success criterion text - see `src/_data/wcagCriteria.json` for the ones already in use.
3. Link to related existing posts inline where genuinely relevant (the "Related content" section on the article page is generated automatically from shared `topics`/`technologies`/`type` - you don't need to hand-curate it).
4. Run `npm run build` and check the new page, its topic archive page(s), and (if `wcag` is set) `/wcag/`.

## Site Features

#### Navigation & discovery

- Site-wide header navigation (Home / Tips / Test / WCAG / Resources) and breadcrumbs (with `BreadcrumbList` structured data) on every post and archive page
- Home page built around user intent: hero with primary actions, curated "Explore accessibility" topic cards, auto-generated "Featured guides" (posts with `type: guide`/`pattern`/`checklist`), a testing callout, and an auto-generated "Popular topics" list sorted by post count
- `/tips/` and `/resources/` archive pages, both paginated once they have enough posts
- `/topics/<topic>/` archive pages, one per topic, generated automatically (grouped by slug, so casing differences in `topics` don't split a topic across two pages) and also paginated where needed
- `/test/` - a curated testing hub (automated/keyboard/screen reader/visual/mobile/manual checklist), linking out to the relevant existing posts rather than duplicating their content
- `/patterns/` - lists posts with `type: pattern`; not yet in primary nav since there's currently only one (the modal dialog pattern) - reachable via its "Pattern" badge link. Add it to the nav once there's enough content to justify a section
- `/wcag/` - every WCAG-tagged post grouped by principle (Perceivable/Operable/Understandable/Robust), generated entirely from front matter
- Site search (`Ctrl`/`Cmd`+`K`, or the header button) against a build-time JSON index (`/search-index.json`) of titles, descriptions, topics, technologies, and WCAG criteria - client-side only, no backend, progressively enhanced (the trigger is hidden until JS runs)

#### Article experience

- Article metadata row (type, level, technologies, WCAG chips, reading time, published/updated date) that only renders the fields a given post actually has
- Auto-generated table of contents on longer articles (3+ headings), as a native `<details>` disclosure - no JS required
- "Related content" section generated per-article by scoring shared topics/technologies/type across all posts - not just the latest posts
- Clickable topic tags on every post card and post page, linking to the relevant topic archive
- Per-post pages generated from Markdown with a shared permalink pattern
- Syntax highlighting for code examples

#### Theming & accessibility

- Light / Dark / System theme toggle in the header, persisted to `localStorage`, with a blocking inline script to avoid a flash of the wrong theme on load. All color tokens are CSS custom properties (`base/_theme.scss`) so components don't need per-theme overrides - both palettes are contrast-checked against WCAG AA
- Global `prefers-reduced-motion` handling that disables transitions/animations site-wide, not just scroll behavior

#### Performance

- Content images (`src/assets/img/`) are automatically converted to responsive AVIF/WebP/JPEG `<picture>` markup at build time via `eleventyImageTransformPlugin` - no changes needed to how images are referenced in Markdown
- CSS compiled once at build time and served as a single cached stylesheet (not inlined per page)
- HTML minification via a custom build transform

#### SEO & feeds

- `TechArticle`/`Article` + `BreadcrumbList` JSON-LD structured data per page
- Atom feed at `/feed/feed.xml`
- Sitemap and robots.txt generation, including every paginated archive page

#### Under the hood

- Custom Eleventy collections for sorting tips by date and title, grouping resources, generating topic archives, and building the WCAG index

## Local Development

```bash
git clone https://github.com/Vranjan7077/11ty-accessibility-tips.git
cd 11ty-accessibility-tips
npm install
npm start
```

The dev server runs at `http://localhost:3000`.

`npm start` does all of the following:

- Cleans the generated output
- Compiles Sass from `src/_includes/sass` into `src/css`
- Runs PostCSS optimization on the generated CSS
- Starts Eleventy in serve mode with live reload
- Watches Sass files for changes

## Available Scripts

- `npm start` - clean, build CSS, and start local development watchers
- `npm run build` - create a production build in `public`
- `npm run clean` - remove generated output
- `npm run build:sass` - compile Sass into `src/css`
- `npm run build:css` - process compiled CSS with PostCSS
- `npm run build:eleventy` - generate the Eleventy site
- `npm run watch:sass` - watch Sass files and rebuild CSS
- `npm run watch:eleventy` - run Eleventy dev server
- `npm run format` - format JavaScript and Sass files with Prettier

## Build Notes

- Source content lives in `src/`; production output is written to `public/`.
- Assets in `src/assets` are copied through to the final site.
- The compiled stylesheet (`src/css/main.css`) is copied through to `public/assets/css/main.css`.
- `_redirects` is **generated** at build time by `src/redirects.njk` (one rule per post whose URL has moved), not copied through as a static file.
- Eleventy serve mode is configured to use port `3000`.

## Deployment

The site metadata points to the deployed site at:

- Production URL: `https://accessibilitytips.netlify.app`
- Repository: `https://github.com/Vranjan7077/11ty-accessibility-tips`

Deploy status is shown at the top of this file. Build command, publish directory, and Node version are pinned in `netlify.toml`.
