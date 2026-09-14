// Stagger offsets for Reveal.tsx (see that file, and app/globals.css's
// own --motion-text-* custom properties for duration/distance/easing —
// this is the one piece of the shared token system that has to be a
// plain number rather than a CSS custom property: a `delay` prop is
// composed in JS per sibling (eyebrow at 0, heading at TIGHT, body at
// TIGHT + LOOSE, a card row's Nth item at N * TIGHT, etc.), not a fixed
// value CSS alone could express. Named to match the two steps in the
// site's own request for this system ("eyebrow → 60–100ms later →
// heading → 80–120ms later → body copy") — TIGHT covers the tighter of
// those two gaps, LOOSE the wider one, reused for either gap rather than
// four separate numbers.
export const REVEAL_STAGGER_TIGHT = 70; // ms
export const REVEAL_STAGGER_LOOSE = 110; // ms
