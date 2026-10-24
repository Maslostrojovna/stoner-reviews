# Coherence publication — 2026-10-24

Approved by Daniel: add Coherence to D1, generate the poster and update stoner.danimaslo.dev.

- Source: Reviews/Coherence.md; tagline, verdict and full review preserved.
- Import: database/coherence.sql, idempotent INSERT, leaves existing slugs untouched.
- Scores: Fun 3, Action 2, Mind-blowing 5, Smart 5, Feels 2, Overall 5.
- Why social field: exactly the first paragraph after the Why heading.
- Poster: new generated bitmap with exact approved V7 vector logo overlay, served at /posters/coherence-2013.svg. Source and exact prompt in BrandKit/posters/.
- Renderer: adds artwork mapping, escaped inline emphasis, independent Overall display.
- Validation: local D1 import; exact source/API comparisons; full review present in initial HTML; safe emphasis/HTML escaping and missing-score checks; build and deploy dry run pass.
- Desktop review card and image visually checked. Measured cream/teal text contrast 11.74:1; apricot/teal 7.34:1. No CSS palette/layout changes. Full homepage/mobile/state contrast audit remains outside this narrow content release.
- Existing SEO gaps remain as documented in PROJECT.md: no standalone review routes or structured data in this version. Coherence is reachable at /reviews/#coherence.

Local import (after initial migrations and original seed):

```sh
npx wrangler d1 execute stoner-reviews-editorial-local --config wrangler.local.json --local --persist-to .wrangler/state --file database/coherence.sql
```
