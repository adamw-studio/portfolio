"use client";

import { useEffect, useRef, useState } from "react";

// Figma 138:6876 — the same five colored "sticky notes" the page-by-page
// carousel's own ReflectionPage nested under "Some questions that drove
// the workshop" (StickyNote there), now its own standalone, overlapping
// fan between "Reflection" and "Turning point" instead of a subsection
// of the former. Same five fixed colors/text-colors as before (this
// site's own established Tag.tsx palette — gold/teal/orange/blue/red),
// but re-fetched rotation values: three of the five (orange/blue/red)
// came back different from the carousel version's own numbers on this
// pass, which the page-by-page rebuild never re-checked after its own
// original fetch. Trusting the fresher numbers here rather than
// carrying the stale ones forward.
//
// Layout/interaction ported from AboutCardStack.tsx (the home page's own
// scattered card stack), on direct instruction — "same layout
// interactions and logic ... without the click interaction": reveals
// once with a staggered fade-and-settle the first time it scrolls into
// view, and each tile lifts/relaxes its tilt/nudges its immediate
// neighbors apart on hover. What's deliberately NOT here is
// AboutCardStack's own selectedId/onToggle machinery: these five notes
// have no expanded state or body copy to reveal, just a short line each,
// so there's nothing for a "click to open" interaction to actually do.
//
// Unlike AboutCardStack, this composition does NOT scale itself down to
// stay inside its own container — reported live as wanting the fan to
// bleed past the column edge on both sides instead (see the render
// below for why that's safe).
const NOTE_W = 130;
const NOTE_H = 162; // radius is the rounded-[10px] class below, matching this site's own --radius-m
const OVERLAP = 24; // matches the original -ml-6 overlap this replaces

const NOTES: { color: string; textColor: string; rotate: number; text: string }[] = [
  { color: "#d9a900", textColor: "#4b3c06", rotate: 0, text: "What is quality?" },
  { color: "#00a2c2", textColor: "#0d0d0d", rotate: 6.41, text: "Why are we drawn to things that are quality?" },
  { color: "#e5522e", textColor: "#290e07", rotate: -1.71, text: "What would be your 11-star experience" },
  { color: "#0d99ff", textColor: "#0a2a40", rotate: 5.51, text: "What makes a great product?" },
  { color: "#d92100", textColor: "#fff8f7", rotate: -0.38, text: "Treasure Island" },
];

// Pre-rotation x position of each note's own left edge, laid out
// left-to-right with a fixed overlap — same idea as AboutCardStack's own
// CARDS[].x, just derived from a uniform overlap instead of individually
// hand-placed Figma coordinates (these five notes' own literal canvas
// positions were already normalized to this same overlap technique, see
// this file's git history).
const POSITIONS = NOTES.map((_, i) => i * (NOTE_W - OVERLAP));
const CONTAINER_W = POSITIONS[POSITIONS.length - 1] + NOTE_W;
// A rotated 130x162 note's own bounding box reaches slightly taller than
// 162 (the steepest tilt here, ±6.41deg, adds ~14px) — enough headroom
// that the fan's own rotation never clips against this component's
// container at rest, before hover's own further lift is even added.
const CONTAINER_H = 180;
const NOTE_Y = (CONTAINER_H - NOTE_H) / 2;

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"; // this project's own strong ease-out (components/motion/tokens.ts)
const STAGGER_MS = 60;
const HOVER_MS = 180;
const REST_MS = 350;
const HOVER_LIFT = 10;
const HOVER_ROTATE_FACTOR = 0.45;
const HOVER_NEIGHBOR_GAP = 6;

export default function QualityTiles() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    // Full width, no scale-to-fit and no overflow-hidden — reported live
    // as wanting the fan to bleed past the column on both sides (the
    // "escape the frame" read a scattered, rotated stack like this one
    // is going for) instead of being shrunk to stay inside it. This
    // relies on the SAME safety net CardRow's own full-bleed breakout
    // and SelectedWorks.tsx's row already do — html/body's own
    // overflow-x:hidden (globals.css) clips the true page edge cleanly
    // once this composition genuinely runs wider than the viewport,
    // rather than that overflow becoming real page-level horizontal
    // scroll. No [container-type:inline-size]/cqw scale needed any more
    // either, since nothing here is trying to fit a target width.
    <div ref={wrapperRef} className="flex w-full items-center justify-center py-6" aria-label="Questions that drove the workshop">
      <div className="relative shrink-0" style={{ width: CONTAINER_W, height: CONTAINER_H }}>
        {NOTES.map(({ color, textColor, rotate, text }, i) => {
          const hovered = canHover && hoveredIndex === i;
          let neighborNudge = 0;
          if (!reducedMotion && hoveredIndex !== null && i !== hoveredIndex) {
            if (i === hoveredIndex - 1) neighborNudge = -HOVER_NEIGHBOR_GAP;
            else if (i === hoveredIndex + 1) neighborNudge = HOVER_NEIGHBOR_GAP;
          }
          const x = POSITIONS[i] + neighborNudge;
          const y = NOTE_Y - (hovered ? HOVER_LIFT : 0);
          const tilt = rotate * (hovered ? 1 - HOVER_ROTATE_FACTOR : 1);
          const entranceScale = reducedMotion || visible ? 1 : 0.92;
          const hoverScale = hovered ? 1.03 : 1;
          const delay = i * STAGGER_MS;
          return (
            <div
              key={text}
              className="absolute left-0 top-0 flex items-start rounded-[10px] p-2 font-sans text-[16px] font-extrabold leading-[18px] tracking-[-0.128px] will-change-transform"
              style={{
                width: NOTE_W,
                height: NOTE_H,
                backgroundColor: color,
                color: textColor,
                opacity: reducedMotion || visible ? 1 : 0,
                zIndex: hovered ? 10 : i,
                transform: `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg) scale(${entranceScale * hoverScale})`,
                transition: reducedMotion
                  ? undefined
                  : [`opacity 400ms ${EASE_OUT} ${delay}ms`, `transform ${hovered ? HOVER_MS : REST_MS}ms ${EASE_OUT} ${visible ? 0 : delay}ms`].join(
                      ", ",
                    ),
              }}
              onMouseEnter={() => canHover && setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex((current) => (current === i ? null : current))}
            >
              {text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
