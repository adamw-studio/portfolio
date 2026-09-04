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
// Figma's stacked "before" state (217:12280) only specifies 3 of the 8 cards
// explicitly, since the other 5 are fully hidden behind them — their
// resting positions are extrapolated by continuing that same diagonal
// cascade (see getStackOffset below), not guessed independently.
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

/** Resting-stack offset for a card, continuing Figma's own diagonal cascade
 * (front→middle ≈ +25x/-23.5y, middle→back ≈ +25x/-25y — averaged here)
 * outward symmetrically from the stack's center so all 8 cluster together. */
function getStackOffset(stackIndex: number, layout: (typeof LAYOUT)["desktop"]) {
  const dx = 25 * layout.scale.x;
  const dy = -23.5 * layout.scale.y;
  const baseX = layout.containerW / 2 - layout.cardW / 2;
  // Biased toward the top third of the container (not true vertical
  // center) so the resting stack sits closer to the "About me" heading
  // rather than in the middle of the viewport.
  const baseY = layout.containerH * 0.32 - layout.cardH / 2;
  const t = stackIndex - 3.5;
  return { x: baseX + t * dx, y: baseY + t * dy };
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

export default function AboutCardStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [reducedMotion, setReducedMotion] = useState(false);

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
      const viewportH = window.innerHeight;
      const scrollableDistance = section.offsetHeight - viewportH;
      const progress = scrollableDistance > 0 ? clamp01(-rect.top / scrollableDistance) : 0;
      const eased = easeInOutSine(progress);

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const { stack, final } = positions[i];
        const x = lerp(stack.x, final.x, eased);
        const y = lerp(stack.y, final.y, eased);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };

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

  // Reduced motion: no sticky pin, no scroll distance, no listeners — just
  // the static final composition.
  if (reducedMotion) {
    return (
      <div
        className="relative mx-auto"
        style={{ width: layout.containerW, height: layout.containerH, maxWidth: "100%" }}
      >
        {CARDS.map((card, i) => (
          <Card key={card.id} card={card} layout={layout} style={{ transform: `translate3d(${positions[i].final.x}px, ${positions[i].final.y}px, 0)` }} />
        ))}
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen w-full items-start justify-center overflow-hidden pt-6">
        <div className="relative" style={{ width: layout.containerW, height: layout.containerH, maxWidth: "100%" }}>
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
    </section>
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
