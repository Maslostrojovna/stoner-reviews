# Local editorial database

Run these commands from the Stoner Reviews project root (the folder containing
`index.html` and `wrangler.local.json`). Node.js and npm are required. The commands
pin Wrangler to 4.152.0; `npx` downloads it on first use without adding application
dependencies. A Cloudflare login or remote database is not required.

## Files

- `../wrangler.local.json`: separate local D1 configuration using the `DB` binding.
  The all-zero database ID is a local placeholder, not a provisioned Cloudflare
  database. There is no production account, domain, or deployment target here.
  Production has its own configuration and separate D1 database; see the deployment README.
- `migrations/0001_create_editorial_reviews.sql`: creates the one application table,
  `editorial_reviews`, with the requested fields. Each rating accepts NULL or an
  integer from 1 to 5. `overall` is independent and has no calculated default.
- `seed.sql`: inserts the real review from `Reviews/Fear&Loathing.md`, preserving
  its wording and paragraph breaks (line endings normalized to LF). `body_md`
  contains the complete review, including the “Why watch it high?” heading and all
  following review paragraphs, excluding the separate Stoner Scores block.
  `why_watch_high_md` contains only the first paragraph
  after that heading, without the heading itself. Title, year, tagline and short
  verdict have separate fields.
  The source's Stoner Scores are stored separately: Fun 5, Action 3,
  Mind-blowing 3, Smart 5, Feels 3 and independently assigned Overall 5.
  Repeating the seed leaves an existing row
  with that slug unchanged.
- `../.gitignore`: excludes Wrangler's generated `.wrangler/` state from Git.

The Pages Function in `../functions/api/editorial-reviews.js` reads this database
as JSON. The separate `/reviews` page uses the same API handler to render cards.
Keep SQL, local configuration and review source files outside the public asset
directory; production serves only the configured public assets directory.

## 1. Create the local table

This applies pending migrations to a SQLite database managed by Wrangler/Miniflare
inside `.wrangler/state`. Wrangler also creates migration bookkeeping tables;
there are no additional application tables. Every database command below
explicitly uses `--local` and the same state directory.

```sh
npx --yes wrangler@4.152.0 d1 migrations apply stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state
```

Wrangler records the migration in `d1_migrations`, so running this again does not
recreate the table. Add a new numbered migration for future schema changes.

## 2. Insert the review

This loads the seed into the local database. It does not overwrite an existing
review with the same slug.

```sh
npx --yes wrangler@4.152.0 d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --file database/seed.sql
```

## 3. Inspect records with SQL

Count reviews:

```sh
npx --yes wrangler@4.152.0 d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --command "SELECT COUNT(*) AS review_count FROM editorial_reviews;"
```

Read identifying information and all six independent scores:

```sh
npx --yes wrangler@4.152.0 d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --command "SELECT id, slug, movie_slug, movie_title, release_year, fun, action, mind_blowing, smart, feels, overall FROM editorial_reviews;"
```

Read the full editorial text:

```sh
npx --yes wrangler@4.152.0 d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --command "SELECT tagline, verdict, body_md, why_watch_high_md FROM editorial_reviews WHERE slug = 'fear-and-loathing-in-las-vegas';"
```

Inspect column definitions and the exact CREATE TABLE statement:

```sh
npx --yes wrangler@4.152.0 d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --command "PRAGMA table_info(editorial_reviews); SELECT sql FROM sqlite_schema WHERE name = 'editorial_reviews';"
```

## Editing later

Use a SQL file with `d1 execute ... --file path/to/edit.sql`, retaining `--local`,
`--config wrangler.local.json` and `--persist-to .wrangler/state` as above. Update
`updated_at = CURRENT_TIMESTAMP` explicitly when editing a row: its default applies
on insertion, not automatically on updates. Assign any ratings independently;
never average or auto-fill `overall`.

The Markdown file is the seed's original source. Later Markdown edits are not
automatically imported, and rerunning the seed deliberately preserves database edits.

## Local read-only API

After migrating and seeding, start Cloudflare Pages' local server from the project
root. This serves the existing brand-reference public directory and compiles
`functions/api/editorial-reviews.js` into `/api/editorial-reviews`.

Pages does not support the custom `wrangler.local.json` filename. The command
therefore supplies the same D1 binding/database ID and persistent state directory
explicitly. This uses local D1; no Cloudflare account or deployment is involved.

```sh
npx --yes wrangler@4.152.0 pages dev Deployment/test-brand-reference-cloudflare/public --d1 DB=00000000-0000-0000-0000-000000000000 --persist-to .wrangler/state --compatibility-date 2026-10-12 --ip 127.0.0.1 --port 8788
```

In another terminal, fetch the reviews:

```sh
curl -i http://127.0.0.1:8788/api/editorial-reviews
```

Successful requests return HTTP 200 with `Content-Type: application/json` and
`{"editorial_reviews":[...]}`. Each object contains the explicitly selected table
fields, including Markdown text, numeric ratings, nullable values and timestamps.
Reviews are ordered newest first, with descending ID as a tie-breaker. An empty
database returns `{"editorial_reviews":[]}`. D1's internal query metadata is omitted.

Only GET is accepted. Other methods return HTTP 405 with `Allow: GET` and
`{"error":"Method not allowed"}`. Database failures return HTTP 500 with
`{"error":"Unable to load editorial reviews"}`; diagnostic details stay in the
server log. Responses use `Cache-Control: no-store`.

The handler runs only SELECT and returns stored scores unchanged, including the
independently assigned `overall`. It does not modify rows or render HTML. Native
mobile clients can consume this same JSON contract later.

Stop the local server with Ctrl+C. Production compiles these same Pages Functions
into the existing `stoner-reviews` Worker. No separate Pages project is needed.
See `Deployment/test-brand-reference-cloudflare/README.md` for production
build, database and deployment commands.

## Editorial reviews page

With the same local server running, open `http://127.0.0.1:8788/reviews`.
The brand reference stays at `/` and is unchanged.

- `../functions/reviews.js` renders the page on the server through the same data
  handler as the JSON endpoint. The complete review text is included in the initial
  HTML, even inside a collapsed card, so readers and crawlers do not need to execute
  JavaScript or click a control to retrieve it. All visitors receive the same HTML.
- `public/reviews.html` in the existing deployment folder is the page template. It
  reuses `brand.css` and the existing logo. `reviews.css` styles only this page.
- `public/review-renderer.js` is a small shared card renderer used on the server
  and in the browser. It safely escapes content and supports the headings and
  paragraphs used by the current review Markdown. Raw HTML is not executed.
- `public/reviews.js` fetches `GET /api/editorial-reviews` if server-rendered data
  is unavailable, with loading, error, empty and retry states. Successful server
  rendering needs no additional request. Native `<details>` controls open and close
  reviews, including with JavaScript disabled.

The five available category scores are displayed independently; missing scores
are omitted. Existing Fear and Loathing artwork is mapped by `movie_slug` until
the API has an artwork field. There is no frontend framework or new database table.

Check the raw HTML without JavaScript (the trailing slash avoids a redirect):

```sh
curl http://127.0.0.1:8788/reviews/
```

The response includes every review paragraph and the “Why watch it high?” heading.
Server-side database failures return HTTP 503 rather than an indexable empty success
page. There are no bot-specific content rules or indexing exclusions on this page.
Localhost is for development. The 2026-10-23 release is live on
`https://stoner.danimaslo.dev/reviews/`; full review text was verified in its initial
HTML. See `../PROJECT.md` for remaining SEO/GEO requirements.

## Coherence (2013), 2026-10-24

`coherence.sql` imports the approved `Reviews/Coherence.md` verbatim, including
Markdown emphasis and the first Why paragraph for social reuse. Independent
scores: Fun 3, Action 2, Mind-blowing 5, Smart 5, Feels 2, Overall 5.
It uses `ON CONFLICT(slug) DO NOTHING` to avoid overwriting existing records.

For a new local database, run this after the migrations and original seed:

```sh
npx wrangler d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --file database/coherence.sql
```

The published artwork is `public/posters/coherence-2013.svg` under the deployment
folder, mapped by movie slug in the shared renderer. The full-size source bitmap,
final cover and generation prompt are in `BrandKit/posters/`. The SVG embeds the
generated bitmap and exact approved V7 vector logo; older covers remain intact.
The renderer supports escaped inline emphasis and displays independent Overall
separately from the five mood scores.

## Watch times and A Complete Unknown — 2026-10-24

Migration `0002_add_runtime_minutes.sql` adds nullable positive-integer
`runtime_minutes`. Apply migrations before deploying the updated API, which
returns this field alongside the existing data. The shared renderer displays it
as watch time under the title and omits it when unknown.

Import the new approved review after migrations with `database/a-complete-unknown.sql`.
Run `database/runtime-backfill.sql` after the original seed and Coherence import
to fill missing runtimes. Existing prose, scores and assigned runtimes are preserved.
A Complete Unknown is 141 minutes (Daniel); Coherence 89 (SFFILM); Fear and Loathing
118 (BFI). Sources, verification and commands are in
`UNKNOWN-AND-RUNTIMES-2026-10-24.md`.

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

## Predator: Badlands — local addition, 2026-10-26

Added `Reviews/Predator_Badlands.md` exactly as supplied, runtime 107 minutes, and
independent scores Fun 3, Action 5, Mind-blowing 3, Smart 2, Feels 3, Brain Effort 2,
Overall 4. `database/predator-badlands.sql` imports idempotently using local migration
0003 already added for Wolf. All four earlier records were verified unchanged.

Local URL: `/reviews/predator-badlands/`. The cover follows the actual review: glowing
Yautja combat, hostile alien flora, chatty legless android Thia and baby monster Bud.
Artwork, generation prompt, final square PNG and SVG composition are under
`BrandKit/posters/predator-badlands-2025*`. The finished SVG is allowlisted for public
use and overlaid with the exact approved V7 vector logo.

NOT published, committed or pushed. Production still has three reviews; Wolf and
Predator are local additions. Before publishing, obtain explicit authorization,
apply production migration 0003 before deploying the updated API, and import both
approved reviews. See `database/PREDATOR-BADLANDS-2026-10-26.md` for data and checks.

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
