# moderncraft-hud

**A flat, metallic operations HUD: graphite metal, near-black cards, one
accent, and a 45° accent hatch.** Dark-first, with a light variant. Six
accent presets. Built for dense project/task/ops interfaces where hierarchy,
numbers, and state must be readable at a glance.

- **Theme:** `moderncraft-hud`
- **Modes:** `dark` (default) · `light`
- **Accents:** `terran` · `horde` (default) · `zerg` · `protoss` · `night-elf` · `human`
- **Shape:** 6/10/12 px radii, hard edges, no clipped corners
- **Texture:** 45° diagonal hatch, 21/22 px, accent at 12% dark / 18% light
- **Motion:** 160 ms, `cubic-bezier(.2,.7,.3,1)`, reduced-motion guard
- **Dependencies:** none (system sans/mono stacks, `color-mix()`)

```
<html data-theme="moderncraft-hud" data-accent="horde" data-mode="dark">
<link rel="stylesheet" href="theme.css">
```

---

## Core idea

The style is **metal, not neon**. The page ground and controls are cool
graphite; every card is near-black (dark) or near-white (light). One accent
drives chrome, card titles, card borders, selection, focus, primary actions,
and the hatch. Everything else is neutral. Depth is a one-pixel border and a
surface value change; the only accent shadow is the low-opacity hover shadow
on cards.

The 45° hatch is the recognisable texture. It is decorative and always low
contrast; it sits behind opaque content and never behind body text. The hatch
line follows the accent (`--hatch-line`), so the whole style re-skins with one
token.

The style is brand-neutral: accent names are labels for a palette, not
affiliation. A host project can re-point `--acc*` to its own brand.

---

## Palette

### Neutrals — dark

| Token | Value | Role |
|---|---|---|
| `--bg` | `#191e24` | page |
| `--bg-2` | `#20262e` | modals / raised ground |
| `--surface` | `#252c34` | controls / chrome |
| `--surface-card` | `#0f1317` | every card (near-black) |
| `--surface-2` | `#2f3842` | inputs, rails inside cards |
| `--surface-3` | `#39434f` | pressed / strong rail |
| `--line` | `#38434f` | borders |
| `--line-2` | `#4d5a68` | strong borders |
| `--card-line` | `#222a33` | card border base |
| `--card-border` | accent mix | 1 px card border: 30% accent + base |
| `--card-shadow-hot` | accent mix | hover ring + tinted shadow |
| `--card-track` | `#1a2028` | progress tracks |
| `--ink` | `#f2f7fb` | primary text |
| `--ink-2` | `#d2dee8` | body text |
| `--mut` | `#a7b8c6` | muted text / labels |

### Neutrals — light

| Token | Value |
|---|---|
| `--bg` | `#e6eaee` |
| `--bg-2` | `#f4f6f8` |
| `--surface` | `#f3f5f8` |
| `--surface-card` | `#fbfcfd` |
| `--surface-2` | `#e9edf1` |
| `--surface-3` | `#dfe4ea` |
| `--line` | `#c7d0d8` |
| `--line-2` | `#a9b6c2` |
| `--card-line` | `#d8e0e7` |
| `--card-track` | `#e4e9ee` |
| `--card-bg-hover` | `#f1f4f7` |
| `--ink` | `#17212a` |
| `--ink-2` | `#3d4b57` |
| `--mut` | `#566675` |

### Accent presets

`--acc` is the **readable accent** used for text, icons, borders, focus, and
the hatch. `--acc-tone` is the **fill** used for primary buttons and solid
marks; `--acc-ink` is the text colour that sits on that fill. In most presets
they are the same; in dark **zerg** and light **protoss** they deliberately
differ.

| Preset | Dark `--acc` | Dark `--acc-tone` | Dark ink | Light `--acc` | Light `--acc-tone` | Light ink |
|---|---|---|---|---|---|---|
| `terran` | `#6fe3f2` | `#6fe3f2` | `#082026` | `#155e75` | `#155e75` | `#ffffff` |
| `horde` | `#b6f34a` | `#b6f34a` | `#142006` | `#3f6212` | `#3f6212` | `#ffffff` |
| `zerg` | `#c084fc` | `#88409c` | `#ffffff` | `#88409c` | `#88409c` | `#ffffff` |
| `protoss` | `#f0cf78` | `#d9b24c` | `#1a1405` | `#7a5b12` | `#c9a227` | `#1a1405` |
| `night-elf` | `#7ef0bd` | `#3ddc97` | `#04140d` | `#0f6b45` | `#1f7a52` | `#ffffff` |
| `human` | `#9db9ff` | `#5b8cff` | `#071226` | `#2f4fa0` | `#3f6fe0` | `#ffffff` |

Soft/line roles: `--acc-soft` (bar gradient start, deep shade) and
`--acc-line` (tag and chip borders). Hatch uses `--acc-tone`.

### Status

| Role | Dark | Light |
|---|---|---|
| good / live | `#57e6b2` | `#047857` |
| warn | `#ffce5c` | `#92400e` |
| bad / overdue | `#ff8f8f` | `#b91c1c` |
| info | `#93c4ff` | `#1d4ed8` |
| priority N1 | `#d0a6ff` | `#7e22ce` |
| priority N2 | `#ff8f8f` | `#b91c1c` |
| priority N3 | `#ffab6b` | `#9a3412` |
| priority N4 | `#ffdc5c` | `#854d0e` |

Status colours are used as text + border + 9–12% tint. Never fill a large
surface with a status colour.

---

## Texture

```css
background: repeating-linear-gradient(
  45deg,
  transparent 0 21px,
  var(--hatch-line) 21px 22px
);
```

- Spacing: **21 px gap / 22 px line** — a perfect 45° stamp.
- Dark: `--acc-tone` at **12%**; light: **18%**.
- Fixed, decorative, `pointer-events: none`.
- Keep it behind opaque panels/cards for long-form content, forms, and tables.
  Page-level chrome and short hero copy may sit over the low-contrast hatch;
  never put dense prose or fields directly on the raw hatch.
- The hatch is optional (`sc-hatch` utility); data-heavy tools should keep it
  subtle. It is not a loading state.

No scanlines, no glow, no grain, no vignette.

---

## Shape & type

- Radii: `--r-sm: 6px` (buttons/inputs), `--r-md: 10px` (panels),
  `--r-lg: 12px` (cards/modals). Pills use `--r-full`.
- Borders are **1 px**; the only thicker rules are the 2 px accent line on
  stat tops and the 2–3 px accent bar on panel headings.
- Type: system sans for UI/body; mono for IDs, labels, numbers, code. Display
  is the sans at tight tracking (`-0.03em` to `-0.04em`). Body is 13–16 px;
  labels are 9–10 px uppercase mono with `0.10–0.12em` tracking.
- Numbers are tabular (`font-variant-numeric: tabular-nums`).

---

## Components

- **Panel** (`sc-panel`): near-black/near-white card surface, 1 px accent-tinted
  border, 10 px radius, 24 px padding. A heading gets a 2 px accent left bar.
  Controls inside stay on `--surface-2` for contrast.
- **Card** (`sc-card`): near-black/near-white, 1 px accent-tinted border,
  12 px radius, 16 px padding. The title is accent. Hover keeps the black
  surface, sets the border to full accent, and adds a 1 px accent ring plus a
  soft hue shadow; no background lightening, no transform.
- **Stat / KPI** (`sc-stat`): near-black card with a 2 px accent top line; value
  is the accent, 26 px, tabular. Label is uppercase mono. Same card hover.
- **Card interaction:** all card-like surfaces share the near-black background,
  accent-tinted border, accent title, and hover ring/shadow. The visual border
  becomes 2 px via `box-shadow: 0 0 0 1px var(--acc)`; layout does not shift.
- **Primary button** (`sc-btn.primary`): solid `--acc-tone`, `--acc-ink` text,
  no shadow. Hover mixes the fill with the page ink (lighter in dark, darker in
  light), so it stays in-family in both modes.
- **Secondary / ghost / danger**: surface or transparent; danger uses the bad
  colour as text + border, never a solid red block.
- **Chip** (`sc-chip`): transparent pill; active is accent text + accent-line
  border + 8% accent tint. No solid accent chip; that keeps accent fills
  reserved for primary actions.
- **Field** (`sc-input` / `sc-select` / `sc-textarea`): `--surface-2`, 1 px
  line, 6 px radius; focus is a 2 px accent border plus a 22% accent outline.
- **Status / priority** (`sc-ts`, `sc-prio`): tinted text + border; status
  states are `open`, `doing`, `blocked`, `done`, `dropped`, `overdue`.
- **Progress** (`sc-bar`): 7 px track; build uses accent-soft → accent-tone;
  traction uses a dark red → bad gradient. Both are display estimates, not
  metrics.
- **Table** (`sc-table`): mono uppercase headers, 1 px row rules, tabular
  numbers, no zebra fill.
- **Theme picker** (`sc-theme`): accent swatches are 26 px circles; active
  swatch gets an accent ring. Mode is a two-button segmented control.

---

## Interaction

- All interactive elements have a visible `:focus-visible` ring in `--acc`.
- Cards hover without moving: border goes to `--acc`, a 1 px accent ring makes
  the edge read as 2 px, and a low-opacity accent shadow appears. The surface
  stays black; no background lightening, no `scale`, no `translate`.
- Transition only `background`, `border-color`, `color`, `box-shadow`, and
  `width` (bars); use `160ms` and the shared ease.
- `prefers-reduced-motion: reduce` collapses durations to 0.01 ms.
- Keyboard: native controls; do not remove focus outlines. The demo includes
  buttons, links, inputs, and the theme controls as real focusable elements.

---

Scrollbars: thin, 10 px, rounded accent-mixed thumb on the page ground; full accent on hover.

## Accessibility

- **Text accent = `--acc`, fill accent = `--acc-tone`.** This is the central
  rule. Dark zerg's readable text is `#c084fc`; the fill is `#88409c` with
  white text. Light protoss's readable text is `#7a5b12`; the fill is
  `#c9a227` with near-black text. Do not use `--acc-tone` as body text or
  `--acc` as a filled button background without checking ink.
- The neutral pairs (`--ink`/`--bg`, `--ink-2`/`--bg`, `--mut`/`--bg`) are
  designed for AA body text; `--mut` is for labels and secondary text, not long
  prose.
- Status text uses the light-mode darkened values (`#047857`, `#92400e`,
  `#b91c1c`, `#1d4ed8`) on light surfaces; the dark-mode values are brighter to
  clear the dark ground.
- The hatch is decorative and low contrast; it must never be the only cue.
  State is always also encoded by text/border.
- Focus rings are accent-coloured and 2 px; do not rely on colour alone.
- Card titles use the readable accent (`--acc`), not `--acc-tone`; the accent
  border and hover shadow are decorative, so the title must still be legible
  without them.
- The accent swatches in the theme picker carry `aria-label`; mode buttons use
  `aria-pressed`.
- Test every new text/background pair. `color-mix()` values in this file are
  starting points, not a substitute for a contrast check.

---

## Do / Don't

**Do**
- Use one accent per screen; let primary actions own the solid fill.
- Keep every card near-black (dark) / near-white (light); use graphite/mist for
  the page and controls inside cards.
- Use the accent for card titles and the card border; keep body copy neutral.
- Use 1 px rules and surface value changes for separation.
- Use the accent ring + hue shadow on card hover; no movement.
- Keep the hatch behind opaque surfaces.
- Use tabular numbers in tables, KPIs, and bars.

**Don't**
- Don't add glow, neon bloom, gradients on surfaces, or scanlines. The card
  hover shadow is the only accent shadow and stays at 16% or lower.
- Don't use the accent for large background areas.
- Don't use `--acc` as a solid button fill when its ink is not verified.
- Don't use a second grey card surface; cards are `--surface-card`.
- Don't lighten the card background on hover or lift it with `transform`.
- Don't place body text over the hatch.
- Don't mix more than one accent preset in a single view.
- Don't use pure black `#000` or pure white `#fff` as page surfaces.

---

## Project slots

The six presets are complete palettes. A host can also re-point:

```css
[data-theme="moderncraft-hud"] {
  --acc: #your-accent;
  --acc-tone: #your-fill;
  --acc-soft: #your-deep;
  --acc-line: #your-border;
  --acc-ink: #text-on-fill;
}
```

Keep `--acc` readable as text and `--acc-tone` readable with `--acc-ink`.
Set `--hatch-line` from `--acc-tone` at the mode percentage. Card borders and
hover shadows are computed from `--acc` and `--card-line`; keep them in the
same file when re-pointing an accent. Status colours can be re-pointed
independently; keep them as text + border + tint.

## Files

```
moderncraft-hud/
  DESIGN.md       this spec
  theme.css       tokens + base + starter components
  tokens.json     DTCG tokens (primitive → semantic)
  demo.html       self-contained preview; accent + mode toggles
  preview.png     1440px preview of the demo (horde/dark)
  PROVENANCE.md   origin + licensing
```

## Provenance

Extracted from the **Overmind Gateway** UI (2026-10-21) and generalised into a
brand-neutral style. The StarCraft **Command Center wireframe** logo used by
Overmind is a separate third-party asset from the StarCraft Fandom/Wikia wiki;
it is **not** part of this style library. No game logos, screenshots, fonts, or
other game assets are bundled. The accent preset names are descriptive labels,
not an affiliation. Code is MIT; see `PROVENANCE.md`.
