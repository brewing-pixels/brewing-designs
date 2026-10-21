# neon-hud

**A sci-fi / tactical HUD web style.** Deep space-blue neutrals, a single cyan
"chrome" colour, sharp 45° clipped corners, horizontal scanlines, and reticle
ornaments. Dark-first, with a light variant. Data-dense, instrument-like —
built for dashboards, terminals, monitoring UIs, and command decks.

- Aliases: `star`, `starcraft`, `cyan-hud` (internal names in the Senzu project).
- Extracted from: Senzu (`/rabotilnica/senzu`), theme `star`, 2026-10-08.

## Files

| File | What |
|---|---|
| `theme.css` | Drop-in portable CSS: tokens + base + starter components + ornaments. |
| `tokens.json` | DTCG tokens (primitive → semantic). Generate CSS/other platforms from this. |
| `demo.html` | Self-contained preview (open in a browser). |
| `ornaments/corner.png`, `ornaments/emblem.png` | The `data-orn="art"` art. |
| `PROVENANCE.md` | Origin + licensing of code and art. |

## Palette

The whole style is **neutrals + one chrome hue**. Neutral = deep desaturated
space blue; chrome = cyan. Nothing else is coloured except the host's accent.

| Role | Dark | Light |
|---|---|---|
| bg | `#070b0f` | `#eef3f7` |
| surface | `#0d1420` | `#fbfdff` |
| surface-2 | `#111b2a` | `#eef4f9` |
| line | `#1d2c40` | `#cdd9e4` |
| ink | `#dbeaf5` | `#0d1b26` |
| ink-2 | `#9fb6cc` | `#3c5163` |
| mut | `#6b8299` | `#6b8093` |
| **chrome** | `#3fd0e6` | `#0f7f93` |
| chrome-line | `#245c6b` | `#7fb6c2` |

**Project slots (NOT part of the style):** `--acc` (brand accent), `--acc-soft`,
`--acc-line`, `--acc-ink`, `--good/--warn/--bad/--info` (status semantics). The
style renders fine with its fallbacks (`--acc` defaults to `--chrome`); a host
re-points them to its own brand. Keeping these as slots is what makes the style
reusable across products.

## Shape

Sharp, machined. Everything is clipped with a 45° cut on **top-left** and
**bottom-right** — the signature HUD silhouette.

```css
--clip-panel: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
--clip-btn:   polygon(0 6px, 6px 0, 100% 0, 100% 100%, 6px 100%, 0 calc(100% - 6px));
```

Radius vars still exist (`--r-sm/md/lg`) but are largely overridden by the clip
for the characteristic corners. Small chrome top-ticks (`.stat::before`,
`.kpi`) add instrument detail.

## Texture

A faint horizontal **scanline** overlay (`body::before`, `--tex`), ~3px pitch,
4.5% cyan. This is the single most "HUD" cue. Disabled in light mode. Keep it
subtle — it should read as a CRT sheen, not stripes.

## Ornaments (`data-orn`)

- `css` — pure-CSS **reticle corner ticks** (16×2px chrome brackets). Cheap, no assets. Default.
- `minimal` — no ornaments, no clip. For when the HUD reads as too much.
- `art` — generated `corner.png` + `emblem.png` (chrome filigree) via `--orn-corner` / `--orn-emblem`.

The generated art is a nice-to-have; the style is complete without it.

## Type

HUD register: a **humanist sans** for text, **monospace + tabular numerals** for
data. Senzu uses *Arsenal* (OFL, Google Fonts). Any humanist sans works; the
theme is font-agnostic. Rules:
- Numbers use `font-variant-numeric: tabular-nums`.
- Labels are uppercase, `letter-spacing:.12em`, small, `--mut`.
- Headings are uppercase with a 3px chrome left-rule (`--ink-2`).

## Components

Generic recipes live in `theme.css` (`.card`/`.hud-panel`, `.btn`/`.btn-primary`,
`.input`, `.segmented`/`.tabs`, `.badge`, `.stat`, `.kbd`). They're all built
from tokens, so re-pointing the tokens restyles everything.

## Do / Don't

- **Do** reserve colour for meaning: neutrals + chrome + the host accent + status.
- **Do** keep scanlines faint and the clip consistent.
- **Don't** introduce a second hue into the chrome — it breaks the instrument feel.
- **Don't** round the corners; the clips are the identity.
- **Don't** use chrome as a large fill — it's an edge/line colour, not a surface.

Scrollbars: thin, 9 px chrome-mixed thumb on the `--bg-2` track; chromed on hover.

## Accessibility

- Chrome-on-surface and ink-on-surface are chosen for dark UIs; verify contrast
  per pair when porting (the cyan `--chrome` at body-text size on `--bg` is for
  accents/lines/thin text, not long prose — use `--ink` for prose).
- Texture is decorative (`pointer-events:none`, behind content) and low-opacity;
  it must never reduce text contrast below WCAG AA.
- Focus ring uses `--acc`; keep it visible (`:focus-visible`, never removed).
- `prefers-reduced-motion` is honoured (transitions → 0).
