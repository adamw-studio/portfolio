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

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"; // this project's own strong-ease-out (see components/motion/tokens.ts)
const STAGGER_MS = 60;

export default function AboutCardStack() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

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

  return (
    // overflow-hidden + flex justify-center: the 655px composition fits
    // Home's own 688px column with room to spare, so nothing clips at
    // that width — but on any narrower viewport (this never rescales
    // down the way the old hover version did), the fan is wider than its
    // column and the outer cards crop at the edges by design, matching
    // the interfacecraft.dev reference this was modeled on — its own
    // card composition is a fixed size that overflows and crops on
    // narrow viewports rather than shrinking to stay fully visible.
    // html/body's own overflow-x: hidden (globals.css) is what keeps
    // that from ever becoming page-level horizontal scroll.
    <div ref={wrapperRef} className="flex w-full items-start justify-center overflow-hidden pt-6">
      <div className="relative shrink-0" style={{ width: CONTAINER_W, height: CONTAINER_H }}>
        {CARDS.map((card, i) => (
          <Card key={card.id} card={card} visible={visible} reducedMotion={reducedMotion} delay={i * STAGGER_MS} />
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
}: {
  card: CardData;
  visible: boolean;
  reducedMotion: boolean;
  delay: number;
}) {
  const scale = visible ? 1 : 0.92;
  return (
    <div
      className="absolute left-0 top-0 flex flex-col justify-between overflow-hidden rounded-m p-2 will-change-transform"
      style={{
        width: CARD_W,
        height: CARD_H,
        backgroundColor: card.color,
        opacity: reducedMotion ? 1 : visible ? 1 : 0,
        transform: `translate3d(${card.x}px, ${card.y}px, 0) rotate(${card.rotate}deg) scale(${reducedMotion ? 1 : scale})`,
        transition: reducedMotion ? undefined : `opacity 500ms ${EASE_OUT} ${delay}ms, transform 500ms ${EASE_OUT} ${delay}ms`,
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
