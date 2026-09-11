// Figma 61:106 — a flat, fixed strip along the bottom edge of the
// viewport, under a top-to-bottom gradient from fully transparent down
// to the page's own solid bg-default. Figma's own export gives this a
// single flat backdrop-blur (2.3px, uniform across the whole strip) —
// implemented that way first, but reported live as reading like a plain
// color gradient with no real sense of *blur* to it, since a uniform
// blur that faint has almost no visible presence on its own.
//
// mask-image is the fix: instead of one flat blur value, the blur is
// masked to fade out over the same span the color gradient already
// fades over (full strength at the very bottom edge, zero at the top of
// the strip) — so it reads as an actual graduated blur, strongest right
// at the screen edge, not a flat wash. This is deliberately NOT the
// technique an earlier, since-removed bottom-edge effect (ScrollEdgeFade)
// used: that one stacked several *separate* backdrop-filter layers, each
// its own fixed blur radius, masked to its own discrete band — and where
// two bands overlapped, their blur radii summed, which is exactly what
// let a "sandwiched" band of real body text land on a compounded peak
// and turn illegible (reported live, tuned twice, still broken, removed
// outright). A single blur value faded by one continuous mask has no
// such peak to compound toward — it's mathematically smooth, not banded,
// so there's no boundary where blur strength jumps. Kept modest even so
// (6px at full strength, well under that attempt's 20px original and
// still under its final, still-broken 3px-with-banding version) since
// this sits low-risk (footer/caption text, not a mid-scroll reading
// zone) but doesn't need to be strong to read as real blur.
//
// bg-bg-default → bg-bg-tertiary, not Figma's own literal rgba(244,244,
// 244,0.05) "to" stop: that literal value is exactly dark theme's own
// --color-bg-tertiary (confirmed against globals.css), and this site's
// own already-established convention for a "same alpha, opposite base
// color" pair like this is to reach for the semantic token so both
// themes resolve automatically — light theme's --color-bg-tertiary
// (rgba(13,13,13,0.05)) is the correct light-mode counterpart, not a new
// hardcoded value invented for just this effect.
//
// pointer-events-none: purely decorative, sits on top of whatever
// scrolls beneath it (HomeFooter, Selected Works' own last card) and
// must never intercept a click meant for that content.
const MASK = "linear-gradient(to top, black 0%, transparent 100%)";

export default function BottomEdgeFade() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-[75px] bg-gradient-to-t from-bg-default to-bg-tertiary backdrop-blur-[6px]"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    />
  );
}
