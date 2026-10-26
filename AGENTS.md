# Stoner Reviews development instructions

Read `PROJECT.md` and `HANDOFF.md` before significant changes. Read relevant existing
documentation too, especially the deployment README, database README, brand
guidelines, and editorial guide. Preserve useful instructions; flag contradictions
instead of silently replacing them.

## Development approach

- Prefer simple, understandable implementations and incremental development.
- Preserve the review website and its visual identity: approved V7 logos, Deep
  Teal/Cream/Apricot palette, typography, illustrations, and design assets. The
  user approved replacing the old brand-reference homepage on 2026-10-26.
  Keep brand documentation and work files outside public/. The explicit public
  asset allowlist in `scripts/check-public-assets.mjs` runs before build/deploy.
- Include a measured contrast audit in future frontend development. Check the
  actual served homepage and review pages on desktop/mobile, including navigation,
  muted copy, rating labels, links, controls, and hover/focus/error states. Target
  WCAG AA text contrast (4.5:1 body text, 3:1 large text), preserving the brand.
  Review legacy-file warnings separately; do not assume they prove live failures
  or suppress them without verification. Record findings, fixes, and retest results.
- The deployed homepage is
  `Deployment/test-brand-reference-cloudflare/public/index.html`. The separate
  repository-root `index.html` is an older brand-reference copy. Confirm which file is served
  before editing; do not replace either casually.
- Avoid unnecessary frameworks, dependencies, migrations, or architectural
  complexity. Do not migrate to React or TypeScript without an explicit need.
- Explain significant architectural decisions, their practical consequences, and
  how changes were verified. Keep these documents current when facts change.
- Maintain compatibility with the existing Cloudflare Worker, D1 binding, custom
  domain, and GitHub deployment integration. Keep the shared API independent of
  website HTML so future mobile clients can consume it.
- Do not build authentication, accounts, social features, or mobile applications
  unless they are explicitly in scope. Do not create future database tables early.

## Production and Git safety

- Never modify a production database, create cloud resources, deploy, or roll back
  production without explicit approval for that work. Previous deployment approval
  is not blanket approval for future sessions.
- A push to GitHub `main` triggers production deployment. Treat that push as a
  production action requiring approval. Ask before committing when requested.
- Inspect the branch, working tree, and remote state first. Local `main` was
  synchronized to the deployed release on 2026-10-23, and the session snapshot is
  on `codex/session-2026-10-23`. Recheck rather than assuming it stays current; read
  `HANDOFF.md`. Do not reset, clean, switch branches over user changes, or stage
  everything indiscriminately. Preserve private `BusinessDetails/` and other
  unrelated material; never upload the repository root as public assets.
- Use the explicit local configuration, `--local`, and `.wrangler/state` for local
  D1 work. Keep local data separate from production. Do not read credential files
  or put credentials in documentation; use supported login/CLI flows.

## Review poster default — approved 2026-10-24

- Use the finished `BrandKit/posters/coherence-2013.png` as the approved poster
  reference: illustrated square artwork, approved V7 logo, large movie title,
  and the review's approved tagline directly below the movie title.
- Preserve the tagline verbatim. Use readable cream supporting type, comfortable
  margins, and one or two balanced lines as needed. Use this film-specific line
  beneath the title instead of the generic brand slogan.
- Reserve room for and overlay the exact approved vector logo. Deliver and
  preview the final branded PNG, including the logo, title and tagline.
- Follow `BrandKit/posters/README.md` for future poster creation.

## Editorial data

- Store watch time in `runtime_minutes` as a positive integer, or NULL when unknown.
  Preserve user-supplied runtimes; verify missing runtimes against reliable film
  sources and record provenance. Include watch time in review Markdown and the API.
- Seven independent 1–5 ratings: Overall, Fun, Action, Mind-blowing, Smart, Feels,
  Brain Effort (attention required, not quality). Migration 0003 adds nullable
  `brain_effort`; migration 0003 is now applied in production. The Wolf of Wall
  Street and Predator: Badlands each have user-approved
  Brain Effort 2; the original three reviews
  remain NULL. Never infer or invent missing values. Publication needs explicit
  approval for deployment. Both reviews are now stored in production D1; their
  new artwork and API/renderer changes are included in the user-authorized complete app release.
- `tmdb_id`, `imdb_id`, and `media_type` are stored by migration 0004, applied to
  local and production D1 on 2026-10-26. All five films have verified IDs and
  `media_type = 'movie'`; future series use `tv`. Preserve NULL until verified,
  and never overwrite conflicting non-null IDs without checking the source.
  See `database/MEDIA-IDENTIFIERS-2026-10-26.md` for the sourced mapping.
- Overall is an independent editorial judgment. Never calculate, average,
  auto-populate, or infer it from the five dimensions. Preserve SQL constraints.
- Do not invent editorial text, anecdotes, facts, or scores. Use approved source
  material and preserve its exact wording and assigned scores when importing.
- `body_md` contains the complete main review, including the entire “Why watch it
  high?” section. `why_watch_high_md` contains only the first paragraph following
  that heading. Title/year, tagline, verdict, and six scores have separate fields.
- The authoritative current scores are in `Reviews/Fear&Loathing.md` and the seed.
  The editorial guide was reconciled to the six-rating model on 2026-10-23.
  Source edits and seed reruns do not automatically update rows.

## SEO/GEO is a product requirement

Preserve and complete the requirements in `PROJECT.md`. Every published review
needs a permanent indexable URL, complete initial server-delivered HTML, semantic
markup, crawlable links, descriptive metadata, canonicals, sitemap coverage, and
appropriate Movie/Review structured data. Do not replace server rendering with
client-only fetching. A collapsed review must already contain its full text in
the delivered HTML, including verdict, “Why watch it high?”, and rating information.

Use the independently assigned Overall for `Review.reviewRating`; show and label
the five custom dimensions. Do not use `AggregateRating` without actual aggregate
user-rating data. Keep public editorial content accessible to legitimate search
and AI search crawlers, including OAI-SearchBot; GPTBot is a separate optional policy
decision. Avoid bot-specific duplicate text, keyword stuffing, or special AI-only
files as a substitute for useful accessible content. Verify raw HTML, not just the
DOM after JavaScript. Document gaps honestly; do not claim full compliance today.
