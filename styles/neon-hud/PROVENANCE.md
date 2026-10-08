# Provenance — neon-hud

## Origin
Extracted from the **Senzu** project (`/rabotilnica/senzu`), where it shipped as the
`star` UI theme, on **2026-10-08**. The theme was originally a "StarCraft HUD"
direction; it is published here under the neutral name **neon-hud** to avoid the
Blizzard trademark. Internal aliases `star` / `starcraft` / `cyan-hud` may still
appear in the source project.

## Code
`theme.css`, `tokens.json`, `demo.html`, `DESIGN.md` — original work by Nikolche.
Released under the **MIT License**.

## Fonts
The style is font-agnostic. The Senzu source uses **Arsenal** (Google Fonts),
licensed under the **SIL Open Font License 1.1**; it is *not* bundled here — a
host project brings its own font and points `--f-sans` / `--f-display` at it.

## Ornaments (`ornaments/corner.png`, `ornaments/emblem.png`)
Generated with **ComfyUI / qwen-image-2.1** for the Senzu project (chrome HUD
filigree), 2026-10. Original generated artwork; treat as covered by the same
MIT grant for reuse. If a stricter provenance is ever needed, regenerate from the
prompt recorded in the Senzu repo (`tools/assets/gen_ornaments.py`).

## Trademarks
No third-party trademarks, logos, or copyrighted art are included. Any
resemblance to a specific game's UI is stylistic only.
