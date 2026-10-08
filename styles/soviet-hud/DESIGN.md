# soviet-hud

**A dense sci-fi / tactical HUD web style with a Soviet constructivist twist.**
Warm near-black neutrals (dark) or bone/paper (light), a single chrome hue —
**crimson** or **purple** — heavy square borders, 45° clipped corners, star and
chevron motifs, faint scanlines, and diagonal constructivist stripes. Dense and
instrument-like: built for dashboards, control decks, terminals, monitoring UIs.

- Aliases: `aiur-hud`, `crimson-hud`, `purple-hud` (internal names in the AIUR project).
- Related: `neon-hud` (the cyan StarCraft-HUD ancestor); `soviet-poster` (the flat
  cell-shaded AIUR predecessor).
- Applied in: AIUR (`/rabotilnica/aiur`), 2026-10 — replacing the `soviet-poster` look.

## Files

| File | What |
|---|---|
| `theme.css` | Drop-in portable CSS: tokens + base + starter components + ornaments. |
| `tokens.json` | DTCG tokens (primitive → semantic). Generate other platforms from this. |
| `demo.html` | Self-contained preview (open in a browser). |
| `ornaments/star.svg`, `ornaments/chevron.svg` | The `data-orn="art"` motifs. |
| `PROVENANCE.md` | Origin + licensing. |

## Palette

**Neutrals + one chrome hue.** Dark = warm near-black; light = bone/paper. Chrome
is crimson (default) or purple; switch with `data-accent`.

| Role | Dark | Light |
|---|---|---|
| bg | `#0c0a0b` | `#f2ede4` |
| surface | `#161213` | `#fbf8f2` |
| surface-2 | `#1e1819` | `#efe8dc` |
| line | `#3a3133` | `#cfc4b2` |
| ink | `#f2e9e4` | `#1c1410` |
| ink-2 | `#c4b5ae` | `#4a3b33` |
| mut | `#8a7973` | `#7a6a5e` |

**Chrome:**

| Accent | Dark | Light | chrome-2 | chrome-line |
|---|---|---|---|---|
| **crimson** (default) | `#d01733` | `#a5122a` | deep red | dark maroon / pink line |
| **purple** | `#6d4fb3` | `#5a3f9e` | deep violet | dark violet / lilac line |

**Project slots (NOT part of the style):** `--acc`, `--acc-soft`, `--acc-line`,
`--acc-ink`, and `--good/--warn/--bad/--info`. Renders fine with fallbacks
(`--acc` defaults to `--chrome`); a host re-points them to its brand.

## Shape

Heavy and machined. `--bw: 2px` borders, small radii, and everything clipped with a
45° cut on **top-left** and **bottom-right** — the signature silhouette.

```css
--clip-panel: polygon(0 10px, 10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
--clip-btn:   polygon(0 6px, 6px 0, 100% 0, 100% 100%, 6px 100%, 0 calc(100% - 6px), 0 6px);
```

Chrome top-ticks (`.stat::before`, `.card-head h2` left rule, `.rule`) add
instrument detail.

## Texture

Two faint layers behind content: **horizontal scanlines** (dark mode only,
`--tex`) and **constructivist diagonal stripes** (`--diag`, both modes). Kept very
low opacity — a CRT sheen, not stripes.

## Ornaments (`data-orn`)

- `css` — pure-CSS **reticle corner ticks** (16×2px chrome brackets). Cheap, no assets. Default.
- `minimal` — no ornaments, no clip. For when the HUD reads as too much.
- `art` — the `star.svg` (top-left) + `chevron.svg` (bottom-right) motifs, **tinted to the accent** via CSS `mask` + `background: var(--chrome)`, so they follow crimson/purple automatically.

## Type

Soviet-HUD register: **Russo One** display, **Play** text, **monospace + tabular
numerals** for data. Both fonts are OFL but *not bundled* — the host points
`--f-display` / `--f-sans` at its own. Rules: labels uppercase tracked `.14em`;
headings uppercase with a chrome left-rule; numbers `font-variant-numeric: tabular-nums`.

## Components

Recipes in `theme.css`: `.hud-panel` / `.card`, `.card-head`, `.btn` / `.btn-primary`,
`.input`, `.label`, `.segmented` / `.tabs`, `.badge`, `.stat`, `.rule`, `.serial`,
`.kbd`, plus `.star` for inline motif. All built from tokens.

## Do / Don't

- **Do** reserve colour for meaning: neutrals + chrome + host accent + status.
- **Do** keep scanlines/diagonals faint and the clip consistent.
- **Do** lean on uppercase display type and wide tracking for headers.
- **Don't** introduce a second hue into the chrome — it breaks the instrument feel.
- **Don't** round the corners; the clips are the identity.
- **Don't** use chrome as a large fill — it's an edge/line colour, not a surface.

## Accessibility

- Dark chrome (`#d01733` / `#6d4fb3`) is an **accent/edge** colour; for body prose
  use `--ink`/`--ink-2`. Verify contrast per pair when porting.
- Light-mode chrome (`#a5122a` / `#5a3f9e`) on bone surfaces is chosen for contrast;
  still verify each new pair.
- Texture is decorative (`pointer-events:none`, behind content) and low-opacity;
  it must never reduce text contrast below WCAG AA.
- Focus ring uses `--acc`; keep it visible (`:focus-visible`, never removed).
- `prefers-reduced-motion` is honoured (transitions → 0).

## Provenance

See `PROVENANCE.md`.
