"use client";

import { useEffect, useRef, useState } from "react";

const TRANSITION_MS = 300; // mid-band of the brief's own 250-350ms budget
const OFFSET_PX = 24; // "a small horizontal movement" — a nudge, not a slide
// Same curve as motion/tokens.ts's own EASE_OUT ("strong ease-out for
// shape/position changes"), just as a raw cubic-bezier() rather than
// that file's Tailwind-class-formatted string (`ease-[cubic-bezier(...)]`
// is arbitrary-value class syntax, not valid CSS on its own) — this
// component sets `transition` via inline style, not a className, since
// the duration/easing here is constant but the actual *triggering* of
// the transition depends on JS state (see the effect below).
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

/**
 * The single "current page" viewport — swaps its children immediately on
 * navigation (no simultaneous two-DOM-tree crossfade: simpler, and the
 * brief only asks for the *incoming* page to move/fade in, not a visible
 * outgoing exit), then animates the new content in from the direction it
 * conceptually came from. A fresh page always paints one frame at its
 * *own* "from" offset+opacity before the effect below flips it to
 * settled — without that first uncommitted paint, setting both the
 * start and end style in the same render would just coalesce into the
 * final state with nothing to transition from (the same reason
 * `@starting-style` exists for CSS-only entrances — this needs real JS
 * state instead specifically because the offset direction has to flip
 * between Next and Previous, which one static CSS rule can't express).
 */
export function CaseStudyStage({
  pageKey,
  direction,
  peek = false,
  reducedMotion,
  children,
}: {
  pageKey: string;
  direction: "next" | "prev" | null;
  peek?: boolean;
  reducedMotion: boolean;
  children: React.ReactNode;
}) {
  const [settled, setSettled] = useState(true);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      // Syncing from an external signal (matchMedia, resolved a beat after
      // mount) — same justified exception this codebase already uses
      // elsewhere (AboutCardStack's own reduced-motion read, etc.).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettled(true);
      return;
    }
    setSettled(false);
    // Two rAFs, not one: the first just gets us to the *next* paint (still
    // before the browser has necessarily committed the "unsettled" style
    // from the setSettled(false) above), the second is what actually
    // lands after that frame's paint — reliably starting the transition
    // from the offset state instead of occasionally skipping straight to
    // settled on a fast machine.
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => setSettled(true));
    });
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally keyed only on pageKey; direction/reducedMotion changing mid-flight shouldn't restart this
  }, [pageKey]);

  const startX = direction === "prev" ? -OFFSET_PX : OFFSET_PX; // prev enters from the left, next from the right
  const translateX = reducedMotion ? 0 : settled ? 0 : startX;
  const opacity = reducedMotion ? 1 : settled ? 1 : 0;

  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden">
      {/* The two peeking card edges behind the active composition (Figma
          87:1440/87:1510) — a static depth cue, not part of the page-
          transition motion itself, and only worth the room it takes on a
          wide-enough viewport (hidden below `lg`, where the active card
          alone already nearly fills the width). aria-hidden: purely
          decorative, conveys nothing a screen reader needs. */}
      {peek && (
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
          {/* ±88px, not a guessed value — worked back from Figma's own
              literal left positions (87:1440/87:1442/87:1510, all against
              that frame's 1440px width): the active card's own center
              sits at exactly the frame's center, and each peek card's own
              center is 88px off of it either side. Reported live as
              needing to sit "more closer" to the active card, which is
              exactly what this correction is — an earlier pass had these
              at ±220px, roughly 2.5x Figma's real spacing. */}
          <div className="absolute h-[607px] w-[400px] translate-x-[-88px] rounded-[20px] border border-border-subtle bg-bg-default" />
          <div className="absolute h-[607px] w-[400px] translate-x-[88px] rounded-[20px] border border-border-subtle bg-bg-default" />
        </div>
      )}
      <div
        // py-20 (80px), not more: just enough to clear the fixed back
        // button (top-6, ~44px tall) and nav pill (bottom-6, ~70px with
        // its counter) with real margin either side — reported live as
        // eating into a card's own headroom unnecessarily at 96px.
        className="flex h-full w-full items-center justify-center overflow-y-auto px-4 py-20"
        style={{
          transform: `translateX(${translateX}px)`,
          opacity,
          transition: reducedMotion ? undefined : `transform ${TRANSITION_MS}ms ${EASE_OUT}, opacity ${TRANSITION_MS}ms ${EASE_OUT}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
