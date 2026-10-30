> Historical verification/development record. For the current published scope and status, read [the complete release report](RELEASE-2026-10-30.md). Earlier local-only or old-state statements below describe the original capture.

# Review website — local verification, 2026-10-26

The homepage now contains the user-supplied headline and paragraph verbatim, followed
by server-rendered links to the existing reviews. No editorial prose or ratings were
changed. No framework, database table, or production change was introduced.

## Theme source

`BrandKit/guidelines/design-tokens.json` records `#002A2F` as canonical Deep Teal
and `#00171A` as the darker website comparison. The user clarified that these are
the intended themes. The switch now offers Teal and Dark teal, retaining cream
text, apricot accents, and the same approved transparent logo in both modes.

The system preference selects the initial theme; a manual choice is stored locally.
Both themes remain dark browser color schemes. Without JavaScript, CSS follows the
system and all server-rendered content and links remain available.

## Checks

| Check | Result |
| --- | --- |
| `npm run build` | Pass; website-only asset guard runs first |
| `python3 tests/check_review_url.py` | 8 HTTP integration checks pass on Pages dev, port 8788 |
| `python3 tests/check_review_url.py http://127.0.0.1:8791` | 8 checks pass on the compiled Worker with ASSETS, Worker-first home/reviews, and 404 handling |
| Every removed public-file URL | All 39 return 404 in the compiled Worker |
| Actual image, CSS, JS, and favicon requests | 200 |
| Asset guard with an extra Markdown file in an isolated fixture | Rejects the unexpected file |
| Deployment dry-run | Pass, without publishing |
| Browser reload, navigation and manual theme changes | Correct theme retained |
| Keyboard switching | Space toggles the native switch; focus outline is visible |
| 1280px and 390px, homepage/listing/detail/404, both themes | All images load; no horizontal overflow |

HTTP integration checks include full review paragraphs in the initial HTML,
per-review title and description, canonical, direct requests/reloads, unknown
review 404, trailing-slash redirect, all homepage review links, and no public
Markdown/brand-reference examples.

## Contrast

| Rendered colors | Teal | Dark teal |
| --- | --- | --- |
| Cream body/headings | 11.74:1 | 14.16:1 |
| Apricot links/rating values | 7.34:1 | 8.86:1 |
| Muted metadata/footer | 8.18:1 | 9.87:1 |

These exceed 4.5:1 for normal text. Navigation hover changes the underline;
switch hover uses apricot; focus outlines use apricot. Review expansion hover uses
cream with Midnight text (14.65:1). Retry buttons use the theme's shared button
styles for default and hover states. The 404 page uses the same tested palette.
503/empty content uses the same styles but was not induced against the user's D1.

The design detector flagged the inherited Recoleta display font as “overused.”
It is the established brand font and was intentionally preserved. A narrow
`overused-font` / `Recoleta` exception is recorded through Impeccable in
`.impeccable/config.json`; other font values and design checks remain active.
The detector now reports no findings for `site.css`. Fonts still use the existing
local/fallback delivery approach.

## Public boundary and scope

Only 17 required website files remain in public/. Removed files include Markdown,
design tokens, provenance, brand previews, logo comparisons, obsolete logo exports,
and unused film reference artwork. The previous public directory is preserved in
ignored `.local-backups/website-before-2026-10-26/public/`. Source brand and review
documents remain available locally. Build and npm deploy both enforce the allowlist.

The prior production site remains unchanged until an approved deployment. Domain
cutover to `stoner.reviews`, sitemap/structured data, and a fixed canonical origin
remain future work. Nothing committed or pushed. Existing unrelated changes remain.
