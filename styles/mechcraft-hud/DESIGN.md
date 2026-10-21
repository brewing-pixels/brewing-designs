# mechcraft-hud

**A command-console HUD: layered metal, recessed black screens, an amber/cyan
command accent, and a central briefing composition.** Dark-first, with a
working light mode.

- **Theme:** `mechcraft-hud`
- **Modes:** `dark` (default) · `light`
- **Type:** Saira Condensed (OFL, bundled) + system sans + system mono
- **Shape:** 2–6 px radii, 1 px metal bezels, recessed screens, 40 px command keys
- **Texture:** technical grid, brushed-metal gradients, corner rails, no images
- **Motion:** 160 ms, edge-light and hue-shadow transitions, reduced-motion guard
- **Dependencies:** `color-mix()` only; no JS framework

```
<html data-theme="mechcraft-hud" data-mode="dark">
<link rel="stylesheet" href="theme.css">
```

---

## Thesis — “the command table”

The board is a tactical table. Project cards are command modules. A project
page becomes a **briefing**: directives on the left, the selected work in the
center, telemetry and links on the right, and a command bar at the bottom. The
style borrows the **composition and material logic** of real-time-strategy
command consoles; it does not copy game artwork, portraits, logos, icons or
fonts.

The visual target is not “neon HUD”. It is **a dark, physical console**: graphite
metal, near-black screens, one amber accent, cold cyan data, and small status
lamps. Depth comes from bezels and recesses, not from large glows.

---

## Reference read

The source references fall into three groups:

1. **Classic in-game command decks** — a bottom console with minimap/status pod,
   central command-card grid, portrait/action pod. Gunmetal and amber Terran
   chrome; navy, cyan and gold Protoss chrome; layered bezels, hazard stripes,
   red/yellow lamps, wireframe unit icons.
2. **Modern / co-op HUD** — near-black glass panels, thin cyan/green edge lights,
   selected-unit information in the center, contextual command pod on the right,
   resource pips along the top.
3. **Campaign briefings** — a centered dark translucent dossier with two portrait
   frames, a central dialogue plate, an objective side panel, and pill command
   buttons over a cinematic background.

The shared grammar is the product:

- center of gravity is a command surface, not a page title;
- side pods are instruments, not decoration;
- dark metal / black glass, one accent, cold cyan data;
- small caps and mono numbers; state lamps; command buttons;
- high information density with a clear hierarchy.

This style keeps that grammar, removes the game-density, and adds web rules:
14–16 px body text, real labels, accessible focus, no icon-only controls.

---

## Palette

### Amber / Cyan — dark

| Role | Value |
|---|---|
| ground | `#070a0c` |
| plate | `#141b1f` |
| card screen | `#0a0f12` |
| raised control | `#1f282d` |
| bezel | `#4b585c` / `#2a3438` |
| highlight edge | `#8a9a9c` |
| ink | `#dfe8e4` |
| body | `#b2c0bc` |
| muted | `#7f918e` |
| command amber | `#f2a23b` |
| amber deep | `#8a4b1e` |
| cyan holo | `#63d4e4` |
| gold | `#d2b466` |
| good / warn / bad | `#7bd88f` / `#f2d85a` / `#e45c50` |

### Light modes

- **Amber light:** warm steel/ivory ground `#e7e4dc`, plate `#eeeae1`, screen
  `#fbf8f1`, amber-brown text `#8a4a12`, amber fill `#d9852c`, cyan `#0e6672`.

Light modes keep the metal bezels, inset screens and grid. They are **daylight
hangar**, not SaaS white.

### Status / priority

Status is text + border + tint: good `#7bd88f` dark / `#047857` light; warn
`#f2d85a` / `#92400e`; bad `#e45c50` / `#b91c1c`; info `#63d4e4` / `#0e6672`.
Priority N1–N4 uses the same tinted text/border treatment as the system.

---

## Typography

- **Display / labels / command chrome:** Saira Condensed 600/700, uppercase,
  `0.05–0.18em` tracking. Self-hosted in `fonts/` under OFL.
- **Body:** system sans, 14–15px, `1.6–1.7` line-height. Do not use the
  condensed face for long prose.
- **Data / keys / IDs:** system mono, tabular numbers.
- Do not use StarCraft's proprietary fonts. Do not set body copy below 12px.

---

## Shape and texture

- **Cards:** black screen surface, 1px metal bezel, 12px-ish (6px) radius in
  this style, 2px accent top rail, subtle corner bolt dots. No heavy bevel
  bitmaps; CSS only.
- **Command keys:** 2px radius, inset highlight, bottom dark edge, hotkey
  chips where useful.
- **Grid:** fixed 47/48px technical grid at 7% cyan, behind opaque content.
- **Recessed screens:** black surfaces with an inset shadow, thin bezel and
  cyan/amber line. Used for specs, telemetry and cards.
- **Hazard yellow/red:** reserved for warning, destructive and live status;
  never a large decorative surface.
- **No:** scanline overlays on prose, heavy bloom, bitmap scratches, game art.

---

## Layouts

### Reskin

The existing information architecture with the mechcraft skin. Same board,
same project columns, same spec card; objectives remain in the main column.
Use this when density and familiarity matter.

### Briefing

A project page becomes a three-pod command console:

```
┌ header: sigil · title · status · priority / flags / archive ┐
│ directives   │ briefing / command stage │ telemetry          │
│ objectives   │ summary + bars           │ repo/service       │
│ tasks        │ specification slate      │ links              │
│ checkboxes   │                          │ controls           │
└ command bar: objective · spec · fields · flags ─────────────┘
```

- Objectives move to the left **Directives** pod.
- Task checkboxes stay inside their objective; they are not icon-only.
- The center is the **briefing** and a read-only **specification data slate**.
- The right pod is telemetry, links and command controls.
- The command bar is sticky; on mobile it wraps.
- On narrow screens the pods stack: briefing, directives, spec, telemetry,
  links, fields.

The library demo shows the briefing arrangement. The Overmind Gateway demo
adds a temporary Reskin ↔ Briefing switch so the same data can be compared.

---

## Components

- `cc-shell` — maximum-width page frame.
- `cc-top` — metal resource/header strip.
- `cc-resource` + `cc-nav` + `cc-pips` — nav and counters.
- `cc-panel` — a metal-framed section with an accent top rail.
- `cc-card` — a black command module with title, description, lamps and foot.
- `cc-stat` — compact metric readout with an accent top line.
- `cc-btn` — steel secondary, primary accent, ghost, danger.
- `cc-chip` — filter / mode pill; active is accent text + line + tint.
- `cc-input` — inset field; focus ring is accent.
- `cc-check` — square command checkbox; checked uses accent fill.
- `cc-lamp` — status light with a text label; never color-only.
- `cc-task` / `cc-objective` — directives and command queue.
- `cc-bar` — segmented display bar; build accent, traction red.
- `cc-briefing` — central summary + facts.
- `cc-spec-doc` — read-only specification document inset.
- `cc-command-bar` — sticky bottom command surface.
- `cc-swatch-btn` / `cc-mode-btn` — theme controls.

---

## Interaction

- Hover cards: 1px accent ring + 16% hue shadow, no movement, no background
  lightening; the surface stays black.
- Primary buttons fill with `--acc-tone` and use `--acc-ink`; do not fill with
  the readable accent if the ink is not verified.
- Focus: 2px accent ring, 2px dark offset. Every control is keyboard reachable.
- Active/live lamps may breathe slowly; no constant animation.
- `prefers-reduced-motion: reduce` collapses durations.
- Menu/table/popup surfaces are opaque; the grid is decorative.

---

## Accessibility

- Body 14–16px; labels 10–11px; no game-HUD 8px body copy.
- Accent text uses `--acc`; fills use `--acc-tone` + `--acc-ink`.
- The amber/cyan palette is checked for AA against its dark and light grounds.
- Status is always labeled; the lamp is an accent, not the only cue.
- Grid and glow are decorative; they do not carry state.
- Theme controls use `aria-pressed`; mode labels are visible.
- Command bar wraps on mobile; no horizontal scrolling.

---

## Files

```
mechcraft-hud/
  DESIGN.md       this spec
  theme.css       tokens + base + command components
  tokens.json     DTCG tokens (primitive → semantic + component)
  demo.html       command-console specimen with mode controls
  preview.png     amber/dark preview of the demo
  fonts/          Saira Condensed 600/700 (OFL) + OFL.txt
  PROVENANCE.md   source references + licensing
```

## Provenance

The style was authored for the Overmind Gateway command-console exploration
(2026-10-21) and generalised into a brand-neutral style. The reference images
were supplied by the owner for composition/material analysis only; no game
screenshots, logos, portraits, icons, fonts or other game assets are bundled.
The bundled Saira Condensed font is OFL; the code is MIT. See `PROVENANCE.md`.
