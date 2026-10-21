# construct-poster

**A flat, cell-shaded constructivist-poster web style.** Warm paper neutrals, a
single chrome hue, heavy flat borders, sharp un-blurred "cell" shadows, and
constructivist background decoration (diagonal stripes, rings, a triangle).
Dark and light: warm paper by day, a warm-black night ground with a cream line
and brighter chrome. Loud, structured, poster-like — built for dashboards,
control panels, and command decks that want personality, not subtlety.

- Aliases: `aiur-poster`, `construct`, `orange-poster` (internal names in the AIUR project).
- Extracted from: AIUR (`/rabotilnica/aiur`), the original `gateway.css` theme, 2026-10.

## Files

| File | What |
|---|---|
| `theme.css` | Drop-in portable CSS: tokens + base + starter components. |
| `tokens.json` | DTCG tokens (primitive → semantic). Generate CSS/other platforms from this. |
| `demo.html` | Self-contained preview (open in a browser). |
| `PROVENANCE.md` | Origin + licensing. |

## Palette

The whole style is **paper neutrals + one chrome hue + gold rules**. The chrome is
either the canonical orange or the muted violet alt. The dark variant keeps the
same structure but inverts the value: a warm-black ground, a cream line, and a
brighter chrome.

### Light (canonical)

| Role | Orange | Violet |
|---|---|---|
| bg | `#fdf3e3` | `#f7f5fa` |
| surface | `#fdf3e3` | `#f7f5fa` |
| surface-2 | `#f0dcc0` | `#e8e3f0` |
| line | `#1a0800` | `#241d33` |
| ink | `#1a0800` | `#241d33` |
| ink-2 | `#2d1400` | `#3a3149` |
| mut | `#7a5c44` | `#655b78` |
| **chrome** | `#e8600a` | `#8578a8` |
| chrome-2 (deep) | `#b84300` | `#6b5b8a` |
| chrome-bright | `#ff8c2e` | `#a49cc0` |
| chrome-soft | `#ffc078` | `#cbc4dd` |
| chrome-pale | `#ffe4c4` | `#efecf5` |
| cell-shadow | `#1a0800` | `#241d33` |
| gold (rules) | `#f1c40f` | `#cbbf8f` |

### Dark

| Role | Orange night | Violet night |
|---|---|---|
| bg | `#120b08` | `#110d16` |
| surface | `#1c0f09` | `#1b1424` |
| surface-2 | `#26140c` | `#241a30` |
| line | `#f4e3cb` | `#efe4ff` |
| ink | `#f6e8d6` | `#f3ecfb` |
| ink-2 | `#d8c3aa` | `#d3c1ec` |
| mut | `#a88d75` | `#a795c2` |
| **chrome** | `#ff7a1a` | `#b8a6e0` |
| chrome-2 (readable) | `#ffb066` | `#d8c8ff` |
| chrome-bright | `#ffc08a` | `#e7dcff` |
| chrome-soft | `#6a3210` | `#4a3a66` |
| chrome-pale | `#2a1309` | `#241b33` |
| cell-shadow | `#050201` | `#07040c` |
| gold (rules) | `#e6c15c` | `#d9c98a` |

Switch modes with `data-mode="light|dark"`; switch accents with
`data-accent="orange|violet"` on the themed root. `data-mode` defaults to light
when omitted, matching the canonical paper poster. In dark, the heavy border
becomes a cream line and the near-black cell shadow sits on the warm night
ground; the chrome fill keeps near-black ink, so the poster hierarchy survives
the inversion.

**Project slots (NOT part of the style):** `--acc`, `--acc-soft`, `--acc-line`,
`--acc-ink`, and `--good/--warn/--bad/--info`. The style renders fine with its
fallbacks (`--acc` defaults to `--chrome`); a host re-points them to its brand.

## Shape

Flat and heavy. The identity is the **cell shadow**: a sharp, *un-blurred* offset
(`--cell`, 4px) on panels, buttons, inputs, cards, and modals. Borders are a hard
`--bw` (2px), corners barely rounded (3–4px). No soft drop shadows, no gradients.

```css
box-shadow: var(--cell) var(--cell) 0 var(--cell-shadow);   /* rest */
transform: translate(2px,2px); box-shadow: 2px 2px 0 ...;    /* hover — presses in */
```

## Texture

A very low-opacity **constructivist diagonal stripe** layer plus decorative rings
and a rotated triangle (`.poster-bg`). Decorative only — `pointer-events:none`,
behind content.

## Type

Poster register: **Russo One** for display (banner, buttons, labels, panel
titles), **Play** for body, **Courier New** for data. Both display/sans fonts are
OFL but *not bundled* — the host points `--f-display` / `--f-sans` at its own.
Rules: banner tracked +6px; panel titles and labels uppercase tracked +2–3px.

## Components

Generic recipes in `theme.css`: `.banner`, `.panel` (`.panel-head`/`.panel-title`/
`.panel-rule`/`.panel-body`), `.btn` (`.btn-ghost`/`.btn-sm`), `.input`/`.textarea`/
`.select`, `.label`, `.check`, `.badge`, `.status-card`, `.progress` (+
`.indeterminate`), `.drop-zone`, `.modal` (`.modal-box`/`-head`/`-body`/`-foot`),
`.thumb`, `.breadcrumb`, `.stat`.

## Do / Don't

- **Do** use the sharp cell shadow everywhere; it is the style.
- **Do** keep colour to paper + chrome + gold rules + status.
- **Do** lean on uppercase display type and wide tracking for headers.
- **Don't** use blurred/soft shadows or gradients — they kill the flat-print feel.
- **Don't** add a second hue to the chrome.
- **Don't** round corners much; the poster is rectilinear.

Scrollbars: 12 px, square line-coloured thumb on the surface track; chrome on
hover. In dark the thumb is cream on a night track.

## Accessibility

- The chrome is used mostly as a **fill** with `--bg` as text on it — paper in
  light, warm black in dark. Verify that pair when re-pointing the chrome. As
  link/text colour, prefer `--chrome-2`: the deeper light value on paper, the
  brighter night value on dark.
- In dark the border is a cream line on the night ground; keep the line at least
  3:1 against the surface so the poster grid stays visible.
- The `.poster-bg` texture is decorative and low-opacity; it must never reduce
  text contrast below WCAG AA.
- Focus ring uses `--chrome`; keep it visible (`:focus-visible`, never removed).
- `prefers-reduced-motion` is honoured (transitions/animations → 0).

## Provenance

See `PROVENANCE.md`.
