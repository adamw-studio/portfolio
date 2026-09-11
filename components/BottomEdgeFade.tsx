// Figma 61:106 — a flat, fixed strip along the bottom edge of the
// viewport, under a top-to-bottom gradient from fully transparent down
// to a solid near-black. Figma's own export gives this a single flat
// backdrop-blur (2.3px, uniform across the whole strip) —
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
// Fixed literal colors (#0d0d0d → rgba(244,244,244,0.05)), not this
// site's theme-aware bg-default/bg-tertiary tokens: an earlier pass used
// those specifically so the gradient would flip per theme, but reported
// live as wrong — the two themes should show the *same* gradient, not a
// light-mode mirror of it (a near-white version of this same effect
// reads as a completely different, much weaker treatment against a
// light page, not a matching one). Figma's own export only gives a
// dark-theme value in the first place, so that's the one fixed pair
// used in both themes — the same reasoning already established for
// BeaconComposer's own glass panel and the Soon badge, both of which
// keep one deliberate look regardless of site theme rather than
// flipping.
//
// pointer-events-none: purely decorative, sits on top of whatever
// scrolls beneath it (HomeFooter, Selected Works' own last card) and
// must never intercept a click meant for that content.
const MASK = "linear-gradient(to top, black 0%, transparent 100%)";

export default function BottomEdgeFade() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-[75px] bg-gradient-to-t from-[#0d0d0d] to-[rgba(244,244,244,0.05)] backdrop-blur-[6px]"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    />
  );
}
