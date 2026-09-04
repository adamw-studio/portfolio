"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CardData = {
  id: string;
  color: string;
  lines: string[];
  /** Final (expanded) position — Figma's exact per-card pixel offsets from node 217:12252. */
  final: { x: number; y: number };
  /** 0 = frontmost card in the resting stack (the only one with legible text), 7 = furthest back/most hidden. */
  stackIndex: number;
};

// Card copy, color and *final* positions are exact (Figma node 217:12252).
const CARDS: CardData[] = [
  { id: "prototype", color: "#fff1b5", lines: ["prototype", "with AI"], final: { x: 168, y: 17 }, stackIndex: 0 },
  { id: "systems", color: "#00a2c2", lines: ["builds design", "systems"], final: { x: 336, y: 70 }, stackIndex: 1 },
  { id: "workflows", color: "#fff1b5", lines: ["rethinks team’s", "workflows"], final: { x: 504, y: 0 }, stackIndex: 2 },
  {
    id: "creative",
    color: "#00a2c2",
    lines: ["believes in the power", "of creative thinking"],
    final: { x: 0, y: 143 },
    stackIndex: 3,
  },
  {
    id: "learning",
    color: "#fff1b5",
    lines: ["is invested in", "learning new things"],
    final: { x: 672, y: 143 },
    stackIndex: 4,
  },
  {
    id: "details",
    color: "#fff1b5",
    lines: ["obsessed about the", "smallest details"],
    final: { x: 168, y: 215 },
    stackIndex: 5,
  },
  { id: "shipcode", color: "#00a2c2", lines: ["...want to", "ship code"], final: { x: 504, y: 198 }, stackIndex: 6 },
  {
    id: "crit",
    color: "#fff1b5",
    lines: ["loves a good design", "crit session"],
    final: { x: 337, y: 268 },
    stackIndex: 7,
  },
];

type Breakpoint = "desktop" | "tablet" | "mobile";

const LAYOUT: Record<Breakpoint, { cardW: number; cardH: number; containerW: number; containerH: number; scale: { x: number; y: number } }> = {
  // Desktop: exact Figma values, no scaling.
  desktop: { cardW: 160, cardH: 190, containerW: 832, containerH: 458, scale: { x: 1, y: 1 } },
  // Tablet: smaller cards, horizontal spread compressed more than vertical
  // (per spec: "reduce horizontal spread", "preserve the scattered-card concept").
  tablet: { cardW: 128, cardH: 152, containerW: 560, containerH: 430, scale: { x: 0.55, y: 0.85 } },
  // Mobile: cards spread into a narrow two-column diagonal, not a scaled-down
  // version of the wide desktop layout (see getMobileFinal below).
  mobile: { cardW: 132, cardH: 156, containerW: 300, containerH: 900, scale: { x: 1, y: 1 } },
};

function getBreakpoint(width: number): Breakpoint {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/** Mobile final layout: a narrow two-column diagonal cascade, computed
 * directly rather than compressing the wide desktop composition. */
function getMobileFinal(index: number, cardW: number, cardH: number) {
  const col = index % 2;
  const row = Math.floor(index / 2);
  const colGap = 24;
  const rowStep = cardH * 0.62;
  const zigzag = col === 0 ? 0 : 28;
  return { x: col * (cardW + colGap), y: row * rowStep + zigzag };
}

function getFinalPosition(breakpoint: Breakpoint, card: CardData, index: number) {
  const layout = LAYOUT[breakpoint];
  if (breakpoint === "mobile") return getMobileFinal(index, layout.cardW, layout.cardH);
  return { x: card.final.x * layout.scale.x, y: card.final.y * layout.scale.y };
}

// Figma's stacked "before" state (217:12280) only ever shows 3 distinct card
// surfaces — front, middle, back — each offset from the last by the same
// diagonal step. The remaining 5 cards aren't a continuation of that
// cascade; they sit exactly where the back card sits, fully hidden beneath
// it, so only 3 are ever visible at rest.
const STACK_CASCADE = [
  { x: 0, y: 47 },
  { x: 25, y: 23.5 },
  { x: 50, y: 0 },
];

function getStackOffset(stackIndex: number, layout: (typeof LAYOUT)["desktop"]) {
  const cascade = STACK_CASCADE[Math.min(stackIndex, STACK_CASCADE.length - 1)];
  const last = STACK_CASCADE[STACK_CASCADE.length - 1];
  const clusterW = layout.cardW + last.x * layout.scale.x;
  const clusterH = layout.cardH + last.y * layout.scale.y;
  const baseX = layout.containerW / 2 - clusterW / 2;
  // Biased toward the top third of the container (not true vertical
  // center) so the resting stack sits closer to the "I'm a designer who,"
  // heading rather than in the middle of the viewport.
  const baseY = layout.containerH * 0.32 - clusterH / 2;
  return { x: baseX + cascade.x * layout.scale.x, y: baseY + cascade.y * layout.scale.y };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

// Sine ease-in-out: smooth, restrained scrubbing with no overshoot/bounce.
function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

const HOVER_TRANSITION = "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)";

export default function AboutCardStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isHoveringRef = useRef(false);
  const applyProgressRef = useRef<() => void>(() => {});
  const hoverTimeoutRef = useRef<number | null>(null);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fitScale, setFitScale] = useState(1);
  const [trailingBuffer, setTrailingBuffer] = useState(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);

    const updateBreakpoint = () => setBreakpoint(getBreakpoint(window.innerWidth));
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      window.removeEventListener("resize", updateBreakpoint);
    };
  }, []);

  const layout = LAYOUT[breakpoint];

  const positions = useMemo(
    () =>
      CARDS.map((card, i) => ({
        stack: getStackOffset(card.stackIndex, layout),
        final: getFinalPosition(breakpoint, card, i),
      })),
    [breakpoint, layout],
  );

  // Shrink the composition (via a single ancestor transform, not by
  // recomputing every card's pixel offsets) whenever the available column is
  // narrower than the layout's native container width, so cards never get
  // clipped by the sticky wrapper's overflow-hidden on tighter viewports.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const update = () => {
      const available = wrapper.clientWidth;
      setFitScale(available > 0 ? Math.min(1, available / layout.containerW) : 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [layout.containerW]);

  // Guarantees the scroll-driven animation can always reach progress=1.
  // Once the sticky pin releases, that scroll position only exists on the
  // page if there's at least one more viewport-height of content below it
  // — browsers can't scroll past `document height - viewport height`.
  // Shrinking the wrapper to its actual content (see the section below)
  // means it's no longer automatically exactly one viewport tall, so this
  // spacer makes up whatever's still short. Recomputed per breakpoint
  // since the wrapper's content height varies a lot — mobile's stacked
  // card layout is taller than a typical mobile viewport on its own.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const update = () => setTrailingBuffer(Math.max(0, window.innerHeight - wrapper.offsetHeight));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint, layout]);

  // Scroll-linked animation. Reads scroll position and writes transforms
  // directly to card DOM nodes inside a single rAF-throttled callback —
  // bypassing React state so continuous scrolling never triggers a
  // re-render, only cheap transform writes on already-mounted elements.
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    let rafId: number | null = null;

    const applyProgress = () => {
      rafId = null;
      const rect = section.getBoundingClientRect();
      // The sticky child's own height, not the viewport's — sticky
      // release happens when the *parent's* bottom reaches the *child's*
      // bottom, and those stopped being the same thing once the wrapper
      // was sized to its content instead of a flat h-screen. Using
      // window.innerHeight here (i.e. assuming child height == viewport
      // height) made the CSS unstick before this math ever reached
      // progress 1, so the JS kept writing transforms for a scroll range
      // that had already ended — reads as the animation getting stuck.
      const stickyH = wrapperRef.current?.offsetHeight ?? window.innerHeight;
      const scrollableDistance = section.offsetHeight - stickyH;
      const scrollProgress = scrollableDistance > 0 ? clamp01(-rect.top / scrollableDistance) : 0;
      // Hovering the card area previews the full unfold immediately,
      // independent of scroll position; scroll remains the primary driver
      // once the pointer leaves.
      const progress = isHoveringRef.current ? 1 : scrollProgress;
      const eased = easeInOutSine(progress);

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const { stack, final } = positions[i];
        const x = lerp(stack.x, final.x, eased);
        const y = lerp(stack.y, final.y, eased);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

    applyProgressRef.current = applyProgress;

    const onScroll = () => {
      if (rafId === null) rafId = requestAnimationFrame(applyProgress);
    };

    applyProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [positions, reducedMotion]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current !== null) window.clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (reducedMotion) return;
    isHoveringRef.current = true;
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    cardRefs.current.forEach((el) => {
      if (el) el.style.transition = HOVER_TRANSITION;
    });
    applyProgressRef.current();
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    isHoveringRef.current = false;
    cardRefs.current.forEach((el) => {
      if (el) el.style.transition = HOVER_TRANSITION;
    });
    applyProgressRef.current();
    // Drop the transition once it's finished so scroll-scrubbing goes back
    // to tracking the scroll position 1:1 with no lag.
    hoverTimeoutRef.current = window.setTimeout(() => {
      cardRefs.current.forEach((el) => {
        if (el) el.style.transition = "none";
      });
      hoverTimeoutRef.current = null;
    }, 500);
  };

  // Reduced motion: no sticky pin, no scroll distance, no listeners — just
  // the static final composition.
  if (reducedMotion) {
    return (
      <div ref={wrapperRef} className="w-full overflow-hidden">
        <div
          className="relative mx-auto"
          style={{
            width: layout.containerW,
            height: layout.containerH * fitScale,
            transform: fitScale < 1 ? `scale(${fitScale})` : undefined,
            transformOrigin: "top center",
          }}
        >
          {CARDS.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              layout={layout}
              style={{ transform: `translate3d(${positions[i].final.x}px, ${positions[i].final.y}px, 0)` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    // Section height = scroll distance the pin holds for (unchanged from
    // before, in vh so it scales with viewport) + the sticky wrapper's own
    // height. The wrapper used to be a flat h-screen regardless of how
    // tall the card composition actually is, so once the animation
    // settled there was still up to ~240px of empty space to scroll
    // through *inside* the still-pinned box before the section even
    // ended — on top of whatever margin followed it. Sizing the wrapper
    // to its content (pt-6 + the card container + a small pb) removes
    // that dead zone. The trailing spacer below restores just enough of
    // that removed height back (see the effect that computes it) so the
    // scroll-driven animation can still always reach progress=1 — without
    // it, on any viewport taller than the wrapper's new content height,
    // there simply isn't enough page left to scroll to that point.
    <>
      <section ref={sectionRef} className="relative h-[calc(90vh+520px)]">
        <div
          ref={wrapperRef}
          className="sticky top-0 flex w-full items-start justify-center overflow-hidden pt-6 pb-8"
        >
          {/* Hover-to-preview only triggers within the card composition
              itself plus a 16px margin around it — not the whole sticky
              area (which is as wide as the viewport). The padding grows
              this element by 16px on every side without shifting the
              cards inside it: the flex parent re-centers the now-larger
              box, and the padding pushes the (unchanged-size) card
              container back to the exact same spot. */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ width: layout.containerW + 32, height: layout.containerH + 32, padding: 16 }}
          >
            <div
              className="relative"
              style={{
                width: layout.containerW,
                height: layout.containerH,
                transform: fitScale < 1 ? `scale(${fitScale})` : undefined,
                transformOrigin: "top center",
              }}
            >
              {CARDS.map((card, i) => (
                <Card
                  key={card.id}
                  card={card}
                  layout={layout}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  style={{
                    transform: `translate3d(${positions[i].stack.x}px, ${positions[i].stack.y}px, 0)`,
                    zIndex: 8 - card.stackIndex,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {trailingBuffer > 0 && <div style={{ height: trailingBuffer }} aria-hidden />}
    </>
  );
}

function Card({
  card,
  layout,
  style,
  ref,
}: {
  card: CardData;
  layout: { cardW: number; cardH: number };
  style: React.CSSProperties;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className="absolute left-0 top-0 overflow-hidden rounded-lg will-change-transform"
      style={{ width: layout.cardW, height: layout.cardH, backgroundColor: card.color, ...style }}
    >
      <div className="absolute left-3 top-3 size-1 rounded-full bg-[#0d0d0d]" />
      <div className="absolute left-[66px] top-3 h-1 w-7 rounded-full bg-[#0d0d0d]" />
      <div className="absolute bottom-3 left-3 font-serif text-[16px] leading-[18px] tracking-[-0.128px] text-[#0d0d0d]">
        {card.lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
