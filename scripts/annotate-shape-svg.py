#!/usr/bin/env python3
"""Prepares a raw "masked-letter-grid" SVG export from Figma for inline use
by components/icons/ShapeIcon.tsx: bakes in this page's fixed accent color
and adds the "line by line" hover animation.

The raw export is a flat list of top-level fragment groups, each
`<g transform="translate(X, Y) scale(S) rotate(R)">` wrapping one
letterform, plus a `<style>` block declaring `svg { --fill-color: ...; }`.
That bare `svg { }` selector is fine when the file is its own isolated
document (e.g. loaded via `<img src>`), but ShapeIcon inlines these SVGs
directly into the page so their fragments can react to hover — which
means every icon's `<style>` block becomes a *global* stylesheet on the
same page, and a bare `svg { }` selector from one icon clobbers every
other icon's color. So this script also scopes that selector to the
specific instance via a unique id.

This script:
  1. Sets `--fill-color` to the requested color (this page's fixed
     cream/teal two-tone accent palette — see ShapeIcon.tsx).
  2. Gives the root <svg> a unique id and rewrites the bare `svg { }`
     selector to target only that id.
  3. Buckets fragments into rows by their Y translate.
  4. Gives each fragment a unique id (dropping its `transform` attribute)
     and emits its base transform as a plain `#id { transform: ...; }`
     stylesheet rule instead — deliberately *not* an inline `style`
     attribute, which would always beat the `:hover` rule below
     regardless of selector specificity, since inline styles win the
     cascade over any stylesheet rule short of `!important`. Two
     stylesheet rules of different specificity is what lets `:hover`
     actually override the base state.
  5. Adds a `.group:hover #id { transform: ...; }` rule (higher
     specificity than the base rule above, so it wins while hovered) that
     shifts the fragment sideways, alternating direction by row parity,
     with a transition-delay proportional to its row — the stagger is
     what reads as "line by line" rather than the whole glyph jumping at
     once.

Usage:
    python3 scripts/annotate-shape-svg.py <input.svg> <id-prefix> <fill-color> <output.svg>

`id-prefix` must be unique per icon (e.g. "pt" for painter) — it scopes
both the root <svg> id and every fragment id, so nothing collides once
multiple icons are inlined on the same page.

Re-run this whenever a shape's raw SVG is re-exported from Figma —
components/icons/shapes/*.svg are the already-annotated output, not the
raw export, so don't hand-edit them; regenerate instead.
"""

import re
import sys

FRAG_RE = re.compile(
    r'<g transform="translate\(([-\d.]+), ([-\d.]+)\) scale\(([-\d.]+)\) rotate\(([-\d.]+)\)">'
)
FILL_COLOR_RE = re.compile(r"--fill-color:\s*#[0-9a-fA-F]{3,6};")
SVG_OPEN_RE = re.compile(r"<svg\b")
VIEWBOX_RE = re.compile(r'viewBox="0 0 ([\d.]+) [\d.]+"')

# Fraction of the icon's own viewBox — NOT a fixed unit count. These six
# source files have wildly different viewBox sizes (2310 to 8855, i.e.
# each icon was exported at a different native "zoom") but all render at
# the same tiny ~16-20px on the page (ShapeIcon forces `size-4`), so a
# fixed unit shift is a different, mostly-imperceptible fraction of a
# pixel on each one — confirmed empirically: 140 units read as a clear
# ~1px shift on the 2310-viewBox icon and a sub-pixel, invisible shift on
# the 8855-viewBox one. Scaling by the viewBox keeps the *visible* shift
# consistent across icons instead.
ROW_SHIFT_FRACTION = 0.06
ROW_DELAY_MS = 55


def annotate(src: str, prefix: str, fill_color: str) -> str:
    svg_id = f"{prefix}-shape"

    viewbox_match = VIEWBOX_RE.search(src)
    if not viewbox_match:
        raise SystemExit('Expected a `viewBox="0 0 N N"` on the root <svg>')
    row_shift = float(viewbox_match.group(1)) * ROW_SHIFT_FRACTION

    # Give the root <svg> a unique id (first <svg ...> tag only).
    src = SVG_OPEN_RE.sub(f'<svg id="{svg_id}"', src, count=1)

    # Bake in this icon's real color and scope the selector to this
    # instance instead of every <svg> on the page.
    src = FILL_COLOR_RE.sub(f"--fill-color: {fill_color};", src, count=1)
    src = src.replace("svg {", f"#{svg_id} {{", 1)

    matches = list(FRAG_RE.finditer(src))
    if not matches:
        raise SystemExit("No fragments found — is this a masked-letter-grid export?")

    ys = sorted({round(float(m.group(2)), 1) for m in matches})
    row_of = {y: i for i, y in enumerate(ys)}

    out = []
    last = 0
    style_rules = []
    for i, m in enumerate(matches):
        x, y, s, r = (float(m.group(g)) for g in (1, 2, 3, 4))
        row = row_of[round(y, 1)]
        frag_id = f"{prefix}-f{i}"
        delay = row * ROW_DELAY_MS
        dx = row_shift if row % 2 == 0 else -row_shift
        # translate() needs explicit units in the CSS `transform` property
        # (unlike the SVG `transform` presentation attribute, which is
        # unitless) — a unitless non-zero value here is a syntax error and
        # silently drops the whole declaration. `px` maps to exactly one
        # user unit for elements in the SVG namespace, so this reproduces
        # the original raw export's positioning exactly.
        base_transform = f"translate({x}px, {y}px) scale({s}) rotate({r}deg)"
        hover_transform = f"translate({x + dx}px, {y}px) scale({s}) rotate({r}deg)"

        out.append(src[last : m.start()])
        out.append(f'<g id="{frag_id}" class="frag">')
        last = m.end()
        style_rules.append(
            f"#{frag_id} {{ transform: {base_transform}; transition: transform 450ms "
            f"cubic-bezier(0.4,0,0.2,1); transition-delay: {delay}ms; }}"
        )
        style_rules.append(f".group:hover #{frag_id} {{ transform: {hover_transform}; }}")
    out.append(src[last:])
    result = "".join(out)

    style_block = "\n      " + "\n      ".join(style_rules) + "\n    "
    return result.replace("</style>", style_block + "</style>")


if __name__ == "__main__":
    if len(sys.argv) != 5:
        raise SystemExit(f"Usage: {sys.argv[0]} <input.svg> <id-prefix> <fill-color> <output.svg>")
    src_path, prefix, fill_color, out_path = sys.argv[1:5]
    with open(src_path) as f:
        result = annotate(f.read(), prefix, fill_color)
    with open(out_path, "w") as f:
        f.write(result)
    print(f"wrote {out_path} ({len(result)} bytes)")
