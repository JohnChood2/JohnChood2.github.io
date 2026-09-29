# Site Revamp Design

Date: 2026-09-29
Branch: `site-revamp`

## Goal

Make johnchood2.github.io look polished and professional with a calm dark theme,
bring all old pages into one consistent design, and add a "Notes" blog section
modeled on https://markptorres.com/self_education/.

## Decisions

| Topic | Decision |
|---|---|
| Framework | Convert to **Jekyll**, built automatically by GitHub Pages |
| Blog | One section called **Notes**, posts can have multiple tags |
| Theme | Dark-only, charcoal background, steel-blue accent `#7aa2c8` |
| CV | Convert `Hood_CV.html` to the new layout with the same content. Automatic updates from the PDF are **out of scope** for now |
| Delivery | Pull request from `site-revamp` into `master`, merged by John |

## Site structure

```
_config.yml              site title, URLs, nav links, plugins
_layouts/
  default.html           page shell: nav + footer + Google Analytics
  post.html              one Notes post: title, date, reading time, tags
_includes/
  nav.html
  footer.html
_posts/
  2026-09-29-welcome.md  sample post
_templates/
  post-template.md       copy this to start a new post (not published)
index.html               home page (existing content, calmer style)
notes/index.html         list of all posts, newest first
notes/tags.html          posts grouped by tag
Hood_CV.html             \
Hood_research.html        |
Hood_data.html            |  same filenames and content,
Hood_outreach.html        |  rebuilt on the default layout
Hood_resources.html      /
assets/css/site.css      single new stylesheet
README.md                how to write a post and preview locally
```

- Existing page URLs do not change.
- Post URLs: `/notes/YYYY/MM/DD/slug/`.
- Reading time is computed in the layout from the word count (words / 200).
- Only plugins in the GitHub Pages allow-list are used (`jekyll-feed`, `jekyll-seo-tag`).
- `docs/` is excluded from the built site.

### Front matter for a post

```yaml
---
title: "Post title"
date: 2026-09-29
tags: [research, data-science]
description: "One-sentence summary shown on the Notes list."
---
```

## Removed files

- `outreach.html` (duplicate of `Hood_outreach.html`)
- `normal_files/` (unused template demo pages)
- `assets/css/main.css`, `ie8.css`, `ie9.css`, `modern.css`, `font-awesome.min.css`
- `assets/js/*` (old template scripts and `modern.js`); a small replacement
  script handles only the mobile menu
- `assets/sass/`, `assets/fonts/` (old template sources)
- `README.txt` (template readme; replaced by `README.md`)

`images/`, `Docs/`, and `LICENSE.txt` are kept unchanged.

## Visual style

- Colors: background `#111317`, panels `#181b21`, borders `#262a31`,
  text `#e6e8eb`, secondary text `#9aa3ad`, accent `#7aa2c8`.
- Fonts: Inter for text (17px), JetBrains Mono for code. Font Awesome 6 (CDN)
  for icons.
- Post body width capped near 70 characters per line.
- Code blocks use a muted dark syntax-highlighting palette.
- No particles, glows, gradients, typing text, or animated counters.
  Only hover color transitions.
- Home page keeps its sections (About, Research, Projects, Publications,
  Outreach, Contact) and adds a "Recent Notes" list of the 3 newest posts.
- Nav on every page: Home, Research, CV, Notes, Outreach, Data, Resources.
- Responsive; on narrow screens the nav collapses to a menu button.

## Verification

- Build locally with Jekyll and serve the site.
- Click through every page in a browser: nav links, images, PDF links,
  Notes list, tag page, sample post, mobile width.
- Check the browser console for errors.

## Out of scope

- Automatically generating the CV page from the CV PDF.
- Light theme.
- Comments or search on Notes.
