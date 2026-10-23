# Stoner Reviews deployment

The existing `stoner-reviews` Cloudflare Worker serves `stoner.danimaslo.dev`.
The homepage is `public/index.html` in this directory: the updated V7 brand reference.
`/reviews/` renders editorial reviews; `/api/editorial-reviews` returns read-only JSON.
No frontend or API framework is used. Pages Functions are compiled into one Worker.

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
Before publishing this release, set its build command to `npm run build` and its
deploy command to `npm run deploy`.
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

The homepage retains its existing layout, reference sections and V7 logo updates.
`public/logos/` contains approved exports; `public/references-v7/` contains the
updated cover variants and provenance. Original images remain unchanged.
Font CSS uses local Recoleta Alt and Kollektif with browser fallbacks, as before;
no new font binaries are distributed.
