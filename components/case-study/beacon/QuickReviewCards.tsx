"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Figma 158:1066 (resting fan) + 109:3520/3526/3532/3538/3544/3550 (each
// card's own expanded "Card / Default" state) — the home page's own
// scattered card-stack (see AboutCardStack.tsx), re-themed with this
// page's own six "Quick review" beats instead of the About section's
// six. Explicit instruction: "same logic as on the home page with
// these cards" — so this ports AboutCardStack's whole interaction
// wholesale (stagger reveal, hover lift/neighbor-nudge, click-to-expand
// with a settled row for the other five, outside-click/Escape to
// close), not just its resting layout the way QualityTiles.tsx
// deliberately left the click interaction out. The six colors/text-
// colors below came back an exact match for five of AboutCardStack's
// own six pairs (same brand palette, different cards wearing it) —
// "Listening to users" is the one genuine new pair (#6458c3/#eceaf8 at
// rest — its own expanded node says #ede3e9 instead, close enough to
// read as the same "not yet refreshed on every node" situation
// AboutCardStack's own doc comment already flags for two of its cards,
// not a real per-state difference worth a second color field).
//
// `image` (one static JPEG per card, not a shared looping video the
// way this file's first pass had it): both the 158:1066 resting fetch
// and each card's own 109:35xx expanded fetch render this area as an
// empty placeholder frame, but their own flat PNG exports make the
// real intent unambiguous — six distinct abstract textures (halftone
// maps, a dot field, wavy stripes), not six repeats of one brand clip.
// Sourced via download_assets' own rawImages on the resting node at
// their full 1280x960 export size, then re-encoded to JPEG (they're
// fully opaque, no alpha channel in use) since the halftone/noise
// patterns compress far worse as PNG than the site's other imagery.
type CardData = {
  id: string;
  color: string;
  textColor: string;
  text: string;
  description: string;
  image: string;
  /** Pre-rotation top-left position (px), within this component's own
   * fixed 705x196 reference frame — see the width/height note below. */
  x: number;
  y: number;
  rotate: number;
};

const CARD_W = 130;
const CARD_H = 162;
const CARD_RADIUS = 10; // --radius-m

// Position math, same technique AboutCardStack's own doc comment
// explains: Figma exports a rotated element as a non-rotated wrapper
// div sized to that element's rotated bounding box, centered on the
// actual card — so each card's own pre-rotation (x, y) here is that
// wrapper's own center, re-based to this card's fixed 130x162 box
// (center - (65, 81)), computed from node 158:1066's own get_metadata
// (each of its six children's absolute canvas position), not the
// approximate calc(%+px) values get_design_context returns for a node
// nested this deep. "A vision workshop" carries Figma's own rotate: 0
// and needed no such back-computation — its frame already gives the
// unrotated box directly. Rotation itself verified against each
// wrapper's own width/height (a rotated 130x162 box's bounding
// dimensions solve for a unique angle) rather than trusted from
// get_design_context's own literal class name alone.
//
// Re-measured TWICE now, live, both times reported as "not well-
// aligned"/"do you really think this card is in a good place" against
// "Joining Orchestro" specifically:
//
// 1. The Figma file itself moved between this file's first fetch and
//    its next one — two cards' own rotation genuinely changed (0→15°
//    "Designing what's next", 8.3°→4.88° "Meet Beam"), and every other
//    card's position shifted by a few px too. Re-fetched and replaced
//    all six x/y/rotate values for that.
// 2. That re-fetch still looked wrong for "Joining Orchestro" specifically
//    (and, it turns out, "Listening to users" — the same bug, just not
//    reported live because it's less visually obvious there): get_metadata
//    reports a wrapper y of 291.65 for this card's own rotated frame
//    (158:1067), but get_design_context's own generated CSS for the
//    exact same node independently says `top-[258px]` — a real, ~34px
//    disagreement between the two tools for this one node. Every OTHER
//    card's own y agreed between both tools to within rounding — the
//    pattern across all six is that get_metadata's own y is only wrong
//    for the two NEGATIVELY-rotated cards (this one at -15°, "Listening
//    to users" at -8.28°); every positively-rotated (or unrotated) card
//    checked out fine. Confirmed by simulating both candidate y values
//    as filled rotated rectangles and comparing the resulting silhouette
//    against Figma's own flat screenshot: get_design_context's `top`
//    value reproduces Figma's own shape (and, as a side confirmation,
//    the resulting container height matches this frame's own reported
//    195.125 almost exactly); get_metadata's own y does not. Using
//    get_design_context's top for these two cards' y from here on,
//    get_metadata for everything else (x, width/height, and every other
//    card's y) — the discrepancy is specific to y on negative rotation,
//    not a reason to distrust get_metadata wholesale.
const CARDS: CardData[] = [
  {
    id: "joining-orchestro",
    color: "#f8ecd7",
    textColor: "#544831",
    text: "Joining Orchestro",
    description: "Became the first full-time designer, after 1.5 years building client projects at McKinsey.",
    image: "/images/home/beacon-review-joining-orchestro.jpg",
    x: 18.75,
    y: 14.06,
    rotate: -15,
  },
  {
    id: "fragmented-product",
    color: "#ee3334",
    textColor: "#ede3e9",
    // Figma 109:3526's own expanded node — genuinely different copy
    // from this card's earlier "Took ownership of a product suite with
    // no consistent design direction across it." (that line was this
    // file's own guess, written before this node had real copy to
    // check against).
    description: "Inherited Beacon with no consistent design direction across the experience.",
    text: "A fragmented product",
    image: "/images/home/beacon-review-fragmented-product.jpg",
    x: 152.65,
    y: 16.51,
    rotate: 11.02,
  },
  {
    id: "listening-to-users",
    color: "#6458c3",
    textColor: "#eceaf8",
    text: "Listening to users",
    description: "Interviews revealed people liked the concept, but didn’t trust the AI outputs.",
    image: "/images/home/beacon-review-listening-users.jpg",
    x: 213.45,
    y: 9.1,
    rotate: -8.28,
  },
  {
    id: "vision-workshop",
    color: "#00f790",
    textColor: "#004f00",
    text: "A vision workshop",
    description: "Led leadership in London to rethink what the next generation of Beacon should be.",
    image: "/images/home/beacon-review-vision-workshop.jpg",
    x: 313.45,
    y: 19.1,
    rotate: 0,
  },
  {
    id: "meet-beam",
    color: "#211f1e",
    textColor: "#f8ecd7",
    text: "Meet Beam",
    description: "Reimagined Beacon as a conversational, chat-led experience with an AI companion.",
    image: "/images/home/beacon-review-meet-beam.jpg",
    x: 427.22,
    y: 19.1,
    rotate: 4.88,
  },
  {
    id: "designing-whats-next",
    color: "#00a4c6",
    textColor: "#0d0d0d",
    text: "Designing what’s next",
    description: "Now prototyping how AI speed and human judgment work together in ideation.",
    image: "/images/home/beacon-review-designing-next.jpg",
    x: 555.68,
    y: 19.06,
    rotate: 15,
  },
];

// Width: rightmost is card 6's own flat right edge in its rotated
// bounding box (555.68 origin + its own 167.5-wide rotated box ≈
// 704.4) — kept generous (rather than trimmed to this frame's own
// reported 662.499-wide bounding box) since under-sizing this would
// make the responsive scale-to-fit read the fan as wider than it
// actually renders and clip the rightmost card against the wrapper's
// own overflow-hidden edge; a few px of unused right margin costs
// nothing visible.
// Height: 196, corrected alongside the CARDS y-fix above — recomputed
// from the six cards' own true rotated extents using the corrected y
// values, and lands almost exactly on this frame's own reported
// 195.125 (a good sign the y-fix is right, not just a fix for the one
// card that got reported live).
const CONTAINER_W = 705;
const CONTAINER_H = 196;

// Expanded-card sizing below (301x400, 12px padding, 20px radius, a
// 170px image area) is carried over unchanged from AboutCardStack.tsx —
// and confirmed, not just assumed, by each card's own 109:35xx "Card /
// Default" node: every one of the six reports this exact same box,
// down to the pixel, so "same logic as on the home page" turned out to
// literally be the same expanded-card spec too, not just the same
// interaction technique. What those six nodes don't cover is the
// SETTLED row layout (the other five cards' positions once one is
// open) — Figma has no equivalent multi-card composition for this
// section, so that part still reuses the home page's own five measured
// slot positions/z-order, re-based onto this card set's own SELECTED_X
// (itself derived from CONTAINER_W, so it tracks this file's own width
// rather than assuming it stays close to AboutCardStack's own 655).
const SELECTED_W = 301;
const SELECTED_H = 400;
const SELECTED_RADIUS = 20;
const SELECTED_PADDING = 12;
const SELECTED_IMAGE_H = 170;
const SELECTED_TITLE_TEXT = "font-sans font-extrabold text-[24px] leading-[28px] tracking-[-0.192px]";
const SELECTED_SHADOW = (alpha: number) => `0px 1px 2px 0px rgba(23,23,23,${alpha})`;
const RESTING_TEXT = "font-sans font-extrabold text-[16px] leading-[18px] tracking-[-0.128px]";
const RESTING_PADDING = 8;

function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const SELECTED_X = CONTAINER_W / 2 - SELECTED_W / 2;
const SELECTED_Y = 0;

// AboutCardStack's own five measured settled-row slots (Figma node
// 37:10045), re-based onto this component's own SELECTED_X so the
// settled row and the active card share one consistent origin
// regardless of CONTAINER_W — see that file's own doc comment for how
// OPEN_ORIGIN_X/these offsets were derived.
const OPEN_ORIGIN_X = SELECTED_X - 118;
const OTHER_SLOTS: { x: number; y: number }[] = [
  { x: OPEN_ORIGIN_X + 21.3, y: 364.45 },
  { x: OPEN_ORIGIN_X + 108.7, y: 359.91 },
  { x: OPEN_ORIGIN_X + 198.7, y: 367.04 },
  { x: OPEN_ORIGIN_X + 326.98, y: 367.04 },
  { x: OPEN_ORIGIN_X + 409.0, y: 367.0 },
];
const OTHER_SLOT_Z = [1, 2, 3, 5, 4];
const CONTAINER_EXPANDED_H = 556;
const MIN_SELECTED_SCALE = 0.78;

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const STAGGER_MS = 60;
const OPEN_MS = 450;
const CLOSE_MS = 350;
const HOVER_MS = 180;
const DESCRIPTION_OPEN_DELAY_MS = 290;
const DESCRIPTION_MS = 220;
const HOVER_LIFT = 12;
const HOVER_ROTATE_FACTOR = 0.45;
const HOVER_NEIGHBOR_GAP = 7;

export default function QuickReviewCards() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [hasRevealedOnce, setHasRevealedOnce] = useState(false);

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

  useEffect(() => {
    if (!visible || hasRevealedOnce) return;
    const timeout = setTimeout(() => setHasRevealedOnce(true), CARDS.length * STAGGER_MS + 500);
    return () => clearTimeout(timeout);
  }, [visible, hasRevealedOnce]);

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

  const effectiveScale = selectedId ? Math.max(scale, MIN_SELECTED_SCALE) : scale;
  let xCompress = 1;
  if (selectedId && scale < MIN_SELECTED_SCALE) {
    const wrapperWidth = scale * CONTAINER_W;
    const settledCenterX = SELECTED_X + SELECTED_W / 2;
    const offsetX = (wrapperWidth - CONTAINER_W * effectiveScale) / 2;
    const leftSlotX = OTHER_SLOTS[0].x;
    const rightSlotX = OTHER_SLOTS[OTHER_SLOTS.length - 1].x;
    const kLeft = (-offsetX / effectiveScale - settledCenterX) / (leftSlotX - settledCenterX);
    const kRight = ((wrapperWidth - offsetX) / effectiveScale - CARD_W - settledCenterX) / (rightSlotX - settledCenterX);
    xCompress = Math.max(0, Math.min(1, kLeft, kRight));
  }

  return (
    <div
      ref={wrapperRef}
      className="flex w-full items-start justify-center overflow-hidden pt-6"
      style={{
        height: (selectedId ? CONTAINER_EXPANDED_H : CONTAINER_H) * effectiveScale + 24,
        transition: reducedMotion ? undefined : `height ${selectedId ? OPEN_MS : CLOSE_MS}ms ${EASE_OUT}`,
      }}
    >
      <div
        className="relative shrink-0"
        style={{
          width: CONTAINER_W,
          height: CONTAINER_H,
          transform: `scale(${effectiveScale})`,
          transformOrigin: "top center",
          transition: reducedMotion ? undefined : `transform ${selectedId ? OPEN_MS : CLOSE_MS}ms ${EASE_OUT}`,
        }}
      >
        {(() => {
          const otherIds = CARDS.filter((c) => c.id !== selectedId).map((c) => c.id);
          const hoveredIndex = hoveredId ? CARDS.findIndex((c) => c.id === hoveredId) : -1;
          return CARDS.map((card, i) => {
            let neighborNudge = 0;
            if (!selectedId && hoveredIndex !== -1 && card.id !== hoveredId) {
              if (i === hoveredIndex - 1) neighborNudge = -HOVER_NEIGHBOR_GAP;
              else if (i === hoveredIndex + 1) neighborNudge = HOVER_NEIGHBOR_GAP;
            }
            return (
              <Card
                key={card.id}
                card={card}
                visible={visible}
                reducedMotion={reducedMotion}
                delay={hasRevealedOnce ? 0 : i * STAGGER_MS}
                selected={selectedId === card.id}
                dimmed={selectedId !== null && selectedId !== card.id}
                hovered={canHover && !selectedId && hoveredId === card.id}
                neighborNudge={neighborNudge}
                otherIndex={otherIds.indexOf(card.id)}
                xCompress={xCompress}
                onToggle={() => setSelectedId((current) => (current === card.id ? null : card.id))}
                onHoverChange={(isHovered) => setHoveredId((current) => (isHovered ? card.id : current === card.id ? null : current))}
              />
            );
          });
        })()}
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
  hovered,
  neighborNudge,
  otherIndex,
  xCompress,
  onToggle,
  onHoverChange,
}: {
  card: CardData;
  visible: boolean;
  reducedMotion: boolean;
  delay: number;
  selected: boolean;
  dimmed: boolean;
  hovered: boolean;
  neighborNudge: number;
  otherIndex: number;
  xCompress: number;
  onToggle: () => void;
  onHoverChange: (hovered: boolean) => void;
}) {
  const slot = OTHER_SLOTS[otherIndex];
  const settledCenterX = SELECTED_X + SELECTED_W / 2;
  const x = selected ? SELECTED_X : dimmed ? settledCenterX + (slot.x - settledCenterX) * xCompress : card.x + neighborNudge;
  const y = selected ? SELECTED_Y : dimmed ? slot.y : card.y - (hovered ? HOVER_LIFT : 0);
  const rotate = selected ? 0 : dimmed ? card.rotate : card.rotate * (hovered ? 1 - HOVER_ROTATE_FACTOR : 1);
  const entranceScale = reducedMotion || visible ? 1 : 0.92;
  const hoverScale = hovered ? 1.03 : 1;
  const width = selected ? SELECTED_W : CARD_W;
  const height = selected ? SELECTED_H : CARD_H;
  const radius = selected ? SELECTED_RADIUS : CARD_RADIUS;
  const padding = selected ? SELECTED_PADDING : RESTING_PADDING;
  const transitionMs = selected ? OPEN_MS : dimmed ? CLOSE_MS : hovered ? HOVER_MS : CLOSE_MS;

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
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
      className="absolute left-0 top-0 flex cursor-pointer flex-col justify-between overflow-hidden outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-text-primary"
      style={{
        width,
        height,
        padding,
        borderRadius: radius,
        backgroundColor: card.color,
        opacity: reducedMotion || visible ? 1 : 0,
        boxShadow: SELECTED_SHADOW(selected ? 0.4 : 0),
        isolation: "isolate",
        zIndex: selected ? 10 : hovered ? 6 : dimmed ? 2 + OTHER_SLOT_Z[otherIndex] : 1,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${entranceScale * hoverScale})`,
        transition: reducedMotion
          ? undefined
          : [
              `opacity 400ms ${EASE_OUT} ${delay}ms`,
              `transform ${selected || dimmed ? transitionMs : hovered ? HOVER_MS : 500}ms ${EASE_OUT} ${selected || dimmed ? 0 : delay}ms`,
              `width ${transitionMs}ms ${EASE_OUT}`,
              `height ${transitionMs}ms ${EASE_OUT}`,
              `padding ${transitionMs}ms ${EASE_OUT}`,
              `border-radius ${transitionMs}ms ${EASE_OUT}`,
              `box-shadow ${transitionMs}ms ${EASE_OUT}`,
            ].join(", "),
      }}
    >
      <div className="flex w-full shrink-0 flex-col gap-2">
        <div
          className="relative w-full shrink-0 overflow-hidden rounded-[8px]"
          style={{
            height: selected ? SELECTED_IMAGE_H : 60,
            transition: reducedMotion ? undefined : `height ${transitionMs}ms ${EASE_OUT}`,
          }}
        >
          <Image
            src={card.image}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 480px) 301px, 130px"
            className="object-cover"
          />
        </div>
        {!selected && <div className="h-px w-full shrink-0" style={{ backgroundColor: card.textColor }} />}
      </div>
      <div className="flex w-full flex-col gap-2">
        <p
          className={`w-full break-words ${selected ? SELECTED_TITLE_TEXT : RESTING_TEXT}`}
          style={{
            color: card.textColor,
            transition: reducedMotion ? undefined : `font-size ${transitionMs}ms ${EASE_OUT}, color ${transitionMs}ms ${EASE_OUT}`,
          }}
        >
          {card.text}
        </p>
        {selected && <div className="h-px w-full shrink-0" style={{ backgroundColor: card.textColor }} />}
        <div
          className="grid w-full"
          style={{
            gridTemplateRows: selected ? "1fr" : "0fr",
            transition: reducedMotion ? undefined : `grid-template-rows ${transitionMs}ms ${EASE_OUT}`,
          }}
        >
          <p
            aria-hidden={!selected}
            className="w-full min-h-0 overflow-hidden break-words font-sans text-[16px] leading-[normal] tracking-[-0.128px]"
            style={{
              color: withAlpha(card.textColor, 0.8),
              opacity: selected ? 1 : 0,
              transform: `translateY(${selected ? 0 : 8}px)`,
              transition: reducedMotion
                ? undefined
                : `opacity ${DESCRIPTION_MS}ms ${EASE_OUT} ${selected ? DESCRIPTION_OPEN_DELAY_MS : 0}ms, transform ${DESCRIPTION_MS}ms ${EASE_OUT} ${selected ? DESCRIPTION_OPEN_DELAY_MS : 0}ms`,
              pointerEvents: selected ? "auto" : "none",
            }}
          >
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
}
