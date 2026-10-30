> Historical development/measurement record. For final scope and publication status, read [the complete release report](RELEASE-2026-10-30.md). Earlier local-only statements below describe their original capture time.

# Render-path optimization — local, 30 October 2026

Not committed or deployed. The user reviewed this fix and asked to queue it
for the next deployment in another session, with no publication now. Retain the
implementation and consult HANDOFF.md when preparing that release.
Production remains the previously verified c5e433e release. The user's screenshot reported four render-blocking requests, estimated
500ms savings and a separate collapsed image-delivery estimate of 315KiB.

## Reproduction

A temporary Lighthouse 13.6.0 installation in /tmp, with installed Chrome, tested
the actual live homepage. No project dependency or production changes were made.
The default simulated-mobile run scored 100, with FCP/LCP 796.7ms and CLS 0.
It still listed site.css, home.css, site-nav.css and theme.js as blocking requests,
although its estimated FCP/LCP savings were zero in that particular run. Estimates
vary with test settings/network; the screenshot does not establish a universal
500ms saving or a failing Core Web Vitals result.

The image insight identified all five default WebP posters, chiefly estimated
compression savings and a smaller size adjustment for its viewport/density. That
live run estimated 385KiB, rather than the screenshot's 315KiB. These are model
estimates, not a guarantee that that many bytes can be removed without affecting
quality. Existing images, source composition, WebP quality, filenames and social
PNGs are unchanged by this patch. Further compression needs visual comparison.

Primary explanations: [render-blocking requests](https://developer.chrome.com/docs/performance/insights/render-blocking)
and [image delivery](https://developer.chrome.com/docs/performance/insights/image-delivery).

## Implementation

- `lib/page-assets.js` transforms HTML only. It reads the page's existing,
  allowlisted CSS files through ASSETS and inserts their exact content in head
  styles, preserving stylesheet order and a single source of truth. No CSS
  rules, branding, font delivery or layout were rewritten.
- A small inline bootstrap applies only a valid saved theme before paint. System
  preference remains handled by existing CSS. The unchanged external theme.js
  becomes defer, retaining controls, persistence and system-change listeners.
- Existing Worker middleware performs this after page rendering. Its original
  legacy-domain redirect still returns first, preserving path/query. API/image/
  CSS/JS responses bypass HTML transformation; existing public URLs remain valid.
- If an internal CSS read fails or returns non-CSS, keep its original link as a
  safe fallback. An explicit local fixture test exercises this path. Trusted CSS
  is guarded against an accidental closing-style sequence in future comments.
- All four page handlers, 404/503 pages, OG/Twitter metadata, canonicals and full
  editorial SSR remain supported. No framework, build-time duplicate CSS source,
  image service, new public file or production/database configuration is added.

Trade-off: CSS is included in each uncached HTML response instead of separately
cached stylesheets. On the measured homepage, compressed HTML grew from 2,529 to
4,585 bytes (raw 9,669 to 17,070). Three browser CSS requests disappear; theme.js
still downloads but no longer blocks first paint. ASSETS performs internal CSS
reads. This favors a short first-paint path for this small, plain-CSS site; measure
again if styles grow substantially. Existing stylesheet URLs are retained.

## Controlled Lighthouse comparison

Both variants used the same local compiled Worker, fixtures and static files,
with no D1 binding. A temporary wrapper restored original stylesheet links and
synchronous theme loading for the baseline; both variants used the same internal
CSS reads. Fresh Chrome profiles and identical mobile settings were used:
Lighthouse 13.6.0, DevTools throttling, 412×823, DPR 1.75, 562.5ms request latency,
1474.56Kbps download throughput and 4× CPU slowdown.

| Metric | Baseline | Local patch |
| --- | ---: | ---: |
| Performance score | 92 | 100 |
| First contentful paint | 2.678s | 0.625s |
| Largest contentful paint | 2.678s | 0.625s |
| Cumulative layout shift | 0 | 0 |
| Listed render-blocking requests | 4 | 0 |
| Browser stylesheet requests | 3 | 0 |

This is a single controlled paired run, not a field guarantee or a comparison of
localhost timings with production latency. The image-delivery insight is unchanged
between these two variants, as expected: no image encoding was changed.

Temporary reports: /tmp/stoner-lighthouse-before.json (live),
/tmp/stoner-lighthouse-local-before.json and
/tmp/stoner-lighthouse-local-after.json. Lighthouse was invoked with
`--only-categories=performance --throttling-method=devtools` for the local pair.

## Regression verification

`npm run test:social -- /tmp/stoner-social-fixtures.json` passes all **31 checks**:
10 social/fault checks, 16 existing page/style/theme checks and 5 image checks.
Build and the unchanged 42-file public allowlist pass. Actual initial HTML now
contains the expected page styles, inline pre-paint bootstrap and deferred theme
script. Public CSS responses remain identical to their inline content. Failure
fallback, old-host redirects, 404/503 metadata behavior and editorial SSR pass.

A single batched Chrome regression pass covered 40 route/viewport/preference
combinations: home, Reviews, Scores, Coherence and 404 at 1280/390px, system light/
dark and saved overrides in both directions. Initial animation-frame samples show
no theme flash; no CSS requests, overflow or uncaught JS errors. Separate checks
confirm live system changes before manual override, manual selection surviving
reload, no-JavaScript dark styling and blocked-storage fallback. Inline CSS is
identical to the previously measured contrast styles; no color rules changed.

No image bytes, D1 schema/data, original dirty checkout, release records or live
infrastructure were changed. Source/asset URLs and the approved image naming
convention remain intact. The local patch needs a new publication approval;
previous approval applied to the already completed release.
