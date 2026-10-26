# Core website verification — 2026-10-26

Local implementation of the supplied Home / Reviews / Stoner Scores brief and
system-aware theme request. Existing brand, stack, editorial data and approved
scores are retained. No framework, database changes or production actions.

## Implemented

- Latest supplied homepage introduction and brief About section, with real review
  cards and a clear link to all reviews.
- `/stoner-scores/` with all seven definitions, five Brain Effort levels, and the
  distinction between attention and quality. Overall is explicitly independent.
- Consistent primary navigation on home, listing, detail, Scores and error pages.
- Full square posters on home/listing/detail, using `object-fit: contain`.
- Reused the early theme implementation; no second theme mechanism was added.

## HTTP and build checks

```sh
npm run build
python3 tests/check_review_url.py
python3 tests/check_review_url.py http://127.0.0.1:8791
npx --no-install wrangler deploy --config Deployment/test-brand-reference-cloudflare/wrangler.json --dry-run
```

The 12 integration checks cover existing full review text and six approved scores
for every current review; metadata/canonicals; direct requests and reloads; slash
redirects; unknown-review 404; all real homepage links; matching navigation;
Scores content and scale; actual asset requests; removed public work-file 404s;
and the blocking theme script preceding styles and body parsing.

Pages dev uses port 8788. The compiled Worker check uses port 8791 with the same
local D1 state and an ignored local config derived from deployment config, with
account/domain removed and only the placeholder local database binding.

Build/deploy guard validates the 19-file website-only public allowlist.
Deployment dry-run validates the bundle without publishing.

## Actual browser theme checks

| Scenario | Result |
| --- | --- |
| System light, no stored preference | Teal, `#002A2F` |
| System dark, no stored preference | Dark teal, `#00171A` |
| System changes before manual selection | Theme follows the change |
| Manual dark override with light system, then reload | Dark teal retained |
| Manual teal override with dark system, then reload | Teal retained |
| Navigation between core sections | Manual theme retained |

System emulation was cleared and the original saved preference restored afterward.
The bootstrap remains a normal blocking script in the head, before styles and body;
it applies localStorage/system choice immediately rather than waiting for DOM-ready.
The DOM-ready callback only initializes the visible toggle. This preserves the
existing protection against an initial flash of the wrong theme.

## Visual and accessibility checks

Inspected Home and Scores screenshots at 1280px and 390px, and checked listing,
detail and 404 layouts at both widths in both themes. All images load; no
horizontal overflow. Poster boxes remain square and use contain, preserving the
whole cover. Mobile header puts the logo and theme control above the three links.

Measured minimum visible text contrast: 7.34:1 in Teal, 8.86:1 in Dark teal.
The cream Brain Effort panel uses Deep Teal text (11.74:1). These exceed AA's
4.5:1 body-text target. Hover/focus use existing accessible accent colors; native
links, buttons, definition lists, an ordered scale, and skip navigation are retained.

## Outstanding

Brain Effort has no approved values in the existing reviews and no database field;
it is explained but no score is invented or inferred. Future editorial assignment
and a small schema update will be needed to display it on individual reviews.

Domain cutover to `stoner.reviews`, publication, fixed primary-origin canonicals,
sitemap/structured-data completion and hosted font delivery remain separate work.
Existing local/fallback fonts are unchanged. Earlier verification documents describe
earlier versions of the site. Nothing committed or pushed.
