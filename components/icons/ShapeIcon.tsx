import { readFileSync } from "fs";
import { join } from "path";
import { ICON_DURATION, EASE_POP, MOTION_REDUCE } from "@/components/motion/tokens";

/**
 * Shared shell for the "What shapes me" chip icons — painter, sculptor,
 * curiosity, craftsmanship, deep respect, and time ("5 years & 4 months")
 * (Figma calls these "masked-letter-grid" glyphs). Each is a scattered
 * grid of tiny rotated letterform paths — real vector art, supplied
 * directly rather than exported as a raster: Figma's own PNG export of
 * these only ever rasterizes at a native 16x16 with antialiasing baked
 * in, which reads as blurry at any display size no matter how it's
 * scaled (confirmed: the browser paints the export byte-for-byte, so
 * there was no fixable rendering step — the softness was in the source).
 * A real SVG has no such ceiling: crisp at any size/DPI.
 *
 * Rendered by inlining the SVG markup (not `<img src>`) specifically so
 * its internal groups can react to hover — an externally-referenced SVG
 * is opaque to the host page's CSS/mouse events, but inlined markup lives
 * in the same DOM and can respond to an ancestor's `.group:hover` like
 * anything else. This is a Server Component (no "use client"), so the
 * file read happens at render/build time — the hover behavior itself is
 * pure CSS, so no client JS is needed at all.
 *
 * Each shape's own <style> (baked in by
 * scripts/annotate-shape-svg.py — see components/icons/shapes/) groups
 * its ~15-30 letterform fragments into rows by Y position and gives each
 * a `.group:hover #<id>` rule that shifts it sideways, alternating
 * direction by row with a per-row transition-delay — that stagger is
 * what reads as "line by line" rather than the whole glyph just jumping
 * at once. Color is baked into each file's own `--fill-color` custom
 * property rather than threaded in as a prop: teal (#00a2c2, fixed in
 * both themes already) for sculptor/craftsmanship, `var(--icon-cream)`
 * (the same page-wide token every other cream icon uses, which swaps
 * per theme — plain #fff1b5 read fine on dark but had poor contrast once
 * this page's light theme was checked) for the rest. Since these SVGs
 * are inlined into the same document rather than loaded as a separate
 * resource, that CSS variable inherits from the live page like any other
 * descendant, no extra plumbing needed.
 *
 * The old per-part stagger animation (independently-moving bars/squares)
 * doesn't carry over as-is — this replaces it with the row-shift above,
 * plus the same whole-icon pop on hover/focus used elsewhere (see
 * marks.tsx's former ShapeMark) via the wrapping span.
 */
const shapesDir = join(process.cwd(), "components/icons/shapes");
const svgCache = new Map<string, string>();

function loadShapeSvg(name: string): string {
  const cached = svgCache.get(name);
  if (cached) return cached;
  const svg = readFileSync(join(shapesDir, `${name}.svg`), "utf8");
  svgCache.set(name, svg);
  return svg;
}

export function ShapeIcon({ name }: { name: string }) {
  return (
    <span
      className={`relative inline-flex size-5 shrink-0 items-center justify-center overflow-hidden origin-center transition-transform ${ICON_DURATION} ${EASE_POP} ${MOTION_REDUCE} group-hover:scale-[1.15] group-focus:scale-[1.15] [&_svg]:size-4`}
      aria-hidden
      // Safe: this is our own build-time asset (components/icons/shapes/),
      // never user input.
      dangerouslySetInnerHTML={{ __html: loadShapeSvg(name) }}
    />
  );
}
