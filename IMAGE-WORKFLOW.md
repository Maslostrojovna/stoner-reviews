# Image workflow for development and review releases

Approved 30 October 2026. Follow this for future image work and every new review.
This is a delivery standard, not authorization to publish or change artwork.
The initial implementation was prepared on `codex/stoner-reviews-improvements`.
The user separately authorized its publication on 30 October 2026; that approval
does not authorize future releases. See the release record for verified results.

## Preserve the approved artwork

- Keep high-resolution source art, exact prompts, approved V7 vector logo and
  finished poster composition outside the public upload directory. Retain the
  established per-film folder organization where present; this checkout also
  contains legacy sources under `BrandKit/posters/`. Do not reorganize sources
  as a side effect of image optimization.
- Derive website images from the **finished branded composition**, including its
  approved movie title and exact tagline, not from unbranded source art or a
  screenshot. Preserve originals and published image URLs.
- Keep aspect ratios and full composition. Use `object-fit: contain` for square
  poster containers. No global switch to cover, unintended cropping, stretching
  or upscaling. A different crop/artwork treatment needs a shown comparison and
  approval before replacement.
- Logo/mascot remain approved vector artwork where suitable. Rating dots are
  already CSS shapes with accessible numeric labels; do not turn them into files.

## Website files and naming

Names are descriptive, end in **`-stoner-reviews` before the extension**, and have
**no pixel dimensions or version suffixes**. Release years belong in film names.

| Role | Example filename | Current dimensions |
| --- | --- | --- |
| Thumbnail | `coherence-2013-thumbnail-stoner-reviews.webp` | 320×320 |
| Default card | `coherence-2013-stoner-reviews.webp` | 720×720 |
| Large card | `coherence-2013-large-stoner-reviews.webp` | 1152×1152 |
| Film social preview | `coherence-2013-stoner-reviews.png` | 1200×630 |
| Site social preview | `homepage-stoner-reviews.png` | 1200×630 |

The three website sizes match current layouts: 88/144px review thumbnails,
352/354px usual homepage cards and up to 564px single-column cards, including
2× density. Re-measure before adding variants or changing layout assumptions.
Do not upscale a smaller source to manufacture these dimensions; adjust outputs
and their declared srcset widths to actual source limits.

Use WebP for website artwork. The current authoring baseline is quality 85,
effort 6; it is a starting point, not a substitute for inspection. Aim around
40–200 KB where appropriate. Current default cards are 132–159 KB, thumbnails
36–43 KB; large 2× variants are 264–312 KB to preserve detail. Record justified
exceptions rather than forcing visibly damaging compression.

Keep social previews PNG for crisp typography and established compatibility.
The homepage keeps its rich teal field, cream wizard and legible V7 wordmark,
with important content inside the centered-square safe area. No tiny extra
slogans or chat UI. Inspect 400px, 250px and square/compact previews. Retain the
approved site image unless a replacement is requested.

Do not apply immutable caching to mutable, unversioned paths. Preserve normal
revalidation/ETags; coordinate social-platform cache refreshes on approved image
updates. A new cache-busting filename policy needs an explicit decision.

## Render and load correctly

- Keep website image references in the shared server renderer,
  `Deployment/test-brand-reference-cloudflare/public/review-renderer.js`, so
  initial HTML and browser fallback agree. D1 stores editorial data, not images.
- Use responsive srcset/sizes matching actual containers. Declare actual candidate
  widths and reserve the correct aspect ratio with width/height or equivalent CSS.
- Informative poster alt identifies the stored film title/year, e.g. “Illustrated
  poster for Coherence (2013).” Escape it as text. Decorative duplicates may use
  empty alt; do not invent scenes or keyword-stuff.
- Keep above-fold images eager. Currently the first three home posters are eager
  for the desktop first row, with high priority only on the first, which can be
  LCP at the single-column breakpoint. First listing poster and individual-review
  artwork are eager; later home/listing images are native-lazy. Reassess ordering
  and loading if the layout changes; never blanket-preload every poster.
- Social metadata belongs in initial Worker HTML through `lib/social-metadata.js`.
  Use `https://stoner.reviews` for canonical/OG/image identities, truthful alt,
  correct image dimensions and Twitter summary_large_image. Review descriptions
  come from stored verdict/tagline; no invented synopsis. 404/503 pages must not
  acquire indexable social identities. Preserve the old-domain redirect.

## Add a new review's images

1. Confirm approved title/year, tagline, editorial content and ratings. Finish and
   preview the branded poster under the existing poster guidelines. Preserve source
   art, composition and provenance outside public/.
2. Add its finished-source entry to `scripts/generate-poster-images.cjs` and its
   social source/output pair to `scripts/generate-social-images.cjs`. These are
   **offline authoring tools requiring Sharp**, not runtime dependencies or build
   hooks. Inspect the source/output lists before running; they regenerate listed
   derived outputs. Do not casually regenerate or overwrite approved existing art.
3. Generate and inspect the three WebPs and the contained 1200×630 film PNG.
   Use an available authoring installation of Sharp (in Codex, NODE_PATH may point
   to the bundled workspace Node libraries). No image service is needed.
4. Add the exact movie_slug/stem to the shared renderer's artwork map and the
   film social path to `lib/social-metadata.js`. Keep permanent editorial slugs
   and existing image paths stable.
5. Add every public derivative/social file explicitly to
   `scripts/check-public-assets.mjs`. Production uploads only
   `Deployment/test-brand-reference-cloudflare/public/`; no broad wildcard,
   source-folder or repository-root upload. Preserve the existing DB/ASSETS config.
6. Include the approved review in local test fixtures and update expected film/ID/
   score assertions where needed. Do not insert production drafts or rerun seeds
   merely to test images. Every production D1 row is immediately public.
7. Complete the verification below, record results and show the diff. Coordinate
   approved D1 publication and code/artwork availability separately; image work
   itself normally needs no schema or production-data changes.

## Verification before release

- Compare originals/derivatives at actual card/detail sizes and at 2× density,
  checking fine illustration, title/logo edges and complete composition. Test
  desktop/mobile, the large single-column breakpoint, Teal and Dark teal.
- Inspect actual server-delivered HTML: img/srcset/sizes, useful alt, dimensions,
  eager/lazy/priority rules and social metadata. Fetch every candidate/social URL:
  200, correct MIME type and decoded dimensions, no accidental noindex. Check old
  published URLs, unknown review errors and the old-host redirect too.
- Run `npm run build` and the existing HTTP suites. The current combined runner is:

  ```sh
  npm run test:social -- /absolute/path/to/existing-review-array.json
  ```

  It runs social, existing review and image HTTP checks against the compiled local
  Worker using an existing read-only fixture snapshot and **no D1 binding**. Keep
  production and the original checkout's local database state untouched.
- Measure cold image response bytes before/after under matching conditions;
  distinguish encoded network bytes from source file sizes and initial viewport
  from fully scrolled results. Verify actual browser candidate selection, loaded
  images, no overflow/crop, image geometry and CLS. Check LCP before setting priority.
- Run Lighthouse mobile when available. Label unavailable tooling, unthrottled lab
  timings and unverified field/social-platform results honestly. Include measured
  contrast checks when frontend presentation changes.
- Keep routine captures/output in temporary storage; useful written records belong
  in tests/, never review/source artwork folders. Record source preservation and
  layout/quality findings as well as byte savings.

**Publication is a separate approval.** Show the complete diff, including new files,
before committing or publishing. A push to main deploys. Do not merge, push,
deploy, mutate production D1 or replace approved artwork from this standing
workflow alone. After approved publication, check the actual live image/HTML
responses and platform previews; update release records only with verified facts.

Measured references: [audit](tests/IMAGE-AUDIT-2026-10-30.md),
[optimization results](tests/IMAGE-OPTIMIZATION-2026-10-30.md),
[social implementation](tests/SOCIAL-METADATA-2026-10-30.md).
