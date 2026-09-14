"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// This project statically pre-renders every route — useLayoutEffect
// warns on that server pass even though nothing here depends on running
// during it. Aliasing to plain useEffect for that one pass silences the
// warning without changing behavior.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Figma 164:2729 ("Group 6", the Quick Review card fan) — same
// scattered card-stack technique as Beacon's own QuickReviewCards.tsx
// (itself ported from the home page's AboutCardStack.tsx), re-themed
// with this project's own five review beats.
//
// No click-to-expand here, unlike Beacon: this node's own five cards
// carry no expanded "Card / Default" counterpart anywhere in the file —
// no description copy exists for any of them to expand into, just a
// title each. Five short title-only cards is the whole design, so this
// is deliberately the resting fan alone: stagger-reveal and hover lift,
// nothing more.
//
// Position math: same wrapper-bounding-box technique Beacon's own doc
// comment explains — get_metadata reports each rotated card as a non-
// rotated wrapper div sized to its rotated bounding box, centered on
// the real card, so each card's own pre-rotation (x, y) here is that
// wrapper's own center, re-based to this card's fixed 130x162 box
// (center - (65, 81)). And the same negative-rotation caveat Beacon's
// own file documents at length applies again here: get_metadata's own
// y disagreed with get_design_context's own generated `top-[Npx]` for
// exactly the two negatively-rotated cards ("Designing for
// independence" at -7.45°, off by ~17px; "Iterative validation" at
// -4°, off by ~9px), while the three non-negative cards' y agreed
// between both tools to within a pixel — the same pattern, on a
// different file. Used get_design_context's top for those two cards'
// y, get_metadata for everything else (x, width/height, and every
// other card's y).
type CardData = {
  id: string;
  color: string;
  textColor: string;
  text: string;
  video: string;
  /** Pre-rotation top-left position (px), within this component's own
   * fixed 568x186 reference frame. */
  x: number;
  y: number;
  rotate: number;
};

const CARD_W = 130;
const CARD_H = 162;
const CARD_RADIUS = 10; // --radius-m

// Two LOOPING VIDEOS cover all five cards (a checkerboard for the two
// cream cards AND the blue one, a wave pattern for the two yellow
// ones), not the static stills this file first shipped with —
// get_design_context's own export only ever offered a flat PNG per
// card, so the first pass reasonably read these as static textures.
// Reported live as "these cards should use the videos in it," with the
// two real source clips supplied directly (Revolution Robotics'
// RewiredIA-loop.mp4/UsabilityIssues.mp4): each is a 6-7s, 1120x840,
// ~10-12fps loop of exactly one of the two patterns — confirmed by
// pulling a frame from each (cv2) and comparing it pixel-for-pixel
// against the two still images this file used to reference — not a
// coincidence of similar-looking art, the stills WERE poster frames of
// these same two clips all along. Re-encoded to 640x480 (avconvert,
// Preset640x480 — no ffmpeg in this environment; source is already a
// clean 4:3, so this preset doesn't distort it) since each clip only
// ever renders into a 130x60px card slot here.
const CHECKERBOARD_VIDEO = "/images/home/robotics-review-checkerboard.mp4";
const WAVE_VIDEO = "/images/home/robotics-review-wave.mp4";

const CARDS: CardData[] = [
  {
    id: "designing-independence",
    color: "#f8ecd7",
    textColor: "#544831",
    text: "Designing for independence",
    video: CHECKERBOARD_VIDEO,
    x: 9.95,
    y: 9.3,
    rotate: -7.45,
  },
  {
    id: "research-real-users",
    color: "#0055bf",
    textColor: "#ede3e9",
    text: "Research with real users",
    video: CHECKERBOARD_VIDEO,
    x: 143.85,
    y: 11.74,
    rotate: 11.02,
  },
  {
    id: "iterative-validation",
    color: "#fff03b",
    textColor: "#363f22",
    text: "Iterative validation",
    video: WAVE_VIDEO,
    x: 204.65,
    y: 4.34,
    rotate: -4,
  },
  {
    id: "kids-involved",
    color: "#f8ecd7",
    textColor: "#544831",
    text: "45 kids involved",
    video: CHECKERBOARD_VIDEO,
    x: 304.65,
    y: 14.33,
    rotate: 0,
  },
  {
    id: "scalable-new-experience",
    color: "#fff03b",
    textColor: "#363f22",
    text: "A scalable new experience",
    video: WAVE_VIDEO,
    x: 425.66,
    y: 14.33,
    rotate: 7.45,
  },
];

// Card 5's own rotated bounding box reaches to ≈565.6 (425.66 origin,
// own center at +65, ±84.95 half-width at 7.45°) — rounded up a little
// for the same reason Beacon's own CONTAINER_W is: under-sizing makes
// the responsive scale-to-fit read the fan as wider than it actually
// renders and clips the rightmost card against the wrapper's own
// overflow-hidden edge. Height similarly a hair over the tallest
// card's own bottom edge (card 2, "Research with real users", reaching
// ≈184.7).
const CONTAINER_W = 568;
const CONTAINER_H = 186;

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
          src={card.video}
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
