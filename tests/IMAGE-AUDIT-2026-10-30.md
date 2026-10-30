# Image audit and proposed optimization — 30 October 2026

**Historical pre-change audit. The user subsequently approved the plan with
filename changes; see IMAGE-OPTIMIZATION-2026-10-30.md for implementation/results.
The original measurements and proposed names below are preserved as audit history.**

Working folder: `Stoner Reviews Improvements`, branch
`codex/stoner-reviews-improvements`, base main `2eea96d`. Existing uncommitted
social metadata work is preserved. The original dirty session checkout remains
separate. Do not mistake the local social feature for the live production state.

## Main finding

The live homepage and Reviews listing each download approximately **13.94 MB**
of compressed image response bodies on a cold browser navigation. Five posters
have 17,965,483 bytes (17.97 MB) of uncompressed source data, yet the listing/detail
art displays at just 144px desktop or 88px mobile. Four SVG poster files contain
embedded raster images; they are not lightweight, purely vector illustrations.

Composition is correct: square artwork is contained, not cropped or distorted.
All image references tested load. Existing dimensions/aspect ratios reserve room;
layout shift is already low. This calls for derivatives and loading improvements,
not a new image service, database, framework or redesigned artwork.

## Evidence and limits

- Fresh headless installed Chrome profiles on the live HTTPS site, 1280×900 and
  390×900 CSS viewports, device scale factor 2. Eight routes: home, listing,
  Scores and all five individual reviews. Teal and Dark teal checked on each
  loaded page (theme switch does not request different artwork).
- Network response bytes are Resource Timing encodedBodySize; files served with
  Cloudflare zstd compression where applicable. Source sizes below are exact
  filesystem byte counts and differ from on-wire sizes. MB/kB mean decimal units.
- Initial HTTP HTML/API/assets/robots/sitemap fetched separately with curl and
  TLS verification. Live CSS/JS/logo/poster responses match release main.
- 36 relevant/legacy image files inventoried in this worktree, including 13 public
  image files and 23 source/reference images. No ignored/private folders scanned.
- All five finished posters inspected together at 250px; desktop/mobile page
  screenshots inspected. Existing vector-based brand PNG was previously inspected
  at 400px, 250px and a 250×250 centered-square thumbnail; its hash is unchanged.
- Lighthouse is not installed in the available runtime. LCP/CLS below are single,
  unthrottled lab observations, not Lighthouse or field CWV measurements. No INP
  result is claimed. No physical device, 3× DPR or actual social-platform debugger
  test was performed. Metadata/crawler access does not prove indexing or ranking.

## Existing pipeline and publication boundary

`functions/api/editorial-reviews.js` selects editorial fields from existing D1.
There are no image blobs or image URL columns in its public API. Image paths are
mapped by movie_slug in `public/review-renderer.js`; the same renderer is used by
Worker SSR and listing fallback JS. Source art and finished compositions are in
BrandKit/posters (and grouped review folders in the separate original checkout).

Production Worker `stoner-reviews` uses ASSETS with the sole upload directory
`Deployment/test-brand-reference-cloudflare/public/`. Worker-first routing and
missing-asset 404 behavior are configured in its existing wrangler.json.
`scripts/check-public-assets.mjs` is an explicit allowlist, rejects unexpected
files/symlinks, and runs before build/deploy. Main has 21 public files; the local
social feature expands it to 27. There is no dynamic resizing/CDN service in the
application; Cloudflare already serves/caches these static URLs.

`scripts/generate-social-images.cjs` is an offline Sharp authoring script only.
It renders the approved vector lockup and existing square poster compositions
into six versioned 1200×630 PNGs. It is not a runtime dependency/build hook.

## Deployed public image inventory

All seven deployed image URLs return 200 with appropriate image MIME types and
no X-Robots-Tag. Posters are used by home + listing + their corresponding detail.
All five have empty alt text today; the nearby title/year identifies the film and
home image links also have an accessible name. Empty alt is therefore a defensible
decorative treatment, not a proven WCAG failure. For the requested informative
artwork/image-discovery treatment, add concise film-title/year alt text.

| Filename under public/ | Format / intrinsic dimensions | Exact source bytes | Cold encoded bytes¹ | Use and assessment |
| --- | --- | ---: | ---: | --- |
| `logos/stoner-reviews-v7-transparent.svg` | SVG / 460×225 | 132,898 | 58,407 | Header logo on all pages, incl. Scores. True vector, no raster embedding; sharp at 2×. alt="Stoner Reviews". Larger than necessary for a logo; optional unused-definition cleanup. |
| `logos/stoner-reviews-wizard-teal-400.png` | PNG / 400×400 | 21,528 | not separately measured | 400px wizard favicon on all pages. At typical 16–32px tab display, oversized in pixels but only 21.5kB. Not an inline content img; alt does not apply. Low priority. |
| `posters/a-complete-unknown-2024.svg` | SVG / 1254×1254 | 3,696,158 | 2,710,540 | A Complete Unknown (2024). Oversized/heavy at all tested display sizes; full composition retained; not undersized. |
| `posters/coherence-2013.svg` | SVG / 1254×1254 | 3,839,721 | 2,823,987 | Coherence (2013). Oversized/heavy at all tested display sizes; full composition retained; not undersized. |
| `posters/fear-and-loathing-1998.png` | PNG / 1254×1254 | 2,618,936 | 2,618,936 | Fear and Loathing in Las Vegas (1998). Oversized/heavy at all tested display sizes; full composition retained; not undersized. |
| `posters/predator-badlands-2025.svg` | SVG / 1254×1254 | 4,053,075 | 2,968,750 | Predator: Badlands (2025). Oversized/heavy at all tested display sizes; full composition retained; not undersized. |
| `posters/the-wolf-of-wall-street-2013.svg` | SVG / 1254×1254 | 3,757,593 | 2,759,352 | The Wolf of Wall Street (2013). Oversized/heavy at all tested display sizes; full composition retained; not undersized. |

¹ One observed desktop-home navigation. The favicon was independently fetched but
its browser transfer was not included in these img-initiated totals. Compression
can vary slightly by request; source file sizes are stable.

## Actual display dimensions, loading and accessibility

| Context | Desktop at 1280px | Mobile at 390px | Ratio / image behavior |
| --- | --- | --- | --- |
| Homepage posters, all five | 352×352 | 354×354 | 1:1, object-fit: contain; native img width/height 600×600 |
| Listing posters, all five | 144×144 | 88×88 | 1:1, contain; native width/height 144×144 |
| Every individual review poster | 144×144 | 88×88 | Same thumbnail presentation as listing; no large detail hero |
| Header logo, every route | 170×83.14 | 140×68.47 | Native vector ratio 460:225 (2.044:1); img attributes 170×83 |
| Scores | Header logo only | Header logo only | No movie artwork or additional icon image payload |
| Ratings | CSS dots, 8px | CSS dots, 7px | CSS spans with aria-hidden; numeric labels remain accessible |

CSS permits homepage art up to 564×564 at the 600px single-column breakpoint;
this maximum is derived from the current CSS. At 2× DPR it calls for about 1128px,
while tested home cards call for about 704–708px. Listing/detail requires only
288px at desktop 2× and 176px on mobile 2×. The 1254px sources therefore provide
ample sharpness; the excess is network payload, not an upscaling defect.

- All five posters retain their titles/logo/composition in both themes. No evidence
  of incorrect crop, stretching or source blur at tested display sizes. Tiny
  lettering/taglines are naturally unreadable inside 88px artwork; adjacent HTML
  carries the title/tagline. Do not enlarge/redesign detail art as housekeeping.
- Every movie img has explicit dimensions; square CSS aspect ratio and contain
  prevent clipping. No horizontal overflow was observed on any tested page.
- No loading, fetchpriority, srcset or sizes attributes are present on movie imgs.
  All five are fetched on both listing/home regardless of scroll position.
- At 900px viewport height, the first three homepage posters intersect the desktop
  viewport; the first intersects mobile. Only the first listing poster intersects
  the initial viewport in either size. All individual posters are above the fold.
- Keep above-fold artwork eager. LCP was text, not artwork, in these observations;
  do not blindly give every poster fetchpriority=high or preload every image.
- Homepage/listing/detail img references and complete review content are in raw
  SSR HTML. Image URLs are stable root-relative paths resolving to HTTPS.
- Rating dots are already resolution-independent CSS shapes; converting them to
  files or SVG requests would add complexity with no benefit. No separate live
  inline mascot asset exists beyond the approved logo and favicon.

## Social sharing: live versus local

**Live:** no OG/Twitter tags on any of the eight inspected pages. All six local
`/social/*-v1.png` URLs currently return 404. These are unpublished assets, not
broken images requested by the deployed pages. Social services may choose a
fallback; their actual UI/caches were not inspected.

**Local feature:** initial Worker HTML supplies absolute HTTPS og:image/og:url/
canonical values, 1200×630 dimensions, truthful alt text, image/png, and Twitter
summary_large_image. The three site pages share the brand image, while every
existing review has a film-specific image. No browser JavaScript is needed.

| Local social filename | Format / dimensions / ratio | Exact bytes | Use / assessment |
| --- | --- | ---: | --- |
| `social/a-complete-unknown-2024-v1.png` | PNG / 1200×630 / 1.905:1 | 802,542 | Matching individual review. Whole approved square poster contained at 570×570 on teal; no crop/upscale. Alt identifies film title/year. Crisp source; moderately heavy for a social-only asset, but not loaded by ordinary page views. |
| `social/coherence-2013-v1.png` | PNG / 1200×630 / 1.905:1 | 834,667 | Matching individual review. Whole approved square poster contained at 570×570 on teal; no crop/upscale. Alt identifies film title/year. Crisp source; moderately heavy for a social-only asset, but not loaded by ordinary page views. |
| `social/fear-and-loathing-1998-v1.png` | PNG / 1200×630 / 1.905:1 | 867,506 | Matching individual review. Whole approved square poster contained at 570×570 on teal; no crop/upscale. Alt identifies film title/year. Crisp source; moderately heavy for a social-only asset, but not loaded by ordinary page views. |
| `social/predator-badlands-2025-v1.png` | PNG / 1200×630 / 1.905:1 | 884,194 | Matching individual review. Whole approved square poster contained at 570×570 on teal; no crop/upscale. Alt identifies film title/year. Crisp source; moderately heavy for a social-only asset, but not loaded by ordinary page views. |
| `social/stoner-reviews-v1.png` | PNG / 1200×630 / 1.905:1 | 38,485 | Home, Reviews and Scores. Approved V7 vector lockup on #002A2F; sharp at 400/250px and centered square. Useful wizard/wordmark alt. Already small; retain unchanged. |
| `social/the-wolf-of-wall-street-2013-v1.png` | PNG / 1200×630 / 1.905:1 | 855,478 | Matching individual review. Whole approved square poster contained at 570×570 on teal; no crop/upscale. Alt identifies film title/year. Crisp source; moderately heavy for a social-only asset, but not loaded by ordinary page views. |

The full homepage lockup is inside the central 630px square, with no slogan or
Messenger UI. Its source is the approved V7 SVG, never an enlarged screenshot.
Keep it and film previews as PNG for now; switching social output to WebP/JPEG
needs compatibility/quality evidence and comparison, not an assumption.

## Network and layout baseline

Image totals below count img-initiated resources, including the header logo,
not HTML/CSS/JS or favicon. Each navigation used a fresh browser context.

| Route | Desktop encoded image bodies | Mobile encoded image bodies | Desktop LCP / CLS | Mobile LCP / CLS |
| --- | ---: | ---: | --- | --- |
| `/` | 13,939,972 bytes | 13,938,300 bytes | 0.240s / 0.000000 | 0.200s / 0.000000 |
| `/reviews/` | 13,938,504 bytes | 13,940,369 bytes | 0.252s / 0.000948 | 0.228s / 0.000000 |
| `/stoner-scores/` | 58,423 bytes | 58,407 bytes | 0.224s / 0.000000 | 0.196s / 0.000000 |
| `/reviews/coherence/` | 2,882,106 bytes | 2,882,288 bytes | 0.300s / 0.000000 | 0.204s / 0.000000 |
| `/reviews/fear-and-loathing-in-las-vegas/` | 2,677,343 bytes | 2,677,343 bytes | 0.196s / 0.000000 | 0.212s / 0.000000 |
| `/reviews/a-complete-unknown/` | 2,768,311 bytes | 2,766,569 bytes | 0.188s / 0.000000 | 0.324s / 0.000000 |
| `/reviews/the-wolf-of-wall-street/` | 2,817,352 bytes | 2,816,258 bytes | 0.372s / 0.000000 | 0.188s / 0.000000 |
| `/reviews/predator-badlands/` | 3,027,151 bytes | 3,028,096 bytes | 0.236s / 0.000000 | 0.220s / 0.000000 |

All final observed LCP elements were text. Nearly zero CLS means reserving image
space is already working; these numbers do not establish fast mobile performance
on a constrained network. Payload remains 13.94MB per cold home/listing visit.
Image headers currently use public,max-age=0,must-revalidate and ETags; Cloudflare
reported cache HIT. Browser revalidation is not the primary bottleneck.

## Findings and proposed scope for approval

1. **P1 — Excessive poster transfers.** Add new WebP derivatives for each film,
   preserving every source and existing published PNG/SVG path. Proposed widths:
   320, 720 and 1152 square pixels. These correspond to thumbnail, usual 2× home,
   and the largest 2× single-column card. Never upscale beyond source dimensions.
   Begin around quality 80–85 and compare full frames, logo/title edges and detailed
   artwork in both themes before choosing settings. Target 40–200kB as appropriate,
   but do not claim a byte saving or force that budget before encoding/visual review.
2. **P2 — No responsive selection/loading control.** Use stable descriptive,
   versioned filenames such as coherence-2013-720-v1.webp. Listing/detail selects
   the small derivative; home uses srcset/sizes matching its actual grid. Keep
   dimensions/aspect ratio and object-fit:contain. Keep the first three home
   images eager for the desktop first row and the first listing image eager;
   lazy-load later images natively. Individual review artwork remains eager.
   Browser lazy thresholds vary: compression supplies the main guaranteed saving.
3. **P2 — Informative artwork lacks film/year alt.** Set concise alt based on stored
   movie_title/release_year, e.g. Illustrated poster for Coherence (2013). Preserve
   empty alt for any genuinely decorative duplicates; keep numeric ratings and
   CSS dots unchanged. No keyword stuffing or invented scene descriptions.
4. **P2 — Social release gap.** Preserve the existing local 1200×630 PNG artwork
   and server metadata. Verify it alongside the new derivatives, including actual
   PNG responses, 400/250px previews and square crops. Do not deploy now. Actual
   Messenger/WhatsApp/X cache/debugger verification requires a later approved
   publication. Existing 24 HTTP tests previously passed for this local feature;
   they will be rerun after approved implementation.
5. **P3 — Optional logo cleanup.** The 132,898-byte V7 SVG includes an unused
   light-background wizard definition. Only if worthwhile, derive a separate
   lean SVG retaining exact referenced paths/colors and compare pixel renders.
   Keep the original. This is optional, not necessary for the main payload win.
   Leave the small favicon unchanged in the first pass.

No image-processing service/CDN, database column/table, framework, artwork redraw,
page layout redesign, global cover cropping, or font change is proposed. The
explicit allowlist must gain each derivative; no directory-wide wildcard upload.
Old URLs stay valid. Add immutable browser caching only for genuinely versioned
new files if included, never blanket-cache mutable originals indefinitely.

## Image-related technical SEO

All currently used image URLs return 200 with no observed image noindex header.
Raw HTML contains crawlable links/img references and normal canonicals. Robots
returns Cloudflare explanatory content-signal comments but no User-agent rules,
Disallow, actual signal assignments or sitemap declaration. Sitemap.xml is 404;
Movie/Review JSON-LD is absent. These remain separate broader SEO gaps, not a
reason to introduce an image CDN or claim that images are blocked. Real crawler
access and search indexing remain unverified. No robots or WAF changes proposed.

## Approval boundary and verification after approval

After approval: generate derivatives without overwriting originals, show original/
derivative comparisons, update shared renderer + allowlist and meaningful tests,
then run build, all existing HTTP/social checks and added responsive image tests.
Check every raw HTML image/srcset and metadata URL, MIME types/dimensions, 404s,
LCP-image loading rules, responsive candidate choice at 1×/2×, composition,
sharpness, layout stability and both themes. Repeat the same cold browser transfer
measurements for an actual before/after comparison. Run Lighthouse mobile where
available, otherwise label the tooling limit and keep lab measurements separate.
Show the final diff before any commit/push/deployment. Production D1 and the
original checkout/state remain untouched.

## Scoped technical audit score

Image-system scope only; this is not a whole-site accessibility certification.

| Dimension | Score /4 | Evidence |
| --- | --- | --- |
| Accessibility | 3 | Named logo/links, numeric ratings, defensible decorative alt; informative film/year alt proposed |
| Performance | 1 | 13.94MB cold home/listing images, full-size thumbnail downloads, no lazy loading |
| Theming | 4 | Full art and brand contrast retained on both served backgrounds |
| Responsive | 3 | Contained/reserved artwork at desktop/mobile/2×, no overflow; no responsive source selection |
| Implementation integrity | 4 | Shared SSR renderer, explicit upload boundary, preserved identity; scoped detector found no mechanical findings |
| Total | 15/20 | Good overall structure; image transfer cost is the clear weak point |

The relevant Impeccable follow-up is optimize for measured payload reduction,
then polish for the bounded final visual comparison. No audit recommendations
have been applied yet.

## Source/reference inventory (not loaded by the live application)

These files are outside the Worker public directory and contribute zero bytes to
normal page loads. They are preserved. Four BrandKit finished SVGs duplicate the
public poster composition; art PNGs and final PNG exports remain source material.
Root v3 logos, type specimens and references are legacy material, not approved
replacements for the current public V7 logo or a reason to delete source files.

| Path | Format | Dimensions | Exact bytes | Use |
| --- | --- | --- | ---: | --- |
| `BrandKit/posters/a-complete-unknown-2024-art.png` | PNG | 1254×1254 | 2,672,284 | Poster source/composition/export; not served |
| `BrandKit/posters/a-complete-unknown-2024.png` | PNG | 1254×1254 | 3,637,338 | Poster source/composition/export; not served |
| `BrandKit/posters/a-complete-unknown-2024.svg` | SVG | 1254×1254 | 3,696,158 | Poster source/composition/export; not served |
| `BrandKit/posters/coherence-2013-art.png` | PNG | 1254×1254 | 2,779,963 | Poster source/composition/export; not served |
| `BrandKit/posters/coherence-2013.png` | PNG | 1254×1254 | 3,775,248 | Poster source/composition/export; not served |
| `BrandKit/posters/coherence-2013.svg` | SVG | 1254×1254 | 3,839,721 | Poster source/composition/export; not served |
| `BrandKit/posters/predator-badlands-2025-art.png` | PNG | 1254×1254 | 2,939,919 | Poster source/composition/export; not served |
| `BrandKit/posters/predator-badlands-2025.png` | PNG | 1254×1254 | 2,908,035 | Poster source/composition/export; not served |
| `BrandKit/posters/predator-badlands-2025.svg` | SVG | 1254×1254 | 4,053,075 | Poster source/composition/export; not served |
| `BrandKit/posters/the-wolf-of-wall-street-2013-art.png` | PNG | 1254×1254 | 2,718,305 | Poster source/composition/export; not served |
| `BrandKit/posters/the-wolf-of-wall-street-2013.png` | PNG | 1254×1254 | 2,895,580 | Poster source/composition/export; not served |
| `BrandKit/posters/the-wolf-of-wall-street-2013.svg` | SVG | 1254×1254 | 3,757,593 | Poster source/composition/export; not served |
| `brand-type-reference.png` | PNG | 488×318 | 208,167 | Legacy brand/reference asset; not served |
| `references/coherence.png` | PNG | 1254×1254 | 2,487,951 | Legacy brand/reference asset; not served |
| `references/fear-and-loathing.png` | PNG | 1254×1254 | 2,618,936 | Legacy brand/reference asset; not served |
| `references/interstellar.png` | PNG | 1254×1254 | 2,710,199 | Legacy brand/reference asset; not served |
| `references/matrix.png` | PNG | 1254×1254 | 2,612,700 | Legacy brand/reference asset; not served |
| `stoner-reviews-logo-v3-dark-00171a.png` | PNG | 920×450 | 55,805 | Legacy brand/reference asset; not served |
| `stoner-reviews-logo-v3-preview.png` | PNG | 920×450 | 55,378 | Legacy brand/reference asset; not served |
| `stoner-reviews-logo-v3-teal-002a2f.png` | PNG | 920×450 | 55,378 | Legacy brand/reference asset; not served |
| `stoner-reviews-logo-v3.svg` | SVG | 460×225 | 72,636 | Legacy brand/reference asset; not served |
| `stoner-reviews-social-icon-400.png` | PNG | 400×400 | 19,044 | Legacy brand/reference asset; not served |
| `stoner-reviews-wizard-v3.svg` | SVG | 692×776 | 38,327 | Legacy brand/reference asset; not served |
