"use client";

import { useEffect, useRef } from "react";
import type { CaseStudyPageConfig } from "@/components/case-study/types";

// Figma 97:2143's own 30px gap between cards, and the same lane width
// every page's own card already renders at (min(440px, viewport-32px) —
// the mobile safety margin CaseStudyNav/BeaconComposer also use).
const GAP_PX = 30;
const LANE_WIDTH = "min(440px, calc(100vw - 32px))";
// How long a real, in-flight scroll goes quiet before this treats it as
// "settled" and reports the nearest card upward — long enough to not
// fire mid-drag on a slow pointer, short enough that Prev/Next's own
// disabled state and the URL catch up right after a flick.
const SETTLE_MS = 120;
const SCROLL_MS = 450; // same band as this system's other page-to-page motion

// Same strong ease-out cubic-bezier this whole system already uses for
// every other page transition — evaluated by hand (Newton-Raphson on
// the bezier's own x(t), same approach browsers use internally for CSS
// easing) because the browser's *native* smooth scroll can't be reused
// here: this container also has `scroll-snap-type: x mandatory` (for
// free drag/swipe to settle on a card), and `scrollTo({behavior:
// "smooth"})` on a snap container silently no-ops in this environment —
// confirmed live, the strip just never moved at all when Prev/Next set
// a new index. A manual per-frame scrollLeft write bypasses that
// combination entirely rather than fighting it.
function easeOutBezier(t: number): number {
  const x1 = 0.23,
    y1 = 1,
    x2 = 0.32,
    y2 = 1;
  const A = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
  const B = (a1: number, a2: number) => 3 * a2 - 6 * a1;
  const C = (a1: number) => 3 * a1;
  const bezier = (u: number, a1: number, a2: number) => ((A(a1, a2) * u + B(a1, a2)) * u + C(a1)) * u;
  const slope = (u: number, a1: number, a2: number) => 3 * A(a1, a2) * u * u + 2 * B(a1, a2) * u + C(a1);
  let u = t;
  for (let i = 0; i < 4; i++) {
    const s = slope(u, x1, x2);
    if (s === 0) break;
    u -= (bezier(u, x1, x2) - t) / s;
  }
  return bezier(u, y1, y2);
}

/**
 * The presentation's own horizontal filmstrip — every page's card sits
 * in a fixed lane, side by side with a real gap (Figma 97:2143), inside
 * one native `overflow-x-auto` row with scroll-snap. Reported live as
 * wanting real left-to-right scrolling through every step "just like
 * our project cards on the home page" (SelectedWorks.tsx's own row) —
 * this reuses that exact drag-to-scroll convention (a mouse has no
 * native horizontal-scroll gesture; touch already gets real scrolling
 * from `overflow-x-auto` + `touch-pan-x` alone) rather than the
 * transform-and-measure approach this file used before.
 *
 * Scroll position is the one source of truth for *which* card is
 * current, in both directions: `index` changing (Prev/Next, a keyboard
 * arrow, a pasted ?casePage= link) scrolls the strip to that card, and
 * the strip settling anywhere else — a drag, a swipe, a trackpad flick —
 * reports that card back up through `onSettle` so the URL and the
 * Prev/Next disabled state track wherever the user actually left it.
 */
export function CaseStudyStage({
  pages,
  index,
  reducedMotion,
  onSettle,
}: {
  pages: CaseStudyPageConfig[];
  index: number;
  reducedMotion: boolean;
  onSettle: (index: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Drag-to-scroll state lives in a ref, not useState — read/written on
  // every pointermove, which would otherwise fight the scrollLeft writes
  // below with re-renders (same reasoning as SelectedWorks' own version
  // of this).
  const drag = useRef({ dragging: false, startX: 0, startScrollLeft: 0, moved: false, pointerId: 0 });

  // `index` changing scrolls the strip to that card — covers Prev/Next,
  // a keyboard arrow, and the URL syncing from Back/Forward or a pasted
  // link, all in one place, since all three already just change `index`.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const target = slideRefs.current[index];
    if (!scroller || !target) return;
    const from = scroller.scrollLeft;
    const to = target.offsetLeft - (scroller.clientWidth - target.clientWidth) / 2;
    if (reducedMotion) {
      scroller.scrollLeft = to;
      return;
    }
    const distance = to - from;
    if (distance === 0) return;
    const start = performance.now();
    let frame: number;
    const step = (now: number) => {
      const elapsed = Math.min((now - start) / SCROLL_MS, 1);
      scroller.scrollLeft = from + distance * easeOutBezier(elapsed);
      if (elapsed < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [index, reducedMotion]);

  // The other direction: free scrolling (drag, swipe, trackpad) settling
  // somewhere reports the nearest card back up. Debounced on quiet time
  // rather than firing on every scroll event — this only needs to know
  // where the strip *stopped*, not track it continuously, and the
  // debounce also means this never fights the programmatic scroll above
  // (that scroll's own settle just reports back the same index it was
  // already given).
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const center = scroller.scrollLeft + scroller.clientWidth / 2;
        let closest = 0;
        let closestDistance = Infinity;
        slideRefs.current.forEach((slide, i) => {
          if (!slide) return;
          const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
          if (distance < closestDistance) {
            closestDistance = distance;
            closest = i;
          }
        });
        if (closest !== index) onSettle(closest);
      }, SETTLE_MS);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, [index, onSettle]);

  // Mouse-only drag-to-scroll, identical to SelectedWorks.tsx's own row —
  // see that file's own comments for why (no setPointerCapture until a
  // real drag is detected, so a plain click still reaches anything
  // interactive inside a card).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { dragging: true, startX: e.clientX, startScrollLeft: el.scrollLeft, moved: false, pointerId: e.pointerId };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const state = drag.current;
    if (!el || !state.dragging) return;
    const dx = e.clientX - state.startX;
    if (!state.moved && Math.abs(dx) > 8) {
      state.moved = true;
      try {
        el.setPointerCapture(state.pointerId);
      } catch {
        // Safari/older browsers can reject capture for a pointerId
        // that's already gone by the time this runs — safe to ignore.
      }
    }
    el.scrollLeft = state.startScrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    drag.current.dragging = false;
  };

  return (
    <div
      ref={scrollerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      // 100svh, not 100dvh: dvh tracks mobile Safari's own toolbar as it
      // shows/hides, but CaseStudyNav's Prev/Next pill is a *separate*,
      // always-fixed element positioned against the real viewport, not
      // this scroller — on first load, before any page-level scroll has
      // happened to collapse that toolbar, a dvh-sized (taller) stage
      // could push this pill's own bottom-6 anchor down far enough that
      // the still-expanded toolbar covers it. svh is the browser's own
      // smallest-toolbar-state height, so the stage never assumes more
      // room than the pill can actually always count on.
      className="scrollbar-none flex h-[100svh] w-full cursor-grab touch-pan-x snap-x snap-mandatory items-center overflow-x-auto px-[max(16px,calc((100vw-440px)/2))] py-20 active:cursor-grabbing"
      style={{ gap: GAP_PX }}
    >
      {pages.map((page, i) => {
        const ActiveComponent = page.Component;
        return (
          <div
            key={page.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="flex max-h-full shrink-0 snap-center items-center justify-center overflow-y-auto"
            style={{ width: LANE_WIDTH }}
          >
            <ActiveComponent />
          </div>
        );
      })}
    </div>
  );
}
