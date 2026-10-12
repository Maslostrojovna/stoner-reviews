# Stoner Reviews — extracted visual identity

Extraction date: 12 October 2026. This documents the existing **Illustrated Escape** direction; it does not select new creative options. Generated artifact paths below are relative to this file. Original reference filenames refer to the parent `BrandKit/` folder. The supplied originals were left unchanged.

## Evidence and scope

Inspected every root-level PNG: `stoner-reviews-brand-kit-v2-wizard.png` (1448×1086), `stoner-reviews-lettering-redraws.png` (1536×1024), both `midnight-screening-room-*.png` website proposals (1086×1448), and `interstellar.png`, `fear-and-loathing.png`, `wolf-of-wall-street.png`, `matrix.png`, `coherence.png` (each 1254×1254). The nine-panel overview acts as identity board/moodboard and includes digital, print, illustration and social examples. There is no separate root-level moodboard or standalone master logo.

Read root supporting text: `brand-kit-v2-wizard-prompt.txt`, `lettering-redraw-prompt.txt`, `edit-prompt.txt`. Prompts establish intent, not successful execution or a blanket approval of every generated result. Ignored `OLD/`, `instagram-original-colors-wizard/`, `.DS_Store` and ZIP contents. No font, vector, layered design or website source files are present at this level.

Confidence labels used throughout:

- **Confirmed intent:** explicit text in the board or root prompts.
- **Observed / measured raster:** visible repeated characteristics or measurements in PNGs.
- **Estimated:** approximate proportions and implementation equivalents inferred from flattened references.
- **Unresolved:** references cannot establish a production decision.

## Visual personality

Confirmed language: “Illustrated Escape”; “Creative. Laid-back. Otherworldly.” Core repeated line: “Same movies. Bigger perspective.” The website uses “Cinema, from another angle” and “Worth getting lost in.” The board also shows “Find your next escape” and “Good movies hit different.” These are distinct existing copy examples, not one mandatory headline.

Observed character: warm, knowing and cinematic; relaxed film culture expressed through enormous landscapes, cosmic suns, improbable cities and small human viewers. The wink comes from a sunglasses-wearing wizard, not cannabis symbolism. Heavy cream lettering and warm coral/apricot light anchor dense teal environments. Quiet, structured editorial UI contains richly textured illustration. The direction feels like a vintage screenprinted movie poster interpreted as an otherworldly viewing experience.

## Colour

| Name | Current confirmed HEX | Existing role |
|---|---|---|
| Midnight | `#081113` | Near-black canvas, dark identity panels |
| Deep Teal | `#002A2F` | User-confirmed brand field and logo-preview background; illustration shadows |
| Sage | `#83A58B` | Supporting greenery, muted accents, website eyebrow |
| Cream | `#F4DFBA` | Logo, display type, pale panels and print stock |
| Apricot | `#FF9B57` | Logo underline, links, CTA, warm highlights |
| Ember | `#D85B31` | Secondary warm illustration accents |
| Sunset | `#C94736` | Red/orange scenic light, sun motif |

The user confirmed **Deep Teal `#002A2F`** on 12 October 2026. This supersedes the historical `#073E42` label in overview panel 05 and its prompt. The other six colours retain those references’ explicit values. Use the current palette for reusable artifacts; the original board and prompts remain historical evidence, not updated specifications. This does not claim that every PNG pixel matches. Raster sampling shows deviations from those labels: approximate swatch interior medians include Deep Teal `#014649`, Sage `#829F85`, Cream `#F9E0BA`, Apricot `#FD9552`. Texture, lighting and generation introduce many adjacent colours. These samples are diagnostics, not extra canonical brand colours.

Website field medians in a quiet left-hand region (normalized x 1–3%, y 41–48%) are teal `#002A2F` and dark `#00171A`. The user has confirmed the teal sample as canonical Deep Teal. The dark sample remains a historical comparison, not another value for Deep Teal. The lettering exploration prompt separately specifies `#072F34`, `#FFE6C5`, `#FFAA76`; its PNG varies too. Social skies and highlights introduce coral-pink, pale peach and lighter teal/sage beyond the seven flat labels. Do not force the artwork into a seven-colour indexed palette or promote every scenic shade into UI tokens.

## Typography and hierarchy

**Confirmed intent:** overview panel 06 names **Recoleta Alt** for headlines and **Kollektif** for supporting text. Its prompt explicitly calls the specimens “visual interpretations.” Neither authentic font files, exact cuts nor licensing evidence are supplied. Family naming is known; exact matching to rendered glyphs is not verified.

**Observed:** display headings are heavy, rounded/flared serif forms with broad bowls and tight stacked lines. Website body and navigation are simple sans; small labels use uppercase and expanded tracking. Social film titles are very large cream serif capitals, often with enlarged initial letters/small-cap-like proportions; they cannot be assumed to be standard uppercase Recoleta. The wordmark is separate artwork and must not be replaced by a font setting.

| Role | Reference behaviour | Confidence |
|---|---|---|
| Website hero | Two lines, left aligned; cap/glyph height roughly 65–80px at 1086px canvas width | Estimated visible glyph size, not recovered CSS font size |
| Feature heading | Three tightly stacked lines; roughly 45–55px glyph height | Estimated |
| Card heading | Cream serif; roughly 25–30px glyph height | Estimated |
| Body/button | Sans; roughly 14–18px glyph height, button visibly stronger | Estimated; weights unverified |
| Eyebrow/navigation | Uppercase sans; roughly 10–14px glyph height, generous tracking | Estimated |
| Social title | 1–3 lines, bottom left; roughly 90–160px major glyph height at 1254px | Estimated; fit varies by title |
| Social tagline | Single-line sans beneath title, roughly 25–32px glyph height | Estimated |

Display line-height around 0.9–1.0 and label tracking around 0.15–0.25em are implementation estimates. Numeric font weights remain unresolved. `brand.css` supplies family hooks without inventing font files or declaring an exact display weight. Browser fallbacks are functional substitutes only and do not reproduce the identity.

## Layout, spacing and proportions

No original spacing grid is recoverable. Do not claim an 8px system from screenshots.

Website observations at 1086×1448: content begins around x=45–46px (~4.2% inset); usable width is roughly 998px (~92%). Header divider is around y=70px; illustrated hero ends around y=564px (~52% of width). Mood choices form four equal bordered tiles with approximately 16–18px gaps. Feature section places a large image (~627px wide) beside copy (~338px), with ~33px between. Lower editorial cards form three columns, ~325px each with ~18–20px gaps. Major sections use thin rules. Most content remains left aligned. Hero text overlays a quieter left part of the scene; the right carries the cosmic spectacle. Rectangular CTA and cards have square corners. Rounded corners occur on overview presentation panels and avatar examples, not as a universal website card rule.

Social: square full-bleed artwork. Logo sits upper left, roughly 35–43% of canvas width and ~3–4% from edges, with mascot left and stacked name right. The prompt asks for approximately 38%, but rendered sizes vary. Titles sit in the bottom-left dark area, typically occupying the last ~15–32% of height depending on line count. Tagline sits beneath, roughly 4–5% above the lower edge. Insets roughly 35–50px (~3–4%). Title width and size respond to film-name length; no fixed CSS size is justified. There are no enclosing logo panels on the covers.

Overview: three columns × three rows; approximately 20px outer side margins and ~9–12px gutters, thin light panel borders, small numbered labels. This is a case-study presentation grid, not the website layout.

## Logo and distinctive motifs

Observed across the overview, websites and social: bent pointed wizard hat with broad brim, sunglasses with **sr** in the viewer-left lens and **rs** in the viewer-right lens, small separate nose, smile and sweeping split/S-shaped beard. Cream positive shapes reveal dark/teal negative space. Wordmark reads “Stoner” over “Reviews,” with a warm apricot zigzag underline. Overview also shows a compact single-line name beside a smaller wizard, plus icon-only dark-on-cream and reversed examples.

Reuse a single approved master once supplied. Current generated instances differ slightly in hat contour, lens letters, beard and lettering. The five numbered lettering proposals explore different constructions (wedge serif, rounded slab, flared, italic brush and frame-cut geometric). No redraw-board number is selected. The user subsequently selected the logo and lettering from the overview, panel 01, for vector reconstruction. The redraws remain alternatives, not interchangeable logo styles.

Recurring illustration patterns: tiny viewer versus enormous landscape; sunset/planet/black-hole disc; winding river/road as an eye path; layered foreground silhouettes; warm rim light; distressed ink/grain; dense directional contours. Wizard is the identity. Sun/river/portal forms remain scenery. Supporting motifs include outline glasses, clapperboard, ticket, landscape, wavy gesture, mood icons and five-position ratings.

## Inconsistencies and unresolved decisions

1. Palette labels describe intent, while actual raster colours differ. Social posts are notably pinker/lighter in their highlights. Keep artwork variation separate from flat UI colours.
2. Two website proposals share composition but use different background darkness. The user has now confirmed the teal sample `#002A2F` as Deep Teal; `#00171A` remains a comparison. This colour selection does not establish every other website implementation decision.
3. Logo renderings vary in geometry and relative mascot/wordmark size. The overview panel 01 primary lockup is now selected for the SVG. Social logo widths exceed or fall below the prompt’s approximate 38%.
4. Lettering exploration offers five distinct alternatives; the overview’s rounded serif wordmark remains the repeated incumbent, but the user has now selected overview panel 01 as the reconstruction source; original vector master remains missing.
5. Film-title letterforms and scales vary. Recoleta Alt intent does not prove the social titles were set in that font.
6. Most social taglines use regular-looking sans; Wolf uses a stronger weight, shifts its tagline inset and adds an extra short orange underline beneath the title. This is an observed exception, not a mandatory template element.
7. Board’s compact website example differs from both full-page proposals in headline and CTA form. Keep those as separate compositions.
8. Board numbering, borders, labels and construction guides are presentation devices, not automatically brand application components.

Still needed: final website implementation details; original authoritative vector geometry; font files/exact weight cuts and licensing; clear-space and minimum-size rules; mobile layouts and breakpoints; hover/focus/disabled states; full review-page typography; motion behaviour. None is invented here.

## SVG reconstruction — selected source

Following user selection, `stoner-reviews-logo.svg` reconstructs the **large primary lockup in overview panel 01**, including the wizard, the exact illustrated stacked lettering and the zigzag underline. It does not use any of the five redraw proposals. The transparent SVG contains 27 Bézier path elements and no embedded bitmap, font dependency or live text. ViewBox: 460×225, based on source crop x=36..496, y=88..313. This crop margin is not a newly approved clear-space rule.

Method: isolate cream and orange silhouette masks from the selected crop at 4× sampling, trace their contours as spline paths and retain negative spaces, including “sr”/“rs” lens details and letter counters. Use confirmed intended Cream `#F4DFBA` and Apricot `#FF9B57` rather than preserving raster shading. The dark field is transparent negative space, so place this cream version over a dark background. Shape contours are **raster-derived estimates**, not original master geometry. No alternate lockup, new lettering, rearrangement or icon redraw has been introduced.

Validation: rendered SVG inspected beside the original crop; both lens labels, hat silhouette, smile, beard, wordmark counters and underline checked. Binary silhouette overlap at 4× sampling is 97.86% (intersection-over-union against extracted masks). This checks contour fidelity to the extracted raster, not approval or recovery of original authoring paths. `stoner-reviews-logo-validation.png` shows source and vector side by side. Remaining differences are flat canonical colour, removal of raster shading/texture and subpixel contour smoothing. For authoritative master precision, an original SVG/AI/EPS/PDF with outlined lettering would still be preferable; it is no longer required to use this reconstructed SVG.

## Validation against originals

| Source | System match | Limits / differences preserved |
|---|---|---|
| Overview panels 01–02 | Wizard, cream/teal reversal, stacked and compact lockups | Panel 01 SVG contours reconstructed from raster; no invented clear-space formula |
| Overview 04–06 | Illustrated Escape, seven named colours, serif/sans hierarchy | Labelled intent distinguished from pixel colour and authentic fonts |
| Overview 07–09 | Matte poster/ticket mood, cinematic environment, avatar and outline details | Mockup dimensions and exact icon paths not recovered |
| Lettering board | Wizard + stacked words + zigzag; five alternatives documented | Overview lettering selected; redraw-board candidates unused; exploratory colours separate |
| Teal website | Inset, hero, four mood tiles, feature split, three cards, rating rows | Sampled teal field confirmed by user as canonical Deep Teal |
| Dark website | Same structure and scale | Historical dark comparison; not canonical Deep Teal |
| Interstellar | Upper-left lockup, one-line title, black-hole escape scene | Long title fitted; coral art retained |
| Fear and Loathing | Lockup, three-line title, giant sun/city/car scene | Tall title occupies more lower-left space |
| Wolf of Wall Street | Lockup, two-line title, layered city perspective | Extra title stroke and heavier tagline recorded as exception |
| Matrix | Lockup, two-line title, teal city/coral light | Code-rain motif is film-specific, not general brand ornament |
| Coherence | Lockup, one-line title, repeated houses/cosmic beam | Larger initial C and broad title, not normalized |

Validation method: direct visual inspection of all nine root PNGs; native dimensions and RGB sampling with Pillow; measured proportions referenced to source canvas, not guessed original CSS. Every exported token has evidence/status metadata. CSS is an opt-in extraction scaffold, not a pixel-perfect website rebuild; no browser implementation or responsive reference is supplied to validate. Original file SHA-256 hashes were compared after writing. See `COMPONENTS.md` for reusable patterns and boundaries.


## Wizard version 2 trial

The user supplied a closer wizard reference on 12 October 2026 and asked to try it in the SVG logo. `stoner-reviews-logo-v2.svg` uses this wizard reversed to Cream, beside the unchanged overview lettering and Apricot underline. `stoner-reviews-wizard-v2.svg` provides the same wizard alone in Deep Teal. Both have transparent backgrounds; the prior SVG is retained and the trial does not replace the primary selection.

Source: attachment `codex-clipboard-8192776a-e575-4913-924f-9eeb37c31d61.png`; crop (67,60)–(1005,1133). Construction guides excluded by tonal separation. Pixel steps smoothed using a 4px-radius pretrace filter at attachment scale; spline contours remain raster-derived approximations. Wizard fitted proportionally into the previous left-hand placement; wordmark and underline path attributes verified unchanged. Both lens labels and negative spaces visually checked. Binary silhouette overlap against isolated original attachment mask: 97.59%. SVGs contain genuine paths, no bitmap or live font. See `stoner-reviews-logo-v2-preview.png`. Original assets remain unchanged.


## Wizard version 3 — latest supplied reference

`stoner-reviews-wizard-v3.svg` reconstructs the large black wizard from attachment `codex-clipboard-7bc36697-23c4-4187-b40e-1a0a97cacf27.png`, crop (420,28)–(1112,804). The small presentation labels and bottom-row examples are excluded. This version preserves the paired lens-reflection strokes, sr/rs lens lettering, rounded glasses, hooked hat and sweeping beard. Standalone artwork is black with transparent negative spaces, matching the source treatment.

`stoner-reviews-logo-v3.svg` pairs that wizard, uniformly scaled and reversed to Cream, with the existing overview wordmark and Apricot underline. Lettering and underline path attributes are verified unchanged. Earlier versions are retained. The user selected this source for a new reconstruction; final primary-version approval is not inferred.

Contours traced as genuine Bézier paths at 2× source sampling, without the stronger blur used for the pixelated v2 reference. Solid fills replace raster texture. Rendered output visually checked against the source, including lens reflections and letter counters. Silhouette intersection-over-union: 99.01% against thresholded source. This is a fidelity measurement, not recovery of original authoring geometry. Both SVGs have no embedded image or live font. Preview: `stoner-reviews-logo-v3-preview.png`. Original source files remain unchanged.


## Canonical Deep Teal — user confirmation

Deep Teal is **`#002A2F`**, confirmed by the user on 12 October 2026 after comparing the latest logo against the sampled website backgrounds. This is the current production value in `design-tokens.json`, `brand.css` and generated brand-background previews. Earlier `#073E42` labels in original artwork/prompts are historical and superseded. Midnight remains `#081113`; the dark comparison remains `#00171A`. Transparent SVG lockups retain their Cream/Apricot paths; any generated SVG using the old Deep Teal fill is updated to the canonical value. Original illustration/board PNGs and source prompts are preserved.


## Installed display font

The user installed `Recoleta Alt Bold.otf` locally. Font metadata confirms full name **Recoleta Alt Bold**, PostScript name **RecoletaAlt-Bold**, family **Recoleta Alt**, weight **700**. `brand.css` now declares this face through `local()` and the reference page uses it for live display text. No font binary is copied or embedded for distribution. Kollektif still lacks a supplied file. Original raster-cut matching remains unresolved; a local desktop installation does not establish hosted webfont licensing. Earlier font-absence observations describe the initial extraction.
