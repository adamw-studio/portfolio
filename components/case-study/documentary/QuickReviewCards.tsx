"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// This project statically pre-renders every route — useLayoutEffect
// warns on that server pass even though nothing here depends on running
// during it. Aliasing to plain useEffect for that one pass silences the
// warning without changing behavior.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Figma 165:2834 ("Group 6", the Quick Review card fan) — same
// scattered card-stack technique as Robotics' own QuickReviewCards.tsx
// (which this file is modeled on directly), re-themed with this
// project's own four review beats and a deep-red palette instead of
// Robotics' cream/blue/yellow.
//
// Four cards, not five — this fan has no fifth "unrotated" card the
// way Robotics' own does; Figma's own card group here stops at
// "Teaser". Same resting-fan-only decision as Robotics for the same
// reason: none of these four cards has an expanded "Card / Default"
// counterpart anywhere in this file, just a title each.
//
// All four cards share ONE texture (checkerboard), not a mix of two the
// way Robotics' own five do — confirmed via download_assets on this
// node returning a single small+large pair, and every card's own
// isolated get_screenshot showing the same pattern.
//
// Video, not the static still this file first shipped with — Robotics'
// own QuickReviewCards.tsx got the same fix for the same reason (see
// its own doc comment for the fuller story: the "checkerboard" still
// was itself just a poster frame of a real looping clip, RewiredIA-
// loop.mp4, supplied directly and confirmed pixel-for-pixel against
// that still). Reused directly from Robotics' own saved file
// (robotics-review-checkerboard.mp4) rather than a second copy under a
// different name — same asset both projects' own Figma files draw the
// identical checkerboard fill from.
//
// Position math and the negative-rotation get_metadata/
// get_design_context caveat: identical technique to Robotics' own file
// (see its own doc comment for the fuller explanation) — applied again
// here for "Context" (-7.45°) and "Contributions" (-4°), the two
// negatively-rotated cards.
//
// Re-measured live, reported as misaligned: the Figma file itself moved
// between this file's first fetch and this re-fetch (165:2835) — "Story
// behind" changed the most (11.02°→5.04° rotation, a smaller/different
// wrapper box, its own x/y shifted with it), and every other card's own
// position shifted by a few px too, the same "the design itself moved"
// situation Beacon's own QuickReviewCards doc comment already
// describes happening there. Every x/y value below is from this
// re-fetch, not the original one.
type CardData = {
  id: string;
  color: string;
  textColor: string;
  text: string;
  /** Pre-rotation top-left position (px), within this component's own
   * fixed 440x186 reference frame. */
  x: number;
  y: number;
  rotate: number;
};

const CARD_W = 130;
const CARD_H = 162;
const CARD_RADIUS = 10; // --radius-m
const CHECKERBOARD_VIDEO = "/images/home/robotics-review-checkerboard.mp4";

const CARDS: CardData[] = [
  {
    id: "context",
    color: "#d03939",
    textColor: "#f8ecd7",
    text: "Context",
    x: 9.95,
    y: 7.74,
    rotate: -7.45,
  },
  {
    id: "story-behind",
    color: "#5c0404",
    textColor: "#f8ecd7",
    text: "Story behind",
    x: 127.11,
    y: 10.19,
    rotate: 5.04,
  },
  {
    id: "contributions",
    color: "#d03939",
    textColor: "#f8ecd7",
    text: "Contributions",
    x: 204.65,
    y: 6.78,
    rotate: -4,
  },
  {
    id: "teaser",
    color: "#5c0404",
    textColor: "#f8ecd7",
    text: "Teaser",
    x: 304.65,
    y: 16.78,
    rotate: 0,
  },
];

// Card 4's own unrotated box reaches to exactly 434.65 (304.65 + 130) —
// the fan's own rightmost extent (card 3's own rotated bounding box
// only reaches ≈340.14) — rounded up a little for the same reason
// every other fan's own CONTAINER_W is. Height matches card 4's own
// bottom edge (16.78 + 162 ≈ 178.78, this fan's own group height per
// get_metadata) with a small buffer.
const CONTAINER_W = 436;
const CONTAINER_H = 182;

const RESTING_TEXT = "font-sans font-extrabold text-[16px] leading-[18px] tracking-[-0.128px]";

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const STAGGER_MS = 60;
const REST_MS = 400;
const HOVER_MS = 180;
const HOVER_LIFT = 10;
const HOVER_ROTATE_FACTOR = 0.45;

export default function QuickReviewCards() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Defaults true, not false — this component's own server-rendered
  // (and no-JS) HTML must show the resting card fan fully visible, not
  // permanently invisible, if JS never runs to flip it. Armed back to
  // its real pre-reveal state by the mount-only layout effect below,
  // before a JS-enabled visitor's browser ever paints it — same
  // progressive-enhancement shape as components/Reveal.tsx's own
  // "initial" phase.
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);
    return () => motionQuery.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof ResizeObserver === "undefined") return;
    const updateScale = () => setScale(Math.min(1, wrapper.clientWidth / CONTAINER_W));
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // Arms the hidden pre-reveal state before the browser's first paint —
  // mount-only, not gated on reducedMotion (see Reveal.tsx's own fuller
  // comment on why: that signal isn't known for certain until a later
  // passive effect, and the reveal effect just below already corrects
  // `visible` back to true if reducedMotion does turn out to be true).
  useIsomorphicLayoutEffect(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
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
    <div ref={wrapperRef} className="flex w-full items-start justify-center overflow-hidden pt-6" style={{ height: CONTAINER_H * scale + 24 }}>
      <div
        className="relative shrink-0"
        style={{
          width: CONTAINER_W,
          height: CONTAINER_H,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {CARDS.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            visible={visible}
            reducedMotion={reducedMotion}
            delay={i * STAGGER_MS}
            hovered={canHover && hoveredId === card.id}
            onHoverChange={(isHovered) => setHoveredId((current) => (isHovered ? card.id : current === card.id ? null : current))}
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
  hovered,
  onHoverChange,
}: {
  card: CardData;
  visible: boolean;
  reducedMotion: boolean;
  delay: number;
  hovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}) {
  const y = card.y - (hovered ? HOVER_LIFT : 0);
  const rotate = card.rotate * (hovered ? 1 - HOVER_ROTATE_FACTOR : 1);
  const entranceScale = reducedMotion || visible ? 1 : 0.92;
  const hoverScale = hovered ? 1.03 : 1;

  return (
    <div
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className="absolute left-0 top-0 flex flex-col overflow-hidden will-change-transform"
      style={{
        width: CARD_W,
        height: CARD_H,
        padding: 8,
        borderRadius: CARD_RADIUS,
        backgroundColor: card.color,
        opacity: reducedMotion || visible ? 1 : 0,
        zIndex: hovered ? 6 : 1,
        transform: `translate3d(${card.x}px, ${y}px, 0) rotate(${rotate}deg) scale(${entranceScale * hoverScale})`,
        transition: reducedMotion
          ? undefined
          : [`opacity 400ms ${EASE_OUT} ${delay}ms`, `transform ${hovered ? HOVER_MS : REST_MS}ms ${EASE_OUT} ${hovered ? 0 : delay}ms`].join(", "),
      }}
    >
      <div className="relative h-[60px] w-full shrink-0 overflow-hidden rounded-[8px]">
        <video
          src={CHECKERBOARD_VIDEO}
          aria-hidden
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      </div>
      <div className="flex w-full flex-1 flex-col justify-end">
        <p className={`w-full break-words ${RESTING_TEXT}`} style={{ color: card.textColor }}>
          {card.text}
        </p>
      </div>
    </div>
  );
}
