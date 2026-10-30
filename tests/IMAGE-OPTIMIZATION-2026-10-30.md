# Image optimization — approved implementation, 30 October 2026

Branch: `codex/stoner-reviews-improvements`, in the sibling
`Stoner Reviews Improvements` worktree, based on main `2eea96d`.
The user approved the image-audit plan, then specified no version suffix or pixel
dimensions in filenames and `-stoner-reviews` at the end. Merge/publication are
explicitly deferred. Nothing committed, merged, pushed or deployed.

## Changes

- Fifteen new WebP derivatives, authored offline with Sharp quality 85/effort 6:
  five each at 320, 720 and 1152 square pixels. No upscaling, cropping or stretching.
- Names use descriptive roles, e.g. `coherence-2013-thumbnail-stoner-reviews.webp`,
  `coherence-2013-stoner-reviews.webp`, `coherence-2013-large-stoner-reviews.webp`.
  Dimensions remain in srcset descriptors/metadata, never in filenames.
- `public/review-renderer.js` supplies responsive SSR images and the same markup
  to the browser fallback. sizes follows the actual grid widths/gutters/breakpoints.
  Listing/detail selects small images at tested 2×; homepage selects the default
  or large image according to viewport/density. Width/height preserve square space.
- First three homepage posters are eager for the desktop first row; later ones
  are native-lazy. Only the first homepage poster has fetchpriority=high because
  it becomes LCP at the 600px single-column breakpoint. First listing poster and
  all individual-review artwork are eager; subsequent listing artwork is lazy.
  Other poster priorities remain auto; decoding is async.
- Informative image alt is escaped stored film title/year, e.g. Illustrated poster
  for Coherence (2013). No editorial text, ratings or film facts were invented.
- Existing CSS, layout, contain behavior, V7 logo, mascot/favicon and rating dots
  remain unchanged. All old published PNG/SVG URLs and high-resolution originals
  remain byte-identical. No image CDN/framework/runtime dependency was introduced.
- Six **unpublished** social PNGs were renamed byte-for-byte to the required naming
  convention: `homepage-stoner-reviews.png` and film names ending
  `-stoner-reviews.png`. Their 1200×630 pixels and approved composition are unchanged.
  Metadata mappings, generator, allowlist and HTTP tests use the new names.
  No previously deployed social URL was removed (the feature is still unpublished).
- No immutable-cache policy was introduced: filenames have no version marker;
  existing revalidation/ETag behavior remains. Future social-image updates need
  platform cache refresh coordination rather than unapproved filename versioning.
- The explicit public allowlist now covers 42 files, adding all 15 derivatives
  individually and the six renamed previews. Source/work files remain outside public/.

## Measured asset sizes

Exact bytes, excluding HTTP headers. Originals are preserved, not overwritten.
Normal home cards and thumbnails meet the approximate 40–200kB target; some
thumbnails are slightly smaller. The largest 2× variant is 264–312kB because the
single-column card can be 564 CSS px wide (1128 device px at 2×). Fine illustration
and lettering were retained rather than forcing an arbitrary 200kB limit.

| Film asset stem | Preserved original | Thumbnail | Default | Large |
| --- | ---: | ---: | ---: | ---: |
| `fear-and-loathing-1998` | 2,618,936 B | 41,452 B | 159,200 B | 312,434 B |
| `coherence-2013` | 3,839,721 B | 40,708 B | 155,614 B | 307,824 B |
| `a-complete-unknown-2024` | 3,696,158 B | 36,158 B | 131,516 B | 263,596 B |
| `the-wolf-of-wall-street-2013` | 3,757,593 B | 42,504 B | 155,664 B | 304,210 B |
| `predator-badlands-2025` | 4,053,075 B | 41,152 B | 152,646 B | 301,058 B |

## Before/after HTTP image measurements

A local comparison wrapper used the **actual main renderer read from Git** for
before, and the compiled feature Worker for after. Both used identical fixtures,
HTML, CSS and assets on the same local server. No D1 binding, new D1 database,
imports, migrations or writes were used. The original renderer was confined to
/tmp; it is not imported by production code.

Cold fresh Chrome profiles, 1280×900 and 390×900, 2× device scale. Values are
Resource Timing encodedBodySize for poster responses only, excluding the unchanged
logo/favicon/HTML/CSS/JS. Local compression makes original SVG transfer bytes
smaller than their filesystem sizes. Production's separately measured homepage
poster baseline is approximately 13.88MB; all images including logo about 13.94MB.
After values are local measurements, not a claim that production is optimized.

| Route / viewport | Before, all posters | After, initial viewport | After, fully scrolled | Full-page reduction |
| --- | ---: | ---: | ---: | ---: |
| `/` / 1280px | 13,900,404 B | 754,640 B | 754,640 B | 94.57% |
| `/reviews/` / 1280px | 13,900,404 B | 119,814 B | 201,974 B | 98.55% |
| `/reviews/coherence/` / 1280px | 2,830,590 B | 40,708 B | 40,708 B | 98.56% |
| `/reviews/fear-and-loathing-in-las-vegas/` / 1280px | 2,618,936 B | 41,452 B | 41,452 B | 98.42% |
| `/reviews/a-complete-unknown/` / 1280px | 2,714,282 B | 36,158 B | 36,158 B | 98.67% |
| `/reviews/the-wolf-of-wall-street/` / 1280px | 2,763,304 B | 42,504 B | 42,504 B | 98.46% |
| `/reviews/predator-badlands/` / 1280px | 2,973,292 B | 41,152 B | 41,152 B | 98.62% |
| `/` / 390px | 13,900,404 B | 439,826 B | 754,640 B | 94.57% |
| `/reviews/` / 390px | 13,900,404 B | 119,814 B | 201,974 B | 98.55% |
| `/reviews/coherence/` / 390px | 2,830,590 B | 40,708 B | 40,708 B | 98.56% |
| `/reviews/fear-and-loathing-in-las-vegas/` / 390px | 2,618,936 B | 41,452 B | 41,452 B | 98.42% |
| `/reviews/a-complete-unknown/` / 390px | 2,714,282 B | 36,158 B | 36,158 B | 98.67% |
| `/reviews/the-wolf-of-wall-street/` / 390px | 2,763,304 B | 42,504 B | 42,504 B | 98.46% |
| `/reviews/predator-badlands/` / 390px | 2,973,292 B | 41,152 B | 41,152 B | 98.62% |

Scores has no poster transfers before or after. Native lazy thresholds vary by
browser: on desktop home, all five posters were prefetched; on mobile only the
first three initially. Compression is the primary saving; lazy loading supplies
additional initial-view savings where the browser defers images.

## Visual/layout and performance verification

- All five original/derivative pairs viewed side-by-side at representative card
  size, with title/logo edges and illustration detail checked. No composition
  changes or visible objectionable artifacts found at tested displays. Original
  artwork is always available at its unchanged path.
- The browser comparison covered all eight routes before/after at 1280/390px,
  2×, both themes. Additional home cases: 600px/2×, 320px/2× and 1280px/1×.
  All images load after scrolling; no page errors, crop/stretch or overflow.
- Every image bounding box agrees with the original renderer within 1 CSS pixel.
  Poster fit remains contain. CLS stays zero except desktop listing's unchanged
  0.0009483253. No new image-related layout shift was introduced.
- Browser selects default WebP for 352/354px 2× home cards, thumbnail for 144/88px
  review art, and large WebP for the 564px card at 600px/2×. The final bounded
  confirmation checked the new first-home-poster high/eager attributes and large
  candidate; other images retain their appropriate priority/loading behavior.
- LCP remained text at typical 1280/390px viewports. At 600px the first poster
  becomes LCP; it is eager/high. Local timings were tens of milliseconds and
  must not be compared to network-throttled mobile or field CWV. Lighthouse is
  unavailable in this runtime; no Lighthouse score or field-speed claim is made.
- Existing contrast pairs are unaffected (CSS, backgrounds and controls unchanged):
  Cream 11.74/14.16:1, Apricot 7.34/8.86:1, muted 8.18/9.87:1 on Teal/Dark teal.
  No new text/control styles were introduced. This is not a full WCAG certification.
- Social images have identical SHA-256 contents under their new names. Existing
  400px/250px/center-square checks remain applicable; platform previews/caches
  require a later approved deployment. Twitter summary_large_image, OG dimensions,
  alt and canonical origin remain in initial HTTP HTML.

## Build/tests and integrity

`npm run test:social -- /tmp/stoner-social-fixtures.json` passes **29 tests**:
9 social metadata/image tests, 15 existing site checks, 5 new image-system tests.
Build and the 42-file asset guard pass. New HTTP checks inspect every server
image/srcset, correct film/year alt, loading/priority rules, all 15 actual WebP
responses and decoded VP8 dimensions, MIME types, no image noindex, old source URLs,
Scores logo, descriptive filenames and budgets. Existing checks retain complete
editorial SSR, API fields/ratings, navigation, 404/503 handling and old-domain 308.

Syntax/whitespace checks pass; the scoped Impeccable detector returned no findings.
Production/local D1 configs, migrations, SQL, package-lock, editorial sources,
website CSS and old-domain middleware have no diff from main. Original checkout
status and its 21 local database/runtime files were checked against starting
status/hashes. No unrelated cleanup or Wrangler upgrade was carried over.

## Review diff and pending publication

[Code/documentation review diff](/tmp/stoner-reviews-review.diff) includes tracked
changes against main plus new text sources. Binary assets are listed in this
record and the allowlist, and can be reviewed as files/comparison previews.
Recreate the tracked portion with `git diff main`; untracked implementation/test
files also need explicit review before selective staging. Do not stage everything.

A push to main deploys production. The user explicitly deferred merging and
publication. **No commit, merge, push, deployment, rollback or production D1
change is authorized by this implementation approval.** Production continues to
serve its prior assets until a separate approved publication.
