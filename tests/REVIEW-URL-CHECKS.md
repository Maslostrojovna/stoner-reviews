# Local review URL verification — 2026-10-26

Implemented locally on `codex/session-2026-10-23`, preserving the pre-existing
uncommitted work. Nothing committed, pushed, deployed, or changed in production D1.

Example URL: `http://127.0.0.1:8788/reviews/fear-and-loathing-in-las-vegas/`.
Title: `Fear and Loathing in Las Vegas (1998) review — Stoner Reviews`.
Description: the stored editorial verdict, unchanged. Canonical uses the request
origin and the stable unique editorial slug; the future primary domain is pending.

## Commands and results

```text
npm run build
  PASS — compiled Worker successfully

python3 tests/check_review_url.py
  PASS — 5 tests against Pages dev on 127.0.0.1:8788

python3 tests/check_review_url.py http://127.0.0.1:8791
  PASS — the same 5 tests against the compiled Worker with ASSETS/run_worker_first

npx --no-install wrangler deploy --config Deployment/test-brand-reference-cloudflare/wrangler.json --dry-run
  PASS — bundle/assets validated; --dry-run exited without publishing
```

The compiled-Worker check used ignored `.wrangler/review-url-check.json`, copied
from the deployment config with local absolute asset/build paths, no account or
domain routes, and only the placeholder local D1 binding (`remote: false`). Both
runtimes used the existing `.wrangler/state`. No seed or editorial data was changed;
local migration inspection reported no pending migrations.

| Check | Result |
| --- | --- |
| Direct detail GET, followed by a fresh GET | 200 both times, identical HTML |
| Actual browser reload at the detail URL | Correct URL/title/review preserved |
| Initial HTML without executing JavaScript | Every stored body paragraph, Why section, verdict, tagline, and six independent scores present |
| Detail metadata | Review-specific title/description, absolute canonical, one H1 |
| Detail content | Body visible without expanding a control; no script required |
| Known slug without slash | 308 to its trailing-slash URL |
| Unknown slug | 404 HTML, recovery link, no canonical, `X-Robots-Tag: noindex` |
| Listing and homepage | 200; listing has crawlable detail links |
| Build and deployment dry-run | Passed |

## Visual checks

Inspected the detail page at 1280px and 390px; the existing brand, artwork, typography,
rating layout and navigation are retained. H1 → H2 hierarchy on the detail page.
Measured `scrollWidth === innerWidth` for the homepage, listing, detail and 404 page
at both widths. Browser viewport override was reset after verification.

Rendered review-page colors: cream `#f4dfba` on teal `#002a2f` = **11.74:1**;
apricot links/rating values `#ff9b57` on teal = **7.34:1**. Both exceed 4.5:1.
The homepage's measured default text pairs also pass: cream/midnight 14.65:1,
apricot/midnight 9.16:1, muted text/midnight 8.48:1, download text/midnight 7.50:1,
and sage/teal 5.63:1. This is a default-state check, not a complete interactive-state
accessibility audit. Existing hover/focus styles were preserved. No contrast
warnings were suppressed. Impeccable's detector returned `[]` for the changed UI files.

## Remaining product work

Homepage design/content, light/dark switch, public working-file cleanup, domain
cutover to `stoner.reviews`, sitemap/structured data, fixed primary-origin canonicals,
and complete interaction-state accessibility checks remain future work. The current
patch establishes review routing and server rendering in the existing stack.
