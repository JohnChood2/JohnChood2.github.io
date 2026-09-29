source "https://rubygems.org"

# Jekyll and the two plugins this site uses, pinned to the versions GitHub Pages
# runs (see https://pages.github.com/versions/). If GitHub updates them, bump
# these numbers to match.
#
# We list these directly instead of using the "github-pages" gem, which bundles
# extra plugins we don't use (one of them triggers a Dependabot security alert).
gem "jekyll", "~> 3.10.0"
gem "kramdown-parser-gfm"

group :jekyll_plugins do
  gem "jekyll-feed", "0.17.0"
  gem "jekyll-seo-tag", "2.8.0"
end

# Needed by `jekyll serve` on Ruby 3+.
gem "webrick"

# Standard-library gems Jekyll 3 needs that newer Rubies no longer include by default.
gem "base64"

# Checks the built site for broken links and images (see check-site.sh).
group :test do
  gem "html-proofer", "~> 5.0"
end
