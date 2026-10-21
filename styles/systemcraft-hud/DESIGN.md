# systemcraft-hud

**A hybrid systems HUD: Mechcraft type and card geometry, Moderncraft texture
and restraint, on a darker black. Amber, cyan and lime rotate through prime,
secondary and tertiary roles. Dark and light. Sahara or grid background.**

- **Theme:** `systemcraft-hud`
- **Modes:** `dark` (default) · `light`
- **Role orders:** all six permutations of amber / cyan / lime
- **Backgrounds:** `sahara` (default) · `grid`
- **Type:** Saira Condensed (OFL, bundled) + system sans + system mono
- **Shape:** 3 px cards and controls, 1 px secondary borders, inset highlight, 1 px prime bottom rail
- **Texture:** 45° Sahara hatch, or a 47/48 px technical grid
- **Motion:** 160 ms, border and hue transitions, reduced-motion guard
- **Dependencies:** `color-mix()` only; no JS framework

```
<html data-theme="systemcraft-hud"
      data-mode="dark"
      data-roles="amber-cyan-lime"
      data-bg="sahara">
<link rel="stylesheet" href="theme.css">
```

---

## Thesis — “the dark systems board”

Systemcraft is the meeting point of two earlier directions. Mechcraft supplies
the physical grammar: condensed display type, squared-off cards, inset
highlights, small technical labels, command-bar rhythm. Moderncraft supplies
the restraint: near-black card screens, one dominant accent, fine texture,
and a hierarchy that does not need gradients or glow to carry attention.

The new ingredient is a **role system**. Three colours are always present, but
they change jobs. That keeps the interface coherent while allowing the same
surface to read amber-led, cyan-led or lime-led.

The top of the app is one masthead: identity, pages and actions share a single
row, with a 1 px delimiter underneath. The pages sit between the logo and the
settings; there is no second tabs strip.

---

## Colour roles

The three primitives are fixed:

| Colour | Dark readable | Dark fill | Light readable | Light fill |
|---|---|---|---|---|
| Amber | `#f2a23b` | `#d9852c` | `#8a4a12` | `#d9852c` |
| Cyan | `#63d4e4` | `#2a9dac` | `#0e6672` | `#2a9dac` |
| Lime | `#b6f34a` | `#84cc16` | `#3f6212` | `#84cc16` |

All six orders are valid:

| `data-roles` | Prime | Secondary | Tertiary |
|---|---|---|---|
| `amber-cyan-lime` | Amber | Cyan | Lime |
| `amber-lime-cyan` | Amber | Lime | Cyan |
| `cyan-amber-lime` | Cyan | Amber | Lime |
| `cyan-lime-amber` | Cyan | Lime | Amber |
| `lime-amber-cyan` | Lime | Amber | Cyan |
| `lime-cyan-amber` | Lime | Cyan | Amber |

Role semantics:

- **Prime** — active tab, primary action, card title, focus ring, primary
  border. This is the one thing the eye should hit first.
- **Secondary** — links, data, bars, table values, supporting metrics. It
  explains and connects.
- **Tertiary** — pips, small status marks, sparse state decoration. It is the
  quietest role.

Do not use all three at equal strength in one local region. The role order
changes the hue, not the hierarchy.

---

## Backgrounds

### Sahara — default

A single-direction 45° line, 21/22 px, using the current **prime** colour at
9% dark / 14% light. It is the Moderncraft hatch, carried onto the darker
ground.

### Grid

The Mechcraft technical grid: 47/48 px both axes, using the current
**secondary** colour at 7% dark / 10% light. It reads as an instrument surface
rather than a page texture.

The background is a fixed layer behind the content. It must never sit on top
of cards or compete with text. Switch with `data-bg="sahara|grid"`.

---

## Type

- **Display:** Saira Condensed 600/700 for brand, page titles, section titles,
  tabs, buttons and labels. Uppercase labels carry 0.12–0.15 em tracking.
- **Body:** system sans at 13–15 px, line-height 1.5–1.6.
- **Data:** system mono for numbers, metadata, pips and table figures.
- Keep Markdown/spec prose in the body stack; use display type for chrome and
  headings, not for long paragraphs.

---

## Shape and surface

- **Cards:** 3 px radius, 1 px **secondary** border, near-black screen, inset
  top highlight, and a 1 px **prime** rail across the bottom edge. Hover keeps
  the secondary border and adds a 1 px secondary ring; the background does not
  lighten and the card does not move.
- **KPI / stat cards:** a 3 px prime top border instead of a bottom rail, so
  the metric cards remain distinct from normal cards.
- **Buttons / inputs:** 3 px radius, 1 px border, 34 px minimum height. Form
  fields use a secondary-tinted border, a near-black raised surface, display
  labels, and a prime focus border + ring. Checkboxes/radios use `accent-color:
  prime`.
- **Labels / metadata:** small caps, mono or display, high tracking; metadata
  uses the tertiary role.
- **No heavy metal gradients.** Mechcraft contributes geometry and material
  cues, not a full console treatment.

The light mode keeps the same geometry with a cool near-white ground,
near-white cards and darker role colours for AA text.

---

## Masthead

```
[ mark / brand ]   [ Board  Tasks  Vault ]   [ sync · refresh · settings · + Project ]
────────────────────────────────────────────────────────────────────────────────────
```

- One row on desktop; the nav sits between the logo and the action cluster.
- A 1 px border under the masthead is the only divider.
- The active tab underline sits on that border.
- The store hint is hidden in this composition; it is not a page.
- Mobile wraps the nav to a second line inside the same masthead; the
  delimiter stays under the whole block.

This composition is **style-specific** in the Overmind Gateway. Moderncraft and
Mechcraft keep their existing two-row header.

---

## Components

- `sy-masthead` — combined brand / nav / action row with bottom delimiter.
- `sy-brand` + `sy-mark` — identity block.
- `sy-nav` — page tabs with a single active underline.
- `sy-card`, `sy-panel` — dark screen, 3 px corners, secondary border, prime bottom rail.
- `sy-kpi` — 3 px prime top border, no bottom rail.
- `sy-title` — accent section label with a 2 px left rule.
- `sy-btn` — primary / secondary / ghost.
- `sy-input`, `sy-select`, `sy-field` — secondary-tinted field border, prime focus.
- `sy-chip`, `sy-pill`, `sy-pip`, `sy-dot`.
- `sy-bar`, `sy-track`, `sy-fill`.
- `sy-table`.
- `sy-command` — sticky command strip at the bottom of a briefing.
- Scrollbars — thin secondary thumb on the ground track; prime on hover.

---

## Accessibility

- All three readable colours are checked against the dark and light card
  grounds. The amber/cyan/lime fills use dark ink (`--*-ink`) rather than
  white, so primary-button text stays readable in both modes.
- Do not rely on hue alone for state; pair pips/chips with labels.
- Tertiary metadata is checked against both card grounds for AA.
- Focus is a 2 px prime ring with 2 px offset.
- The background texture is decorative and `pointer-events: none`.
- Honour `prefers-reduced-motion`; transitions are 160 ms and non-essential.

---

## Do / do not

**Do**

- let one role dominate each local region;
- use the role order control to re-key the whole surface, not patchwork
  colours;
- keep the masthead as one row on desktop;
- keep cards near-black / near-white with secondary borders and a prime bottom rail;
- use the grid when the page is data-dense and Sahara when it is editorial.

**Do not**

- use prime, secondary and tertiary at equal visual weight;
- add a second header row below the masthead;
- put the texture over the cards;
- use lime as a success colour; status stays semantic;
- brighten the card on hover or move it.

---

## Form fields and scrollbars

- Fields sit on `--surface-2`, with a 1 px secondary-tinted border, 3 px radius
  and an inset highlight. Focus switches to the prime token with a 1 px ring.
- Labels are display-font small caps in the tertiary role. Placeholders and
  helper text stay muted.
- Scrollbars are thin. The track uses the page ground; the thumb is secondary,
  with a prime hover. WebKit and Firefox are both styled.

---

## Files

```
DESIGN.md          this specification
theme.css          drop-in tokens, masthead, cards, controls
tokens.json        DTCG tokens and role orders
demo.html          combined-header specimen with 6 roles + 2 backgrounds
preview.png        screenshot of the dark Sahara specimen
PROVENANCE.md      origin, licensing, no-game-art statement
fonts/             Saira Condensed 600/700 + OFL
```
