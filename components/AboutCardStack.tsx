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
  // Mobile: opened state is a plain, non-overlapping 2-column grid (Figma
  // 303:8456 — "opened" mobile state), not a zigzagging cascade — see
  // getMobileFinal below. Figma's own frame draws that grid at the cards'
  // full desktop size (160x190), but adopting that size here — not just
  // the grid *pattern* — would force containerH up to ~808px (4 rows of
  // 190 + 3 16px gaps) purely to reserve room for a state that's only
  // ever entered on tap. Since this wrapper's height is static (sized for
  // whichever state is tallest, closed or open — see showFinal below) as
  // it already is on desktop, that 808px would sit as dead space behind
  // the resting 3-card stack on every phone-width viewport, nearly a full
  // extra screen's worth. Keeping the cards at the size already tuned for
  // narrow viewports (132x156) and only borrowing Figma's arrangement
  // keeps containerH proportionate (4*156+3*16=672) while still reading
  // as the same clean, non-overlapping grid once opened.
  mobile: { cardW: 132, cardH: 156, containerW: 280, containerH: 672, scale: { x: 1, y: 1 } },
};

function getBreakpoint(width: number): Breakpoint {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/** Mobile final layout: a plain 2-column, non-overlapping grid — 16px gaps
 * both between columns and between rows, per Figma 303:8456 — computed
 * directly rather than compressing the wide desktop composition. */
function getMobileFinal(index: number, cardW: number, cardH: number) {
  const col = index % 2;
  const row = Math.floor(index / 2);
  const gap = 16;
  return { x: col * (cardW + gap), y: row * (cardH + gap) };
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

// Card-to-card transform transition. Only ever toggled between two fixed
// endpoints (stack / final) now that this is hover-driven rather than
// scroll-scrubbed, so a plain CSS transition on `transform` does the
// interpolation — no rAF, no per-frame lerp, no scroll listener at all.
const CARD_TRANSITION = "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)";

export default function AboutCardStack() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fitScale, setFitScale] = useState(1);
  const [hovered, setHovered] = useState(false);
  // Touch devices have no persistent hover state — mouseenter/leave
  // either never fire or fire once on tap with no matching "leave" until
  // the next tap elsewhere, so a hover-only reveal is simply unreachable
  // there. canHover switches the trigger to tap-to-toggle instead of
  // hover for exactly those devices; keyboard access (focus/blur, below)
  // is unconditional either way.
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);

    const updateBreakpoint = () => setBreakpoint(getBreakpoint(window.innerWidth));
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCanHover = () => setCanHover(hoverQuery.matches);
    updateCanHover();
    hoverQuery.addEventListener("change", updateCanHover);

    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      window.removeEventListener("resize", updateBreakpoint);
      hoverQuery.removeEventListener("change", updateCanHover);
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
  // clipped on tighter viewports.
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

  // Hover-driven only: no scroll scrubbing, no sticky pin, no wrapper
  // height tied to viewport size. That scroll-linked design needed a
  // large, viewport-proportional scroll distance for the pin to release
  // into, which only ever paid off in extra scrollable dead space once
  // the trailing content (the footer) turned out too short to fill it on
  // anything but a short viewport — no amount of retuning that distance
  // could avoid it, since the shortfall doesn't depend on how that
  // distance is sized. Driving the reveal from hover instead removes the
  // scroll dependency (and the dead space) entirely: this is just a
  // normal, content-sized block now.
  const showFinal = reducedMotion || hovered;

  return (
    // No overflow-hidden here: the hover hit-zone below deliberately
    // extends 16px past this element's own box on every side (including
    // the bottom), and clipping would silently kill the bottom margin of
    // that hit area.
    <div ref={wrapperRef} className="flex w-full items-start justify-center pt-6">
      <div className="relative" style={{ width: layout.containerW, height: layout.containerH }}>
        {/* Hover-to-preview triggers over the card composition itself plus
            a 16px margin around it — this element *wraps* the cards
            (rather than sitting beside them) specifically so hovering a
            card counts as hovering it too; mouseenter/leave only fire on
            an ancestor for crossing its own outer boundary, not for
            moving between children, which is exactly the "leave only
            when you exit the whole padded area" behavior this needs.
            Absolutely positioned + inset so the extra 16px is purely a
            bigger hit area — it doesn't add to this element's layout
            footprint the way padding would, which is what keeps the gap
            to the footer below exactly the designed 36px instead of 16px
            taller than intended. */}
        <div
          onMouseEnter={canHover ? () => setHovered(true) : undefined}
          onMouseLeave={canHover ? () => setHovered(false) : undefined}
          onClick={!canHover ? () => setHovered((h) => !h) : undefined}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          role={!canHover ? "button" : undefined}
          aria-pressed={!canHover ? hovered : undefined}
          aria-label={!canHover ? "Reveal what kind of designer I am" : undefined}
          tabIndex={0}
          className="absolute -inset-4 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary"
        >
          <div
            className="absolute"
            style={{
              inset: 16,
              transform: fitScale < 1 ? `scale(${fitScale})` : undefined,
              transformOrigin: "top center",
            }}
          >
            {CARDS.map((card, i) => {
              const { stack, final } = positions[i];
              const { x, y } = showFinal ? final : stack;
              return (
                <Card
                  key={card.id}
                  card={card}
                  layout={layout}
                  style={{
                    transform: `translate3d(${x}px, ${y}px, 0)`,
                    transition: reducedMotion ? undefined : CARD_TRANSITION,
                    zIndex: 8 - card.stackIndex,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  card,
  layout,
  style,
}: {
  card: CardData;
  layout: { cardW: number; cardH: number };
  style: React.CSSProperties;
}) {
  return (
    <div
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
