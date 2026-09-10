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
const CARD_RADIUS = 10; // --radius-m

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

// Selected-card size/radius/type, Figma 18:7508 (its own worked example,
// "obsessed about the smallest details" picked) — literal fixed values,
// not this card's own 130x162/10px-radius/16px-text scaled up by a CSS
// transform. That distinction matters: Figma keeps padding at a flat 8px
// in both states, only width/height/radius/font-size actually change, so
// a uniform transform: scale() (which stretches padding and radius right
// along with everything else) would visibly overpad and over-round this
// compared to the real design.
const SELECTED_W = 240;
const SELECTED_H = 300;
const SELECTED_RADIUS = 16;
const SELECTED_VIDEO_H = 154;
const SELECTED_TEXT = "text-[20px] leading-[24px] tracking-[-0.16px]";
const RESTING_TEXT = "text-[16px] leading-[18px] tracking-[-0.128px]";

// Selected card centers horizontally in the container and sits with its
// own top at the container's own top (y=0) — not vertically centered,
// which was the actual bug being fixed here: centering it let the card
// grow symmetrically both up *and* down from the container's normal
// bounds, and growing up is what pushed it into the bio paragraph
// sitting directly above this component on the page. Growing only
// downward, into space this component already reserves for exactly this
// (see EXPANDED_H below), keeps it clear of everything above.
const SELECTED_X = CONTAINER_W / 2 - SELECTED_W / 2;
const SELECTED_Y = 0;
const DIM_OPACITY = 0.85;

// The five non-selected cards fan into one row centered under the
// selected card's own midpoint — adapts to whichever card is picked,
// rather than Figma's one worked example's literal (and non-uniform,
// tighter near the selected card, wider further away) per-card offsets,
// which only actually line up for that one specific card/position
// combination. Row sits at y=178, matching Figma's own example, chosen
// there so it tucks just under the selected card's video area without
// reaching its copy (video ends at 8+154=162; row starting at 178 clears
// that with room to spare).
const OTHER_ROW_Y = 178;
const OTHER_STEP = 55;
const OTHER_ROW_W = CARD_W + OTHER_STEP * 4; // 5 cards
const OTHER_ROW_X = CONTAINER_W / 2 - OTHER_ROW_W / 2;

// Reserves enough height for the fully expanded state (selected card 0
// to 300, other-cards row 178 to 178+162=340, +5 breathing room) at all
// times, animated rather than a fixed always-tall box — an explicit
// exception to "only animate transform/opacity" (see the `animate`
// skill's own accordion exception): the whole point is for the page
// content *below* this component to actually move out of the way while
// a card is expanded, which only a real layout property can do —
// transform never affects surrounding layout, that's exactly why it's
// normally the safe one to animate.
const CONTAINER_EXPANDED_H = 345;

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
    // reference this was modeled on. Height animates between the resting
    // and expanded reservation (see CONTAINER_EXPANDED_H) so the page
    // content below this component moves out of the way instead of being
    // covered by it.
    <div
      ref={wrapperRef}
      className="flex w-full items-start justify-center overflow-hidden pt-6"
      style={{
        height: (selectedId ? CONTAINER_EXPANDED_H : CONTAINER_H) + 24, // +24 = pt-6
        transition: reducedMotion ? undefined : `height ${SELECT_MS}ms ${EASE_OUT}`,
      }}
    >
      <div className="relative shrink-0" style={{ width: CONTAINER_W, height: CONTAINER_H }}>
        {(() => {
          // otherIndex: this card's position among the *other* (non-
          // selected) cards specifically, e.g. the 3rd card overall might
          // be the 2nd "other" one once whichever card is selected is
          // excluded — that's what actually drives the stacked row's
          // layout below, not each card's own fixed array index.
          const otherIds = CARDS.filter((c) => c.id !== selectedId).map((c) => c.id);
          return CARDS.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              visible={visible}
              reducedMotion={reducedMotion}
              delay={i * STAGGER_MS}
              selected={selectedId === card.id}
              dimmed={selectedId !== null && selectedId !== card.id}
              otherIndex={otherIds.indexOf(card.id)}
              onToggle={() => setSelectedId((current) => (current === card.id ? null : card.id))}
            />
          ));
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
  otherIndex,
  onToggle,
}: {
  card: CardData;
  visible: boolean;
  reducedMotion: boolean;
  delay: number;
  selected: boolean;
  dimmed: boolean;
  otherIndex: number;
  onToggle: () => void;
}) {
  // dimmed here doubles as "some other card is selected" — that's
  // exactly when this one belongs in the stacked row instead of its own
  // resting spot, not just visually faded there.
  const x = selected ? SELECTED_X : dimmed ? OTHER_ROW_X + otherIndex * OTHER_STEP : card.x;
  const y = selected ? SELECTED_Y : dimmed ? OTHER_ROW_Y : card.y;
  const rotate = selected ? 0 : card.rotate; // straightens out of its tilt when picked — same "this one's in focus" cue Tag.tsx's own hover state already uses
  const entranceScale = reducedMotion || visible ? 1 : 0.92; // only the mount-in animation ever uses transform:scale — the selected-size change uses real width/height instead, see the module doc comment above
  const width = selected ? SELECTED_W : CARD_W;
  const height = selected ? SELECTED_H : CARD_H;
  const radius = selected ? SELECTED_RADIUS : CARD_RADIUS;

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
      className="absolute left-0 top-0 flex cursor-pointer flex-col justify-between overflow-hidden p-2 outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-text-primary"
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: card.color,
        opacity: reducedMotion ? (dimmed ? DIM_OPACITY : 1) : visible ? (dimmed ? DIM_OPACITY : 1) : 0,
        // Selected is always frontmost; among the stacked others, later
        // otherIndex (further right in the row) sits on top of earlier
        // ones, same left-under-right layering an ordinary hand of fanned
        // cards would have.
        zIndex: selected ? 10 : dimmed ? 2 + otherIndex : 1,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${entranceScale})`,
        transition: reducedMotion
          ? undefined
          : `opacity ${SELECT_MS}ms ${EASE_OUT} ${delay}ms, transform ${selected || dimmed ? SELECT_MS : 500}ms ${EASE_OUT} ${selected || dimmed ? 0 : delay}ms, width ${SELECT_MS}ms ${EASE_OUT}, height ${SELECT_MS}ms ${EASE_OUT}, border-radius ${SELECT_MS}ms ${EASE_OUT}`,
      }}
    >
      {/* Figma's own export for this area came back as an empty div —
          it renders a hand-drawn pattern in the design file that the
          MCP tool can't translate to markup, but the actual intent is a
          looping video here instead of a static pattern (confirmed, and
          supplied per-card). object-cover on a mismatched aspect ratio
          crops to a center band — not a bug, just what covering does;
          the `video` field staying optional is what lets a card render
          as just its flat color if one's ever missing rather than
          breaking. Height animates 60↔154 alongside the card itself
          (Figma 18:7508's own selected-state value), width stays w-full
          in both states since the padding either side of it doesn't
          change. */}
      <div
        className="relative w-full shrink-0 overflow-hidden"
        style={{
          height: selected ? SELECTED_VIDEO_H : 60,
          transition: reducedMotion ? undefined : `height ${SELECT_MS}ms ${EASE_OUT}`,
        }}
      >
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
      <p
        className={`w-full font-serif not-italic ${selected ? SELECTED_TEXT : RESTING_TEXT}`}
        style={{ color: card.textColor, transition: reducedMotion ? undefined : `font-size ${SELECT_MS}ms ${EASE_OUT}` }}
      >
        {card.text}
      </p>
    </div>
  );
}
