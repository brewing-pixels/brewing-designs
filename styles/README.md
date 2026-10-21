# designs / styles

Reusable **web UI style systems**. Each style is a self-contained, portable
design direction: tokens + CSS + spec + preview, decoupled from any one project.

## Styles

| Style | Vibe | Modes | Status |
|---|---|---|---|
| [`neon-hud/`](neon-hud/) | sci-fi / tactical HUD — cyan chrome, clipped corners, scanlines | dark + light | ready |
| [`construct-poster/`](construct-poster/) | flat cell-shaded constructivist poster — hard borders, sharp offset cell-shadows, orange / violet chrome | light (2 accents) | ready |
| [`moderncraft-hud/`](moderncraft-hud/) | industrial metallic HUD — graphite panels, near-black cards, one active accent, 45° accent hatch, six presets | dark + light (6 accents) | ready |
| [`mechcraft-hud/`](mechcraft-hud/) | command-console HUD — layered metal, black screens, amber/cyan | dark + light | ready |
| [`systemcraft-hud/`](systemcraft-hud/) | hybrid systems HUD — Mechcraft cards/type, Moderncraft texture, 3-colour role assignment (27 combos), combined header | dark + light (27 role combos) | ready |

## Anatomy of a style

```
<style-slug>/
  DESIGN.md       # the spec: palette roles, shape, texture, type, do/don't, a11y, provenance
  theme.css       # drop-in portable CSS: tokens + base + starter components + ornaments
  tokens.json     # DTCG tokens (primitive → semantic); generate other platforms from this
  demo.html       # self-contained preview (open in a browser)
  preview.png      # 1440x900 screenshot of the example page in this style
  ornaments/      # any asset art the style needs (optional)
  PROVENANCE.md   # origin + licensing
```

## How to use a style in a project

1. Read `DESIGN.md`. Copy `theme.css` (or just its token block) into the project,
   or reference it alongside your own CSS.
2. Set `<html data-theme="<slug>" data-mode="dark|light" data-orn="css|art|minimal">`.
3. **Re-point the PROJECT SLOTS** (`--acc`, `--acc-soft`, `--acc-line`,
   `--acc-ink`, and `--good/--warn/--bad/--info`) to the project's brand/status
   colours. The style stays brand-neutral otherwise.
4. Point `--f-sans` / `--f-mono` at the project's fonts.
5. Verify WCAG contrast for every text/background pair you introduce.

## How to add a style

Duplicate a style dir, update `DESIGN.md` + `tokens.json` + `theme.css`, add a
`demo.html` + `preview.png`, record `PROVENANCE.md`, and list it in the table
above. If a style is extracted from a project, note the source there.

## Discovery

Agents find this library via the `style-library` skill (and the
`designs-library` entry in `opencode.json` → `references`). Keep the table above
current so the index stays useful.
