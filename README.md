# Accessibility Tips

An [Eleventy](https://www.11ty.dev/) site for publishing accessibility tips, patterns, and testing guides for front-end developers.

The site currently includes 27 posts focused on topics like semantic HTML, ARIA, keyboard access, color contrast, reduced motion, forms, media, and accessibility testing.

## Tech Stack

- [Eleventy 3](https://www.11ty.dev/)
- Nunjucks templates
- Markdown content
- Sass for authoring styles
- PostCSS with `autoprefixer` and `cssnano`
- `markdown-it` for Markdown rendering
- Eleventy plugins for RSS, navigation, and syntax highlighting

## Project Structure

```text
.
|-- eleventy.config.mjs
|-- src/
|   |-- _11ty/            # Custom collections, filters, shortcodes, transforms, markdown config
|   |-- _data/            # Site metadata
|   |-- _includes/        # Layouts, components, Sass, and CSS includes
|   |-- assets/           # Images and favicons
|   |-- posts/            # Markdown posts
|   |-- tips/             # All tips listing page
|   |-- css/              # Generated CSS output from Sass
|   |-- index.njk         # Home page with pagination
|   |-- feed.njk          # Atom feed
|   |-- robots.njk
|   |-- sitemap.xml.njk
|   |-- 404.md
|-- public/               # Generated site output
```

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

## Site Features

- Home page with pagination, showing 6 posts per page
- `/tips/` archive page listing all posts alphabetically
- Per-post pages generated from Markdown with a shared permalink pattern
- Atom feed at `/feed/feed.xml`
- Sitemap and robots.txt generation
- Syntax highlighting for code examples
- Custom Eleventy collections for sorting by date and title
- HTML minification and inline CSS support through custom transforms and shortcodes

## Build Notes

- Source content lives in `src/`
- Production output is written to `public/`
- Assets in `src/assets` are copied through to the final site
- `_redirects` is passed through for deployment
- Eleventy serve mode is configured to use port `3000`

## Deployment

The site metadata points to the deployed site at:

- Production URL: `https://accessibilitytips.netlify.app`
- Repository: `https://github.com/Vranjan7077/11ty-accessibility-tips`

Deploy status: [![Netlify Status](https://api.netlify.com/api/v1/badges/8826848b-8a3f-4d7f-a297-71a9de69bd19/deploy-status)](https://app.netlify.com/sites/accessibilitytips/deploys)
