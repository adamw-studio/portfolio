"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTheme } from "@/components/ThemeContext";
import type { CaseStudyPageConfig } from "@/components/case-study/types";

// Figma 97:2143's own 30px gap between cards.
const GAP_PX = 30;
// ThemeContext's own page-dots wrapper (ThemeContext.tsx) puts a px-4
// (16px each side) on literally every page, this carousel's own scroll
// container included — so this stage's own scroller box is never
// actually 100vw wide, it's 100vw minus this, regardless of anything
// declared in this file. Every width/padding formula below has to
// subtract this first, or it's measuring against a viewport that isn't
// the scroller's own real one; missing this the first time around is
// exactly what made the peek fix below land asymmetric (confirmed live
// via getBoundingClientRect: the scroller's own box started 16px in
// from the true viewport edge on both sides, not at it).
const PAGE_PADDING_PX = 32;
// How much of a neighboring card should stay visible on either side of
// the centered active one, on viewports narrow enough that the card
// can't sit at its full 440px — this is what makes "keep adjacent
// cards visible so it's obvious the section scrolls" (the brief's own
// wording) actually hold on a real phone, not just on desktop where
// the viewport is wide enough to peek regardless. Reported live as
// fully broken: the old margin (PAGE_PADDING_PX/2 = 16px) was
// *smaller* than GAP_PX (30px) itself, so a neighbor's near edge never
// even crossed into the visible margin — mobile showed one card with
// dead empty space on both sides, no hint of the carousel at all. This
// has to clear GAP_PX before any sliver can show; 42px clears it with
// enough left over (~12px) to read as a real, deliberate peek rather
// than a rounding accident.
const PEEK_PX = 42;
// Same lane width every page's own card renders at — capped at 440px,
// or the scroller's own available width (view width, less the page's
// own outer padding above) minus a peek margin on each side once the
// viewport gets too narrow for 440px. Exported so CaseStudyNav can
// derive its own pill position from this exact same formula instead of
// duplicating the literal (see that file's own PILL_TOP for why: it
// used to hardcode this same expression, and the peek fix above would
// have silently desynced the two if it only changed one of them).
export const LANE_WIDTH = `min(440px, calc(100vw - ${PAGE_PADDING_PX}px - ${PEEK_PX * 2}px))`;
// How long a real, in-flight scroll goes quiet before this treats it as
// "settled" and reports the nearest card upward — long enough to not
// fire mid-drag on a slow pointer, short enough that Prev/Next's own
// disabled state and the URL catch up right after a flick.
const SETTLE_MS = 120;
const SCROLL_MS = 450; // same band as this system's other page-to-page motion
// How much larger the centered/active card reads than its neighbors —
// reported live as wanting a "clear visual hierarchy"; 6% splits the
// requested 5-8% range down the middle.
const ACTIVE_SCALE = 1.06;
// How much an inactive card dims relative to the active one — a small
// step down, not a heavy fade: neighbors should still read as legible,
// inviting content (the brief's own "obvious the section can be
// navigated horizontally"), not a disabled/ghost state. A brightness
// filter, not opacity — every card here has its own opaque bg-tertiary-
// solid fill, and *opacity* on an ancestor still forces the browser to
// recomposite that whole layer against whatever's actually behind it
// (the page's own dot grid), letting it show back through at
// (1 - opacity) strength — reported live as "dots overflowing" the
// inactive cards. brightness() darkens the card's own already-
// composited pixels in place instead, with no new translucency for
// anything behind it to leak through.
//
// Different per theme, not one shared constant: dark theme's own
// bg-tertiary-solid (#191919) is already close to black, so darkening
// it further by 0.6 reads as a subtle further recede. Light theme's own
// card surface is now literally bg-default (globals.css's own comment
// on bg-tertiary-solid has the why) — a much lighter starting point, so
// that same 0.6 factor would swing it all the way to a medium/heavy
// gray, reported live as inactive cards feeling "too dark/heavy"
// against a light page. Light theme's own factor is gentler on purpose,
// landing its inactive cards in a soft light gray instead.
const INACTIVE_BRIGHTNESS = { dark: 0.6, light: 0.94 } as const;

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
 * one native `overflow-x-auto` row with scroll-snap. Reused from
 * SelectedWorks.tsx's own row: free drag-to-scroll on desktop (a mouse
 * has no native horizontal-scroll gesture) and real touch scrolling on
 * mobile from `overflow-x-auto` + `touch-pan-x` alone.
 *
 * Scroll position is the one source of truth for *which* card is
 * current, in both directions: `index` changing (Prev/Next, a keyboard
 * arrow, a pasted ?casePage= link) scrolls the strip to that card, and
 * the strip settling anywhere else — a drag, a swipe, a trackpad flick —
 * reports that card back up through `onSettle` so the URL and the
 * Prev/Next disabled state track wherever the user actually left it.
 *
 * Every slide is also continuously scaled/dimmed by its own live
 * distance from the viewport's center (reported live as wanting the
 * active card to "clearly" read as selected while neighbors still
 * invite navigation) — not a binary is-this-active flag swapped in
 * after the fact, so the incoming card visibly grows into place and
 * the outgoing one recedes in the same motion as the scroll itself,
 * whether that scroll is a free drag or the eased Prev/Next tween.
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
  const { theme } = useTheme();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Drag-to-scroll state lives in a ref, not useState — read/written on
  // every pointermove, which would otherwise fight the scrollLeft writes
  // below with re-renders (same reasoning as SelectedWorks' own version
  // of this).
  const drag = useRef({ dragging: false, startX: 0, startScrollLeft: 0, moved: false, pointerId: 0 });

  // Writes each slide's transform/filter/z-index directly (bypassing
  // React state) so this can run every animation frame without
  // re-rendering the page tree 60 times a second — the same reasoning
  // drag-to-scroll already writes scrollLeft directly rather than
  // through setState. No CSS transition on transform/filter: the value
  // itself already changes smoothly frame-to-frame (scrollLeft moves
  // smoothly whether from a drag's own momentum or the eased tween
  // below), so a *second*, independently-timed transition layered on
  // top would only trail behind the real position and read as rubbery
  // rather than smoother.
  const updateCardStyles = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    const slide = slideRefs.current.find((el): el is HTMLDivElement => el !== null);
    const unit = (slide?.offsetWidth ?? 0) + GAP_PX || 1; // one full card+gap step in the strip
    const inactiveBrightness = INACTIVE_BRIGHTNESS[theme];
    slideRefs.current.forEach((el) => {
      if (!el) return;
      const distance = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      const progress = Math.min(distance / unit, 1); // 0 = centered/active, 1 = a full step away or further
      const settledness = 1 - progress;
      el.style.transform = `scale(${1 + (ACTIVE_SCALE - 1) * settledness})`;
      el.style.filter = `brightness(${inactiveBrightness + (1 - inactiveBrightness) * settledness})`;
      // The scaled-up active card visually grows past its own lane into
      // the gap either side — bumped above its (unscaled) neighbors so
      // that growth reads as "on top of", not "cut off by", whichever
      // sibling happens to sit later in the DOM.
      el.style.zIndex = progress < 0.5 ? "10" : "0";
    });
  }, [theme]);

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
      updateCardStyles();
      return;
    }
    const distance = to - from;
    if (distance === 0) {
      updateCardStyles();
      return;
    }
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / SCROLL_MS, 1);
      scroller.scrollLeft = from + distance * easeOutBezier(elapsed);
      updateCardStyles();
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [index, reducedMotion, updateCardStyles]);

  // The other direction: free scrolling (drag, swipe, trackpad) keeps
  // the active-card styling in sync every frame (rAF-throttled), and —
  // debounced on quiet time, not every event — reports the nearest card
  // back up once the strip actually stops. One listener for both: they
  // share the same "distance from center" measurement, and the settle
  // debounce naturally never fights the programmatic scroll above
  // (that scroll's own settle just reports back the same index it was
  // already given).
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateCardStyles(); // paint the initial state before any scroll/resize ever fires

    let settleTimeout: ReturnType<typeof setTimeout>;
    let frame: number | null = null;
    const onScroll = () => {
      if (frame === null) {
        frame = requestAnimationFrame(() => {
          frame = null;
          updateCardStyles();
        });
      }
      clearTimeout(settleTimeout);
      settleTimeout = setTimeout(() => {
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
    // Card width itself is viewport-dependent (LANE_WIDTH) — a resize
    // changes every slide's offsetLeft/offsetWidth without ever firing
    // a 'scroll' event on its own, so the applied styles need their own
    // explicit refresh here.
    const resizeObserver = new ResizeObserver(updateCardStyles);
    resizeObserver.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      clearTimeout(settleTimeout);
      if (frame !== null) cancelAnimationFrame(frame);
    };
    // updateCardStyles is a dependency on purpose (it's useCallback'd on
    // theme): toggling theme mid-session needs the already-applied
    // inactive brightness to recompute immediately, not sit stale until
    // the next scroll or page change happens to re-trigger this effect
    // anyway.
  }, [index, onSettle, updateCardStyles]);

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
      className="scrollbar-none flex h-[100svh] w-full cursor-grab touch-pan-x snap-x snap-mandatory items-center overflow-x-auto py-20 active:cursor-grabbing"
      // paddingInline, not a Tailwind px-[...] arbitrary class: this has
      // to stay the exact same expression LANE_WIDTH derives its own
      // peek from (max(PEEK_PX, (100vw-PAGE_PADDING_PX-440px)/2)) —
      // first/last slide can only ever scroll to center if this padding
      // is at least as wide as the peek margin LANE_WIDTH already
      // assumes exists on either side. Keeping both as JS constants
      // (PEEK_PX, PAGE_PADDING_PX) rules out the two silently drifting
      // apart the way this and LANE_WIDTH's old hardcoded "16px" already
      // had before this fix.
      style={{
        gap: GAP_PX,
        paddingInline: `max(${PEEK_PX}px, calc((100vw - ${PAGE_PADDING_PX}px - 440px) / 2))`,
      }}
    >
      {pages.map((page, i) => {
        const ActiveComponent = page.Component;
        return (
          <div
            key={page.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            // will-change-transform + backface-hidden: this slide is the
            // element CaseStudyStage actually scales (its child card
            // never gets its own transform — confirmed live,
            // getComputedStyle(card).transform is "none" — so there's
            // only ever one bordered box here, not a duplicate). Without
            // a hint to promote it to its own compositing layer up
            // front, the browser can end up redrawing this card's own
            // border+radius at each new fractional `scale()` value
            // instead of rasterizing it once and letting the GPU scale
            // that texture as a unit — landing the rounded corner on a
            // fractional device pixel (confirmed live:
            // getBoundingClientRect().x had a many-decimal value) and
            // showing a faint second, slightly-offset curve outside the
            // real edge. Promoting the layer up front is the standard
            // fix for exactly this class of artifact, not a second
            // border to remove.
            className="flex shrink-0 snap-center items-center justify-center overflow-y-auto will-change-transform [backface-visibility:hidden]"
            // maxHeight: 100% / ACTIVE_SCALE, not a flat 100% (max-h-full) —
            // reported live as a "mistake" in a card's own border: the
            // active card's rounded bottom corner was getting sliced
            // into a hard flat edge on shorter viewports. Root cause
            // wasn't the border at all (removing it live changed
            // nothing) — it was this slide's own overflow-y-auto safety
            // net clipping the *scaled-up* card once its painted size
            // (up to 106% tall) exceeded the slide's unscaled layout
            // budget, something that could only happen once cards
            // started scaling at all. Reserving that same headroom here
            // means even a fully-active card never has more painted
            // height than this slide actually has room for, so the
            // clip this depends on for genuine overflow never fires on
            // account of the scale effect itself.
            style={{ width: LANE_WIDTH, maxHeight: `calc(100% / ${ACTIVE_SCALE})` }}
          >
            <ActiveComponent />
          </div>
        );
      })}
    </div>
  );
}
