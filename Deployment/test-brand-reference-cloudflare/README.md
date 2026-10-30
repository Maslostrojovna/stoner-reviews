# Stoner Reviews deployment

Published image/social release: application commit `b189352`; see
[verified results](../../tests/DEPLOYMENT-2026-10-30.md) and deployment.json.

## Current image release requirement — 2026-10-30

Follow [the standing image workflow](../../IMAGE-WORKFLOW.md) for every new review
and image change. Finish optimized WebPs and the film's 1200×630 PNG social
preview; update both renderer/social mappings, generator source lists and the
explicit public allowlist together. Check raw HTTP HTML, all candidate/image
responses, actual responsive selection, layout/quality and transfer bytes before
showing the release diff. Do not publish a new row while its required artwork or
deployed code is unavailable. Coordinate D1 and code publication with approval.

The user separately authorized committing/publishing the October 30 image/social
implementation. Future publication still needs its own authorization. The historical sections below do not supersede this workflow
or establish current deployment state. A push to main deploys production.

The existing `stoner-reviews` Cloudflare Worker serves `stoner.danimaslo.dev`.
The homepage uses `public/index.html` as a template, rendered by `functions/index.js`
with the user’s introduction and real review links. Brand-reference examples are
archived locally and excluded from public assets.
`/reviews/` renders editorial reviews; `/api/editorial-reviews` returns read-only JSON.
No frontend or API framework is used. Pages Functions are compiled into one Worker.

## Local review URLs — 2026-10-26

`/reviews/{slug}/` now renders one complete review with its own title, description,
canonical URL and H1. The permalink key is the existing unique `editorial_reviews.slug`
(not `movie_slug`); keep it stable when editing movie information. The listing links
to these URLs. Example: `/reviews/fear-and-loathing-in-las-vegas/`.
Existing reviews also work through the same route. Known slugs without a trailing
slash redirect 308; unknown slugs return 404; database failures return 503.
The detail page needs no browser JavaScript. Nested paths use Worker-first routing.

After local migrations/seed and `npm run dev`, run:

```sh
python3 tests/check_review_url.py
```

This checks the raw HTTP HTML against every stored body paragraph, metadata, all
six ratings, direct requests/reloads, the slash redirect, unknown-review 404, and
listing links. See `tests/REVIEW-URL-CHECKS.md` for recorded verification.
This change is local only. The review homepage, Teal/Dark teal theme switch and
public-asset cleanup are also implemented locally; migration to `stoner.reviews`
and publication remain subsequent work. See `tests/WEBSITE-CHECKS.md`.

Run the commands below from the repository root.

## Local development

```sh
npm ci
npx wrangler d1 migrations apply stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state
npx wrangler d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --file database/seed.sql
npm run dev
```

Open `http://127.0.0.1:8788/`. The local configuration uses a placeholder database
ID and persistent state in `.wrangler/state`, excluded from Git. It does not use
production data. `remote: false` in the production configuration also ensures
`wrangler dev` uses local emulation rather than a remote binding.

## Production configuration

`wrangler.json` in this directory preserves the existing Worker and custom domain.
It serves only `public/`, binds static assets as `ASSETS`, and runs the compiled
functions first on the Reviews and API routes. Root-level source files, SQL,
credentials, and working notes are not part of the asset upload.

The production `DB` binding points to `stoner-reviews-prod`, database ID
`7b2c5a8c-8e9b-4eff-9073-a05bc1fc6e27`. Cloudflare confirms EU jurisdiction,
primary region EEUR, and disabled read replication. Jurisdiction was set on creation.
The application's one table is `editorial_reviews`; D1 also maintains migration
bookkeeping. All six ratings accept NULL or integers 1–5. Overall is never derived.

The seed stores the complete review in `body_md`, including “Why watch it high?”.
`why_watch_high_md` contains only the first paragraph under that heading. The source
is `Reviews/Fear&Loathing.md`, with its Stoner Scores kept as separate database fields.

## Build and deployment

```sh
npm run build
npx wrangler deploy --config Deployment/test-brand-reference-cloudflare/wrangler.json --dry-run
```

Build output is `.wrangler/build/worker/index.js` and is not committed. The Pages
Functions compiler is part of the pinned Wrangler dependency. Both the JSON API
and server-rendered page use the same data handler. The whole review is in the
initial HTML, even when its native details element is collapsed.

The existing Cloudflare Workers Builds integration stays connected to
`Maslostrojovna/stoner-reviews`, production branch `main`, repository root `/`.
Its build command was set to `npm run build` and its deploy command to
`npm run deploy` for the verified 2026-10-23 release.
Pushing to `main` therefore publishes production. The previous `--assets .`
command must not be used because the application now has a specific public folder.

The equivalent manual deployment command is:

```sh
npm run deploy
```

This changes the running production Worker. Database changes are separate,
explicit steps; they are not run on every Git push:

```sh
npx wrangler d1 migrations apply stoner-reviews-prod --remote --config Deployment/test-brand-reference-cloudflare/wrangler.json
npx wrangler d1 execute stoner-reviews-prod --remote --config Deployment/test-brand-reference-cloudflare/wrangler.json --file database/seed.sql
```

The seed is repeatable and leaves an existing matching slug unchanged. Update
`updated_at = CURRENT_TIMESTAMP` explicitly when changing a review. Assign all
ratings independently. See `database/README.md` for inspection queries.

## Verification and rollback

Check `/`, `/reviews/`, `/api/editorial-reviews`, Home/Reviews navigation on a phone
and desktop, all logo/cover images, and full review text with JavaScript disabled.
The API accepts GET only and returns `405` for write methods. Confirm the six
scores and source prose match before declaring a release complete.

The pre-application deployment was version `a53ca5e1-4451-4700-b44f-758a5666335f`.
If needed, roll back the Worker with:

```sh
npx wrangler rollback a53ca5e1-4451-4700-b44f-758a5666335f --config Deployment/test-brand-reference-cloudflare/wrangler.json
```

Rollback changes production traffic but does not delete or roll back D1 data.
Record each published version in `deployment.json`.

## Later: stoner.reviews

Add `stoner.reviews` as an active zone in the same Cloudflare account, then attach
it as another Custom Domain on this same Worker. Keep the existing `DB` binding.
No database migration is needed. Update canonical URLs and any old-domain redirects
at that time. No `stoner.reviews` domain changes are part of the current release.

## Brand assets

The homepage is now a movie-review discovery page using the approved V7 logo and
review posters. `public/logos/` contains only the required logo and favicon;
`public/posters/` contains the three review covers. Source images and brand
guidelines remain outside public/. `scripts/check-public-assets.mjs` rejects any
file outside the website allowlist before build/deploy.
Font CSS uses local Recoleta Alt and Kollektif with browser fallbacks, as before;
no new font binaries are distributed.

## Core-site update — local, 2026-10-26

Primary navigation is Home, Reviews and Stoner Scores. `/stoner-scores/` explains
seven independent ratings and the Brain Effort scale; its canonical is rewritten
by `functions/stoner-scores.js`. Existing records retain their six approved scores
and have no invented Brain Effort values. Homepage copy and the short About section
follow the latest supplied brief; posters retain their full square artwork.

The existing Teal/Dark teal theme bootstrap respects system preference, allows
manual overrides, persists them, and executes before CSS/body parsing. The public
allowlist now contains 19 website files. See `tests/CORE-SITE-CHECKS.md`.

## Production cutover — 2026-10-26

Primary URL is now `https://stoner.reviews/`. Both Custom Domains are configured;
`functions/_middleware.js` redirects the old hostname permanently. Worker-first
execution now covers every path so the redirect includes static and removed URLs.
The deployed version is `faa1cbce-67e5-458e-a327-21cb016a3614`, 100% traffic.
The existing D1 database is unchanged. See `tests/DEPLOYMENT-2026-10-26.md`.

This release was deployed directly from the reviewed local working tree. GitHub
main was not updated; reconcile application changes onto current main before a
future push triggers a deployment. Do not re-publish the previous main as-is.

## The Wolf of Wall Street — local addition, 2026-10-26

Added `Reviews/The_Wolf_of_Wall_Street.md` verbatim, runtime 180 minutes and scores
Fun 5, Action 4, Mind-blowing 3, Smart 4, Feels 2, Brain Effort 2, Overall 5.
Local migration 0003 adds nullable `brain_effort`; only Wolf has an assigned value,
and all three existing records were verified unchanged. The API and renderer now
return/show an available Brain Effort score with an “Attention required” note.

The user asked to rework the artwork around the review. The finished cover depicts
the broker’s charismatic office-party excess and the crawling-to-the-phone
slapstick. Exact title/tagline and approved V7 vector logo are included. Source
art, prompt, SVG and final square PNG are in `BrandKit/posters/`; only the finished
SVG is served. Original artwork is preserved. Preview URL:
`http://127.0.0.1:8788/reviews/the-wolf-of-wall-street/`.

Build, deployment dry-run and 13 integration checks pass locally. Review/listing/
home were checked at 1280, 390 and 320 pixels in both themes: images loaded, no
horizontal overflow, and rating values align. The new note’s contrast is 8.18:1
on Teal and 9.87:1 on Dark teal. Public allowlist: 20 files.

NOT published, committed or pushed. Production still has the prior three reviews.
Before publishing, obtain explicit authorization and apply production migration
0003 BEFORE deploying the new API, then import the approved review and publish
from current main. Do not push the older session branch over main. See
`database/WOLF-2026-10-26.md` for exact data, checks and publication order.

## Production D1 identifiers and pending reviews published — 2026-10-26

The user explicitly authorized adding `tmdb_id`, `imdb_id` and `media_type`, then
publishing to D1. Production was exported to ignored
`.local-backups/d1-identifiers-2026-10-26/production-before.sql` before changes.
Applied migrations 0003 (Brain Effort) and 0004 (media identifiers) locally and in
production; imported the approved Wolf and Predator reviews and backfilled all
five records with verified TMDB/IMDb identifiers and `media_type = 'movie'`.

Production was read back through Wrangler. All five rows match approved local
prose, taglines, runtimes, independent ratings and IDs. The original three rows’
editorial fields are unchanged; their Brain Effort remains NULL. Updated metadata
sets updated_at without rewriting review text. No conflicting IDs were overwritten.
All 15 local HTTP checks pass; in-memory checks validate constraints and repeat-safe
backfill. Public API returns 200/five reviews and both new review URLs return 200
with their complete initial HTML. Identifier sources and detailed verification:
`database/MEDIA-IDENTIFIERS-2026-10-26.md`.

This was database-only. No Worker deployment, Git commit or main push occurred.
The deployed API still omits the new ID fields and Brain Effort; Wolf/Predator
artwork is not in the deployed renderer yet. Those code/assets await separately
authorized app publication from current main. Previous local-only/three-review
notes describe the state before this authorized database change.

## Complete app release — 2026-10-26

The user authorized “deploy all” after the D1 publication. This release includes
both approved reviews, final Wolf/Predator artwork, Brain Effort rendering, and
API fields `tmdb_id`, `imdb_id`, `media_type` and `brain_effort`. Production D1
already has migrations 0003/0004 and all five records; this code release does not
rerun database imports. Earlier pending/local-only notes are historical.

Prepared from current origin/main in an isolated release worktree, preserving the
older dirty session checkout. Public asset guard passes with 21 files; compiled
Worker passes all 15 HTTP checks on port 8791, including full server-rendered text,
direct reloads, unknown-review 404, exact identifiers and both seven-score reviews.
Publishing this commit to main triggers the existing Cloudflare Workers Build.
Verify that build and repeat the HTTP checks against stoner.reviews after release.
