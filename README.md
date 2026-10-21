# brewing-designs

Portable web UI style systems: tokens, CSS, specs and previews. Five complete
directions, one specimen page, no build step.

**Live showcase:** <https://brewing-pixels.github.io/brewing-designs/>

| Style | Modes | Extras |
|---|---|---|
| [`neon-hud`](styles/neon-hud/) | dark + light | `data-orn`: `css`, `art`, `minimal` |
| [`construct-poster`](styles/construct-poster/) | light | `data-accent`: `orange`, `violet` |
| [`moderncraft-hud`](styles/moderncraft-hud/) | dark + light | `data-accent`: six presets |
| [`mechcraft-hud`](styles/mechcraft-hud/) | dark + light | single amber/cyan console palette |
| [`systemcraft-hud`](styles/systemcraft-hud/) | dark + light | independent prime/secondary/tertiary roles (27 combos) · Sahara/Grid |

Each style is a self-contained directory: `theme.css`, `tokens.json`,
`DESIGN.md`, `demo.html`, `preview.png`, `PROVENANCE.md` and any licensed fonts
or ornaments. The example page is a single static HTML page that switches
between all five without a reload.

## Use a style

Read the style's `DESIGN.md`, copy or reference `theme.css`, and set the root
attributes:

```html
<html data-theme="neon-hud" data-mode="dark">
<link rel="stylesheet" href="styles/neon-hud/theme.css">
```

Re-point `--acc` / `--acc-soft` / `--acc-line` / `--acc-ink` and the status
colours to the host project's palette. See
[`styles/README.md`](styles/README.md) for the style index and
[`example-page/README.md`](example-page/README.md) for the specimen.

## Repository layout

```text
styles/        # the five portable style systems
example-page/  # the GitHub Pages specimen (static; no build)
```

## License

The code, documentation and preview images are MIT licensed. Bundled Saira
Condensed is under the SIL Open Font License; Play and Russo One are loaded
from Google Fonts under the OFL. See [`LICENSE`](LICENSE) and
[`THIRD_PARTY.md`](THIRD_PARTY.md).
