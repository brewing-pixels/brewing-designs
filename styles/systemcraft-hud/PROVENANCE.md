# Provenance — systemcraft-hud

## Origin

- **Authored:** 2026-10-21, for the Overmind Gateway UI (`/rabotilnica/_overmind_/gateway`).
- **Extracted / generalised:** the gateway's theme tokens, component rules, and
  the 45° accent hatch were reduced to a portable, brand-neutral style.
- **Author:** Nikolche / PixelWeave (project work), with Fenix.
- **Status:** ready; used in the Overmind Gateway (dark/light, six accents).

The design direction is original CSS and token work. It borrows only generic
HUD conventions: graphite metal, one accent, tabular numerics, a diagonal
texture. No third-party component library, template, or theme file was copied.

## Licensing

- **Code / CSS / tokens / demo:** MIT. Use, modify, and redistribute freely;
  keep this provenance note with substantial copies.
- **Preview:** generated from `demo.html` in this directory; same licence as
  the demo.
- **Fonts:** none bundled. The style uses system sans/mono stacks. If a host
  substitutes a display font, that font's licence applies.
- **Images / ornaments:** none. The style has no image assets and no
  `ornaments/` directory.

## The StarCraft logo — deliberately excluded

Overmind's application header uses the **StarCraft Command Center wireframe**
from the StarCraft Fandom/Wikia wiki:

`https://static.wikia.nocookie.net/starcraft/images/c/cb/SCRTB_Command_Center_Wireframe.png`

That image is a third-party game asset and is **not** included in this style
library. It is used by Overmind as a personal/LAN application mark; it should be
replaced with an original mark before any public distribution. The style itself
is independent of it: `theme.css`, `tokens.json`, `demo.html`, and `preview.png`
contain no StarCraft artwork, logos, screenshots, or fonts.

Accent preset names (`terran`, `horde`, `zerg`, `protoss`, `night-elf`, `human`)
are descriptive labels for the six palettes. They do not imply affiliation with
or endorsement by Blizzard Entertainment or any other rights holder.

## Changes from the source UI

- Removed all Overmind-specific content, project data, and the Command Center
  logo.
- Replaced the app's brand name with the neutral `SYSTEMCRAFT` demo mark.
- Renamed the app's component classes to the portable `sc-*` prefix.
- Kept the six accent values and both mode token sets verbatim.
- Added the `tokens.json` DTCG export, `DESIGN.md`, demo, and preview.
- No behavioural changes to the colour system.
