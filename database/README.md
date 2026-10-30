# Stoner Reviews — database and editorial publishing

Current 30 October 2026. Application table: editorial_reviews. Cloudflare D1 DB
binding; production database stoner-reviews-prod (EU). Local config wrangler.local.json
uses an all-zero placeholder and .wrangler/state. No local credentials or runtime
state are committed. Run commands from a checkout under Code/.

## Schema and data contract

Migrations 0001–0004 are applied in production: editorial fields/six original scores,
positive nullable runtime_minutes, nullable brain_effort, and verified media IDs.
Seven independently assigned nullable 1–5 numeric scores are stored: Overall plus
Fun, Action, Mind-blowing, Smart, Feels, Brain Effort. Never average/infer Overall.
Brain Effort scores remain stored although the guide's old five-level scale was removed.

body_md contains the entire review including Why watch it high?. why_watch_high_md
contains only the first paragraph after that heading. Tagline, short verdict,
title/year and scores are separate. tmdb_id/imdb_id/media_type remain NULL until
verified; preserve supplied runtimes/IDs. There is no draft flag: every row is public.

Canonical copy/artwork belongs in the shared knowledge Reviews/film-slug-year/
library. Repository Reviews/ files and SQL are versioned editorial snapshots.
Editing Markdown or rerunning an INSERT does not synchronize existing D1 rows.

## Local setup

Use only explicit local configuration and state:

```sh
npx wrangler d1 migrations apply stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state
npx wrangler d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --file database/seed.sql
npm run dev
```

Other reviewed film imports are in database/*.sql. INSERTs preserve existing slugs.
Do not import a seed to overwrite a published edit. Do not create future tables early.
The preserved session checkout owns the existing local D1 state; a newly created
worktree does not inherit it. Fixture tests require no D1 mutation.

## Current editorial changes

- Predator: “The Predator somehow has friends now.” — the user-approved narrow
  UPDATE is in predator-tagline-2026-10-30.sql and already applied/verified.
- Wolf: “An awful person but excellent company.” plus the author's prepared
  Why-watch/body revision. The user explicitly confirmed publishing all prepared
  body edits as part of this release. Reviewed UPDATE: wolf-review-update-2026-10-30.sql.
- Five reviews retain the independently approved scores, runtimes and verified IDs.
  No schema migrations are needed for this release.

## Production discipline

Publication requires explicit authorization, as provided for this complete release.
Use supported Wrangler login; never read credentials or put them in docs.
Read only the needed row/metadata, confirm slug/title/year, review exact SQL and
change only approved fields plus updated_at. Preserve useful rollback evidence.
Avoid broad data exports for a single-row edit. Source updates do not publish data;
Worker deployment does not run SQL. Apply data changes separately and verify row
counts, approved wording and preservation of ratings/IDs.

The API is read-only; POST returns 405. It exposes only editorial fields through
functions/api/editorial-reviews.js. Keep DB/API independent from HTML presentation.
