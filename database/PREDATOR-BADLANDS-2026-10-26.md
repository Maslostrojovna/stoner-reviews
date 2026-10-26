# Predator: Badlands — local addition, 26 October 2026

Approved source: `Reviews/Predator_Badlands.md`, preserved verbatim from the user.
Runtime: 107 minutes, supplied as 1h 47m. Tagline:
“The Predator has friends now. Somehow.”

Independent scores, Fun / Action / Mind-blowing / Smart / Feels / Brain Effort /
Overall: **3 / 5 / 3 / 2 / 3 / 2 / 4**. No ratings or editorial text were inferred.

`predator-badlands.sql` is an idempotent import that preserves a pre-existing row
with the same slug. The complete Full review and Why section are in `body_md`;
`why_watch_high_md` contains only the first Why paragraph. This reuses local
migration 0003 from the Wolf review; no further schema change is necessary.

Local command:

```sh
npx --no-install wrangler d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --file database/predator-badlands.sql
```

Local D1 was backed up in ignored `.local-backups/predator-review-2026-10-26/`.
All four previous records were compared field-for-field after importing: unchanged.
The new row exactly matches the supplied Markdown sections, runtime and seven
scores. Importing twice in an in-memory database confirms idempotence.

The local permalink is `/reviews/predator-badlands/`, movie slug
`predator-badlands-2025`. The existing renderer supplies title, description,
canonical and complete initial HTML. Brain Effort is labeled as attention required;
earlier unassigned values remain NULL.

## Artwork

The review drives the cover: luminous-blade Yautja combat, a hostile alien ecosystem,
and the unlikely partnership between Dek, legless android Thia and baby monster Bud.
The established illustrated screenprint identity, exact title and tagline, and
approved V7 vector logo are retained. Source art, prompt, SVG composition and final
square PNG are under `BrandKit/posters/predator-badlands-2025*`; the finished SVG
is the only new public asset and is explicitly allowed by the asset guard.

## Publication

This addition is local only. Neither this review nor Wolf has been published,
committed or pushed. Production remains at three reviews. Before an authorized
publication, apply production migration 0003 before deploying the updated API,
then import the approved reviews and publish from current main. Do not push the
older local session branch over main. No production data was changed here.

## Completed verification

Build, public-asset guard and deployment dry-run pass. All 14 HTTP integration
checks pass on Pages dev (8788) and the compiled Worker (8791). All stored review
paragraphs and available scores are present in initial HTML; the new URL survives
direct reload and unknown review URLs still return 404.

At 1280px, 390px and 320px, Home, listing and Predator detail pass in both themes:
all images load, posters use contain, and no horizontal overflow. The inherited
text palette remains unchanged from the measured AA-passing review styles. The
final PNG is 1254×1254 and was visually inspected with exact logo/title/tagline.
Viewport overrides were reset and the original theme restored. The public allowlist
contains 21 website files. No production action was taken.
