#!/usr/bin/env bash
# Build the site and check it for broken internal links and images.
# Usage: ./check-site.sh
set -euo pipefail

# Jekyll needs a UTF-8 locale to read the site files.
export LC_ALL=en_US.UTF-8

bundle exec jekyll build
bundle exec htmlproofer _site --disable-external --no-enforce-https
