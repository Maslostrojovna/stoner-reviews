> Historical verification/development record. For the current published scope and status, read [the complete release report](RELEASE-2026-10-30.md). Earlier local-only or old-state statements below describe the original capture.

# Production release — 30 October 2026

Explicitly authorized by the user: commit, deploy and publish live, including
all earlier OG changes. Application commit `b189352e2ded334a5ed5d05f70eb47ae7c3f487b` was pushed normally to
GitHub main from the isolated feature worktree, based on verified `2eea96d`.

Published at 2026-10-30T10:49:19.942000+01:00 (Europe/Prague). Cloudflare Workers Builds succeeded:
[build](https://dash.cloudflare.com/d4ff220754fe194748e128743cb69f01/workers/services/view/stoner-reviews/production/builds/11ee711f-ff5d-483b-9e87-300ed41518dc). Worker `stoner-reviews`, version `079ed5cb-c6a7-4bbd-bc95-0a2e6c49053c`, was verified
at 100% traffic. Previous version: `7fff95f5-312d-4e97-9137-0f7112265633`.
A documentation-only follow-up records these verified facts; if it triggers a
new build, its application source/assets are byte-identical to this release.

## Published scope

- Complete initial-HTML Open Graph and Twitter metadata on home, Reviews,
  Stoner Scores and all five individual reviews. Correct website/article types,
  stored editorial descriptions, escaped metadata, primary-domain canonicals.
- Six 1200×630 PNG sharing images, including the approved V7 wizard/wordmark
  homepage preview, using descriptive names ending in -stoner-reviews.
- Fifteen WebP derivatives with responsive source selection, native lazy loading,
  film/year alt text, reserved dimensions and first-home-poster LCP priority.
- Standing image workflow linked from project/development/release/poster guides.
- No framework, image service, production D1 data/schema change, replacement of
  original artwork, change to public source URLs or old-domain redirect.

## Verification

Build/allowlist and all 29 local HTTP tests passed before publishing. Production
suites ran with `STONER_TEST_USER_AGENT=curl` and normal TLS verification:

```sh
STONER_TEST_USER_AGENT=curl python3 tests/check_social_metadata.py https://stoner.reviews
STONER_TEST_USER_AGENT=curl python3 tests/check_review_url.py https://stoner.reviews
STONER_TEST_USER_AGENT=curl python3 tests/check_images.py https://stoner.reviews
```

24 production checks passed. Five fault-injection/alternate-host checks are
local-only and intentionally skipped live; they passed locally. Old-domain
review and PNG URLs were additionally fetched directly: permanent 308 to the
primary origin, retaining path/query. Unknown review 404/noindex and complete
review text/scores/runtime/IDs in raw HTML pass. Every social PNG and WebP returns
the correct MIME type and declared dimensions; old image URLs remain valid.

All 36 fetched CSS/JS/logo/poster/social responses exactly match committed bytes.
The public API before/after JSON is exactly equal, including editorial fields,
ratings, identifiers and timestamps. No migrations/imports or remote D1 commands
ran. Existing configurations/bindings remain unchanged.

19 fresh live Chrome contexts cover all eight routes at 1280/390px and 2×,
both themes, plus home at 600/320px and a desktop 1× case. Images load on scroll,
correct responsive candidates are chosen, contain geometry is preserved, no
horizontal overflow or JS exceptions observed. Maximum sampled CLS: 0.0009514.
The first homepage poster is eager/high priority for the single-column LCP case.

| Actual live poster bodies | Initial desktop | Initial mobile | Fully scrolled |
| --- | ---: | ---: | ---: |
| Home | 754,640 B | 439,826 B | 754,640 B |
| Reviews | 119,814 B | 119,814 B | 201,974 B |

Before the release, cold homepage/listing poster transfers were approximately
13.88 MB in production (13.94 MB including the unchanged logo). Image byte costs
exclude HTML/CSS/JS/favicon; compression and native-lazy thresholds can vary.
Lighthouse is unavailable. Lab viewport checks are not physical-device or field
CWV certification; actual Messenger/WhatsApp/X preview caches were not inspected.
No sitemap, JSON-LD or crawler/WAF changes are claimed in this image/social release.

The original dirty session checkout and its local runtime/database state were
preserved. Its older branch is not the release branch; do not push it over main.
Future production changes still require their own authorization.
