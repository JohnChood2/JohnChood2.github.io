# Site Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert johnchood2.github.io to Jekyll with a calm dark theme, rebuild every page on one shared layout, and add a tagged "Notes" blog.

**Architecture:** GitHub Pages builds the site with Jekyll. One layout (`_layouts/default.html`) plus small includes (nav, footer, post list, tag list) wrap every page. Existing page filenames stay the same so old links keep working. Posts are Markdown files in `_posts/`.

**Tech Stack:** Jekyll via the `github-pages` gem (same versions as the live build), `jekyll-feed`, `jekyll-seo-tag`, Rouge syntax highlighting, plain CSS, ~10 lines of vanilla JS. `html-proofer` for local link checking. Homebrew `ruby@3.3` for local builds.

**Spec:** `docs/superpowers/specs/2026-09-29-site-revamp-design.md`

## Global Constraints

- Dark-only. Colors: background `#111317`, panels `#181b21`, borders `#262a31`, text `#e6e8eb`, secondary text `#9aa3ad`, accent `#7aa2c8`.
- Fonts: Inter (17px base) for text, JetBrains Mono for code. Font Awesome 6.4.0 from cdnjs for icons.
- No particles, glows, gradients, typing text, or animated counters. Only hover color transitions.
- Nav on every page, in order: Home, Research, CV, Notes, Outreach, Data, Resources.
- Keep filenames `index.html`, `Hood_CV.html`, `Hood_research.html`, `Hood_data.html`, `Hood_outreach.html`, `Hood_resources.html`.
- Post URLs: `/notes/:year/:month/:day/:title/`.
- Only GitHub Pages allow-listed plugins.
- Keep Google Analytics ID `G-SBT0F5VW0N`.
- Page text is kept as written by John (no rewording, no typo fixes without asking).
- `images/`, `Docs/`, `LICENSE.txt` are not modified.
- Every internal link must use `relative_url` so pages at nested URLs (posts) resolve correctly.

## Review Focus

1. **Post dated in the future** (or later today) is silently skipped by Jekyll. Expect: `timezone: America/Chicago` is set and the README warns about it. Checked in Task 4 Step 6.
2. **Post with no `tags`** should render with no empty tag row and no build error. Checked in Task 4 Step 6.
3. **Tag with spaces or capitals** (e.g. `Data Science`) should link to a matching anchor on the tags page. `html-proofer` checks internal `#hash` links. Checked in Task 4 Step 6.
4. **Pages at nested URLs** (posts under `/notes/2026/09/29/...`) must load CSS, images, and nav links. `html-proofer` over `_site` covers this. Checked in Task 4 Step 5.
5. **Narrow screens (375px):** the nav collapses to a menu button that opens and closes. Checked in Task 6 Step 2.

---

### Task 1: Jekyll setup, shared layout, stylesheet, and the Data page

**Files:**
- Create: `Gemfile`, `_config.yml`, `.gitignore`, `check-site.sh`
- Create: `_layouts/default.html`, `_includes/nav.html`, `_includes/footer.html`
- Create: `assets/css/site.css`, `assets/js/site.js`
- Modify: `Hood_data.html` (full rewrite, same content)

**Interfaces:**
- Produces: `layout: default` for any page. Front matter `title` and `description` feed `{% seo %}`. `site.nav`, `site.social.*`, `site.email`, `site.publications_url` in `_config.yml`. CSS classes listed in `site.css` (`.page-header`, `.page-lead`, `.section`, `.section-lead`, `.btn`, `.btn-outline`, `.card-grid`, `.card`, `.card-image`, `.card-image.contain`, `.card-body`, `.card-link`, `.panel`, `.caption`, `.link-list`, `.meta`, `.two-col`, `.grid-2`, `.hero*`, `.feature`, `.cv-list`, `.cv-row`, `.cv-date`, `.prose`, `.post*`, `.tag`, `.tag-list`, `.tag-section`, `.tag-count`, `.social-icons`, `.muted`).
- `./check-site.sh` builds the site and runs html-proofer.

- [ ] **Step 1: Install a Ruby that can run Jekyll**

```bash
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
ruby -v
```
Expected: `ruby 3.3.x`. (This Ruby is "keg-only": it does not replace the system Ruby; it's only used when the `export PATH` line is run.)

- [ ] **Step 2: Create `Gemfile`**

```ruby
source "https://rubygems.org"

# The same Jekyll and plugin versions GitHub Pages uses for the live site.
gem "github-pages", group: :jekyll_plugins

# Needed by `jekyll serve` on Ruby 3+.
gem "webrick"

# Checks the built site for broken links and images (see check-site.sh).
group :test do
  gem "html-proofer", "~> 5.0"
end
```

- [ ] **Step 3: Create `.gitignore`**

```
_site/
.jekyll-cache/
.jekyll-metadata
.bundle/
vendor/
.sass-cache/
```

- [ ] **Step 4: Create `check-site.sh` and make it executable**

```bash
#!/usr/bin/env bash
# Build the site and check it for broken internal links and images.
# Usage: ./check-site.sh
set -euo pipefail

bundle exec jekyll build
bundle exec htmlproofer _site --disable-external
```

Run: `chmod +x check-site.sh`

- [ ] **Step 5: Create `_config.yml`**

```yaml
# Site settings. After editing this file, restart `jekyll serve`.

title: John C. Hood II
description: >-
  Astrophysicist and postdoctoral researcher at the University of Chicago
  specializing in time-domain astronomy, AGN monitoring, and millimeter
  wavelength observations.
url: https://johnchood2.github.io
baseurl: ""
author: John C. Hood II
email: hood.astro@gmail.com
image: /images/john.jpg
lang: en_US
timezone: America/Chicago
google_analytics_id: G-SBT0F5VW0N

# Links to all publications on NASA ADS
publications_url: "https://ui.adsabs.harvard.edu/search/q=author%3A(%22Hood%2C%20John%22%20OR%20%22Hood%2C%20J.%22%20OR%20%22Calven%20Hood%2C%20John%22)%20AND%20%20year%3A%5B2006-*%5D%20AND%20%20full%3A(%22CMB%22%20OR%20%22SPT%22%20OR%20%22Vanderbilt%22%20OR%20%22Fisk%22%20OR%20%22Columbus%20State%22)&sort=date%20desc%2C%20bibcode%20desc&p_=0"

social:
  github: https://github.com/JohnChood2
  linkedin: https://www.linkedin.com/in/john-hood-phd/
  orcid: https://orcid.org/0000-0003-4157-4185

# Top navigation, in order
nav:
  - title: Home
    url: /
  - title: Research
    url: /Hood_research.html
  - title: CV
    url: /Hood_CV.html
  - title: Notes
    url: /notes/
  - title: Outreach
    url: /Hood_outreach.html
  - title: Data
    url: /Hood_data.html
  - title: Resources
    url: /Hood_resources.html

# Notes (blog posts in _posts/)
permalink: /notes/:year/:month/:day/:title/
markdown: kramdown
highlighter: rouge

plugins:
  - jekyll-feed
  - jekyll-seo-tag

feed:
  path: notes/feed.xml

exclude:
  - docs/
  - README.md
  - Gemfile
  - Gemfile.lock
  - check-site.sh
  - vendor/
```

- [ ] **Step 6: Create `_includes/nav.html`**

```html
<header class="site-header">
  <div class="container nav-bar">
    <a class="site-title" href="{{ '/' | relative_url }}">{{ site.title }}</a>

    <button class="nav-toggle" id="nav-toggle" aria-label="Open menu"
            aria-expanded="false" aria-controls="nav-links">
      <i class="fas fa-bars"></i>
    </button>

    <nav aria-label="Main">
      <ul class="nav-links" id="nav-links">
        {% for item in site.nav %}
          {% assign is_current = false %}
          {% if page.url == item.url %}{% assign is_current = true %}{% endif %}
          {% if item.url == '/notes/' and page.url contains '/notes/' %}{% assign is_current = true %}{% endif %}
          <li>
            <a href="{{ item.url | relative_url }}"{% if is_current %} class="current" aria-current="page"{% endif %}>{{ item.title }}</a>
          </li>
        {% endfor %}
      </ul>
    </nav>
  </div>
</header>
```

- [ ] **Step 7: Create `_includes/footer.html`**

```html
<footer class="site-footer">
  <div class="container footer-inner">
    <p>&copy; {{ site.time | date: "%Y" }} {{ site.author }}</p>
    <div class="social-icons">
      <a href="{{ site.social.github }}" aria-label="GitHub"><i class="fab fa-github"></i></a>
      <a href="{{ site.social.linkedin }}" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
      <a href="{{ site.social.orcid }}" aria-label="ORCID"><i class="fab fa-orcid"></i></a>
      <a href="mailto:{{ site.email }}" aria-label="Email"><i class="fas fa-envelope"></i></a>
      <a href="{{ '/notes/feed.xml' | relative_url }}" aria-label="Notes RSS feed"><i class="fas fa-rss"></i></a>
    </div>
  </div>
</footer>
```

- [ ] **Step 8: Create `_layouts/default.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    {% seo %}
    {% feed_meta %}

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="{{ '/assets/css/site.css' | relative_url }}">

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ site.google_analytics_id }}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '{{ site.google_analytics_id }}');
    </script>
  </head>

  <body>
    {% include nav.html %}

    <main class="container">
      {{ content }}
    </main>

    {% include footer.html %}

    <script src="{{ '/assets/js/site.js' | relative_url }}"></script>
  </body>
</html>
```

- [ ] **Step 9: Create `assets/js/site.js`**

```js
// Open and close the navigation menu on small screens.
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.getElementById("nav-links");

navToggle.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});
```

- [ ] **Step 10: Create `assets/css/site.css`**

```css
/* ==========================================================
   Styles for johnchood2.github.io
   Dark theme with a single steel-blue accent color.
   To re-theme the whole site, change the colors in :root.
   ========================================================== */

:root {
  --bg: #111317;
  --panel: #181b21;
  --code-bg: #0c0e11;
  --border: #262a31;
  --text: #e6e8eb;
  --text-muted: #9aa3ad;
  --accent: #7aa2c8;
  --accent-hover: #9bbad8;
  --radius: 8px;
  --content-width: 960px;
  --prose-width: 70ch;
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
}

/* ---------- Base ---------- */

*, *::before, *::after { box-sizing: border-box; }

html { font-size: 17px; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--accent); text-decoration: none; transition: color 0.15s; }
a:hover { color: var(--accent-hover); text-decoration: underline; }

h1, h2, h3, h4 { line-height: 1.25; font-weight: 600; margin: 1.6em 0 0.5em; }
h1 { font-size: 2rem; margin-top: 0; }
h2 { font-size: 1.45rem; }
h3 { font-size: 1.15rem; }
h4 { font-size: 1rem; }

img { max-width: 100%; height: auto; }

.container { max-width: var(--content-width); margin: 0 auto; padding: 0 1.25rem; }
main.container { padding-top: 2.5rem; padding-bottom: 4rem; }
.muted { color: var(--text-muted); }

/* ---------- Header and navigation ---------- */

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.nav-bar { display: flex; align-items: center; justify-content: space-between; min-height: 3.5rem; }
.site-title { color: var(--text); font-weight: 600; }
.site-title:hover { color: var(--text); text-decoration: none; }

.nav-links { list-style: none; display: flex; gap: 1.25rem; margin: 0; padding: 0; }
.nav-links a { color: var(--text-muted); font-size: 0.9rem; }
.nav-links a:hover { color: var(--text); text-decoration: none; }
.nav-links a.current { color: var(--text); border-bottom: 2px solid var(--accent); padding-bottom: 0.2rem; }

.nav-toggle {
  display: none;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  padding: 0.35rem 0.6rem;
  cursor: pointer;
}

/* ---------- Footer ---------- */

.site-footer { border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.85rem; }
.footer-inner { display: flex; justify-content: space-between; align-items: center; padding-top: 1.5rem; padding-bottom: 1.5rem; }
.footer-inner p { margin: 0; }

/* ---------- Shared pieces ---------- */

.page-header { margin-bottom: 2rem; }
.page-lead, .section-lead { color: var(--text-muted); margin-top: 0; }

.section { margin-top: 3rem; padding-top: 0.5rem; border-top: 1px solid var(--border); }
.section > h2 { margin-top: 1.5rem; }

.btn {
  display: inline-block;
  padding: 0.5rem 1.1rem;
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  background: var(--accent);
  color: var(--bg);
  font-size: 0.9rem;
  font-weight: 500;
}
.btn:hover { background: var(--accent-hover); border-color: var(--accent-hover); color: var(--bg); text-decoration: none; }
.btn-outline { background: transparent; color: var(--accent); }
.btn-outline:hover { background: transparent; color: var(--accent-hover); }

.social-icons { display: flex; gap: 1rem; font-size: 1.15rem; }
.social-icons a { color: var(--text-muted); }
.social-icons a:hover { color: var(--text); text-decoration: none; }

.tag-list { list-style: none; display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 0.5rem 0 0; padding: 0; }
.tag {
  display: inline-block;
  padding: 0.1rem 0.55rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--text-muted);
  font-size: 0.75rem;
}
a.tag:hover { color: var(--accent); border-color: var(--accent); text-decoration: none; }

.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; }
.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.card-image { display: block; width: 100%; aspect-ratio: 16 / 10; object-fit: cover; background: var(--code-bg); }
.card-image.contain { object-fit: contain; padding: 1rem; }
.card-body { display: flex; flex: 1; flex-direction: column; gap: 0.5rem; padding: 1rem 1.1rem 1.25rem; }
.card-body h3 { margin: 0; }
.card-body p { margin: 0; color: var(--text-muted); font-size: 0.92rem; }
.card-link { margin-top: auto; font-size: 0.9rem; }

.panel { padding: 1.25rem; background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius); }
.panel > :first-child { margin-top: 0; }

.caption { color: var(--text-muted); font-size: 0.85rem; font-style: italic; }

.link-list { list-style: none; margin: 0; padding: 0; }
.link-list li { padding: 0.55rem 0; border-bottom: 1px solid var(--border); }
.link-list li:last-child { border-bottom: 0; }
.link-list .meta { display: block; color: var(--text-muted); font-size: 0.85rem; }

.two-col { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; align-items: start; }
.grid-2 { display: grid; grid-template-columns: 1.6fr 1fr; gap: 2rem; align-items: start; }

/* ---------- Home page ---------- */

.hero { display: flex; gap: 2rem; align-items: center; padding: 1rem 0; }
.hero-photo { flex-shrink: 0; width: 160px; height: 160px; object-fit: cover; border: 1px solid var(--border); border-radius: 50%; }
.hero h1 { margin-bottom: 0.3rem; }
.hero-lead { margin: 0 0 1.25rem; color: var(--text-muted); }
.hero-links { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.25rem; }

/* ---------- Research page ---------- */

.feature { display: grid; grid-template-columns: 1fr 1.4fr; gap: 2rem; align-items: start; padding: 2rem 0; border-bottom: 1px solid var(--border); }
.feature:last-of-type { border-bottom: 0; }
.feature img { border: 1px solid var(--border); border-radius: var(--radius); }
.feature h2 { margin-top: 0; scroll-margin-top: 4.5rem; }

/* ---------- CV page ---------- */

.cv-list { margin: 0 0 1rem; }
.cv-row { display: grid; grid-template-columns: 9rem 1fr; gap: 1rem; padding: 0.6rem 0; border-bottom: 1px solid var(--border); }
.cv-row:last-child { border-bottom: 0; }
.cv-date { color: var(--text-muted); font-size: 0.9rem; font-variant-numeric: tabular-nums; }

/* ---------- Notes ---------- */

.prose { max-width: var(--prose-width); }

.post-list { list-style: none; margin: 0; padding: 0; }
.post-list > li { padding: 1.1rem 0; border-bottom: 1px solid var(--border); }
.post-link { font-size: 1.1rem; font-weight: 600; }
.post-meta { margin: 0.2rem 0 0; color: var(--text-muted); font-size: 0.85rem; }
.post-description { margin: 0.35rem 0 0; }

.post-back { margin: 0 0 1rem; font-size: 0.9rem; }
.post-header { margin-bottom: 2rem; }
.post-header h1 { margin-bottom: 0.4rem; }
.post img { border-radius: var(--radius); }
.post blockquote { margin: 1.5rem 0; padding: 0.2rem 1rem; border-left: 3px solid var(--accent); color: var(--text-muted); }
.post table { width: 100%; border-collapse: collapse; }
.post th, .post td { padding: 0.4rem 0.7rem; border: 1px solid var(--border); text-align: left; }

.tag-section h2 { scroll-margin-top: 4.5rem; }
.tag-count { color: var(--text-muted); font-size: 1rem; font-weight: 400; }

/* ---------- Code ---------- */

code, pre { font-family: var(--font-mono); font-size: 0.85rem; }
:not(pre) > code { padding: 0.1rem 0.35rem; background: var(--panel); border: 1px solid var(--border); border-radius: 4px; }
pre { overflow-x: auto; padding: 1rem; line-height: 1.5; background: var(--code-bg); border: 1px solid var(--border); border-radius: var(--radius); }

/* Syntax highlighting colors (Rouge) */
.highlight .c, .highlight .c1, .highlight .cm, .highlight .cs { color: #6b7380; font-style: italic; }
.highlight .k, .highlight .kd, .highlight .kn, .highlight .kr, .highlight .kc, .highlight .ow { color: #9d8cc9; }
.highlight .s, .highlight .s1, .highlight .s2, .highlight .sb, .highlight .sd, .highlight .si { color: #9cbf8a; }
.highlight .m, .highlight .mi, .highlight .mf { color: #d4a857; }
.highlight .nf, .highlight .fm { color: #7aa2c8; }
.highlight .nc, .highlight .nn { color: #7fb5b5; }
.highlight .nb, .highlight .bp { color: #c49a7a; }
.highlight .o, .highlight .p { color: #b8bfc7; }

/* ---------- Small screens ---------- */

@media (max-width: 760px) {
  .nav-toggle { display: block; }
  .nav-links {
    display: none;
    position: absolute;
    top: 3.5rem;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    padding: 0.5rem 1.25rem 1rem;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }
  .nav-links.open { display: flex; }
  .nav-links a { display: block; padding: 0.5rem 0; font-size: 1rem; }
  .nav-links a.current { border-bottom: 0; color: var(--accent); }

  .hero { flex-direction: column; text-align: center; }
  .hero-links, .hero .social-icons { justify-content: center; }
  .feature, .two-col, .grid-2 { grid-template-columns: 1fr; }
  .cv-row { grid-template-columns: 1fr; gap: 0.1rem; }
  .footer-inner { flex-direction: column; gap: 0.75rem; }
}
```

- [ ] **Step 11: Rewrite `Hood_data.html` on the new layout (same content)**

```html
---
layout: default
title: Data
---
<header class="page-header">
  <h1>Data</h1>
</header>

<h3>Available Data Coming Soon</h3>
```

- [ ] **Step 12: Install gems and run the check**

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle config set --local path vendor/bundle
bundle install
./check-site.sh
```
Expected: build succeeds. html-proofer may report errors **only** in files not converted yet (`index.html`, `Hood_CV.html`, `Hood_research.html`, `Hood_outreach.html`, `Hood_resources.html`, `outreach.html`, `normal_files/*`). No errors in `Hood_data.html`.

Also run: `grep -c 'nav-links' _site/Hood_data.html` → Expected: `1` or more (shared nav present).

- [ ] **Step 13: Commit**

```bash
git add Gemfile Gemfile.lock .gitignore check-site.sh _config.yml _layouts _includes assets/css/site.css assets/js/site.js Hood_data.html
git commit -m "Set up Jekyll with shared dark layout; convert Data page"
```

---

### Task 2: Home page

**Files:**
- Modify: `index.html` (full rewrite, same text content)

**Interfaces:**
- Consumes: `layout: default`, CSS classes from Task 1, `site.social.*`, `site.email`, `site.publications_url`.
- Produces: `index.html` with a `<!-- RECENT_NOTES -->` marker comment between the Publications and Outreach sections, where Task 4 inserts the Recent Notes section. Research card links point to `Hood_research.html#spt-agn-monitoring`, `#mkid-microstrips`, `#blazars` (anchors created in Task 3).

Content changes vs. current page: typing animation, stat counters, particles, avatar glow, and scroll-reveal are removed. The nav's broken `#publications` link becomes a real Publications section linking to NASA ADS. The broken favicon/apple-touch-icon links (files don't exist) are dropped. The custom JSON-LD block is replaced by `jekyll-seo-tag`'s output.

- [ ] **Step 1: Rewrite `index.html`**

```html
---
layout: default
title: Astrophysicist & Researcher
description: >-
  John C. Hood II - Astrophysicist and postdoctoral researcher at University of
  Chicago specializing in time-domain astronomy, AGN monitoring, and millimeter
  wavelength observations.
---
<section class="hero">
  <img class="hero-photo" src="{{ '/images/best_frontpage.png' | relative_url }}" alt="John C. Hood II">
  <div>
    <h1>John C. Hood II</h1>
    <p class="hero-lead">
      Postdoctoral Researcher at University of Chicago<br>
      Specializing in Time-Domain Astronomy &amp; Experimental Cosmology
    </p>
    <div class="hero-links">
      <a class="btn" href="{{ '/Hood_research.html' | relative_url }}">Research</a>
      <a class="btn btn-outline" href="{{ '/Hood_CV.html' | relative_url }}">CV</a>
      <a class="btn btn-outline" href="{{ '/notes/' | relative_url }}">Notes</a>
    </div>
    <div class="social-icons">
      <a href="{{ site.social.github }}" aria-label="GitHub"><i class="fab fa-github"></i></a>
      <a href="{{ site.social.linkedin }}" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
      <a href="{{ site.social.orcid }}" aria-label="ORCID"><i class="fab fa-orcid"></i></a>
      <a href="mailto:{{ site.email }}" aria-label="Email"><i class="fas fa-envelope"></i></a>
    </div>
  </div>
</section>

<section class="section" id="about">
  <h2>About Me</h2>
  <p class="section-lead">Passionate about understanding the dynamic universe through cutting-edge research</p>

  <div class="grid-2">
    <div>
      <p>
        I'm John Hood, an astronomer and current postdoctoral researcher at the University of Chicago.
        My work focuses on understanding the dynamic universe, with a particular interest in time-domain
        astronomy and the physics driving transient astrophysical phenomena.
      </p>
      <p>
        I combine observational data with statistical and machine learning techniques to uncover patterns
        in variable and flaring sources. Passionate about both discovery and data, I aim to develop
        tools that push the boundaries of how we observe and interpret the cosmos.
      </p>
      <h4>Research Interests</h4>
      <ul class="tag-list">
        <li><span class="tag">Millimeter Transients (AGN)</span></li>
        <li><span class="tag">MKID and TES Detector Development</span></li>
        <li><span class="tag">Machine Learning &amp; AI</span></li>
        <li><span class="tag">Astronomical Instrumentation</span></li>
        <li><span class="tag">Experimental Cosmology</span></li>
      </ul>
    </div>

    <div class="panel">
      <h4>Current Position</h4>
      <p><strong>Heising-Simons Fellow</strong><br>
        University of Chicago<br>
        <span class="muted">2022 - Present</span></p>
      <p>
        <i class="fas fa-envelope"></i> <a href="mailto:{{ site.email }}">{{ site.email }}</a><br>
        <i class="fas fa-map-marker-alt"></i> ERC 533, Chicago, IL
      </p>
    </div>
  </div>
</section>

<section class="section" id="research">
  <h2>Research</h2>
  <p class="section-lead">Exploring the dynamic universe through cutting-edge observational techniques</p>

  <div class="card-grid">
    <article class="card">
      <img class="card-image" src="{{ '/images/PKS_2326_502.png' | relative_url }}" alt="SPT-Pol AGN Monitoring" loading="lazy">
      <div class="card-body">
        <h3>SPT-Pol AGN Monitoring</h3>
        <p>Millimeter wavelength monitoring of Active Galactic Nuclei using South Pole Telescope data.
          Developing observational pipelines for AGN variability studies in the mm band.</p>
        <ul class="tag-list">
          <li><span class="tag">AGN</span></li>
          <li><span class="tag">SPT</span></li>
          <li><span class="tag">Millimeter Astronomy</span></li>
        </ul>
        <a class="card-link" href="{{ '/Hood_research.html#spt-agn-monitoring' | relative_url }}">Learn more &rarr;</a>
      </div>
    </article>

    <article class="card">
      <img class="card-image" src="{{ '/images/FullWafer.jpg' | relative_url }}" alt="MKID Detector Development" loading="lazy">
      <div class="card-body">
        <h3>MKID Detector Development</h3>
        <p>Low loss microstrip materials with MKIDs for microwave applications.
          Characterizing dielectric loss of various microstrip materials and substrates.</p>
        <ul class="tag-list">
          <li><span class="tag">Instrumentation</span></li>
          <li><span class="tag">MKIDs</span></li>
          <li><span class="tag">Detectors</span></li>
        </ul>
        <a class="card-link" href="{{ '/Hood_research.html#mkid-microstrips' | relative_url }}">Learn more &rarr;</a>
      </div>
    </article>

    <article class="card">
      <img class="card-image" src="{{ '/images/aas1954-388.jpg' | relative_url }}" alt="Blazar Analysis" loading="lazy">
      <div class="card-body">
        <h3>Multi-wavelength Blazar Analysis</h3>
        <p>Studying multi-wavelength observations of Fermi bright blazars to search for
          optical and gamma-ray orphan flares using SMARTS and Fermi data.</p>
        <ul class="tag-list">
          <li><span class="tag">Blazars</span></li>
          <li><span class="tag">Multi-wavelength</span></li>
          <li><span class="tag">Fermi</span></li>
        </ul>
        <a class="card-link" href="{{ '/Hood_research.html#blazars' | relative_url }}">Learn more &rarr;</a>
      </div>
    </article>
  </div>
</section>

<section class="section" id="projects">
  <h2>Projects</h2>
  <p class="section-lead">Welcome to my projects. Whether you are looking to analyze compiled observational data, play through the path from undergrad to PI, or review my open-source code, you can explore my recent work below.</p>

  <div class="card-grid">
    <article class="card">
      <a href="https://spt3g.ncsa.illinois.edu/datasets/spt_agn_lightcurves/">
        <img class="card-image contain" src="{{ '/images/strawhat_logo.png' | relative_url }}" alt="STRAWHAT Catalog" loading="lazy">
      </a>
      <div class="card-body">
        <h3><a href="https://spt3g.ncsa.illinois.edu/datasets/spt_agn_lightcurves/">STRAWHAT Catalog</a></h3>
        <p>Public data catalog of SPTpol AGN light curves &mdash; multi-frequency millimeter-wavelength monitoring data released for the broader astronomy community.</p>
        <ul class="tag-list">
          <li><span class="tag">Data Catalog</span></li>
          <li><span class="tag">SPTpol</span></li>
          <li><span class="tag">AGN</span></li>
          <li><span class="tag">Light Curves</span></li>
        </ul>
      </div>
    </article>

    <article class="card">
      <a href="https://johnchood2.github.io/sci-runner/">
        <img class="card-image contain" src="{{ '/images/sci-runner-logo.jpeg' | relative_url }}" alt="sci-runner" loading="lazy">
      </a>
      <div class="card-body">
        <h3><a href="https://johnchood2.github.io/sci-runner/">sci-runner</a></h3>
        <p>Browser based runner for learning about academic career path and research.</p>
        <ul class="tag-list">
          <li><span class="tag">HTML</span></li>
          <li><span class="tag">Education</span></li>
          <li><span class="tag">Open Source</span></li>
          <li><span class="tag">Reproducibility</span></li>
        </ul>
      </div>
    </article>

    <article class="card">
      <a href="{{ site.social.github }}">
        <img class="card-image contain" style="background: #24292f;" src="{{ '/images/GitHub_Invertocat_White_Clearspace.png' | relative_url }}" alt="GitHub" loading="lazy">
      </a>
      <div class="card-body">
        <h3><a href="{{ site.social.github }}">GitHub</a></h3>
        <p>Repositories for research code, tools, and side projects.</p>
        <ul class="tag-list">
          <li><span class="tag">Open Source</span></li>
          <li><span class="tag">Code</span></li>
          <li><span class="tag">Research</span></li>
        </ul>
      </div>
    </article>
  </div>
</section>

<section class="section" id="publications">
  <h2>Publications</h2>
  <p class="section-lead">A full, up-to-date list of my publications is on NASA ADS.</p>
  <p>
    <a class="btn" href="{{ site.publications_url }}">My Publications (NASA ADS)</a>
    <a class="btn btn-outline" href="{{ site.social.orcid }}">ORCID</a>
  </p>
</section>

<!-- RECENT_NOTES -->

<section class="section" id="outreach">
  <h2>Outreach &amp; Media</h2>
  <p class="section-lead">Sharing astronomy and research through interviews, podcasts, and public engagement</p>

  <p>
    I'm passionate about making astronomy accessible to everyone. Through interviews, podcasts,
    and public talks, I share the excitement of astronomical research and the importance of
    scientific discovery with diverse audiences.
  </p>

  <div class="card-grid">
    <div class="panel">
      <h4><i class="fas fa-microphone"></i> Podcasts &amp; Interviews</h4>
      <ul class="link-list">
        <li><a href="https://podcasters.spotify.com/pod/show/mentality-unchained/episodes/The-Color-of-Astrophysics-e1k98gs/a-a8591ir">MENtality Unchained - "The Color of Astrophysics"</a>
          <span class="meta">2022 - Podcast discussion on diversity in astrophysics</span></li>
        <li><a href="https://soundcloud.com/ethan-siegel-172073460/starts-with-a-bang-87-agns-from-the-south-pole">Starts With a Bang Podcast</a>
          <span class="meta">2022 - AGNs from the South Pole discussion</span></li>
        <li><a href="https://youtu.be/J0_PLFRlM_U">Bad Astra Interview</a>
          <span class="meta">2021 - Career journey and research insights</span></li>
      </ul>
    </div>

    <div class="panel">
      <h4><i class="fas fa-newspaper"></i> Articles &amp; Features</h4>
      <ul class="link-list">
        <li><a href="https://www.ledger-enquirer.com/news/local/education/article276570156.html">Columbus Ledger Enquirer</a>
          <span class="meta">2023 - "Nothing less than amazing" feature article</span></li>
        <li><a href="https://aps.org/publications/apsnews/202305/nuclei.cfm">APS News Profile</a>
          <span class="meta">2023 - American Physical Society feature</span></li>
        <li><a href="https://www.nature.com/articles/s41550-025-02577-9">Nature Astronomy - "Black in cosmology"</a>
          <span class="meta">2025 - Comment article on diversity in cosmology</span></li>
      </ul>
    </div>

    <div class="panel">
      <h4><i class="fas fa-graduation-cap"></i> Academic Presentations</h4>
      <ul class="link-list">
        <li><a href="https://www.youtube.com/watch?v=8wlFuW0tClE">CU Boulder Friday Seminar</a>
          <span class="meta">2024 - Research presentation on AGN monitoring</span></li>
        <li><a href="https://youtu.be/PU6EuIbuffw">PhD Defense Presentation</a>
          <span class="meta">2022 - Doctoral defense on multi-wavelength blazar analysis</span></li>
      </ul>
    </div>

    <div class="panel">
      <h4><i class="fas fa-music"></i> Creative Projects</h4>
      <ul class="link-list">
        <li><a href="https://youtu.be/3A8lrW_jqbk">Astronomy Music Video</a>
          <span class="meta">2016 - "I Stayed up late to watch the stars"</span></li>
      </ul>
    </div>
  </div>

  <p><a href="{{ '/Hood_outreach.html' | relative_url }}">More about my outreach &rarr;</a></p>
</section>

<section class="section" id="contact">
  <h2>Get In Touch</h2>
  <p class="section-lead">Let's discuss research opportunities, collaborations, or just chat about astronomy</p>
  <div class="panel">
    <p><i class="fas fa-envelope"></i> <strong>Email</strong>: <a href="mailto:{{ site.email }}">{{ site.email }}</a></p>
    <p><i class="fas fa-map-marker-alt"></i> <strong>Office</strong>: ERC 533, University of Chicago</p>
    <p><i class="fas fa-university"></i> <strong>Institution</strong>: University of Chicago</p>
  </div>
</section>
```

- [ ] **Step 2: Build and check**

Run: `./check-site.sh`
Expected: no errors in `index.html` **except** the three `Hood_research.html#...` hash links (anchors are added in Task 3). Errors in other unconverted files are expected.

Run: `grep -cE 'typing-text|counter|particle' _site/index.html` → Expected: `0`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "Rebuild home page on shared layout with calmer style"
```

---

### Task 3: Research, CV, Outreach, and Resources pages

**Files:**
- Modify: `Hood_research.html`, `Hood_CV.html`, `Hood_outreach.html`, `Hood_resources.html` (full rewrites, same content)

**Interfaces:**
- Consumes: `layout: default`, CSS classes from Task 1, `site.publications_url`.
- Produces: anchors `#spt-agn-monitoring`, `#mkid-microstrips`, `#blazars`, `#observatory-technician`, `#solar-observer` on `Hood_research.html` (used by Task 2's home page).

Content notes: old per-page footers (including the wrong "© Victor Calderon (2017)" on the Data page) are replaced by the shared footer. The `place holder` link at the end of the Outreach links list is dropped. The old "My Publications" call-to-action banner is kept only on the Research page.

- [ ] **Step 1: Rewrite `Hood_research.html`**

```html
---
layout: default
title: Research
---
<header class="page-header">
  <h1>Research</h1>
</header>

<section class="feature">
  <img src="{{ '/images/PKS_2326_502.png' | relative_url }}" alt="Light curves for FSRQ PKS 2326-502">
  <div>
    <h2 id="spt-agn-monitoring">SPT-Pol AGN Monitoring</h2>
    <p>
      While continuous high-cadence monitoring of active galactic nuclei (AGN) is common at gamma-rays, optical, and radio wavelengths, AGN monitoring in the millimeter (mm) band has mostly been restricted to short campaigns on targeted sources.Cosmic microwave background (CMB) experiments can now monitor these objects daily in increasingly large areas of sky. We present temporal monitoring of the active galactic nuclei PKS2326-502 from month/year to month/year with a temporal resolution of 36 hours. The flux of PKS 2326-502 is measured at high significance in each 36 hour period (typically S/N = 221.45 --- 2052.45). We use SPT 150 GHz observations to create AGN light curves in the mm band and compare those to light curves at other wavelengths, in particular gamma-rays and optical. our focus source is the blazar-type AGN PKS 2326-502, which has extensive, day-timescale monitoring at gamma-rays, optical, and millimeter wavelengths between 2013 and 2016. We find PKS 2326-502 to be in a flaring state in the first two years of this monitoring, and we present a search for evidence of correlated variability between SPT (150 GHz), SMARTS (R band) and Fermi (gamma-rays) observations. This pilot study paves the way for far larger AGN monitoring campaigns with current and upcoming CMB experiments such as SPT-3G, Simons Observatory, and CMB-S4. These mm-wavelength AGN monitoring campaigns will enhance multi-wavelength studies with facilities such as VRO-LSST.
    </p>
    <p class="caption"><b>Figure</b>: Light curves for FSRQ PKS 2326-502. top: Fermi-LAT; middle: SMARTS optical R; bottom: SPT 150GHz. here we can see long-timescale correlation between mm and gamma-ray observations and short-timescale correlations between the optical and gamma-ray observations.</p>
  </div>
</section>

<section class="feature">
  <img src="{{ '/images/FullWafer.jpg' | relative_url }}" alt="CMB-S4 OMT/TES detector array">
  <div>
    <h2 id="mkid-microstrips">Low loss microstrip materials with MKIDs for microwave applications</h2>
    <p>
      Future measurements of the millimeter-wavelength sky require a low-loss superconducting microstrip coupling the antenna to detectors, typically made from niobium and silicon-nitride. We propose a simple device for characterizing these low-loss microstrips at 150 GHz. In our device we illuminate an antenna with a thermal source and compare the measured power at 150 GHz transmitted down microstrips of different lengths. The power measurement is made using Microwave Kinetic Inductance Detectors (MKIDs) fabricated directly onto the microstrip dielectric, and comparing the measured response provides a direct measurement of the microstrip loss. Our proposed structure provides a simple device (4 layers and a DRIE etch) for characterizing the dielectric loss of various microstrip materials and substrates. We present initial results using these devices.
    </p>
    <p class="caption"><b>Figure</b>:CMB-S4 OMT/TES detector array ~150 mm across.</p>
  </div>
</section>

<section class="feature">
  <img src="{{ '/images/aas1954-388.jpg' | relative_url }}" alt="Optical and Fermi gamma-ray lightcurves of PKS 1954-388">
  <div>
    <h2 id="blazars">SMARTS/ Fermi-LAT Blazars</h2>
    <p>
      My masters research focused on studying the multiwavelength observations of Fermi bright blazars in order to search for optical and Gamma-ray orpan flares. All optical data was taken form the SMARTS-Yale collaboration <a href="http://www.astro.yale.edu/smarts/glast/home.php">SMARTS</a> and the Fermi monitored soure list <a href="https://fermi.gsfc.nasa.gov/ssc/data/access/lat/msl_lc/">Fermi</a>.
    </p>
    <p class="caption"><b>Figure</b>: Optical and Fermi gamma-ray lightcurves of PKS 1954-388 from August 2008 - May 2017. The grey hatched region at approximately MJD 55400-55600 represents a candidate orphan optical flare that requires further analysis, as this source was not on the Fermi quick-look data monitoring list (i.e. a minimum reported gamma-ray flux of 1x 10-6 ph cm-2 s-1 ) at the time of the first reporting of SMARTS B-band data. However, as can be seen at approximately MJD 56800-56900 region, another candidate orphan optical flare is evident, which occurred after PKS 1954-388 reached the minimal Fermi flux to be included on the Fermi monitored source list.</p>
  </div>
</section>

<section class="feature">
  <img src="{{ '/images/Apojee_delta.jpg' | relative_url }}" alt="Filter wheel of the Apogee Delta camera">
  <div>
    <h2 id="observatory-technician">Observatory Technician</h2>
    <p>
      As the observatory tech. my job was to maintain the telescope and observatories functionality during observing runs, both night and day time and resolve any issues that occured.
    </p>
    <p class="caption"><b>Figure</b>: Inside look int the filter wheel of the Apogee Delt camera that is currently being used on the WestRock Observatory.</p>
  </div>
</section>

<section class="feature">
  <img src="{{ '/images/sunny.jpg' | relative_url }}" alt="Processed image of the sun from the WestRock Observatory">
  <div>
    <h2 id="solar-observer">Solar Observer and Astro-Education Outreach</h2>
    <p>
      As a part of a team of student observers, we conducted daily observations of the sun in order to track solar activity for a total of 4 years while working under the Georgia Space Grant consortium <a href="http://www.gasgc.org">GASGC</a>. During this time I was also a member of the education outreach team where we traveled to elementary schools in the tri-county area and Atlanta to show mobile planitaruim shows and conduct physics demos for students.
    </p>
    <p class="caption"><b>Figure</b>: Procesed image of the sun as taken from the WestRock Observatory during one of my observing runs.</p>
  </div>
</section>

<section class="section">
  <p><a class="btn" href="{{ site.publications_url }}"><i class="fas fa-circle-info"></i> My Publications</a></p>
</section>
```

- [ ] **Step 2: Rewrite `Hood_CV.html`**

```html
---
layout: default
title: Curriculum Vitae
---
<header class="page-header">
  <h1>Curriculum Vitae</h1>
  <p><a class="btn" href="{{ '/Docs/John_Hood_CV.pdf' | relative_url }}"><i class="fas fa-file-pdf"></i> Download PDF</a></p>
</header>

<h2>Academic Career</h2>
<div class="cv-list">
  <div class="cv-row">
    <div class="cv-date">2017 - 2022</div>
    <div>Ph.D in Astrophysics<br>
      Advisor: <a href="http://astro.phy.vanderbilt.edu/~holleyjk/">Prof. Kelly Holley-Bockelmann</a><br>
      <a href="http://www.vanderbilt.edu/">Vanderbilt University</a></div>
  </div>
  <div class="cv-row">
    <div class="cv-date">2015 - 2017</div>
    <div>MA Physics<br>
      <a href="https://www.fisk-vanderbilt-bridge.org/">Fisk University, Fisk-Vanderbilt Masters-to-PhD Bridge Program</a></div>
  </div>
  <div class="cv-row">
    <div class="cv-date">2009 - 2014</div>
    <div>BS, Astrophysics &amp; Planetary Geology<br>
      <a href="http://www.columbusstate.edu/">Columbus State University</a></div>
  </div>
</div>

<h2>Scholarships, Honors, and Awards</h2>
<div class="cv-list">
  <div class="cv-row"><div class="cv-date">2022</div><div>NSF-OPP Postdoctoral Research Fellowship</div></div>
  <div class="cv-row"><div class="cv-date">2020</div><div>DOE-SCGSR Fellowship</div></div>
  <div class="cv-row"><div class="cv-date">2016</div><div>Dunlap Institute Instrumentation Summerschool Travel Award</div></div>
  <div class="cv-row"><div class="cv-date">2014</div><div>Larry M. Pollatta Student Acheivement Award</div></div>
</div>

<h2>Community and Professional Services</h2>
<div class="cv-list">
  <div class="cv-row"><div class="cv-date">2019-2021</div><div>Astronomy conversation volunteer, Adler Planetaruim</div></div>
  <div class="cv-row"><div class="cv-date">Nov - Dec(2019)</div><div>South Pole Station Deployment, University of Chicago South Pole Telescope research deployment</div></div>
  <div class="cv-row"><div class="cv-date">2017-2018</div><div>Astronomy and Robotics Instructor for SSMV <a href="http://vandyastroml.github.io/2017_Spring_Vandy_Computational_Workshop.html">School for Science and Math at Vanderbilt Center for Science Outreach</a> at <a href="https://www.vanderbilt.edu/cso/ssmv/">Vanderbilt University</a></div></div>
  <div class="cv-row"><div class="cv-date">2016</div><div>Student Attendee for the <a href="http://www.dunlap.utoronto.ca/training/summer-school/">Dunlap Insititute Astronomy Instrumentation Summer School</a></div></div>
</div>
```

- [ ] **Step 3: Rewrite `Hood_outreach.html`**

```html
---
layout: default
title: Outreach & Media
---
<header class="page-header">
  <h1>Welcome to my outreach page!</h1>
  <p class="page-lead">Along with doing research, I love doing public outreach when possible.</p>
</header>

<div class="two-col">
  <article>
    <img src="{{ '/images/southpole.jpg' | relative_url }}" alt="John at the ceremonial south pole">
    <p class="caption">Me at the ceremonial south pole</p>

    <h3>A little bit about me (Academic Background)</h3>
    <p>In 2014, after completing my BS in Astrophysics and Planetary Geology, I joined the staff of Columbus State University’s Coca-Cola Space Science Center to ground myself in an environment that focused on astronomy research and educational outreach. While physics—a subject new to me—was interesting, I enjoyed applying physical concepts to understand astronomical problems. I did very well in projects, independent study courses, research, workshops, and class discussions and presentations throughout my undergraduate career, and in doing so I was noted by faculty as one of the most inspirational students in the department and received an award via the Institute of Museum and Library Services grant. The award was for a project I led, acquiring, installing, and operating the WestRock Observatory’s new robotic telescope. Upon graduating with my B.Sc. in Astronomy, I accepted a staff position at Columbus State University's Coca-Cola Space Science Center as the observatory technician of the WestRock Observatory. This grant is where I learned to apply the principles of observational techniques and robotics to ongoing scientific projects. The project was an invaluable experience, which further deepened my passion for astronomical research. After taking one year to focus on my position as observatory technician, I joined the Fisk-Vanderbilt Master’s-to-Ph.D. Bridge Program to broaden my perspectives and to improve my career prospects. Now, as a student in this program working with Dr. Isler at Vanderbilt University along with collaborators at Yale University, I have been able to extend my knowledge of the field of multi-wavelength observations by studying blazars that are a part of the Yale/SMARTS multi-wavelength monitoring system. These blazars are radio-loud active galactic nuclei known for producing flares that peak in optical, infrared, and gamma-ray frequencies. In monitoring the Yale/SMARTS blazar catalog, there has been a discovery of what we call orphan flares. These are optical and near-infrared flares that have no accompanying gamma-ray counterpart. The discovery of this phenomenon was studied in Chatterjee et al. 2012 and has led my research in identifying other orphan flares in the history of other blazars in the monitored sources list.</p>
  </article>

  <aside class="panel">
    <h3>Links to previous interviews, podcasts and fun videos</h3>
    <ul class="link-list">
      <li><a href="https://www.youtube.com/watch?v=8wlFuW0tClE">CU Boulder Friday Seminar talk (2024)</a></li>
      <li><a href="https://www.ledger-enquirer.com/news/local/education/article276570156.html">Nothing less than amazing [Columbus Ga. Ledger Enquirer Article](2023)</a></li>
      <li><a href="https://aps.org/publications/apsnews/202305/nuclei.cfm">APS News Profile (2023)</a></li>
      <li><a href="https://youtu.be/PU6EuIbuffw">My Ph.D Defense (2022)</a></li>
      <li><a href="https://soundcloud.com/ethan-siegel-172073460/starts-with-a-bang-87-agns-from-the-south-pole">Starts With a Bang Podcast (2022)</a></li>
      <li><a href="https://youtu.be/J0_PLFRlM_U">Bad Astra Interview (2021)</a></li>
      <li><a href="https://youtu.be/3A8lrW_jqbk">I Stayed up late to watch the stars music video (2016)</a></li>
    </ul>
  </aside>
</div>
```

- [ ] **Step 4: Rewrite `Hood_resources.html`**

```html
---
layout: default
title: Useful Resources
---
<header class="page-header">
  <h1>Useful Resources</h1>
  <p class="page-lead">This is a set of resources that anyone can use.</p>
</header>

<div class="card-grid">
  <section class="panel">
    <h3>General</h3>
    <ul class="link-list">
      <li><a href="http://www.vanderbilt.edu/">Vanderbilt University</a></li>
      <li><a href="http://as.vanderbilt.edu/astronomy/">Vanderbilt Astronomy Group</a></li>
    </ul>
  </section>

  <section class="panel">
    <h3>Version Control</h3>
    <ul class="link-list">
      <li><a href="https://github.com/">Github Website</a></li>
      <li><a href="https://guides.github.com/">Github Guides &amp; Tutorials</a></li>
      <li><a href="https://www.atlassian.com/git/tutorials/">Git Tutorials &amp; training</a> by Atlassian</li>
    </ul>
  </section>

  <section class="panel">
    <h3>Coding</h3>
    <ul class="link-list">
      <li><a href="https://www.codecademy.com/learn/python">Python Course</a> by Codecademy</li>
      <li><a href="http://learnpythonthehardway.org/">Learn Python the Hard Way</a> - Free online course on Python</li>
      <li><a href="http://www.astroml.org/">AstroML</a>: Machine Learning and Data Mining for Astronomy</li>
    </ul>
  </section>

  <section class="panel">
    <h3>LaTeX</h3>
    <ul class="link-list">
      <li><a href="https://www.sharelatex.com/learn/Learn_LaTeX_in_30_minutes">Learn LaTeX in 30 minutes</a></li>
    </ul>
  </section>

  <section class="panel">
    <h3>Papers</h3>
    <ul class="link-list">
      <li><a href="http://arxiv.org/abs/1609.00037">"Good Enough Practices in Scientific Computing"</a> by Greg Wilson et al. (2016)</li>
      <li><a href="https://arxiv.org/abs/1610.04546">"Ten Simple Rules for Making Research Software More Robust"</a> by Morgan Taschuk et al. (2017)</li>
      <li><a href="http://www.nature.com/news/interactive-notebooks-sharing-the-code-1.16261">Interactive Notebooks: Sharing the Code</a> by Helen Shen</li>
    </ul>
  </section>
</div>
```

- [ ] **Step 5: Build and check**

Run: `./check-site.sh`
Expected: no errors in `index.html`, `Hood_*.html`. Remaining errors (if any) only in `outreach.html` and `normal_files/*`, which Task 5 deletes.

Run: `grep -L 'nav-links' _site/Hood_*.html _site/index.html` → Expected: no output (every page has the shared nav).

- [ ] **Step 6: Commit**

```bash
git add Hood_research.html Hood_CV.html Hood_outreach.html Hood_resources.html
git commit -m "Move Research, CV, Outreach, and Resources pages to new layout"
```

---

### Task 4: Notes blog (layout, list, tags, template, sample post, Recent Notes on home)

**Files:**
- Create: `_layouts/post.html`, `_includes/post-list.html`, `_includes/tag-list.html`
- Create: `notes/index.html`, `notes/tags.html`
- Create: `_templates/post-template.md`, `_posts/2026-09-29-welcome-to-my-notes.md`
- Modify: `index.html` (replace `<!-- RECENT_NOTES -->` marker)

**Interfaces:**
- Consumes: `layout: default`, `.post*`, `.tag*`, `.prose` classes from Task 1; `<!-- RECENT_NOTES -->` marker from Task 2.
- Produces: `{% include post-list.html posts=ARRAY %}` renders a list of posts; `{% include tag-list.html tags=ARRAY %}` renders tag links to `/notes/tags.html#<slugified-tag>`. Post front matter: `title`, `date`, `tags` (list, optional), `description` (optional).

- [ ] **Step 1: Create `_includes/tag-list.html`**

```html
{% comment %}
  Shows a row of tag links. Usage: {% include tag-list.html tags=page.tags %}
  Renders nothing when there are no tags.
{% endcomment %}
{% if include.tags and include.tags.size > 0 %}
<ul class="tag-list">
  {% for tag in include.tags %}
  <li><a class="tag" href="{{ '/notes/tags.html' | relative_url }}#{{ tag | slugify }}">{{ tag }}</a></li>
  {% endfor %}
</ul>
{% endif %}
```

- [ ] **Step 2: Create `_includes/post-list.html`**

```html
{% comment %}
  Shows a list of posts, newest first. Usage: {% include post-list.html posts=site.posts %}
  Reading time assumes about 200 words per minute.
{% endcomment %}
<ul class="post-list">
  {% for post in include.posts %}
  {% assign minutes = post.content | strip_html | number_of_words | divided_by: 200 | at_least: 1 %}
  <li>
    <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <p class="post-meta">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y-%m-%d" }}</time>
      &middot; {{ minutes }} minute read
    </p>
    {% if post.description %}<p class="post-description">{{ post.description }}</p>{% endif %}
    {% include tag-list.html tags=post.tags %}
  </li>
  {% endfor %}
</ul>
```

- [ ] **Step 3: Create `_layouts/post.html`**

```html
---
layout: default
---
{% assign minutes = content | strip_html | number_of_words | divided_by: 200 | at_least: 1 %}
<article class="post prose">
  <header class="post-header">
    <p class="post-back"><a href="{{ '/notes/' | relative_url }}">&larr; All notes</a></p>
    <h1>{{ page.title }}</h1>
    <p class="post-meta">
      <time datetime="{{ page.date | date_to_xmlschema }}">{{ page.date | date: "%B %-d, %Y" }}</time>
      &middot; {{ minutes }} minute read
    </p>
    {% include tag-list.html tags=page.tags %}
  </header>

  {{ content }}
</article>
```

- [ ] **Step 4: Create `notes/index.html` and `notes/tags.html`**

`notes/index.html`:
```html
---
layout: default
title: Notes
description: Notes on things I'm working on and learning.
---
<header class="page-header">
  <h1>Notes</h1>
  <p class="page-lead">Notes on things I'm working on and learning. Browse by <a href="{{ '/notes/tags.html' | relative_url }}">tag</a>.</p>
</header>

{% if site.posts.size > 0 %}
  {% include post-list.html posts=site.posts %}
{% else %}
  <p class="muted">No notes yet.</p>
{% endif %}
```

`notes/tags.html`:
```html
---
layout: default
title: Notes by tag
---
<header class="page-header">
  <h1>Notes by tag</h1>
  <p class="page-lead"><a href="{{ '/notes/' | relative_url }}">&larr; All notes</a></p>
</header>

{% assign tags = site.tags | sort %}

<ul class="tag-list">
  {% for tag in tags %}
  <li><a class="tag" href="#{{ tag[0] | slugify }}">{{ tag[0] }} ({{ tag[1].size }})</a></li>
  {% endfor %}
</ul>

{% for tag in tags %}
<section class="tag-section">
  <h2 id="{{ tag[0] | slugify }}">{{ tag[0] }} <span class="tag-count">({{ tag[1].size }})</span></h2>
  {% include post-list.html posts=tag[1] %}
</section>
{% endfor %}
```

- [ ] **Step 5: Create the template and sample post, then build**

`_templates/post-template.md` (folders starting with `_` are not published unless Jekyll is told about them, so this file stays private):
````markdown
---
# HOW TO USE THIS TEMPLATE
# 1. Copy this file into the _posts/ folder.
# 2. Rename it to YYYY-MM-DD-short-title.md (e.g. 2026-10-05-fitting-light-curves.md).
#    The date in the filename is the publish date. Posts dated in the future are
#    NOT shown until that date.
# 3. Fill in the fields below, replace the section text, and delete any sections
#    you don't need.
title: "What I learned about ..."
date: 2026-01-01
tags: [research, tools]        # any words you like; use [] for no tags
description: "One sentence that appears under the title on the Notes page."
---

<!-- One or two sentences: what is this post about and why should someone read it? -->

## Why I'm looking into this

What problem or question got you started? What did you want to understand?

## Background

The minimum context a reader needs. Link to papers, docs, or earlier notes, for example
[an earlier note]({% post_url 2026-09-29-welcome-to-my-notes %}).

## What I did

Steps, experiments, or the approach you took. Code goes in fenced blocks:

```python
import numpy as np

flux = np.loadtxt("light_curve.txt")
print(flux.mean())
```

Images go in `images/notes/` and are added like this:

![Short description of the figure]({{ '/images/notes/example.png' | relative_url }})

## What I learned

The main takeaways, as a short list:

- First takeaway
- Second takeaway

## Open questions / next steps

- What would you try next?

## References

- [Link title](https://example.com)
````

`_posts/2026-09-29-welcome-to-my-notes.md`:
````markdown
---
title: "Welcome to my Notes"
date: 2026-09-29
tags: [meta]
description: "What this section is for and how posts are organized."
---

This is where I write up things I'm working on and learning: research methods,
tools, papers I'm reading, and whatever else I'm figuring out.

## How posts are organized

Posts are listed newest first on the [Notes]({{ '/notes/' | relative_url }}) page.
Each post has one or more tags, and the [tags page]({{ '/notes/tags.html' | relative_url }})
groups posts by tag.

## A code example

```python
def mean_flux(flux):
    """Return the mean of a light curve."""
    return sum(flux) / len(flux)
```
````

Run: `./check-site.sh`
Expected: build succeeds; the only html-proofer errors (if any) are in `outreach.html` / `normal_files/*`. This covers Review Focus #4 (post pages at nested URLs load CSS/nav/links).

Run: `ls _site/notes/2026/09/29/welcome-to-my-notes/index.html && ls _site/_templates 2>&1 | head -1`
Expected: the post file exists; `_site/_templates` does not exist ("No such file").

- [ ] **Step 6: Check edge cases with temporary posts (Review Focus #1-3)**

Create two temporary posts:

```bash
cat > _posts/2026-09-28-tmp-no-tags.md <<'EOF'
---
title: "Temp no tags"
date: 2026-09-28
---
Body.
EOF
cat > _posts/2026-09-27-tmp-spaced-tag.md <<'EOF'
---
title: "Temp spaced tag"
date: 2026-09-27
tags: [Data Science]
---
Body.
EOF
cat > _posts/2099-01-01-tmp-future.md <<'EOF'
---
title: "Temp future"
date: 2099-01-01
---
Body.
EOF
./check-site.sh
grep -c 'id="data-science"' _site/notes/tags.html
grep -c 'tag-list' _site/notes/2026/09/28/tmp-no-tags/index.html
ls _site/notes/2099 2>&1 | head -1
```
Expected: html-proofer reports no errors in `notes/` files (tag hash links resolve); `1`; `0`; "No such file or directory" (future post not published, as the README will explain).

Then remove them:
```bash
rm _posts/2026-09-28-tmp-no-tags.md _posts/2026-09-27-tmp-spaced-tag.md _posts/2099-01-01-tmp-future.md
```

- [ ] **Step 7: Add Recent Notes to the home page**

In `index.html`, replace the line `<!-- RECENT_NOTES -->` with:

```html
<section class="section" id="notes">
  <h2>Recent Notes</h2>
  {% assign recent_posts = site.posts | slice: 0, 3 %}
  {% if recent_posts.size > 0 %}
    {% include post-list.html posts=recent_posts %}
    <p><a href="{{ '/notes/' | relative_url }}">All notes &rarr;</a></p>
  {% else %}
    <p class="muted">No notes yet.</p>
  {% endif %}
</section>
```

Run: `./check-site.sh && grep -c 'Welcome to my Notes' _site/index.html`
Expected: `1`.

- [ ] **Step 8: Commit**

```bash
git add _layouts/post.html _includes/post-list.html _includes/tag-list.html notes _templates _posts index.html
git commit -m "Add Notes blog with tags, post template, and sample post"
```

---

### Task 5: Remove old template files and add README

**Files:**
- Delete: `outreach.html`, `normal_files/`, `README.txt`
- Delete: `assets/css/main.css`, `assets/css/ie8.css`, `assets/css/ie9.css`, `assets/css/modern.css`, `assets/css/font-awesome.min.css`, `assets/css/images/`
- Delete: `assets/js/util.js`, `assets/js/jquery.dropotron.min.js`, `assets/js/modern.js`, `assets/js/jquery.min.js`, `assets/js/main.js`, `assets/js/skel.min.js`, `assets/js/ie/`
- Delete: `assets/sass/`, `assets/fonts/`
- Create: `README.md`

**Interfaces:**
- Consumes: everything from Tasks 1-4. Nothing in the converted pages references the deleted files.

- [ ] **Step 1: Confirm nothing still references the old files**

Run:
```bash
grep -rnE 'main\.css|modern\.css|modern\.js|skel|dropotron|jquery|normal_files|outreach\.html' \
  --include='*.html' --include='*.md' --include='*.yml' . | grep -v '^./docs/' | grep -v '_site/' | grep -v 'vendor/' | grep -v 'Hood_outreach.html'
```
Expected: only matches inside the files being deleted (`outreach.html`, `normal_files/*`), none in converted pages.

- [ ] **Step 2: Delete the old files**

```bash
git rm -r -q outreach.html normal_files README.txt \
  assets/css/main.css assets/css/ie8.css assets/css/ie9.css assets/css/modern.css \
  assets/css/font-awesome.min.css assets/css/images \
  assets/js/util.js assets/js/jquery.dropotron.min.js assets/js/modern.js \
  assets/js/jquery.min.js assets/js/main.js assets/js/skel.min.js assets/js/ie \
  assets/sass assets/fonts
ls assets/css assets/js
```
Expected: `site.css` and `site.js` only (plus `assets/manifest.json` in `assets/`).

- [ ] **Step 3: Create `README.md`**

````markdown
# johnchood2.github.io

Personal website of John C. Hood II, built with [Jekyll](https://jekyllrb.com/)
and hosted on GitHub Pages. GitHub builds and publishes the site automatically
whenever changes are merged into `master`.

## Where things live

| Path | What it is |
|---|---|
| `_config.yml` | Site title, nav links, social links, settings |
| `_layouts/default.html` | Shared page shell (head, nav, footer) |
| `_layouts/post.html` | Layout for a single Notes post |
| `_includes/` | Reusable pieces: nav, footer, post list, tag list |
| `assets/css/site.css` | All styles. Colors are at the top in `:root` |
| `index.html`, `Hood_*.html` | Site pages |
| `notes/` | Notes list page and tags page |
| `_posts/` | Notes posts (Markdown) |
| `_templates/post-template.md` | Starting point for a new post (not published) |
| `images/`, `Docs/` | Images and PDFs |

## Writing a new Note

1. Copy `_templates/post-template.md` into `_posts/`.
2. Rename it `YYYY-MM-DD-short-title.md`, for example `2026-10-05-fitting-light-curves.md`.
3. Edit the `title`, `date`, `tags`, and `description` at the top, then write the post in Markdown.
4. Put any images in `images/notes/`.
5. Commit, push, and open a pull request (or push to `master` to publish right away).

Notes:
- **Posts dated in the future are not published** until that date (Chicago time).
- Tags can be any words, for example `tags: [research, data science]`.
  Each tag gets a section on the tags page automatically.
- Reading time is calculated automatically.

## Previewing the site locally (optional)

One-time setup (macOS, Homebrew):

```bash
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle config set --local path vendor/bundle
bundle install
```

Then, each time:

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle exec jekyll serve
```

Open http://localhost:4000. Add `--future` to also preview posts with future dates.

To check for broken links and images before opening a pull request:

```bash
./check-site.sh
```
````

- [ ] **Step 4: Build and check the whole site**

Run: `./check-site.sh`
Expected: `HTML-Proofer finished successfully.` with zero failures.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "Remove old template files; add README with Notes instructions"
```

---

### Task 6: Browser verification and pull request

**Files:** none (verification only)

- [ ] **Step 1: Serve the site and check every page at desktop width**

Run `bundle exec jekyll serve` (via the preview tool). Visit `/`, `/Hood_research.html`, `/Hood_CV.html`, `/notes/`, `/notes/tags.html`, the sample post, `/Hood_outreach.html`, `/Hood_data.html`, `/Hood_resources.html`.
Expected on each: dark background `rgb(17, 19, 23)`, nav shows 7 links with the current page underlined in steel blue, images load, no console errors. The CV "Download PDF" link opens `Docs/John_Hood_CV.pdf`. The sample post shows date, "1 minute read", a `meta` tag, and a highlighted code block.

- [ ] **Step 2: Check mobile width (Review Focus #5)**

Resize to 375×812. Expected: nav links hidden, menu button visible; clicking it shows the links; clicking again hides them. Hero stacks vertically; research features and CV rows stack; no horizontal scrolling.

- [ ] **Step 3: Push the branch and open the PR**

```bash
git push -u origin site-revamp
gh pr create --base master --head site-revamp --title "Revamp site: Jekyll, calm dark theme, Notes blog" --body-file <body>
```
The PR body summarizes the changes, lists content notes (dropped placeholder link, removed counters, new Publications section), lists typos noticed but not fixed, and ends with the Claude Code attribution line. Expected: PR URL printed. Do not merge; John reviews and merges.
