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
// bg-bg-default → bg-bg-tertiary, this site's own theme-aware tokens —
// not a fixed literal pair. A brief detour tried a fixed #0d0d0d value
// (always dark, regardless of site theme) on the theory that both
// themes should show one identical gradient the way BeaconComposer's
// glass panel and the Soon badge do — but reported live as wrong: those
// two sit *on top of a photo*, which stays the same regardless of page
// theme, so a fixed look is correct there. This strip sits directly on
// the page's own background, which genuinely does flip — a black
// gradient over the light-theme page reads as a stray dark bar, not a
// matching edge fade. bg-bg-default/bg-bg-tertiary already resolve to
// the right pair automatically in both themes (dark: #0d0d0d → rgba
// (244,244,244,0.05); light: #f4f4f4 → rgba(13,13,13,0.05)), so this is
// really just back to the very first version of this component.
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
