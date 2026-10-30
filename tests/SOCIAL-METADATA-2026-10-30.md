# Social metadata — local implementation, 30 October 2026

Branch: `codex/stoner-reviews-improvements`, based on verified GitHub main
`2eea96dc14cd24030a7fb528aa47f7707e662cee`. Not committed, pushed or deployed.
The original dirty `codex/session-2026-10-23` checkout is preserved separately.

## Implementation

`lib/social-metadata.js` owns page titles, descriptions, canonical origin and
social tags. The four existing Worker page handlers replace a template marker
in the initial HTML; there is no browser-side metadata generation or framework.
All canonicals, `og:url` and image URLs use `https://stoner.reviews`, independent
of request hostname and query. Existing legacy-domain middleware is unchanged.

Home, Reviews and Stoner Scores have distinct titles/descriptions/URLs and
`og:type=website`. Each review has its stored title/year, `og:type=article`, and
the exact stored verdict (trimmed), falling back to its stored tagline. If both
are missing, description content stays empty; no film synopsis is fabricated.
All pages include the requested OG tags, image MIME type, explicit Twitter
title/description/image/alt and `twitter:card=summary_large_image`.

Generated HTML attribute values escape ampersands, angle brackets and both
quote types. HTMLRewriter handles title/attribute mutations as text. No editorial
content is interpolated as unescaped head markup. A future review without a
known poster mapping gets the branded PNG and truthful brand alt text.

Unknown reviews return 404 with no canonical or social identity and both HTTP
and HTML noindex. Database failures similarly return 503/noindex, without social
tags/canonicals, retaining Retry-After. The detail template itself is noindex;
successful Worker rendering removes that directive. Full editorial SSR remains.

## Images and provenance

Six PNGs are explicitly added to `scripts/check-public-assets.mjs`.
The social-only allowlist accepted 27 files; the approved image optimization now
adds 15 WebP derivatives, for 42 total. Production assets stay confined to public/.

- `public/social/homepage-stoner-reviews.png`: 1200×630, 38,485 bytes. Exact approved
  V7 vector from `public/logos/stoner-reviews-v7-transparent.svg`, rendered on
  canonical Deep Teal #002A2F. Original cream paths and apricot underline remain.
  No screenshot enlargement, generated lettering, slogan or Messenger UI.
  The full 600px-wide lockup is centered, wholly inside the central 630px square.
- Five film-specific `public/social/*-stoner-reviews.png` files: 1200×630, approximately
  0.80–0.88 MB each, rendered from the existing approved public posters. Entire
  square artworks are contained at 570×570; no editorial artwork/text is cropped.
- Homepage/Reviews/Scores share the brand image; their textual metadata and URLs
  are page-specific. Each of the five existing review pages has its own image.

`scripts/generate-social-images.cjs` reproduces the exports with Sharp, used only
as an offline authoring tool. It is not a production dependency or build step.
In Codex, set NODE_PATH to the bundled workspace Node package directory, then run
`node scripts/generate-social-images.cjs`. Per the user’s later naming instruction, unpublished previews were renamed
without changing bytes: descriptive names end in -stoner-reviews, without a
version suffix or pixel dimensions. Keep cache revalidation; coordinate future
image changes and platform-cache refreshes with publication. Existing
posters, logo sources, website CSS, D1 configs, migrations and data are untouched.

Viewed the homepage export at 400px and 250px wide and as a 250×250 center crop.
Wizard and wordmark remain intact and legible. Also inspected the Coherence
preview at 400px. The two Messenger reference screenshots were not attached to
this chat; the written creative brief guided composition. These are local visual
checks, not assertions about Messenger's current cache or live platform rendering.

## Verification

`npm run test:social -- /absolute/path/to/review-array.json` builds the real
Worker and serves it locally with real Static Assets and HTMLRewriter.
`tests/social-worker.mjs` is a test entry only: it supplies an in-memory SELECT
fixture object and fault scenarios. Production compiles only functions/ and
does not import that wrapper. The temporary test config has **no D1 binding**,
account, routes or production target. No D1 database is created or modified.

For this run, the JSON array was read from the existing original local SQLite
file through Python sqlite3 `mode=ro`; the snapshot stayed in /tmp. No migrations,
imports or database setup commands ran. To reuse an already-running local API:

```sh
curl -fsS http://127.0.0.1:8788/api/editorial-reviews \
  | python3 -c 'import json,sys; print(json.dumps(json.load(sys.stdin)["editorial_reviews"]))' \
  > /tmp/stoner-review-array.json
npm run test:social -- /tmp/stoner-review-array.json
```

Results with locked Wrangler 4.152.0:

- Build and explicit public-file guard pass.
- 9 social HTTP tests pass against actual server-delivered HTML: all three site
  pages and all five reviews; exact stored descriptions; unique tag occurrences;
  canonical origin under alternate hosts/tracking queries; 404/503 behavior;
  legacy 308 path/query preservation including the image URL; malicious quotes,
  ampersands, title/script/meta markup; missing description fallbacks.
- Image HTTP checks fetch all six declared images through ASSETS and confirm 200,
  image/png, PNG signature and IHDR dimensions matching the declared 1200×630.
- All 15 existing HTTP integration checks pass, including complete raw editorial
  text, runtime/ratings/IDs, routes, assets, theme bootstrap and missing files.
  Existing expectations were corrected for primary-domain canonicals and the
  already-approved Brain Effort values 2/4/2 for the original three films.
- Desktop/mobile checks with a fresh headless Chrome profile: home, listing,
  Scores and Coherence at 1280px/390px in both themes (16 combinations). One H1,
  loaded images and no horizontal overflow throughout. Error/retry UI also loads.
- Sampled computed text contrast against actual served backgrounds:

| Text | Teal #002A2F | Dark teal #00171A |
| --- | --- | --- |
| Cream #F4DFBA | 11.74:1 | 14.16:1 |
| Apricot #FF9B57 | 7.34:1 | 8.86:1 |
| Muted #B6C1AE | 8.18:1 | 9.87:1 |

Samples include body/navigation/footer, rating labels/notes, review links and
theme control. Twelve hover/focus samples across both viewport sizes/themes
retain the same Cream/Apricot pairs; keyboard focus has a 3px Apricot outline.
Error text inherits Cream; retry uses Teal on Apricot (7.34:1).
This is a scoped regression sample, not a complete accessibility certification.
No visible page styles or interaction behavior were changed.

## Limits and release boundary

Live social debugger/cache checks await an approved deployment. Actual platform
crops may vary; the centered-square preview is a local simulation. The prior
production sitemap/JSON-LD/crawler-policy gaps are outside this change. Existing
documentation contains historical architecture/score states; current code and
this scoped record describe this feature. The pinned main tooling still reports
the previously known npm advisories (two moderate/one high); the unrelated
Wrangler patch from the original checkout has not been carried over here.

See IMAGE-OPTIMIZATION-2026-10-30.md for the subsequently approved derivatives
and expanded 29-test suite.

No deployment dry-run, commit, push, production API write, D1 write, infrastructure
change or release-record overwrite ran. No new production version is claimed.
