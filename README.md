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
| `_planning/` | Design doc and build plan for the 2026 revamp (not published) |
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
