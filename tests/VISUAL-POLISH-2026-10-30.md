> Historical development/measurement record. For final scope and publication status, read [the complete release report](RELEASE-2026-10-30.md). Earlier local-only statements below describe their original capture time.

# Visual polish — local preview, 2026-10-30

Scope: existing improvements checkout; no publication, commit, push or database write.

## Changes

- Individual review headers are now broad, poster-led compositions: full square artwork beside a large heading, tagline and Overall ticket; stacked on mobile. Existing 1152px WebP derivatives provide the hero, with responsive source selection and high fetch priority.
- Review-list artwork expands to 256px on desktop and full column width on small phones. Homepage keeps square, contain-based posters and adapts through three/two/one columns.
- All review surfaces, including homepage previews, use the six approved category SVGs and score-specific Overall tickets. Every label, numerical rating and ticket verdict remains text in initial server-delivered HTML. Decorative icons have empty alt and aria-hidden.
- Approved palette, V7 logo, locally available display typography and all editorial content are preserved. Editorial spacing, rules, ticket hierarchy and illustrated score motifs echo the supplied midnight-screening-room reference.
- Eleven exact SVG copies are explicitly allowlisted under public/icons/stoner-scores. No work files or source packs are public.
- Poster originals, generated compositions, social images and all 15 existing WebP derivatives are unchanged. SHA-256 comparisons of every public/posters file match the pre-pass manifest.

## Verification

- npm run build and the 53-file public-asset guard pass.
- 32 local HTTP regression checks pass: 10 metadata/error/escaping checks, 16 review/content/routing/theme checks, and 6 image/icon/accessibility checks.
- Browser inspection covers home, review listing and Coherence detail at 1280, 768, 390 and 320 CSS pixels in both themes. No horizontal overflow, browser script errors or text contrast failures were observed. Checked text contrast is at least 7.34:1 on Teal and 8.86:1 on Dark teal.
- The shared score labels, Overall numeric score and verdict remain readable with images blocked and JavaScript disabled. Review expansion and theme switching work.
- Native lazy-loaded images are verified after scrolling them into view; they are intentionally deferred before that.
- Impeccable mechanical scan reports no findings. git diff --check passes.
- Preview uses the real compiled Worker with existing local JSON fixtures, without a D1 binding. Production was not changed or reverified by this pass.

Local preview: http://127.0.0.1:8797/ (server must remain running).
Screenshots and detailed browser evidence live in temporary storage, not Reviews/.

## User refinement — homepage simplicity and first-screen scores

Homepage previews now omit category ratings/icons and Overall ticket images; Overall remains text, enlarged to a 20px label and 26px score. Individual reviews use a smaller full-composition poster (320px desktop, 112px phone), larger Overall text, and category ratings immediately after the header, before the verdict. The duplicate ticket-verdict wording is removed on detail pages. Brain Effort no longer has the Attention required caption.

All six category icons and complete rating rows fit in the first viewport for all five reviews at 1280×800 and 390×844 in both themes (20 review checks), with no overflow. Homepage icon absence verified in all four configurations. Image regression suite: six checks pass; build and public allowlist pass. Poster files remain unchanged. The review listing retains its icons and tickets.

The user subsequently requested keeping the short verdict between the hero and category ratings on individual pages. That reading order is restored. The reduced poster and larger Overall text remain; the earlier above-fold measurements predate this verdict-order restoration.

## Final first-screen arrangement

Removed the individual-page top All reviews link (main navigation and footer remain). Retained the opening order: compact poster/title/ticket hero, complete short verdict, then full category scorecard. Tightened spacing and arranged mobile poster/ticket beside the heading without clipping or hiding content. All five reviews fit all three sections at 1280×800 and 390×844 in both themes: scorecard bottom at most 783px desktop and 834px phone. This supersedes earlier measurements and layout descriptions. Build, asset boundary, image checks and review URL checks pass. Updated the obsolete test expecting the user-removed Attention required caption.

## Stoner Scores guide update

Added the six approved SVG category icons alongside visible category labels and the user's verbatim explanations. Overall has its separate editorial-recommendation paragraph. Removed the dedicated five-level Brain Effort scoring section, keeping its category definition and existing review ratings. Updated page/social descriptions and corresponding regression expectations. Desktop/mobile (1280/390) checks in both themes show all six icons loaded without overflow. No deployment or data write.

## Two-column review intro

Moved the individual review's short verdict inside the text column alongside title/year, watch time, tagline and Overall rating. The poster is the separate left column, with both columns aligned at the top. Category scores remain beneath the intro. On phones, the compact image/metadata layout remains and the verdict spans the available width for readable lines. All five reviews checked at 1280×800 and 390×844 in both themes: no overflow, all scorecards still fit in the first viewport (maximum bottom 781px desktop / 834px phone). All 16 review-content/routing checks pass; build and public asset guard pass. No deployment or data changes.

The user requested a larger image column: individual-review posters are now 400px wide on desktop (previously 280px), with a 44px column gap; medium screens use 300px. The text column moves right and the tagline can use its available width. Phone sizing remains unchanged. Updated responsive sizes metadata; build and all six image checks pass. No deployment.
