# Local editorial database

Run these commands from the Stoner Reviews project root (the folder containing
`index.html` and `wrangler.local.json`). Node.js and npm are required. The commands
pin Wrangler to 4.152.0; `npx` downloads it on first use without adding application
dependencies. A Cloudflare login or remote database is not required.

## Files

- `../wrangler.local.json`: separate local D1 configuration using the `DB` binding.
  The all-zero database ID is a local placeholder, not a provisioned Cloudflare
  database. There is no production account, domain, or deployment target here.
  The existing deployment configuration remains unchanged.
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
directory when adding a future deployment.

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

Check the raw HTML without JavaScript:

```sh
curl http://127.0.0.1:8788/reviews
```

The response includes every review paragraph and the “Why watch it high?” heading.
Server-side database failures return HTTP 503 rather than an indexable empty success
page. There are no bot-specific content rules or indexing exclusions on this page.
Localhost is for development; public crawling requires a future deployment.
