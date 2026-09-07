// Shared timing for every icon micro-interaction in the system.
//
// Implemented as plain CSS transitions (see components/icons/) rather than
// with the `motion` package: in this environment, Motion for React
// (verified on both 13.2.0 and 11.15.0, declarative motion.* components
// and the imperative animate() API, dev server and production build) does
// not animate SVG primitives at all — transform/opacity changes on
// motion.rect/motion.circle/motion.g never take effect, even from plain
// React state with no gesture detection involved. Filed as a known issue;
// CSS transitions give the same restrained, spring-like feel reliably in
// every browser with zero JS.
export const ICON_DURATION = "duration-300"; // 300ms, mid-band of the 200-450ms budget

// Gentle overshoot for scale "pop" choreographies — noticeably springier
// than ease-out without reading as bouncy.
export const EASE_POP = "ease-[cubic-bezier(0.32,1.35,0.6,1)]";

// Strong ease-out for shape/position changes on bigger elements — panels,
// dropdowns, anything sizing or sliding into place. Tailwind's built-in
// `ease-out` is too weak a curve to read as smooth once more than a color
// or opacity is moving; this is the standard "strong UI ease-out" value
// (not EASE_POP's spring — that's for small icon pops specifically, and
// its overshoot would read as an unwanted wobble on a whole panel).
export const EASE_OUT = "ease-[cubic-bezier(0.23,1,0.32,1)]";

// Strong ease-in-out — for something reshaping/moving *in place* rather
// than entering or exiting (e.g. the nav pill widening into a panel: it
// doesn't appear or disappear, it morphs). ease-out is front-loaded —
// fastest at the very start, then a long slow crawl to finish — which
// reads as a "jump" on a shape morph specifically, because the biggest,
// most noticeable part of the motion happens almost instantly and the
// rest barely registers. ease-in-out ramps up and back down instead, so
// the whole change reads as one continuous, even motion.
export const EASE_IN_OUT = "ease-[cubic-bezier(0.77,0,0.175,1)]";

// Reduced motion: keep the state change (so focus/hover is still legible)
// but drop the animated interpolation, per standard practice for small
// non-essential UI motion.
export const MOTION_REDUCE = "motion-reduce:transition-none";
