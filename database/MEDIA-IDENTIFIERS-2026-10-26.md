# Media identifiers and D1 publication — 26 October 2026

User authorized adding `tmdb_id`, `imdb_id`, and `media_type` to reviews, then
publishing to production D1. This includes the two pending approved reviews.
Website deployment and GitHub publication are outside this database-only action.

## Verified identities

Matched each title and release year against its TMDB and IMDb film record.
These are identifiers, not imported third-party ratings or rewritten review text.

| Review | TMDB | IMDb | media_type |
| --- | --- | --- | --- |
| Fear and Loathing in Las Vegas (1998) | [1878](https://www.themoviedb.org/movie/1878-fear-and-loathing-in-las-vegas) | [tt0120669](https://www.imdb.com/title/tt0120669/) | movie |
| Coherence (2013) | [220289](https://www.themoviedb.org/movie/220289-coherence) | [tt2866360](https://www.imdb.com/title/tt2866360/) | movie |
| A Complete Unknown (2024) | [661539](https://www.themoviedb.org/movie/661539-a-complete-unknown) | [tt11563598](https://www.imdb.com/title/tt11563598/) | movie |
| The Wolf of Wall Street (2013) | [106646](https://www.themoviedb.org/movie/106646-the-wolf-of-wall-street) | [tt0993846](https://www.imdb.com/title/tt0993846/) | movie |
| Predator: Badlands (2025) | [1242898](https://www.themoviedb.org/movie/1242898-predator-badlands) | [tt31227572](https://www.imdb.com/title/tt31227572/) | movie |

## Schema and data contract

Migration `0004_add_media_identifiers.sql` adds nullable fields to the existing
`editorial_reviews` table, with no new tables:

- `tmdb_id`: positive integer, NULL until verified.
- `imdb_id`: `tt` followed by at least seven ASCII digits, NULL until verified.
- `media_type`: `movie` or `tv`, NULL when unknown. TMDB identifiers are scoped by
  this type; the same integer can identify a movie and a television series.

No uniqueness restriction is added: the schema can still support multiple
editorial reviews for the same movie later. The API source selects the three
fields as a backwards-compatible addition; no identifier UI is introduced.

`media-identifiers.sql` fills only missing metadata on the exact expected slug,
title and year, preserves existing matching values, skips conflicting identifiers,
and changes `updated_at` only when metadata is actually filled. Verification must
detect skipped/conflicting rows rather than silently overwriting them.

## Publication order

1. Export production D1 before mutation. The SQL export and JSON snapshots are
   retained under ignored `.local-backups/d1-identifiers-2026-10-26/`.
2. Validate migration 0003 + 0004 and the exact import against the real export in
   in-memory SQLite. Original editorial fields must remain unchanged.
3. Apply pending migrations to production D1.
4. Import `the-wolf-of-wall-street.sql`, `predator-badlands.sql`, then
   `media-identifiers.sql`. The composed execution file is saved alongside backup.
5. Read all production records and schema back and compare against approved local
   data and the original production snapshot.

The same metadata migration/backfill was applied locally first. All 15 local HTTP
checks pass, including the five exact identifier mappings. In-memory checks cover
all field constraints and prove a repeated metadata backfill makes no changes.

Existing production code remains compatible with the additive columns. It still
omits Brain Effort and the new IDs from its API and does not include the two new
posters until a separately authorized app deployment. No app deployment or main
push is part of this action.

## Completed production verification

Both migrations succeeded and D1 recorded them. The composed import completed
successfully. A SELECT/PRAGMA readback confirms all three new columns, five records,
and both migration names. Every review's editorial fields, runtime, scores and
identifiers match the approved local API data. Original production IDs/created_at
and editorial content remain unchanged; only updated_at and new metadata changed.

Public API returns 200 with five reviews; both new review URLs return 200 and
contain the full Why section in initial HTML. No Worker deployment, commit or main
push ran. The current live API omits the new identifier/Brain Effort fields until
its source update is deployed; new covers likewise remain local. Backup, before/
after snapshots and exact execution SQL are outside public/ and Git.
