# Stoner Reviews — deployment and development

Current 30 October 2026. Live site: https://stoner.reviews. The current complete
release is documented in [the release report](../../tests/RELEASE-2026-10-30.md);
[deployment.json](deployment.json) records verified publication metadata.
Earlier image SEO publication is historical in tests/DEPLOYMENT-2026-10-30.md.

## Architecture and upload boundary

One Cloudflare Worker (stoner-reviews) with Workers Static Assets and D1 DB binding.
This is not a separate Pages hosting project: the Pages Functions compiler turns
functions/ into .wrangler/build/worker/index.js. Node/npm pins Wrangler 4.152.0.
Production config is this directory's wrangler.json. Only its public/ is uploaded;
the exact allowlist in scripts/check-public-assets.mjs runs before build/deploy.
Never upload the repository/knowledge root, source art, private notes or credentials.

Routes: /, /reviews/, /reviews/{slug}/, /stoner-scores/, /api/editorial-reviews.
Review content and ratings are complete in initial server HTML. The legacy host
stoner.danimaslo.dev redirects permanently to stoner.reviews with path/query retained.
404/noindex and 503/Retry-After paths remain supported. No new cloud resources.

## Build and local checks

From a code checkout:

```sh
npm ci
npm run build
npm run test:social -- /absolute/path/to/existing-review-snapshot.json
```

The fixture runner tests the actual compiled Worker with existing JSON editorial
rows, no D1 binding and temporary local state. It runs metadata/fault, review/routing
and image/icon checks. The current combined suite has 32 local checks.
For local D1 use the explicit wrangler.local.json, --local and .wrangler/state;
see ../../database/README.md. Do not point local development at production DB.

## Images, identity and SEO

Keep the exact current reflection-wizard vector and full-composition square posters.
Website WebP widths: 320, 720, 1152. Sharing PNGs: 1200×630. Names use descriptive
roles ending in -stoner-reviews, never pixel/version suffixes. Scripts
scripts/generate-poster-images.cjs and scripts/generate-social-images.cjs are offline
authoring steps requiring Sharp, not runtime/build dependencies.

Keep truthful srcset/sizes, film/year alt, reserved dimensions, contain geometry,
native lazy loading and appropriate first-view priority. Update renderer/social maps,
actual assets and every exact allowlist entry together. All public original PNG/SVG
URLs remain valid. Approved sources/prompts live in the external shared knowledge
library; older committed source snapshots are historical.

Open Graph/Twitter metadata and canonical URLs are server delivered, escaped,
page specific and use stored editorial descriptions. Social PNGs contain the entire
poster. No sitemap, JSON-LD, crawler-policy change or actual platform-cache refresh
is claimed in this release.

The render-path middleware embeds allowlisted CSS and saved-theme bootstrap before
paint, deferring full theme.js. It retains original CSS links on internal-read errors.
External stylesheet URLs remain available. CSS-in-HTML increases uncached HTML size
in exchange for fewer blocking requests; historical Lighthouse results are lab only.

## Production publication

A normal fast-forward push to GitHub Maslostrojovna/stoner-reviews main triggers
Workers Builds: npm run build then npm run deploy. The user explicitly authorized
the complete 30 October release, including the prepared Wolf body edits and new
tagline. That authorization does not extend to future releases.

Before pushing: refresh main, inspect exact diff, run build/allowlist/32 local checks,
preserve dirty work and confirm DB prerequisites. Never stage local knowledge
symlinks. Code publish does not apply database imports/migrations automatically.

After publishing: verify successful GitHub/Cloudflare build and 100% traffic; run
all applicable HTTP checks with STONER_TEST_USER_AGENT=curl; verify all eight pages,
metadata, status paths, exact public asset bytes, layout/images and theme switching.
Local fault-injection checks are intentionally not run against production.
Record the source commit, Worker version, previous version and verification limits.

## Rollback

Production rollback needs explicit approval. Use the recorded prior Worker version
through Wrangler's supported rollback command. Do not roll back D1 data as part of
a Worker rollback: review-specific DB edits have separate evidence/rollback SQL.
Never push the older dirty session branch over current main.
