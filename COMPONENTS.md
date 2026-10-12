# Stoner Reviews — reusable patterns

Use with `BRAND.md`, `design-tokens.json` and `brand.css`. These describe existing compositions; they do not add a redesigned interface. All dimensions marked estimated are starting points for matching the raster references, not approved engineering specs.

## Logo lockups

Primary: cream wizard left, stacked cream name right, apricot zigzag beneath name. Compact: smaller wizard and single-line name as shown in overview panel 01. Avatar: dark wizard on cream or cream wizard on teal. Use `stoner-reviews-logo.svg` for the selected primary lockup. It is a transparent, raster-derived Bézier reconstruction of overview panel 01, with Cream and Apricot fills; no live font is needed. Never replace the mark with CSS text, emoji or generic wizard artwork. Original master vectors and compact/icon-only vectors are not supplied. Clear space and minimum display size are unresolved; avoid clipping and verify lens lettering remains readable. Never include panel labels or construction guides in the exported logo.

## Website header and hero

Sources: both `midnight-screening-room-*.png`. Header: left logo, centered/upper navigation, right search icon, thin cream-toned rule. Full-width illustrated hero; left eyebrow, large two-line serif title, painted underline and rectangular apricot CTA; scene’s viewer/screen sit right. The brush underline is artwork, not a rounded CSS border. Estimated content inset 4.2%; hero height ~52% of raster width. Board panel 03 instead has a compact headline and round arrow CTA; do not combine these layouts by default.

No navigation destinations, mobile menu behaviour or search interaction were provided. CSS covers documented visual primitives only.

## Mood tile

Four equal columns: outlined warm icon, cream sans label, right arrow; thin cream-toned border and square corners. Labels shown: A good laugh, A strange trip, Big feelings, A little wonder. Estimated gap ~1.5% of canvas width. Exact icon drawings, hover and selected states unknown.

## Feature review

Image left, text/rating right; approximate width ratio 63:34 with remainder as gap. Eyebrow, tightly stacked cream serif title, short sans description, apricot underlined review link. Five rating rows: outline icon, label, five circular positions, filled apricot and hollow unfilled positions, subtle separators. Observed labels: Fun, Action, Mind-blowing, Smart, Feels. This is a multi-axis rating; board mini-cards separately show stars. Do not substitute one for the other.

## Editorial card row

Three columns beneath a section divider and spaced uppercase eyebrow. Landscape image, cream serif title, tiny uppercase multiline description, right arrow. Images approximately 2:1 at the reference scale; tile photographs are actually textured illustrations. No enclosing filled rounded panel. Match text length and crop to the source rather than adding large decorative shadows.

## Social review cover

Sources: five square film PNGs. Layer order: full-bleed illustrated environment; upper-left integrated lockup; lower-left cream film title; supporting tagline. Approximate inset 3.5%, logo width 35–43%; artwork must provide dark enough space behind both text zones. Title wraps according to length: Interstellar/Coherence one line, Matrix/Wolf two, Fear and Loathing three. Avoid a rigid common title size. Use final title artwork or authentic approved font setting once verified.

Maintain the repeated tagline “Same movies. Bigger perspective.” Wolf’s short orange title stroke and heavier tagline are a recorded variant. Do not extend the stroke to all covers without selection. Keep character, sun, buildings and film-specific motifs from being obstructed by the overlay.

## Print/ticket and details

Overview panel 07: illustrated upright posters and pale horizontal admission ticket with wizard, name and `stoner.reviews`. Panel 09: cream circular avatar, scalloped/notched “Worth the trip” badge with stars, restrained outlined film/ticket/glasses/landscape icons. Dimensions, trim, bleed, stock specification and production paths are not available. These are documented treatments, not print-ready templates.

## CSS consumption and confidence

`brand.css` has no reset or external imports; its `@font-face` loads the locally installed Recoleta Alt Bold through `local()`; all classes use the `sr-` prefix. Palette variables are confirmed values. Deep Teal is `#002A2F`, explicitly confirmed by the user; it supersedes the old overview label. Family hooks use the board’s named fonts. Recoleta Alt Bold is now available locally at weight 700; Kollektif remains unavailable. Generic fallbacks visibly change the result. Numeric geometry, line height, tracking and border alpha are explicitly estimated. Supporting text uses browser normal; display uses the installed Bold cut at 700, without claiming recovery of the raster’s original cut.

```html
<link rel="stylesheet" href="brand.css">
<section class="sr-surface sr-surface--teal">
  <div class="sr-container">
    <p class="sr-eyebrow">Cinema, from another angle.</p>
    <h1 class="sr-display">Worth getting lost in.</h1>
    <a class="sr-button" href="/reviews">Explore the reviews →</a>
  </div>
</section>
```

This demonstrates class wiring only, not the illustrated hero’s complete composition. Choose `sr-surface--dark-proposal` only to reproduce the dark reference. Base `sr-surface` uses the named Midnight palette token and is not either exact screenshot background. No responsive breakpoints, additional logo lockups, painted underline, typography sizing scale or interaction states are silently supplied. Set heading sizes per verified application; source glyph heights are documented in `BRAND.md`.


## Alternate wizard trial

`stoner-reviews-logo-v2.svg`: attached wizard + prior overview lettering/underline; Cream/Apricot, transparent. `stoner-reviews-wizard-v2.svg`: isolated attached wizard in Deep Teal, transparent. Trial alongside first reconstruction; source limits and validation in BRAND.md.


## Latest wizard source: version 3

Use `stoner-reviews-logo-v3.svg` to review the latest supplied wizard with existing lettering/underline, or `stoner-reviews-wizard-v3.svg` for its black standalone form. Transparent backgrounds; lens reflections retained. Prior versions remain available. Reconstruction provenance and validation appear in BRAND.md.


## Canonical background colour

Use `--sr-deep-teal` (`#002A2F`) for Deep Teal brand fields and logo previews. `sr-surface--teal` applies it; `sr-surface--teal-proposal` remains a compatibility alias. Base `sr-surface` still represents Midnight (`#081113`); `sr-surface--dark-proposal` is the historical dark comparison (`#00171A`). The colour selection does not change logo contour geometry.
