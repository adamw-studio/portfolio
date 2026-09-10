"use client";

import { useEffect, useRef, useState } from "react";

type CardData = {
  id: string;
  color: string;
  textColor: string;
  text: string;
  /** Pre-rotation top-left position (px), within this component's fixed
   * 655x199 reference frame — see the width/height note below. */
  x: number;
  y: number;
  rotate: number;
  /** Filename under public/videos/about-cards/ — unset renders the flat
   * card color alone (Figma's own placeholder state) until wired up. */
  video?: string;
};

// Figma node 14:7194 — six cards, scattered with individual rotation, not
// the eight-card staggered-diagonal stack this previously showed only on
// hover. Position math: Figma exports a rotated element as a NON-rotated
// wrapper div sized to that element's rotated bounding box (so the
// rotation itself doesn't shift the wrapper's own layout position), with
// the actual rotated card centered inside via items-center justify-center.
// To get each card's own pre-rotation (x, y) — what this component
// actually needs, since CSS `rotate()` pivots around transform-origin
// without touching layout position — every wrapper's center point was
// computed (left + width/2, top + height/2) and then this card's own
// fixed 130x162 box was centered on that same point (x = centerX - 65,
// y = centerY - 81). Cards 4 and 5 ("rethinks team's workflows", "...want
// to ship code") have no rotation in Figma, so they needed no wrapper/
// centering step — their left/top are used directly.
const CARD_W = 130;
const CARD_H = 162;

const CARDS: CardData[] = [
  { id: "prototype", color: "#f83e00", textColor: "#ffffbc", text: "prototyping with AI", x: 10, y: 21, rotate: -7.55, video: "about-card-prototype.mp4" },
  { id: "learning", color: "#f8ecd7", textColor: "#544831", text: "is invested in learning new things", x: 123, y: 23, rotate: 5.09, video: "about-card-learning.mp4" },
  { id: "details", color: "#0093d9", textColor: "#93ffff", text: "obsessed about the smallest details", x: 225, y: 6, rotate: -5.68, video: "about-card-details.mp4" },
  { id: "workflows", color: "#00f790", textColor: "#004f00", text: "rethinks team’s workflows", x: 315, y: 26, rotate: 0, video: "about-card-workflows.mp4" },
  { id: "design", color: "#211f1e", textColor: "#f8ecd7", text: "builds design system", x: 415, y: 26, rotate: 10.05, video: "about-card-design.mp4" },
  { id: "shipcode", color: "#00a4c6", textColor: "#0d0d0d", text: "...want to ship code", x: 525, y: 26, rotate: 0, video: "about-card-shipcode.mp4" },
];

// Bounding box of all six cards' *rotated* extents (not the sum of their
// unrotated boxes) — rightmost is card 5's flat right edge (525+130=655),
// bottommost is card 6's rotated wrapper bottom (15.94+182.205≈198).
const CONTAINER_W = 655;
const CONTAINER_H = 199;

// Where a selected card lands: the container's own center, minus half the
// card's own footprint — i.e. every card converges on the same spot when
// picked, rather than just growing from its own scattered position (which
// would push cards near the container's edges — cards 1 and 5 both sit
// within 10px of it — mostly off past the edge instead of into view).
const SELECTED_X = CONTAINER_W / 2 - CARD_W / 2;
const SELECTED_Y = CONTAINER_H / 2 - CARD_H / 2;
const SELECTED_SCALE = 1.5;
const DIM_OPACITY = 0.55;

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"; // this project's own strong-ease-out (see components/motion/tokens.ts)
const STAGGER_MS = 60;
const SELECT_MS = 350;

export default function AboutCardStack() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);
    return () => motionQuery.removeEventListener("change", updateMotion);
  }, []);

  // One-time reveal when the composition scrolls into view — not a
  // hover/tap trigger like the previous version had, since Figma now
  // shows these cards in their final scattered position inline on the
  // page, not behind an interaction. Reduced motion (or the IO callback
  // never having a chance to fire, e.g. no IntersectionObserver support)
  // just shows the resting state immediately rather than leaving cards
  // stuck invisible.
  useEffect(() => {
    if (reducedMotion) {
      // Syncing from the reducedMotion signal, known only after mount —
      // same pattern (and same justified exception) as PasswordGate's
      // own sessionStorage read and BeaconComposer's own reduced-motion
      // branch.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [reducedMotion]);

  // Click/tap a card to bring it forward and highlight it (interfacecraft.dev
  // itself turned out not to actually have this on closer testing — real
  // clicks on its cards did nothing there, the "one big card" look is just
  // its resting composition — but it's the interaction that was asked for,
  // built fresh rather than copied from a behavior that doesn't exist to
  // copy). Clicking the selected card again, clicking outside the
  // composition, or Escape all deselect — same outside-click + Escape
  // pattern Nav.tsx already uses for its own dismiss.
  useEffect(() => {
    if (!selectedId) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setSelectedId(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedId]);

  return (
    // overflow-hidden normally — the 655px composition fits Home's own
    // 688px column with room to spare, so nothing clips at that width,
    // but on narrower viewports (this never rescales down the way the old
    // hover version did) the fan is wider than its column and the outer
    // cards crop at the edges by design, matching the interfacecraft.dev
    // reference this was modeled on. Switches to overflow-visible while a
    // card is selected: at 1.5x, a selected card's own box (195x243) is
    // taller than this container (199px), and centering it means that
    // excess extends symmetrically above/below the container's normal
    // bounds — clipping it there would cut off the exact card this is
    // trying to showcase. html/body's own overflow-x: hidden (globals.css)
    // still backstops horizontal page scroll either way.
    <div
      ref={wrapperRef}
      className={`flex w-full items-start justify-center pt-6 ${selectedId ? "overflow-visible" : "overflow-hidden"}`}
    >
      <div className="relative shrink-0" style={{ width: CONTAINER_W, height: CONTAINER_H }}>
        {CARDS.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            visible={visible}
            reducedMotion={reducedMotion}
            delay={i * STAGGER_MS}
            selected={selectedId === card.id}
            dimmed={selectedId !== null && selectedId !== card.id}
            onToggle={() => setSelectedId((current) => (current === card.id ? null : card.id))}
          />
        ))}
      </div>
    </div>
  );
}

function Card({
  card,
  visible,
  reducedMotion,
  delay,
  selected,
  dimmed,
  onToggle,
}: {
  card: CardData;
  visible: boolean;
  reducedMotion: boolean;
  delay: number;
  selected: boolean;
  dimmed: boolean;
  onToggle: () => void;
}) {
  const x = selected ? SELECTED_X : card.x;
  const y = selected ? SELECTED_Y : card.y;
  const rotate = selected ? 0 : card.rotate; // straightens out of its tilt when picked — same "this one's in focus" cue Tag.tsx's own hover state already uses
  const entranceScale = visible ? 1 : 0.92;
  const scale = selected ? SELECTED_SCALE : entranceScale;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${card.text}${selected ? " (selected)" : ""}`}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      className="absolute left-0 top-0 flex cursor-pointer flex-col justify-between overflow-hidden rounded-m p-2 outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-text-primary"
      style={{
        width: CARD_W,
        height: CARD_H,
        backgroundColor: card.color,
        opacity: reducedMotion ? (dimmed ? DIM_OPACITY : 1) : visible ? (dimmed ? DIM_OPACITY : 1) : 0,
        zIndex: selected ? 10 : 1,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${reducedMotion ? (selected ? SELECTED_SCALE : 1) : scale})`,
        transition: reducedMotion
          ? undefined
          : `opacity ${SELECT_MS}ms ${EASE_OUT} ${delay}ms, transform ${selected || dimmed ? SELECT_MS : 500}ms ${EASE_OUT} ${selected || dimmed ? 0 : delay}ms`,
      }}
    >
      {/* Figma's own export for this area came back as an empty div —
          it renders a hand-drawn pattern in the design file that the
          MCP tool can't translate to markup, but the actual intent is a
          looping video here instead of a static pattern (confirmed, and
          supplied per-card). object-cover on a 4:3 source inside this
          wide, short 130x60 box crops to a horizontal center band — not
          a bug, just what covering a mismatched aspect ratio does; the
          `video` field staying optional is what lets a card render as
          just its flat color if one's ever missing rather than breaking. */}
      <div className="relative h-[60px] w-full shrink-0 overflow-hidden">
        {card.video && (
          <video
            src={`/videos/about-cards/${card.video}`}
            autoPlay
            loop
            muted
            playsInline
            className="size-full object-cover"
          />
        )}
      </div>
      <p className="w-full font-serif text-[16px] leading-[18px] tracking-[-0.128px]" style={{ color: card.textColor }}>
        {card.text}
      </p>
    </div>
  );
}
