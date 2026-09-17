"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useTheme } from "@/components/ThemeContext";
import { themedIcon } from "@/components/themedIcon";

// Figma 136:5942 ("Quick review") / 138:6709 ("Key findings") — a
// horizontal row of cards, embeddable within a page (unlike
// CaseStudyStage, this system's own full-page card carousel — see that
// component for why this is a separate, lighter sibling rather than a
// shared implementation).
//
// Free-scrolling, not paginated: reported live as feeling too
// constrained — "I do NOT want users limited to clicking arrows or
// moving between fixed carousel states... I want FREE HORIZONTAL
// SCROLLING... stop at any position, including halfway between cards."
// This file's own first pass had exactly that constraint baked in — a
// React `index` state that WROTE to scrollLeft (an effect that, on every
// index change, animated the container to that card's own exact
// position) as well as reading from it, which is precisely "a separate
// carousel state fighting the actual scroll position": dragging or
// trackpad-scrolling to a mid-point still worked for a moment, but any
// index update (including the settle-detection this file still uses)
// would immediately snap it back to a discrete slot. `scroll-snap-type:
// x mandatory` compounded that at the browser level, snapping hard after
// every scroll gesture regardless of how far it went.
//
// Fixed by keeping exactly one source of truth: the container's own
// native scrollLeft. `index` still exists, but only ever as a passive,
// read-only reflection of it (for the dots and the Prev/Next disabled
// state) — nothing here writes scrollLeft except the two things a user
// actually asked for: dragging the row themselves, and pressing Prev/
// Next (a plain scrollBy, exactly the "same scroll container" every
// other input already uses, not a jump to a managed index position).
// `snap-proximity` (not `mandatory`) gives a gentle pull toward a card
// only when a gesture already ends close to one, never a hard force.
//
// Alignment model — the shared left edge every card's own left side
// aligns to (`alignInset`), matching whatever inset centers the page's
// own narrow text column — is unchanged from before; see each card
// row's own caller for why.
const DEFAULT_GAP_PX = 12; // Figma's own gap on both the Quick review (136:5942) and Key findings (138:6709) rows — every existing caller's own default, unchanged
const SETTLE_MS = 120;
const ACTIVE_SCALE = 1.04; // a smaller step than the page-level stage's 1.06 — these cards sit inside a page that's already scrolling vertically, so a lighter emphasis reads as consistent rather than competing for attention
const INACTIVE_BRIGHTNESS = { dark: 0.7, light: 0.96 } as const; // gentler than CaseStudyStage's own 0.6/0.94 — same reasoning: a secondary in-page row, not the page's own single focus
const END_PEEK_PX = 24; // small breathing room past the last card

export function CardRow({
  items,
  cardWidth,
  ariaLabel,
  alignInset,
  gap = DEFAULT_GAP_PX,
  centered = false,
}: {
  items: { id: string; content: ReactNode }[];
  /** Card width in px, matching each card's own fixed Figma width (301/300) — clamped down on narrow viewports the same way LANE_WIDTH is. */
  cardWidth: number;
  ariaLabel: string;
  /** CSS length — the shared left edge every card's own left side aligns to, matching whatever inset centers the page's own narrow text column (see this file's own top comment). */
  alignInset: string;
  /** Gap between cards in px — defaults to DEFAULT_GAP_PX (Figma's own
   * Quick review/Key findings value). A caller with its own different
   * Figma gap (Monday's own galleries: 16px) passes it explicitly
   * rather than this file's own default changing for every existing
   * row. */
  gap?: number;
  /** false (default, every existing caller): the row's own right edge
   * gets a small fixed END_PEEK_PX gutter regardless of alignInset — a
   * deliberate asymmetry (Beacon/Robotics' own "aligned with the text
   * column on the left, breaking out toward the right edge" look).
   * true: the right edge gets the *same* alignInset as the left instead,
   * so on a wide viewport where several cards are visible at once, the
   * whole visible set reads as centered (equal peek both sides) rather
   * than flush-left with a long single-sided overhang to the right —
   * reported live as "should start from the middle" once this row's
   * own content (Monday's last two galleries) was wide enough for that
   * asymmetry to actually show. */
  centered?: boolean;
}) {
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  // Set only when the row has NO real scrollable distance at all (every
  // card already fits the viewport at once — Key findings' own 3 cards,
  // reliably, on anything wider than a laptop) and the user still clicks
  // a dot or an arrow. Reported live as "not possible to... select the
  // second or third card": with the active-card emphasis driven purely
  // by real scroll position (as it should be whenever scrolling is
  // actually possible), a click that can't move scrollLeft — because
  // there's nowhere left to move it to — silently did nothing, over and
  // over, no matter which control was used. This is a narrow escape
  // hatch for exactly that one case, not a return to a managed "current
  // slide" index: the moment the row DOES have real overflow (a resize,
  // or simply a narrower viewport), any real scroll event clears it
  // immediately and scroll position takes back over as the only source
  // of truth, same as before.
  const [forcedIndex, setForcedIndex] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef({ dragging: false, startX: 0, startScrollLeft: 0, moved: false, pointerId: 0 });

  useEffect(() => {
    // Deliberately deferred to an effect, not a lazy useState initializer:
    // matchMedia doesn't exist during SSR, so both the server-rendered
    // HTML and the client's first render need to agree on the "false"
    // default to avoid a hydration mismatch — same reasoning as
    // ThemeContext's own stored-theme correction.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // el.offsetLeft is relative to its nearest POSITIONED ancestor
  // (offsetParent) — which, once this row's own outer wrapper picked up
  // `position: relative` for the full-bleed breakout below, silently
  // became that ancestor instead of the scroller itself, throwing every
  // offsetLeft-based measurement off by a fixed amount. getBoundingClientRect()
  // has no such ambiguity — it's always relative to the real viewport —
  // so every position below is computed from that instead, converted
  // into the scroller's own scroll-space by adding back its current
  // scrollLeft.
  const slidePosition = useCallback((el: HTMLDivElement) => {
    const scroller = scrollerRef.current;
    if (!scroller) return 0;
    return el.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
  }, []);

  // The x-position (within the scroller's own scrolling content, same
  // space slidePosition lives in) that "aligned" means right now — every
  // card's own position is compared against this. Reading the scroller's
  // actual computed padding-left rather than re-deriving it from
  // `alignInset` in JS: the two would otherwise have to stay hand-in-sync
  // between a CSS calc() string and a parallel JS formula, and only one
  // of them (the real computed style) can never drift from what the
  // browser actually laid out.
  const alignmentX = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return 0;
    return scroller.scrollLeft + parseFloat(getComputedStyle(scroller).paddingLeft || "0");
  }, []);

  const updateCardStyles = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const reference = alignmentX();
    const slide = slideRefs.current.find((el): el is HTMLDivElement => el !== null);
    const unit = (slide?.offsetWidth ?? 0) + gap || 1;
    const inactiveBrightness = INACTIVE_BRIGHTNESS[theme];

    // When the row has no real scroll distance (forcedIndex is set —
    // see its own comment), the forced card still needs to visually
    // move to the middle the way a real scroll-to-center would, not
    // just scale up in its own static slot. Reported live: "it should
    // move the selected card in the middle always... it does not matter
    // that it is not overflowing the screen" — the earlier version of
    // this only changed scale/brightness in place, which read as
    // "highlighted" but not "brought to the middle" the way this row's
    // own scrollable case already does by actually moving scrollLeft.
    // Since scrollLeft itself has nowhere left to go, every card is
    // shifted by the same translateX instead — the same visual result
    // (the target card centered, everything else sliding the same
    // amount to keep their real spacing intact) without touching
    // scrollLeft at all.
    let centerDelta = 0;
    if (forcedIndex !== null) {
      const target = slideRefs.current[forcedIndex];
      if (target) {
        // Reset before measuring, not after: getBoundingClientRect
        // reflects whatever transform is CURRENTLY applied, and this
        // target may already be carrying a translateX from a previous
        // forcedIndex (every card shares the same one). Measuring
        // without clearing it first folds that old offset into the new
        // one — reported live as the "centered" card landing hundreds
        // of pixels off-center after a second Next/dot click, not the
        // first.
        const previousTransform = target.style.transform;
        target.style.transform = "none";
        const scrollerRect = scroller.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        target.style.transform = previousTransform;
        const targetCenterX = targetRect.left + targetRect.width / 2 - scrollerRect.left;
        centerDelta = scroller.clientWidth / 2 - targetCenterX;
      }
    }

    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      // forcedIndex substitutes a plain "how many cards away from the
      // forced one" count for the usual real-pixel distance — the only
      // path this ever takes is the "nothing to scroll" one, where every
      // card's own real pixel distance from `reference` is already
      // fixed and can't change.
      const distance = forcedIndex !== null ? Math.abs(i - forcedIndex) * unit : Math.abs(slidePosition(el) - reference);
      const progress = Math.min(distance / unit, 1);
      const settledness = 1 - progress;
      el.style.transform = `translate3d(${centerDelta}px, 0, 0) scale(${1 + (ACTIVE_SCALE - 1) * settledness})`;
      el.style.filter = `brightness(${inactiveBrightness + (1 - inactiveBrightness) * settledness})`;
      el.style.zIndex = progress < 0.5 ? "10" : "0";
      // Only the forced-index path needs an explicit transition: a real
      // scroll already updates this every animation frame via the
      // scroll listener below, so the value itself changes smoothly
      // frame-to-frame with no CSS transition needed (the same reasoning
      // CaseStudyStage's own doc comment gives for the page-level
      // carousel). A discrete forced-index jump is a single style write
      // with nothing else animating it, so it needs its own transition
      // to move rather than snap.
      el.style.transition = forcedIndex !== null && !reducedMotion ? "transform 350ms cubic-bezier(0.23, 1, 0.32, 1)" : "";
    });
  }, [theme, alignmentX, slidePosition, forcedIndex, reducedMotion, gap]);

  // Purely reactive to the container's own real scroll position — updates
  // the active-card scale/brightness every frame while scrolling
  // (dragged, swiped, trackpad'd, or arrow'd, it doesn't matter which),
  // and — debounced on quiet time, not every event — updates `index`
  // once things settle, for the dots and the Prev/Next disabled state
  // only. Never writes scrollLeft itself.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    updateCardStyles();

    let settleTimeout: ReturnType<typeof setTimeout>;
    let frame: number | null = null;
    const onScroll = () => {
      // A real scroll event means the row genuinely CAN move — real
      // position takes back over as the only source of truth immediately,
      // same as if forcedIndex had never been set.
      setForcedIndex((current) => (current !== null ? null : current));
      if (frame === null) {
        frame = requestAnimationFrame(() => {
          frame = null;
          updateCardStyles();
        });
      }
      clearTimeout(settleTimeout);
      settleTimeout = setTimeout(() => {
        const reference = alignmentX();
        let closest = 0;
        let closestDistance = Infinity;
        slideRefs.current.forEach((slide, i) => {
          if (!slide) return;
          const distance = Math.abs(slidePosition(slide) - reference);
          if (distance < closestDistance) {
            closestDistance = distance;
            closest = i;
          }
        });
        setIndex((current) => (closest !== current ? closest : current));
      }, SETTLE_MS);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(updateCardStyles);
    resizeObserver.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      clearTimeout(settleTimeout);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [updateCardStyles, alignmentX, slidePosition]);

  // Mouse-only click+drag (touch and trackpad already get real native
  // scrolling for free from `overflow-x-auto` + `touch-pan-x` — a mouse
  // is the one pointer type with no native horizontal-drag gesture of
  // its own). Sets scrollLeft directly, the same property every other
  // input here ultimately moves too.
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
        // Safari/older browsers can reject capture for a pointerId that's already gone.
      }
    }
    el.scrollLeft = state.startScrollLeft - dx;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    drag.current.dragging = false;
  };

  // Prev/Next: a plain scrollBy on this exact same container, roughly
  // one card+gap at a time — not a jump to a managed "index" position.
  // `behavior: "smooth"` works here (it silently no-ops on a `mandatory`
  // snap container, which is part of why this file used to hand-roll its
  // own eased scroll animation) because this container is `proximity`
  // now, not `mandatory`.
  //
  // canScroll false (the row's own content already fits at once — see
  // forcedIndex's own comment) falls back to just advancing forcedIndex
  // directly: scrollBy would be a genuine no-op there (nowhere left to
  // move scrollLeft to), which is exactly what silently broke Prev/Next
  // for a row in that state.
  const scrollByCard = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const canScroll = scroller.scrollWidth - scroller.clientWidth > 1;
    if (!canScroll) {
      setForcedIndex((current) => Math.min(items.length - 1, Math.max(0, (current ?? index) + direction)));
      return;
    }
    const slide = slideRefs.current.find((el): el is HTMLDivElement => el !== null);
    const step = (slide?.offsetWidth ?? cardWidth) + gap;
    scroller.scrollBy({ left: direction * step, behavior: reducedMotion ? "auto" : "smooth" });
  };

  // A dot is a direct "go to this card" jump — still just scrollTo on the
  // one real container, computed from the same slidePosition/alignmentX
  // this file already uses everywhere else, not a second position system.
  // Same canScroll fallback as scrollByCard above for the same reason.
  const scrollToIndex = (i: number) => {
    const scroller = scrollerRef.current;
    const target = slideRefs.current[i];
    if (!scroller || !target) return;
    if (scroller.scrollWidth - scroller.clientWidth <= 1) {
      setForcedIndex(i);
      return;
    }
    const paddingLeft = parseFloat(getComputedStyle(scroller).paddingLeft || "0");
    const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
    const to = Math.min(maxScrollLeft, Math.max(0, slidePosition(target) - paddingLeft));
    scroller.scrollTo({ left: to, behavior: reducedMotion ? "auto" : "smooth" });
  };

  // Whichever is authoritative right now — forcedIndex while it's set
  // (see its own comment above), otherwise the real settled scroll
  // position — is what the dots' own aria-current/width and the
  // Prev/Next disabled state below read, the same way they'd reflect a
  // real settled scroll position normally.
  const displayIndex = forcedIndex ?? index;
  const atStart = displayIndex === 0;
  const atEnd = displayIndex === items.length - 1;

  return (
    // Full-bleed, same "relative left-1/2 w-screen -translate-x-1/2"
    // technique SelectedWorks.tsx's own row already uses to break out of
    // its column — necessary here for the same reason: `alignInset`
    // only produces a shared-left-edge illusion if this row is
    // positioned against the true viewport, not a narrower centered
    // ancestor. Safe for the same reason that file documents: html/body
    // already carry overflow-x:hidden (globals.css), and the scrolling
    // itself stays inside this row's own overflow-x-auto box.
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <div className="flex w-full flex-col items-center gap-6" role="group" aria-label={ariaLabel}>
        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          // select-none: without it, a mouse drag that starts on top of a
          // card's own text selects that text instead of (or as well as)
          // scrolling the row — reported as an explicit requirement, not
          // just a nicety.
          className="scrollbar-none flex w-full cursor-grab touch-pan-x select-none snap-x snap-proximity items-center overflow-x-auto py-3 active:cursor-grabbing"
          // scrollPaddingLeft/Right, not just paddingLeft/Right: CSS
          // scroll-snap's own "start" alignment target is the scrollport
          // (padding-box) edge, not "after the padding" — with
          // scroll-padding left at its default 0, the browser reads the
          // leading padding as empty space it should snap PAST to bring
          // slide 0 flush to the true edge. Telling the snap machinery to
          // treat this same width as already outside the snapport is
          // what makes scrollLeft 0 — slide 0 sitting right where its
          // padding visually places it — the position this row actually
          // rests at instead of fighting it.
          style={{
            gap,
            paddingLeft: alignInset,
            paddingRight: centered ? alignInset : `${END_PEEK_PX}px`,
            scrollPaddingLeft: alignInset,
            scrollPaddingRight: centered ? alignInset : `${END_PEEK_PX}px`,
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="flex shrink-0 snap-start will-change-transform [backface-visibility:hidden]"
              style={{ width: `min(${cardWidth}px, calc(100vw - 80px))` }}
            >
              {item.content}
            </div>
          ))}
        </div>

        {/* Prev / dots / Next — Figma's own "Segmented Control" (136:5983,
            138:6741): unlike CaseStudyNav's page-level pill (Prev/Next only,
            per that component's own doc comment on why dots were dropped
            there), this embedded row keeps a dot per card — a handful of
            review cards benefits from "how many more" in a way a whole
            case-study page's own navigation didn't.

            Secondary controls now, not the only way to move: they read
            and nudge the same real scrollLeft manual scrolling does
            (scrollByCard/scrollToIndex above), same as every other input
            on this row. */}
        <div className="flex items-center gap-2 rounded-full border border-border-disabled bg-bg-default p-1 backdrop-blur-[5px]">
          <button
            type="button"
            aria-label="Previous card"
            disabled={atStart}
            onClick={() => scrollByCard(-1)}
            className="flex items-center justify-center rounded-full px-3 py-2 transition-[background-color,opacity] duration-150 enabled:hover:bg-bg-tertiary disabled:opacity-30"
          >
            <Image src="/images/home/arrow-left.svg" alt="" width={16} height={16} className={themedIcon} />
          </button>
          <div className="flex items-center gap-1.5">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Go to card ${i + 1}`}
                aria-current={i === displayIndex}
                onClick={() => scrollToIndex(i)}
                className={`h-2 rounded-full bg-bg-secondary transition-[width] duration-150 ${i === displayIndex ? "w-3.5" : "w-2"}`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next card"
            disabled={atEnd}
            onClick={() => scrollByCard(1)}
            className="flex items-center justify-center rounded-full px-3 py-2 transition-[background-color,opacity] duration-150 enabled:hover:bg-bg-tertiary disabled:opacity-30"
          >
            <Image src="/images/home/arrow-right.svg" alt="" width={16} height={16} className={themedIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}
