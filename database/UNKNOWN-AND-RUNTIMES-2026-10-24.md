# A Complete Unknown and watch times — 2026-10-24

Daniel authorised saving and publishing the supplied review, generating its poster,
adding watch time to D1 and updating the other reviews.

## Data

Migration `0002_add_runtime_minutes.sql` adds nullable `runtime_minutes INTEGER`
with a positive-integer CHECK. It leaves all existing fields intact. Apply the
migration before deploying the API, which selects the additional field.

- A Complete Unknown: 141 minutes, supplied by Daniel. Import from
  `Reviews/A_Complete_Unknown.md` using `database/a-complete-unknown.sql`.
- Coherence: 89 minutes, [SFFILM original-release programme](https://sffilm.org/event/coherence/).
- Fear and Loathing: 118 minutes, [BFI](https://www.bfi.org.uk/film/a47079b7-6cbe-534a-8287-1fac54af6e7a/fear-and-loathing-in-las-vegas).

`database/runtime-backfill.sql` fills only missing values on the two existing
films. It does not alter editorial text or scores. Runtimes can differ by edition;
these are original-release running times, not PAL-speed DVD durations.
The Markdown source files also now contain their watch-time metadata.
New-review scores: Fun 3, Action 2, Mind-blowing 2, Smart 4, Feels 4, Overall 4.
The full review and first Why paragraph are preserved exactly, with separate
fields for title/year, tagline, verdict, runtime and scores.

## Local import

After applying migrations and running the original seed and Coherence import:

```sh
npx wrangler d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --file database/a-complete-unknown.sql
npx wrangler d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --file database/runtime-backfill.sql
```

## Presentation and validation

The shared renderer shows watch time under each title with semantic ISO-duration
`time` markup, formats whole hours/minutes, and omits missing or invalid runtimes.
The final poster includes exact approved V7 logo, title and review tagline.
Bitmap, SVG, final PNG and built-in image generation prompt are in BrandKit/posters.

Validated: local migration/import, all three runtimes, six approved new scores,
exact body and social paragraph, preservation of old review content/scores,
initial HTML full text and runtime, repeatable imports/backfill, positive-integer
constraints, formatter edge cases, build and deploy dry run.
Desktop and 390px mobile review layout checked; mobile scroll width is 390px and
no broken images. Watch-time cream/teal contrast is 11.74:1. Existing page palette
and layout are retained. Remaining standalone URL/SEO gaps are unchanged.
