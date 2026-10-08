# Provenance — soviet-hud

## Origin
Created **2026-10** for the **AIUR** project (`/rabotilnica/aiur`), where it
replaced the earlier `soviet-poster` (flat cell-shaded) theme. It descends
stylistically from `neon-hud` (the cyan "StarCraft HUD" style extracted from
Senzu) — dense, clipped, instrument-like — with a Soviet constructivist twist
(heavy square borders, star/chevron motifs, diagonal stripes) and two accent
variants (crimson, purple) across dark + light.

Also internally known as `aiur-hud` / `crimson-hud` / `purple-hud`.

## Code
`theme.css`, `tokens.json`, `demo.html`, `DESIGN.md` — original work by Nikolche.
Released under the **MIT License**.

## Fonts
The style is font-agnostic but is designed around **Russo One** (display) and
**Play** (text), both **SIL Open Font License 1.1**. They are *not* bundled here;
a host project brings its own and points `--f-display` / `--f-sans` at them.

## Ornaments (`ornaments/star.svg`, `ornaments/chevron.svg`)
Original SVG geometry authored for this style (a five-point star and a triple
chevron). Rendered as CSS `mask` images and tinted with `--chrome`, so no colour is
baked in. Released under the same MIT grant.

## Trademarks
No third-party trademarks, logos, or copyrighted art are included. Any resemblance
to a specific game's UI is stylistic only.
