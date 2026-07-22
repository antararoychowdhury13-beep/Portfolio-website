# HTML → Figma

A Figma plugin that converts arbitrary HTML/CSS into native, editable Figma layers —
Frames, Text, images, gradients, shadows — while preserving the DOM's grouping
instead of flattening everything into one pile of shapes.

## How it works

Figma plugins run in two threads with different capabilities: a UI iframe (real
browser DOM, no Figma API) and a plugin sandbox (Figma API, no DOM). This plugin
bridges them:

1. **`ui.html`** — you paste or drop an HTML document. It's rendered off-screen in
   a hidden iframe at a chosen viewport width, so it lays out exactly like it would
   in a browser. The script then walks the live DOM, reading `getComputedStyle()`
   and `getBoundingClientRect()` for every visible element, and serializes it all
   into a JSON scene graph: position, size, colors, gradients, borders, corner
   radii, shadows, opacity, flexbox info, and rich per-run text styling (bold/
   italic/color mixed within one paragraph). Images and inline SVG are fetched/
   rasterized to base64 right there in the browser context, where `fetch` and
   `<canvas>` are available.
2. **`code.js`** (the plugin's main thread) — receives that JSON and rebuilds it
   as real Figma nodes via the Plugin API: `Frame`/`Text`/`Rectangle` nodes with
   matching fills, strokes, corner radius, effects (drop/inner shadow), and Auto
   Layout when the source used `display: flex`.

## Grouping — not just flattening

- The DOM hierarchy is preserved as nested Frames, named after `tag#id.class`
  (e.g. `section.hero`, `div.card`), so the Figma layers panel mirrors your
  markup instead of being one flat list of rectangles.
- Semantic containers (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`,
  `<footer>`) come through as named Frames at the right level.
- **Repeated items** (three or more consecutive siblings sharing the same tag +
  class signature — list items, cards, table rows) are detected and wrapped in a
  labelled Figma **Section** ("Repeated group · 6 items"), so a card grid reads as
  one deliberate group on the canvas and in the layers panel.

  We deliberately did **not** turn repeats into Component/Instance pairs: an
  instance mirrors its main component's content, which would silently overwrite
  each card's own text/images with the first card's — data loss for the most
  common case (a project grid where every card differs). Sections give you the
  organizational win with no risk to content; promote a group to a real component
  by hand afterward if you want one.

## Visual fidelity — the "Freeze layout at" setting

By default every element is placed with the exact pixel position/size it had at
capture, matching the source pixel-for-pixel. Flex containers can optionally be
turned into Figma Auto Layout frames (checkbox in the UI) so the result stays
resizable/editable — but Auto Layout's own spacing math can shift children
slightly from the captured pixels, so it's opt-in rather than the default.

## Installing

1. Open the Figma desktop app.
2. **Plugins → Development → Import plugin from manifest…**
3. Select `figma-html-to-figma-plugin/manifest.json` in this repo.
4. Run it from **Plugins → Development → HTML to Figma**.

No build step, no dependencies — `code.js` and `ui.html` are plain JS/HTML.

## Using it

1. Paste a full HTML document (or a fragment) into the textarea, or drop a
   `.html` file, or click **Load sample** to try [`examples/sample.html`](examples/sample.html).
2. Pick a viewport width to freeze the layout at (Desktop/Tablet/Mobile presets).
3. Toggle Auto Layout / repeat-grouping as desired.
4. Click **Convert to Figma**. A frame appears on the canvas selected and in view.

## What's supported

- Layout: block/flex positioning, `flex-direction`, `gap`, `justify-content`,
  `align-items`, `flex-wrap`, padding.
- Paint: solid backgrounds, linear gradients (including a gradient layered over
  an image, e.g. a scrim over a hero photo), per-image `object-fit`/
  `background-size` (`cover`/`contain`).
- Borders: uniform or independent per-side width/color; corner radius (including
  per-corner and percentage radii).
- Effects: `box-shadow` (multiple, inset or drop) → Figma drop/inner shadow.
- Text: mixed inline styling within one paragraph (`<strong>`, `<em>`, links,
  spans) via Figma's text range APIs, `text-align`, `text-transform`,
  underline/strikethrough, letter-spacing, line-height.
- Images: `<img>`, CSS `background-image`, and inline `<svg>` (rasterized).
- A leaf element that's *also* a styled box — a button, chip, or text input —
  is emitted as a Frame (holding the background/border/radius) with the label
  nested inside as its own Text child, rather than dropping the box styling.
- Common lazy-load patterns: since `<script>` tags are stripped before layout
  is read (see below), a JS-driven lazy-loader never gets to swap its
  placeholder image for the real one — so images sitting behind
  `data-src`/`data-lazy-src`/`data-original`/`data-srcset` (or a `data-bg`-style
  attribute for background images) are resolved directly and `loading="lazy"`
  is forced to eager, before capture.

## Troubleshooting "some content is missing"

The status log at the bottom of the plugin now surfaces what got dropped and
why — check it first. Common causes, roughly in order of likelihood:

1. **Relative image/CSS paths.** If you pasted a page's raw source (e.g. from
   "View Page Source") it often references assets as `/assets/logo.png` or
   `styles.css` rather than a full URL. Those resolve against Figma's own
   plugin UI origin, not the real site, and silently fail. Fill in the
   **Source URL** field with the page's real URL — it's injected as a
   `<base href>`, so relative paths resolve correctly.
2. **External stylesheets failing to load** — the log will say so explicitly
   (`! N external stylesheet(s) failed to load`). Usually fixed by #1, or by
   pasting the fully-rendered/computed HTML instead of the raw source (e.g.
   browser DevTools → Elements panel → right-click the `<html>` node → Copy →
   Copy outerHTML, which captures the DOM *after* the browser applied styles
   and JS — more reliable than raw view-source for JS-heavy sites).
3. **Content only added by JavaScript.** `<script>` tags are intentionally
   removed before layout is captured (running arbitrary third-party JS inside
   the plugin isn't safe, and it isn't needed for a static visual snapshot).
   If a component only renders after a script runs (infinite scroll, a
   React/Vue app mounting into an empty `<div id="root">`, content revealed by
   an IntersectionObserver other than the lazy-image case above), paste the
   *rendered* DOM (Copy outerHTML as above) rather than the original source.
4. **Content hidden at the frozen viewport width.** If a `<style>`/media query
   sets `display:none` at the width you picked in "Freeze layout at", that
   content is legitimately not visible at that breakpoint and is skipped —
   try a different preset.
5. **`<iframe>` embeds** (maps, videos, third-party widgets) render as an
   empty frame — their content lives in a separate, cross-origin document
   this plugin can't read into.
6. **Web components / Shadow DOM.** Elements that render their content inside
   a `shadowRoot` aren't currently traversed.

## Known limitations

- CSS Grid isn't specially interpreted — grid children still get their exact
  computed pixel rects, so visuals match, but the Figma result won't have a Grid
  concept to resize by.
- `transform` support covers translate (already baked into the captured rect)
  and single-axis rotation; skew, 3D transforms, and non-default
  `transform-origin` aren't decomposed.
- Only the first two background layers combining an image with one gradient
  are composited; more complex multi-layer backgrounds fall back to the
  topmost recognizable layer.
- Border-radius only captures the horizontal radius component; elliptical
  corners with distinct horizontal/vertical radii collapse to one value.
- Fonts not installed locally in Figma fall back to Inter at the nearest
  matching weight/style.
- Images must be reachable over the network from wherever Figma is running
  (the manifest's `networkAccess` allows all domains); local `file://` image
  paths won't resolve.

## Files

```
figma-html-to-figma-plugin/
├── manifest.json   Figma plugin manifest
├── ui.html         DOM walker + plugin UI (runs in the browser-backed iframe)
├── code.js         Figma node builder (runs in the plugin sandbox)
└── examples/
    └── sample.html A small card-grid fixture to try the converter on
```
