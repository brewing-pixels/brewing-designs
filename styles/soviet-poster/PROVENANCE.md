# Provenance — soviet-poster

## Origin
Extracted from the **AIUR** project (`/rabotilnica/aiur`) on **2026-10**, where it
shipped as the original `gateway.css` theme (plus `galerija.css` and `upload.css`
extensions). AIUR's UI is Macedonian Cyrillic; the style itself is language-neutral.
Also internally known as `aiur-poster` / `propaganda` / `orange-poster`.

It was extracted and archived before AIUR adopted the newer `soviet-hud` skin, so
the original poster look is preserved as a reusable style.

## Code
`theme.css`, `tokens.json`, `demo.html`, `DESIGN.md` — original work by Nikolche,
refactored from the AIUR sources into a portable token + component system.
Released under the **MIT License**.

## Fonts
The style is font-agnostic but is designed around **Russo One** (display) and
**Play** (text), both licensed under the **SIL Open Font License 1.1**. They are
*not* bundled here; a host project brings its own fonts and points `--f-display` /
`--f-sans` at them.

## Trademarks
No third-party trademarks, logos, or copyrighted art are included. The
constructivist decoration is generic geometric primitives drawn in CSS.
