# Session handoff — 2026-10-23

Date uses Europe/Prague. Objective: publish the smallest database-backed editorial
reviews experience on the existing Cloudflare deployment, preserve the updated
brand-reference homepage, then record the actual architecture and remaining work.
Read `AGENTS.md` and `PROJECT.md` before continuing.

## Workspace and Git: read this first

Primary user workspace:
`/Users/daniel/Library/Mobile Documents/com~apple~CloudDocs/Daniel OS/60 Projects/Stoner Reviews`

This is a Git repository, remote
`https://github.com/Maslostrojovna/stoner-reviews.git`.

## Saved session checkpoint

The user approved discarding the old local prototype edits and saving today's
work as the first named session checkpoint. Existing Git history is retained.

- Snapshot branch: `codex/session-2026-10-23`, based on deployed commit
  `c94471746f9764045df3526a4a46ae15174584f6`.
- Local checkpoint tag: `session-2026-10-23-v1`. Resolve its commit with
  `git show --no-patch session-2026-10-23-v1`.
- Local `main` and refreshed `origin/main` remain at the deployed `c944717...`.
  The checkpoint is local only; no push, merge to main, or deployment was requested.
- Root `index.html` and `style.css` were restored to their tracked release versions
  with approval. Root index is an older brand-reference copy, not the deployed
  homepage. The separate experimental prototype edits are no longer active.
- `Reviews/Fear&Loathing.md` was restored to release line endings; prose and six
  approved scores are unchanged. No line-ending-only diff remains.
- Saved source includes the three context docs, corrected editorial guide and two
  READMEs, deployment verification record, and original BrandKit assets/guidelines/
  references/prompts (including individual historical assets, excluding ZIP bundles).
- `.gitignore` excludes private `BusinessDetails/`, generated BrandKit/Deployment
  ZIPs, local safety backups, runtime state, dependencies, and credentials/env files.
  Those local-only files remain on disk; they are not part of the snapshot.
- Before synchronization, affected files were backed up under
  `.local-backups/2026-10-23-before-main-sync/` with a SHA-256 manifest and prototype
  diff. This ignored safety copy is not an active prototype or a Git checkpoint.
- Application code, migration/seed, production configuration, and every deployed
  public asset remain byte-identical to `c944717...`.
- The temporary release checkout `/private/tmp/stoner-reviews-production` can
  disappear. Use this primary repository and checkpoint for future work.

The checkpoint should have a clean working tree; verify with `git status` on each
session. Do not reset/clean unreviewed changes or `git add .` indiscriminately.
A push to remote `main` triggers production deployment and requires explicit
approval. The local checkpoint/tag has not been uploaded to GitHub.

## Implemented and deployed

- One D1 application table, nullable independent 1–5 integer rating constraints,
  numbered migration, and repeatable real-review seed.
- Real Fear and Loathing in Las Vegas (1998) review, original prose and approved
  scores: Overall 5, Fun 5, Action 3, Mind-blowing 3, Smart 5, Feels 3.
- Read-only JSON API independent of HTML. Shared server-side data handler powers
  the listing; plain JavaScript fetch is a fallback, not the source of crawler text.
- Server-rendered cards, full body including Why section in initial HTML, native
  open/close controls, five visible category ratings, loading/error/retry states.
  Overall remains in D1/API but is not yet visible in the page.
- Updated V7 brand-reference homepage preserved at `/`, Home/Reviews navigation,
  existing original assets retained. No React, auth, users, or mobile functionality.
- Existing Cloudflare Worker/custom domain/GitHub integration retained. No second
  website or separate Pages project was created.

## Important files

| File/path | Responsibility |
| --- | --- |
| `AGENTS.md`, `PROJECT.md`, `HANDOFF.md` | New persistent instructions/context/handoff; documentation-only changes in this wrap-up |
| `package.json`, `package-lock.json` | Pinned Wrangler and build/dev/deploy scripts |
| `.gitignore` | Excludes node_modules, .wrangler, credentials/env files, .DS_Store |
| `wrangler.local.json` | Local D1 placeholder and migration directory |
| `database/migrations/0001_create_editorial_reviews.sql` | Only application-table migration |
| `database/seed.sql`, `database/README.md` | Exact real-review seed; DB/API usage |
| `Reviews/Fear&Loathing.md` | Approved prose and six assigned scores |
| `functions/api/editorial-reviews.js` | GET JSON contract and method/error handling |
| `functions/reviews.js` | Listing SSR, redirect, canonical, failure handling |
| `Deployment/test-brand-reference-cloudflare/wrangler.json` | Existing Worker, assets, domain, production D1 binding |
| `Deployment/test-brand-reference-cloudflare/README.md` | Detailed deployment/local/rollback instructions |
| `Deployment/test-brand-reference-cloudflare/deployment.json` | Deployment verification record saved in session checkpoint; not part of deployed release commit |
| `Deployment/test-brand-reference-cloudflare/public/index.html` | Actual deployed homepage; preserve this existing index |
| `public/brand-preview.html`, `public/brand.css`, `public/design-tokens.json`, `public/BRAND.md`, `public/COMPONENTS.md` | Brand preview, shared styling/tokens, existing design guidance |
| `public/reviews.html`, `public/reviews.css`, `public/reviews.js`, `public/review-renderer.js`, `public/site-nav.css` | Reviews template, presentation, fallback fetch, shared rendering, navigation |
| `public/_headers`, `public/logos/`, `public/references/`, `public/references-v7/` | Existing response headers and preserved/updated assets with provenance |
| Root `index.html`, `style.css`, `script.js` | Legacy brand-reference/website files restored to release versions; not served by production config |
| `BrandKit/`, `Reviews/Stoner_Reviews_Editorial_Guide_and_Template.md` | Brand/editorial source material saved in checkpoint; not all included in deployed release |

In the table, `public/` abbreviates
`Deployment/test-brand-reference-cloudflare/public/`. Release commit `c944717`
added 60 files (including public brand assets). Inspect its exact file list with
`git show --stat codex/d1-production`; do not mistake all currently untracked local
material for intended release content. `BusinessDetails/` is unrelated/private.

## Cloudflare production configuration and completed changes

Configuration: `Deployment/test-brand-reference-cloudflare/wrangler.json`.

| Setting | Value |
| --- | --- |
| Worker | `stoner-reviews` |
| Account ID | `d4ff220754fe194748e128743cb69f01` |
| Current custom domain | `stoner.danimaslo.dev` |
| Compatibility date | `2026-10-12` |
| Assets directory / binding | `./public` relative to config / `ASSETS` |
| Worker entry | `../../.wrangler/build/worker/index.js` relative to config |
| Worker-first paths | `/api/*`, `/reviews`, `/reviews/` |
| Git integration | `Maslostrojovna/stoner-reviews`, branch `main`, root `/` |
| Build / deploy commands | `npm run build` / `npm run deploy` |
| Production D1 name / binding | `stoner-reviews-prod` / `DB` |
| Production database ID | `7b2c5a8c-8e9b-4eff-9073-a05bc1fc6e27` |
| D1 jurisdiction / reported primary region | `eu` / `EEUR`; read replication disabled at creation/verification |
| Published commit | `c94471746f9764045df3526a4a46ae15174584f6` |
| Published Worker version | `0d7e4612-3339-4cd9-97df-124eb846c6f1` (100% traffic verified during release) |
| Cloudflare build ID | `19f4aaf9-0c25-49ab-a8c7-47683fde908f`; GitHub check succeeded |

**Completed with explicit approval during the deployment session:** created the EU
production database; applied migration 0001 remotely; seeded the real review;
configured `DB`; saved build/deploy commands in the existing integration; committed
and pushed the release to GitHub main; verified successful production deployment.
The old static-only Worker version was `a53ca5e1-4451-4700-b44f-758a5666335f`.

`remote: false` controls local emulation; it does not make the deployed Worker use
local data. Production still uses the named real D1 database. The migration directory
is `../../database/migrations` relative to production config. Database changes are
not run automatically on Git pushes.

These commands **affect production**, and are recorded here for identification,
not permission to run them:

```sh
# Production schema change
npx --no-install wrangler d1 migrations apply stoner-reviews-prod --remote --config Deployment/test-brand-reference-cloudflare/wrangler.json
# Production data insertion (does not overwrite an existing slug)
npx --no-install wrangler d1 execute stoner-reviews-prod --remote --config Deployment/test-brand-reference-cloudflare/wrangler.json --file database/seed.sql
# Production deployment; a push to GitHub main also deploys
npm run deploy
```

No production resource, data, deployment, or configuration was changed by this
documentation task. Production control-plane facts above were verified during the
release and retained in the local deployment record; this wrap-up rechecked public
HTML/API and GitHub main, not all dashboard settings or credentials.

**Planned only:** standalone review URLs, schema/sitemap/metadata fixes, primary
domain switch, and future community/mobile capabilities. `stoner.reviews` has not
been attached by this work. Later point it to the same Worker/DB; no DB migration
is needed, but canonicals and old-domain redirects must change.

## Local setup and exact commands

Run from the primary workspace path above, or a clean checkout of the release.
Node.js/npm are required. `npm ci` installs tooling locally; all following DB commands
explicitly target local D1. No Cloudflare login is needed for this local path.

```sh
npm ci
npx --no-install wrangler d1 migrations apply stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state
npx --no-install wrangler d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --file database/seed.sql
npm run dev
```

Local name `stoner-reviews-editorial-local`, binding `DB`, ID
`00000000-0000-0000-0000-000000000000` (placeholder, not a cloud resource).
`npm run dev` explicitly passes that binding to Pages dev and persists to
`.wrangler/state`. The custom local config is used for D1 commands, not auto-discovered
by Pages dev. Keep the same state directory for setup and serving. On 2026-10-23,
port 8788 responded with one local review matching production editorial fields;
do not assume the server remains running in a future session. If the port is busy,
check its existing process before starting a duplicate. Stop your server with Ctrl+C.

In a second terminal:

```sh
curl -i http://127.0.0.1:8788/
curl -i http://127.0.0.1:8788/reviews
curl -i http://127.0.0.1:8788/reviews/
curl -i http://127.0.0.1:8788/api/editorial-reviews
curl -i -X POST http://127.0.0.1:8788/api/editorial-reviews
npx --no-install wrangler d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --command "SELECT slug, movie_slug, movie_title, release_year, overall, fun, action, mind_blowing, smart, feels FROM editorial_reviews;"
npm run build
npx --no-install wrangler deploy --config Deployment/test-brand-reference-cloudflare/wrangler.json --dry-run
```

Expect `/` and `/reviews/` 200, `/reviews` 308 to `/reviews/`, API GET 200 with
`{"editorial_reviews":[...]}`, and POST 405. The raw `/reviews/` response must contain
the review body and Why section even before JS runs. Build compiles Functions into
ignored `.wrangler/build/worker/`; `--dry-run` checks upload preparation without
publishing. There is no `npm test` script or committed automated test suite.

## Routes and tests actually performed

| Route | Implemented behavior |
| --- | --- |
| `/` | Preserved brand-reference homepage, Home/Reviews nav |
| `/reviews` | 308 to `/reviews/` |
| `/reviews/` | Server-rendered listing with full collapsible reviews |
| `/api/editorial-reviews` | GET JSON; rejects other methods |
| `/reviews/{movie-slug}/` | Not implemented; an article anchor is not a substitute |

During the release: local migration/seed checks, exact production-record comparison
to seed, build and deployment dry-run passed. Tested API GET and rejected write
methods locally; browser Home→Reviews→Home, native review expansion, logo/cover
loading, and mobile layout passed. Compiled Worker was also exercised locally on
port 8791; that temporary test server/config is not the normal dev setup.

During this documentation wrap-up: read Git state and remote main; compared local
release code/assets to the preserved release branch; read local and public API;
read raw public `/reviews/` HTML. Both databases expose one real review with
matching editorial fields and exact six scores. Every body paragraph, verdict,
title/year, and five displayed dimensions are present in initial production HTML;
the listing canonical is `https://stoner.danimaslo.dev/reviews/`. No browser
JavaScript was needed to retrieve that content. Seed/schema were also inspected
in an in-memory SQLite database without writing local or remote D1.

## Known gaps and risks

- Frontend contrast audit deferred by user request to future frontend development.
  Five hook warnings concern legacy root `index.html`; attribution and actual
  contrast failures are unverified. Audit the served homepage/listing/detail pages
  and interactive states, measure text contrast, fix verified issues within the
  existing brand, and retest. No findings were suppressed or design changes made.
- SEO/GEO is **partially implemented**, not complete. Full prose SSR and native
  collapse are correct. Missing: per-review permanent URLs and links, visible
  Overall, Movie/Review structured data, XML sitemap, homepage canonical, and
  per-review metadata. Homepage still says “Stoner Reviews — Brand reference”;
  required preferred title is “Stoner Reviews – Movie Reviews & Recommendations”.
  See `PROJECT.md` for a requirement-by-requirement gap/solution table.
- No robots.txt source is present. Public raw HTML is accessible and no page
  noindex was found. Effective Cloudflare managed robots/bot/WAF settings,
  OAI-SearchBot access, and optional GPTBot policy are **unverified**. Do not equate
  successful curl retrieval or a simulated User-Agent with actual crawler access.
- The listing canonical follows request origin; alternate Worker hosts could
  produce alternate canonicals. Choose the primary canonical origin deliberately.
- The API selects all rows, including incomplete ones: there is no publication
  state/filter. NULL acceptance supports incomplete data but does not hide drafts.
  Do not insert private drafts into production expecting them to stay private.
- No pagination; acceptable for one review, revisit when needed. Artwork mapping
  is hardcoded for one `movie_slug`. Markdown renderer supports headings/paragraphs
  only, not arbitrary Markdown lists/emphasis/links. Preserve safe escaping.
- `updated_at` defaults only on insert. Source Markdown, SQL seed, and D1 can
  diverge; a repeated seed intentionally leaves existing rows untouched.
- Resolved during wrap-up: editorial guide now uses six independent scores and
  the approved Mind-blowing 3 / Overall 5. Its useful prose guidance and reference
  review text were preserved. Deployment/database READMEs now reflect completed
  deployment and use `/reviews/` for direct raw-HTML checks.
- Fonts depend on local installations/fallbacks. Preserve the current identity;
  confirm redistribution rights and approved hosted fonts before changing delivery.
- The primary checkout now has a named local session checkpoint and no active
  prototype edits. Private notes/ZIPs remain ignored. The checkpoint is not yet
  backed up on GitHub; do not assume a local-only commit survives loss of this disk.

## Next practical tasks, in priority order

1. Confirm the saved local checkpoint with `git status` and
   `git show --no-patch session-2026-10-23-v1`. If remote backup is wanted, obtain
   approval to push the snapshot branch/tag without touching main. Merging/pushing
   main is a separate production deployment decision.
2. Add permanent server-rendered review detail URLs, stable slug policy, 404s,
   crawlable listing links, and Worker-first nested routing. Reuse existing
   templates/data access; include full review and all six scores in delivered HTML.
3. Add Movie/Review JSON-LD using independent Overall, detail metadata, consistent
   canonicals and an XML sitemap. Update homepage title/description/purpose copy
   while preserving its design. No framework or new tables are required for this.
4. Verify real search/OAI-SearchBot access and Cloudflare bot/robots policies; ask
   separately about GPTBot. Test no-JS HTML, detail 404s, mobile navigation, and
   correct metadata/schema with the existing real review before any approved deploy.
   Include the user-requested frontend contrast audit: measure desktop/mobile
   homepage and review-page text/control states against the targets in `PROJECT.md`,
   distinguish legacy warnings from served-page issues, and record fixes/retests.
5. Document a small, explicit approved-review update process so source, seed, and
   DB remain aligned; the old guide/README contradictions have been corrected.
   Resolve draft-publication handling before using production for incomplete data.

## Coherence publication — 2026-10-24

User authorised production D1 import, poster generation and website update.
`database/coherence.sql` imported Coherence; both production records were compared
to local approved source, including all prose, social paragraph and six scores.
GitHub main advanced from `c944717` to `8d3c5ee` from clean release checkout
`/private/tmp/stoner-coherence-release`; only the Coherence source/import/poster,
release note and shared renderer were committed. Existing local changes on
`codex/session-2026-10-23` were preserved. Do not push this older local branch over
main. The remote main now contains the release, while the primary working tree
also has its files as uncommitted changes.

Poster source/final/prompt: `BrandKit/posters/`. Public cover:
`Deployment/test-brand-reference-cloudflare/public/posters/coherence-2013.svg`.
Renderer now handles escaped inline emphasis and independent Overall display.
Publication checks are recorded in `database/COHERENCE-2026-10-24.md`.

Production verified: commit `8d3c5ee7dde7caff9291ed99d0e3e6aa95bec0af`, Cloudflare version `49c3b76c-15b8-4ee7-a5d4-7c6907ac331d` (100% traffic), GitHub Workers Builds success. Poster bytes match the local final cover; both production records match approved text/scores. Live expand/collapse checked. Verification screenshot: `BrandKit/posters/coherence-live-verification.png`.

## A Complete Unknown and watch times — 2026-10-24

Added the approved `Reviews/A_Complete_Unknown.md`, scores 3/2/2/4/4 and independent
Overall 4. `database/migrations/0002_add_runtime_minutes.sql` adds nullable positive
integer `runtime_minutes`. Migration and new-review import were applied to both
local and production D1. `database/runtime-backfill.sql` fills missing runtimes
without changing prose or scores: A Complete Unknown 141 minutes (user), Coherence
89 (SFFILM), Fear and Loathing 118 (BFI). All three Markdown sources include watch time.
The API now selects runtime_minutes; the shared renderer displays it below the
title. Unknown runtimes stay unset. New branded poster and exact prompt are in
`BrandKit/posters/a-complete-unknown-2024*`; the site uses the final SVG.

Release commit `cc9c53d` was pushed to GitHub main from clean checkout
`/private/tmp/stoner-unknown-release`. Primary checkout remains on
`codex/session-2026-10-23` with existing local changes preserved. Do not overwrite
remote main with this older local branch. See
`database/UNKNOWN-AND-RUNTIMES-2026-10-24.md` for sources, commands and validation.

Live release verified: Cloudflare version `c9a4e715-b64f-400c-89b1-22bc1efda63e`, 100% traffic; GitHub Workers Builds succeeded for `cc9c53d`. All three production API records match local approved text, six scores and runtimes. Full new body and runtimes are in initial HTML, published poster bytes match the local branded SVG, and all live images load. Screenshot: `BrandKit/posters/a-complete-unknown-live-verification.png`.

## Local review URLs — 2026-10-26 (not deployed)

Implemented `/reviews/{slug}/` in `functions/reviews/[slug].js`, reusing the
existing API data handler and shared renderer. The unique editorial `slug` is
the stable URL key. Listing titles link to detail pages; complete review text,
all six ratings, per-review title/description and a canonical are server-rendered.
Unknown slugs return 404; database failures return 503. Nested review paths are
Worker-first. No new framework, table, or production change. Earlier statements
that standalone routes are missing describe the previous production release.

The five HTTP integration tests pass on Pages dev and the compiled Worker; build
and deployment dry-run pass. Actual browser reload and desktop/mobile layout
were checked. See `tests/REVIEW-URL-CHECKS.md` for commands, evidence and limits.
Existing uncommitted changes were preserved on `codex/session-2026-10-23`. Nothing
was committed or pushed. Homepage work, light/dark mode, public-asset cleanup, and
publication on `stoner.reviews` remain subsequent work.

## Review website homepage and public assets — 2026-10-26 (local only)

Replaced the public brand-reference homepage with the user’s exact “What should I
watch high tonight?” copy and server-rendered links to the three existing reviews.
`functions/index.js` reuses the editorial API and a summary renderer; the homepage
is Worker-first. Existing full review routes and their metadata are retained.

The theme switch uses the captured website backgrounds: Teal `#002A2F` and Dark
teal `#00171A`, both with Cream/Apricot text. This is the user’s 2026-10-26 theme
clarification. It follows system preference initially and remembers a manual choice.
The transient cream/light theme was removed. Shared production styles are now
`public/site.css`, with homepage and review CSS separated.

Removed public brand examples, Markdown, token files, comparisons and unused
artwork; retained only 17 website files. The previous public folder is archived
under ignored `.local-backups/website-before-2026-10-26/public/`; source BrandKit
and editorial Markdown are preserved. `scripts/check-public-assets.mjs` enforces
an explicit allowlist before build/deploy. A real 404 page prevents deleted URLs
from falling back to the homepage. All 39 removed URLs return 404 locally.

See `tests/WEBSITE-CHECKS.md` for checks. Nothing committed, pushed or deployed;
production and `stoner.reviews` remain unchanged. Earlier homepage/asset/theme
notes describe the previous implementation.

## Home, Reviews and Stoner Scores — 2026-10-26 (local only)

Implemented the supplied core-site brief using the existing plain HTML/CSS/JS,
Pages Functions compiled to a Worker, shared review renderer and unchanged D1.
Homepage introduction now uses the latest supplied three paragraphs and includes
the short “By a stoner. For stoners.” section. Navigation consistently links Home,
Reviews and Stoner Scores; the discreet theme control sits outside primary nav.

`/stoner-scores/` explains all seven independent 1–5 categories, the full Brain
Effort attention scale, and independent Overall (never an average). The function
provides a clean slash redirect and absolute canonical using the current origin.
Existing reviews retain all approved prose and six available scores. No Brain
Effort values were supplied, so none were assigned and no schema change was made.
Posters use square, contained artwork instead of cropping the approved covers.

Reused the existing early theme bootstrap and localStorage preference. Browser
checks confirmed system light → Teal `#002A2F`, system dark → Dark teal `#00171A`,
live system updates before manual selection, and both manual overrides surviving
reload under the opposite system preference. Test media emulation and the user's
original saved theme were restored. No theme bootstrap delay was introduced.

See `tests/CORE-SITE-CHECKS.md` for verification. Domain cutover, publishing,
sitemap/structured-data completion and adding approved Brain Effort data remain
separate work. No commit, push, remote database change or deployment was made.

## Production domain cutover — 2026-10-26

User explicitly authorized deployment to `stoner.reviews`. Deployed the reviewed
local website directly with Wrangler to existing Worker `stoner-reviews`, version
`faa1cbce-67e5-458e-a327-21cb016a3614`, 100% traffic, at 22:19 Europe/Prague.
`stoner.reviews` is an active Cloudflare zone and is now an enabled Custom Domain.
The existing production D1 binding is unchanged; no migration or data write ran.

Both domain bindings remain on the Worker. `functions/_middleware.js` permanently
redirects the old `stoner.danimaslo.dev` host to the primary domain, preserving path
and query. `assets.run_worker_first: true` ensures this applies to assets and
unknown old URLs too, with non-function routes falling through to ASSETS.

Build and the 12 local checks passed before deployment. All 12 HTTPS integration
checks passed against the new domain using public DNS and the accepted curl UA;
three reviews match local approved prose, six ratings and runtimes. All 13 served
CSS/JS/image files byte-match local source; all 39 removed URLs return 404, API
POST returns 405, and the old review URL redirects 308 with path/query preserved.
Authoritative DNS, 1.1.1.1 and 8.8.8.8 resolve the new domain; TLS is validated.

At verification this machine still cached the previous NXDOMAIN, including in
the in-app browser. HTTP checks used public resolver addresses without disabling
TLS verification. Default Python urllib UA is rejected with Cloudflare 1010; curl
works. No bot/security settings were changed. See deployment.json and
`tests/DEPLOYMENT-2026-10-26.md` for details and remaining limits.

IMPORTANT: This was a direct deployment from the uncommitted working tree. GitHub
main is still `cc9c53d`; nothing was committed/pushed. Do not deploy that old main
over this release. Reconcile the reviewed application changes onto current main
before the next GitHub-triggered release. Exact source, compiled Worker, config,
previous metadata and asset hashes are preserved in ignored
`.local-backups/deploy-stoner-reviews-2026-10-26/`. Previous version for an explicitly
approved rollback: `c9a4e715-b64f-400c-89b1-22bc1efda63e` (domain bindings may need
separate restoration). Earlier local-only notes are historical.

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
