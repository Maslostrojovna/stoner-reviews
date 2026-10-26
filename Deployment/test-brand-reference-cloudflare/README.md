# Stoner Reviews deployment

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

## GitHub main source synchronization — 2026-10-26

The user authorized updating GitHub main after the direct domain deployment. This
commit reconciles the exact deployed website and application code onto remote main
`cc9c53d`, preserving its approved editorial content, migrations and existing
history. It includes the public upload allowlist, both domain bindings, old-host
redirect, shared theme code, Scores page, and integration checks. Unrelated local
notes, source drafts, private backups and credentials are excluded.

Pushing this commit to main triggers the existing Cloudflare Workers Builds
integration. That build should redeploy the same application; no database write
is configured. Earlier warnings about main lacking this release are historical
once this commit is on main. The primary local workspace remains on its older
session branch with existing changes preserved; do not reset or push that branch
over the updated main.
