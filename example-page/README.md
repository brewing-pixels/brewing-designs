# brewing-designs / example-page

One specimen page for every style in the library. Five designs, the same
lorem-ipsum content, switchable without a reload. No build step, no framework,
no server-side code.

**Live:** <https://brewing-pixels.github.io/brewing-designs/example-page/>

## Open it

The page links the canonical stylesheets with `../styles/<style>/theme.css`, so
serve the **repository root** (not the page folder by itself):

```bash
cd brewing-designs
python3 -m http.server 8000
# http://localhost:8000/example-page/
```

Opening `example-page/index.html` directly with `file://` also works; the Google
Fonts used by `construct-poster` simply need network access.

## GitHub Pages

Relative paths are intentional: keep `example-page/` next to `styles/` in the
same repository. Pages publishes from the repo root, the root `index.html`
redirects to the page, and the demo lives at:

```text
https://brewing-pixels.github.io/brewing-designs/example-page/
```

- There is nothing to build. Push the folder and it works.
- `.nojekyll` is at the repository root (and in this folder), so Jekyll leaves
  the static files alone.
- Do not publish `example-page/` alone unless you vendor the five theme
  stylesheets into it (the page deliberately references the canon instead of
  duplicating it).

## Styles

| Style | Modes | Extras |
|---|---|---|
| `neon-hud` | dark + light | `data-orn`: `css`, `art`, `minimal` |
| `construct-poster` | light | `data-accent`: `orange`, `violet` |
| `moderncraft-hud` | dark + light | `data-accent`: six presets |
| `mechcraft-hud` | dark + light | single amber/cyan console palette |
| `systemcraft-hud` | dark + light | `data-prime` / `data-secondary` / `data-tertiary`: 27 assignments · `data-bg`: `sahara`, `grid` |

Each style's `preview.png` is a 1440×900 screenshot of this example page in that
style (Overview tab, canonical state). The style card and gallery on the page
use those images.

## Controls and URLs

- **Design tabs** (header and gallery) switch the active stylesheet.
- **Mode** is remembered where supported; `construct-poster` is light-only.
- **Accent** appears for styles that declare an accent choice.
- **Roles / background** appear for `systemcraft-hud`: three independent amber/cyan/lime role
  assignments (27 combinations) and the Sahara/Grid page texture.
- **Ornaments** appears only for `neon-hud`.
- State persists in `localStorage` and in the query string. **Copy link** copies
  the full state; the section tab is kept in the hash.

Examples:

```text
?style=neon-hud&mode=dark&orn=art
?style=construct-poster&mode=light&accent=violet
?style=moderncraft-hud&mode=light&accent=protoss
?style=mechcraft-hud&mode=dark
?style=systemcraft-hud&mode=dark&prime=cyan&secondary=lime&tertiary=amber&bg=grid
```

Section hashes: `#overview`, `#typography`, `#components`, `#forms`, `#data`,
`#media`, `#tokens`.

## How it works

- `showcase-config.js` is loaded synchronously in `<head>`. It validates URL
  parameters and localStorage, sets `data-theme` / `data-mode`, plus every
  style choice (`data-accent`, `data-prime`, `data-secondary`, `data-tertiary`, `data-bg`), sets `data-orn`, and
  switches exactly one theme `<link>` from `media="not all"` to `media="all"`.
  This happens before first paint, so a direct link to another style does not
  flash the default.
- `showcase.css` is a neutral `ds-*` component layer built on the token contract
  shared by all five styles. It does not borrow any style's class names; each
  style's signature (neon clipping and ornaments, poster cell-shadows, metallic
  panels, hatch/grid, role colours) is applied through scoped
  `[data-theme=...]` rules.
- `showcase.js` handles tabs, the settings UI, permalinks, the dialog, toasts,
  form validation, table sorting, the canvas sparkline, the live token palette,
  computed WCAG contrast, and the element coverage audit.
- The Components tab includes a vertical + horizontal scrollbar specimen. The
  page, code blocks, table wrappers and that specimen all use the active
  style's scrollbar colours.
- The Tokens tab reads the **computed** custom properties from the active theme.
  It shows the palette, contrast ratios for the pairs this page actually uses,
  type/radii/spacing scales, the current usage snippet, and a live check of every
  standard content element (113 at the time of writing). KPI counts for styles,
  modes and appearance presets are derived from the style registry.
- The only external assets are the library's `preview.png` screenshots and the
  Google Fonts for `construct-poster`. `mechcraft-hud` and `systemcraft-hud`
  self-host Saira Condensed in their style folders. All artwork is local SVG;
  the audio sample is an inline data URI, so there are no binary media files in
  this folder.

## Add a style

1. Add `styles/<slug>/` with `theme.css` and a `preview.png`.
2. Add a `<link>` in `index.html` with `media="not all"` and
   `data-theme-css="<slug>"`.
3. Add the style to `showcase-config.js`: `modes`, `choices` (one or more
   `{ attr, label, type, default, options }` groups), `ornaments`, paths and
   `extras`, and add it to `ORDER`.
4. Add a header style tab and a gallery card to `index.html`.
5. Add the style's flourishes in `showcase.css` under a
   `[data-theme="<slug>"]` block.
6. Update the KPI sublabels if the categories change; the values are derived
   from the registry. Check the Tokens tab and the mobile layout.

## Files

```text
example-page/
  index.html            the specimen
  showcase-config.js    style registry + early bootstrap
  showcase.css          ds-* layer + style signatures
  showcase.js           behavior
  assets/               local SVG mock artwork, poster, captions, favicon
  README.md
  .nojekyll
```

Content is lorem ipsum by design: the point is the visual system, not the copy.
