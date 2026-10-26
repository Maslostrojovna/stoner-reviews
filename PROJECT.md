# Stoner Reviews

## Product vision and current scope

Stoner Reviews is a movie discovery and recommendation platform answering:
**“I want to get high tonight. What should I watch?”**

It starts with distinctive editorial reviews. The longer-term vision includes
community movie ratings, watchlists, profiles, following, recommendations, and
iOS/Android applications. These are future capabilities, not implemented features
or permission to build them now. Today's backend scope is editorial reviews only.

The editorial voice is witty, conversational, irreverent, knowledgeable about
cinema, and casually thoughtful. Avoid forced stoner slang, generic hype,
repetitive cannabis imagery, and academic film criticism. Reviews typically have
a movie title/year, distinctive tagline, short verdict, main review, a “Why watch
it high?” section, and relevant caveats. Preserve original, useful observations.

`Reviews/Stoner_Reviews_Editorial_Guide_and_Template.md` contains useful detailed
voice guidance. It was updated on 2026-10-23 to the six-score model and the approved
Mind-blowing 3/5 and Overall 5/5. `Reviews/Fear&Loathing.md` and the seed retain the
approved current review data. Do not reuse its scores as ratings for other movies.

## Rating model

The public Stoner Scores guide now describes seven independent ratings from 1 to 5:
the six stored fields below, plus Brain Effort (attention required, not quality).
Current approved reviews have no Brain Effort values; its storage is not implemented
in this task. Never invent or infer those values. NULL is allowed for missing data;
published presentation omits missing values. Overall is never averaged or calculated
from any other rating.

| Field | Rating | Discovery meaning |
| --- | --- | --- |
| `overall` | Overall | Independent editorial judgment |
| `fun` | Fun | Make me laugh |
| `action` | Action | Take me on a wild ride |
| `mind_blowing` | Mind-blowing | Blow my mind |
| `smart` | Smart | Give me something to think about |
| `feels` | Feels | Hit me in the feels |

## Implemented architecture

Verified against the repository and public HTML/API on 2026-10-23. See `HANDOFF.md`
for deployment IDs, exact commands, verification details, and Git-state warnings.

- Plain HTML, CSS, and vanilla JavaScript; no frontend framework or API framework.
  Node/npm provide build tooling, with Wrangler pinned to `4.152.0`.
- The existing Cloudflare **Worker** `stoner-reviews` hosts the app. There is no
  separate Pages deployment: `wrangler pages functions build` compiles the Pages
  Functions source into one Worker for the existing hosting integration.
- GitHub repository: `Maslostrojovna/stoner-reviews`. Cloudflare Workers Builds
  deploys `main` with `npm run build` followed by `npm run deploy` from the repo root.
- Deployment configuration:
  `Deployment/test-brand-reference-cloudflare/wrangler.json`. Static assets come
  only from that directory's `public/`; `ASSETS` serves them. The compiled Worker
  entry is `.wrangler/build/worker/index.js`. Worker-first paths are `/api/*`,
  `/reviews`, and `/reviews/`.
- `/` serves the existing `public/index.html`, the updated V7 brand-reference
  homepage. Its layout and original assets are preserved. The repository-root
  `index.html` is an older brand-reference copy; root `style.css`/`script.js` are
  legacy files. These root files are not the live homepage. The local experimental
  prototype edits were discarded with approval when saving the session snapshot.
  Home and Reviews navigation links connect `/` and `/reviews/` on desktop/mobile.
- `functions/api/editorial-reviews.js`: read-only GET `/api/editorial-reviews`.
  Reads D1 through `env.DB`, returning `{ "editorial_reviews": [...] }`, with explicit
  fields including all six stored scores, Markdown, nullable values, and timestamps.
  Orders by `created_at DESC, id DESC`; no pagination/publication filter yet.
  Empty data returns an empty array; non-GET returns 405, database errors 500.
  Responses use `Cache-Control: no-store`. The JSON contract contains no HTML.
- `functions/reviews.js`: `/reviews` redirects 308 to `/reviews/`. It calls the same
  API handler internally, loads the template using `ASSETS`, and uses HTMLRewriter
  to insert complete review cards and an absolute canonical into the response.
  Database failures return 503 with a retry message, not an empty success page.
- `public/reviews.html` is the template. `review-renderer.js` is shared between
  server and browser, escapes source text, and supports current Markdown headings
  and paragraphs. Native `<details>` opens/closes the already-rendered review.
  `reviews.js` fetches the API only as a fallback when server rendering has not
  succeeded; it provides loading, error, retry, and empty states.
- `public/brand.css`, `reviews.css`, and `site-nav.css` style the pages. Approved V7
  logo exports live in `public/logos/`; original artwork in `public/references/`;
  updated branded variants and provenance in `public/references-v7/`. Keep source
  BrandKit assets and guidelines. Deep Teal is `#002A2F`, with Cream/Apricot accents.
  Recoleta Alt and Kollektif currently depend on local fonts/browser fallbacks;
  hosted font binaries are not included.

Paths beginning `public/` above are relative to
`Deployment/test-brand-reference-cloudflare/`.

## Current data model

There is one application table: `editorial_reviews`. No `movies`, `users`,
`user_ratings`, or `watchlists` tables exist. D1 migration bookkeeping is separate.

`database/migrations/0001_create_editorial_reviews.sql` creates:

- `id INTEGER PRIMARY KEY AUTOINCREMENT`; `slug TEXT NOT NULL UNIQUE`;
  `movie_slug TEXT NOT NULL`; `movie_title TEXT NOT NULL`; `release_year INTEGER`.
- Nullable TEXT `tagline`, `verdict`, `body_md`, and `why_watch_high_md`.
- The six nullable INTEGER ratings, each with its own integer/range CHECK.
- `created_at` and `updated_at`: TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP.
  `updated_at` must be set explicitly on edits; there is no update trigger.

Movie information stays in this table for now. `movie_slug` is the stable identifier
for a possible later movies table. `slug` identifies an editorial review and is
the unique, stable permalink key for the locally implemented `/reviews/{slug}/`
route. It also remains the listing's HTML anchor. The production release described
below predates this route.

`body_md` contains the entire main review, including the heading and all paragraphs
of “Why watch it high?”. `why_watch_high_md` contains only the first paragraph after
that heading. The separate Stoner Scores block is stored in the six rating fields;
title/year, tagline, and verdict also have dedicated fields.

`database/seed.sql` imports the real `Reviews/Fear&Loathing.md`. It inserts on a new
slug and does nothing on conflict. Markdown edits are not synchronized to D1, and
rerunning the seed does not update existing records. The current approved scores
are Overall 5, Fun 5, Action 3, Mind-blowing 3, Smart 5, Feels 3.

Local D1 is `stoner-reviews-editorial-local` with a placeholder all-zero ID in
`wrangler.local.json`; state is ignored under `.wrangler/state`. Production D1 is
`stoner-reviews-prod`, EU jurisdiction. Both use the binding name `DB` but separate
data. Production changes require explicit approval.

## Long-term design principles

Keep the API reusable by web and future mobile applications. Separate movie,
editorial-review, and user-rating models when the product needs them, with deliberate
migrations; do not prebuild them now. Keep Cloudflare hosting and D1 compatible with
the current deployment. Preserve the homepage and Reviews navigation. Avoid
premature React/TypeScript migration or unnecessary infrastructure.

Current primary domain: `https://stoner.reviews` (deployed 2026-10-26). The former
`https://stoner.danimaslo.dev` redirects permanently, preserving paths and queries.
The same Worker and production D1 binding are retained. See the production cutover
record below; earlier architecture notes describe prior releases.

## Frontend accessibility requirement

Include a measured contrast audit as part of future frontend development. Audit
the actual served homepage, Reviews listing, and future review detail pages at
desktop and mobile sizes. Cover body/muted copy, navigation, links, rating labels,
and controls in their default, hover, keyboard-focus, loading, and error states.
Target WCAG AA text contrast: 4.5:1 for body text and 3:1 for large text. Preserve
the existing visual identity while correcting verified issues; record measured
ratios and retest after changes.

The design hook reported five unverified low-contrast findings in the legacy root
`index.html` on 2026-10-23. That file is not the deployed homepage. These are audit
inputs, not confirmed live-site failures; inspect the applicable rendered colors
before fixing or suppressing anything. No contrast fixes or suppressions were made
during the session wrap-up.

## Critical SEO/GEO requirements

These are product requirements, not optional enhancements:

1. Each published editorial review must have a permanent, indexable URL, ideally
   `/reviews/{movie-slug}/`.
2. The COMPLETE editorial review must be present in the initial server-delivered
   HTML: full body, “Why watch it high?” section, verdict, and rating information.
   Do not rely exclusively on client-side JavaScript fetches for editorial text.
3. Expandable/collapsed UI is acceptable only when its full content is already in
   the delivered HTML. Crawlers must not need to click or execute JavaScript.
4. Use semantic HTML, descriptive headings, crawlable internal links, descriptive
   page titles, and meta descriptions.
5. Clearly identify the movie, release year, editorial review, and Stoner Reviews
   as publisher.
6. Implement appropriate schema.org Movie and Review structured data. Use the
   independent Overall as the editorial `reviewRating` where applicable. Label
   the five custom dimensions visibly. Use `AggregateRating` only when real
   aggregate user-rating data exists.
7. Provide canonical URLs and an XML sitemap. On the later primary-domain change,
   update canonicals and redirect the previous domain.
8. Keep public editorial pages accessible to legitimate search and AI search
   crawlers, including OAI-SearchBot. GPTBot is a separate optional policy decision.
9. Prefer natural, useful, original content over keyword stuffing, special AI-only
   files, or duplicated crawler-targeted text.
10. Make the site's purpose explicit: movie reviews and recommendations with a
    distinctive stoner perspective. Preferred homepage title:
    **“Stoner Reviews – Movie Reviews & Recommendations”**.

## Current compliance and smallest suitable changes

| Requirement | Verified state / gap | Minimum next change |
| --- | --- | --- |
| Permanent review URLs | Only the listing and article IDs exist; no detail route or permalink | Add a small server-rendered Pages Function for `/reviews/{movie-slug}/`, reuse the current renderer/data access, and add crawlable links. Define a stable slug policy, handle unknown slugs with 404, and extend Worker-first routing for the nested paths. |
| Initial HTML / collapsed UI | Complete body, Why section, verdict, title/year, and five dimensions are in initial listing HTML; details works without JS | Preserve this rendering and give each detail URL the same full content. Show independent Overall too; currently stored/API-only. |
| Semantic HTML / metadata / publisher | Listing has main/article/headings/nav/definition lists, review metadata, logo, and site title; no per-review page metadata or explicit review publisher annotation | Add per-review titles/descriptions and publisher identification without redesigning the layout. |
| Movie/Review schema | No JSON-LD or equivalent Movie/Review structured data implemented | Emit safe JSON-LD from stored facts on detail pages; use Overall, omit invented author/facts and aggregate ratings. |
| Canonical / sitemap | Listing has an absolute request-origin canonical; homepage has none; no XML sitemap source | Add homepage/detail canonicals and a sitemap listing actual published URLs. Decide canonical origin for alternate Worker hostnames. |
| Search/AI crawler access | No robots.txt source or page noindex restriction found; full raw HTML is publicly retrievable | Inspect effective Cloudflare robots/bot/WAF settings and verify OAI-SearchBot policy. Account-level policy and real crawler access remain unverified. Decide GPTBot separately. |
| Natural original content | Real approved editorial prose; same rendering for readers and bots | Preserve it; do not create duplicate crawler-only content. |
| Homepage purpose | Preserved brand reference, with title “Stoner Reviews — Brand reference” and a visual-brand meta description | With approval in a later implementation task, update title/description and minimal purpose copy to the required movie-discovery positioning while preserving homepage design. |

Do not introduce a major framework to close these gaps. Existing server rendering,
vanilla templates, and Cloudflare routing can support the next step.

## Published update — 2026-10-24

Production now contains two editorial reviews, Fear and Loathing and Coherence.
`Reviews/Coherence.md` is approved source; `database/coherence.sql` imports it
idempotently. Scores: Fun 3, Action 2, Mind-blowing 5, Smart 5, Feels 2, Overall 5.
New generated cover with approved V7 overlay is served at
`/posters/coherence-2013.svg`. The shared renderer supports safe inline emphasis
and now displays independent Overall separately from mood dimensions.
Release commit `8d3c5ee` is on GitHub main. No schema change was needed. Existing
standalone URL/SEO gaps remain; the review link is `/reviews/#coherence`.

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
