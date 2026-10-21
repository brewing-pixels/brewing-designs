# Provenance — centercraft-hud

## Origin

- **Authored:** 2026-10-21, for the Overmind Gateway command-console exploration.
- **Author:** Nikolche / PixelWeave, with Fenix.
- **Status:** ready; the gateway demo uses it with a temporary Reskin ↔ Briefing
  layout switch.
- **Name:** “centercraft” is a working style label: a center-command console,
  not an affiliation with StarCraft or Blizzard Entertainment.

The CSS, token architecture, demo, command components, and layouts are original
work. The style borrows only generic real-time-strategy HUD grammar:
a central command deck, side instrument pods, layered metal/glass, small caps,
mono numbers, status lamps, and a warm/cold accent tension.

## Reference analysis

The following images were supplied by the owner for composition, palette, and
material analysis only. They are **not bundled** in this directory, and no
screenshots, logos, portraits, unit art, icons, fonts, or extracted textures
from them are included.

- `https://i.imgur.com/SJc5Whm.png`
- `https://i.imgur.com/fbiSj6R.png`
- `https://i.imgur.com/sJc5LRA.png`
- `https://i.imgur.com/zfR2lsW.png`
- `https://static.filehorse.com/screenshots/games/starcraft-2-screenshot-01.png`
- `https://static.filehorse.com/screenshots/games/starcraft-2-screenshot-02.png`
- `https://static.filehorse.com/screenshots/games/starcraft-2-screenshot-03.png`
- `https://i.imgur.com/VbKqP2T.png`
- `https://i.imgur.com/HlWeyV7.png`
- `https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/11/starcraft-2-legacy-of-the-void-3player-coop-1.jpg?q=49&fit=contain&w=3000&h=1500&dpr=2`
- `https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/11/starcraft-2-wings-of-liberty-reversed-4.jpg?q=49&fit=contain&w=3000&h=1500&dpr=2`

Reference analysis is recorded in `DESIGN.md` under “Reference read”. The
style is an adaptation for web project-operation screens, not a game skin.

## Licensing

- **CSS / tokens / demo / preview:** MIT. Use, modify, redistribute; keep this
  provenance with substantial copies.
- **Saira Condensed:** SIL Open Font License 1.1. Font files are in `fonts/`
  with `fonts/OFL.txt`.
- **Other fonts:** none. Body and mono use system stacks.
- **Images / ornaments / game art:** none.
- **Preview:** generated from `demo.html`; same licence as the demo.

The Overmind application header uses a separate third-party StarCraft Command
Center wireframe asset for personal/LAN use; it is not part of this style and
should be replaced before public distribution. No Overmind branding or Command
Center artwork appears in `theme.css`, `tokens.json`, `demo.html`, or
`preview.png`.
