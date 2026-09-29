---
# HOW TO USE THIS TEMPLATE
# 1. Copy this file into the _posts/ folder.
# 2. Rename it to YYYY-MM-DD-short-title.md (e.g. 2026-10-05-fitting-light-curves.md).
#    The date in the filename is the publish date. Posts dated in the future are
#    NOT shown until you push a change on or after that date (the site only
#    rebuilds when something is pushed).
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
[my Notes page]({{ '/notes/' | relative_url }}).

## What I did

Steps, experiments, or the approach you took. Code goes in fenced blocks:

```python
import numpy as np

flux = np.loadtxt("light_curve.txt")
print(flux.mean())
```

Images go in `images/notes/` and are added like this (replace example.png with your file):

![Short description of the figure]({{ '/images/notes/example.png' | relative_url }})

## What I learned

The main takeaways, as a short list:

- First takeaway
- Second takeaway

## Open questions / next steps

- What would you try next?

## References

- [Link title](https://example.com)
