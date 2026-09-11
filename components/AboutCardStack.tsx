"use client";

import { useEffect, useRef, useState } from "react";

type CardData = {
  id: string;
  color: string;
  /** Title color, both at rest and expanded — confirmed identical in both
   * states once each card's own resting "Card / Default" node (33:9790
   * etc.) was fetched directly; an earlier pass had "details" guessing
   * #93ffff at rest from its old video-hover-era value, which never
   * actually matched Figma's own resting node. */
  textColor: string;
  text: string;
  /** Expanded-only body copy (Figma's "Card / Default" nodes, 33:9837 etc.)
   * — the resting card never had this content at all before; discovered
   * only once those specific opened-state frames were fetched, not
   * visible from the rest-state frame this was originally built against. */
  description: string;
  /** Pre-rotation top-left position (px), within this component's fixed
   * 655x199 reference frame — see the width/height note below. */
  x: number;
  y: number;
  rotate: number;
  /** Filename under public/videos/about-cards/ — unset renders the flat
   * card color alone (Figma's own placeholder state) until wired up. */
  video?: string;
};

// Figma node 14:7194 (home-page restructure, 37:10046) for rest-state
// geometry; 33:9848/33:9837/33:9876/33:9885/34:9894/33:9857 for each
// card's own expanded title/description copy — six cards, scattered with
// individual rotation. Position math: Figma exports a rotated element as
// a NON-rotated wrapper div sized to that element's rotated bounding box
// (so the rotation itself doesn't shift the wrapper's own layout
// position), with the actual rotated card centered inside via
// items-center justify-center. To get each card's own pre-rotation (x, y)
// — what this component actually needs, since CSS `rotate()` pivots
// around transform-origin without touching layout position — every
// wrapper's center point was computed (left + width/2, top + height/2)
// and then this card's own fixed 130x162 box was centered on that same
// point (x = centerX - 65, y = centerY - 81). Cards 4 and 6 ("Loves a
// good design critique", "Prototype with AI") have no rotation in Figma,
// so they needed no wrapper/centering step — their left/top are used
// directly.
const CARD_W = 130;
const CARD_H = 162;
const CARD_RADIUS = 10; // --radius-m

const CARDS: CardData[] = [
  {
    id: "prototype",
    color: "#f83e00",
    textColor: "#ffffbc",
    text: "Foundation",
    description:
      "The foundation continues to shape how I approach designing today: curiosity, craftsmanship and a deep respect for the people who touch, feel or use the things I design.",
    x: 10,
    y: 21,
    rotate: -7.55,
    video: "about-card-prototype.mp4",
  },
  {
    id: "learning",
    color: "#f8ecd7",
    textColor: "#544831",
    text: "What shaped me through the years",
    description:
      "I was raised by a painter and a sculptor. I learned that craft matters. My first design education didn’t come from software, it came from watching a painter and sculptor at work.",
    x: 123,
    y: 23,
    rotate: 5.09,
    video: "about-card-learning.mp4",
  },
  {
    id: "details",
    color: "#0093d9",
    textColor: "#f8ecd7",
    text: "I care about",
    description: "The details people might never notice. A few pixels, the right word or a transition that feels just right.",
    x: 225,
    y: 6,
    rotate: -5.68,
    video: "about-card-details.mp4",
  },
  {
    id: "workflows",
    color: "#00f790",
    textColor: "#004f00",
    text: "Loves a good design critique",
    description:
      "Good design gets better when you put it in front of other designers. I enjoy sharing work, challenging ideas and learning how others think.",
    x: 315,
    y: 26,
    rotate: 0,
    video: "about-card-workflows.mp4",
  },
  {
    id: "design",
    color: "#211f1e",
    textColor: "#f8ecd7",
    text: "Building design systems",
    description:
      "I have a thing for well-organised systems. For the past few years, I’ve been building them to help teams design and ship together.",
    x: 415,
    y: 26,
    rotate: 10.05,
    video: "about-card-design.mp4",
  },
  {
    id: "shipcode",
    color: "#00a4c6",
    textColor: "#0d0d0d",
    text: "Prototype with AI",
    description:
      "Things move fast. I used to connect messy Figma frames to prototype an idea. Now I design it, open Cursor or Claude, and make it real. Maybe soon I’ll push some code too.",
    x: 525,
    y: 26,
    rotate: 0,
    video: "about-card-shipcode.mp4",
  },
];

// Bounding box of all six cards' *rotated* extents (not the sum of their
// unrotated boxes) — rightmost is card 5's flat right edge (525+130=655),
// bottommost is card 6's rotated wrapper bottom (15.94+182.205≈198).
const CONTAINER_W = 655;
const CONTAINER_H = 199;

// Expanded-card size — deliberately NOT Figma's own literal 301x400
// (33:9848 etc.). That value read live as a near-modal feature card
// sitting flush against the deck underneath it with zero gap (see the
// live-reported "feels like a large card placed on top of the stack"
// bug this was rebuilt to fix) — a plain 2x scale of the resting card
// (130x162), landing inside the requested 1.8–2.2x range, stays clearly
// "a card lifted out and enlarged" rather than "a different, bigger
// card." Radius/padding/video-area scale by roughly the same factor
// rather than Figma's own literal 20/12/170 numbers, for the same
// reason.
const SELECTED_W = CARD_W * 2; // 260
const SELECTED_H = CARD_H * 2; // 324
const SELECTED_RADIUS = 16;
const SELECTED_PADDING = 10;
const SELECTED_VIDEO_H = 128;
const SELECTED_TITLE_TEXT = "text-[20px] leading-[24px] tracking-[-0.16px]";
const RESTING_TEXT = "text-[16px] leading-[18px] tracking-[-0.128px]";
const RESTING_PADDING = 8;

// Selected card centers horizontally in the container and sits with its
// own top at the container's own top (y=0) — not vertically centered,
// which was the actual bug being fixed originally: centering it let the
// card grow symmetrically both up *and* down from the container's normal
// bounds, and growing up is what pushed it into the bio paragraph sitting
// directly above this component on the page. Growing only downward, into
// space this component already reserves for exactly this (see
// CONTAINER_EXPANDED_H below), keeps it clear of everything above.
const SELECTED_X = CONTAINER_W / 2 - SELECTED_W / 2;
const SELECTED_Y = 0;
// Kept close to the resting-state opacity (1) on purpose — "reduce
// emphasis only subtly... do not heavily darken them" was a direct fix
// request against an earlier, much lower value (0.5) that, stacked
// across several overlapping translucent cards, read as disabled rather
// than secondary.
const DIM_OPACITY = 0.82;

// The five non-selected cards drop down from their own resting spot,
// keep their own individual rotation (Figma's own worked example,
// 37:10045, doesn't flatten them either — a loosely overlapping huddle
// reads as "the rest of the stack this was picked from," where a
// flattened row reads as a second, disconnected composition), and
// alternate a small amount of extra y so the row itself doesn't read as
// a stiff, perfectly ruled line. OTHER_GAP is a real, explicit gap below
// the selected card's own bottom edge — the previous value (345) put the
// deck's own top 55px *above* where the selected card's bottom (400)
// actually landed, so the two visually collided rather than sitting in
// clear top/bottom bands; DIM_STEP is wide enough that adjacent cards no
// longer overlap by more (130-48=82px, 63%) than each card's own title
// text needs to stay legible — title/description are hidden entirely on
// a dimmed card regardless (see Card below), so this only needs to keep
// each card's own color+artwork identifiable, not its full text.
const OTHER_GAP = 36;
const OTHER_ROW_Y = SELECTED_H + OTHER_GAP;
const OTHER_STEP = 68;
const OTHER_ROW_W = CARD_W + OTHER_STEP * 4; // 5 cards
const OTHER_ROW_X = CONTAINER_W / 2 - OTHER_ROW_W / 2;
const OTHER_JITTER = 7; // alternating +/- y per card, see otherIndex use below

// Reserves enough height for the fully expanded state (selected card 0
// to SELECTED_H, other-cards row starting OTHER_GAP below that and
// running CARD_H+OTHER_JITTER tall) at all times, animated rather than a
// fixed always-tall box — an explicit exception to "only animate
// transform/opacity" (see the `animate` skill's own accordion
// exception): the whole point is for the page content *below* this
// component to actually move out of the way while a card is expanded,
// which only a real layout property can do — transform never affects
// surrounding layout, that's exactly why it's normally the safe one to
// animate.
const CONTAINER_EXPANDED_H = SELECTED_H + OTHER_GAP + CARD_H + OTHER_JITTER + 24;

// On a narrow viewport the whole composition already scales down (see
// `scale` below) so all six cards stay fully on-screen at rest — but
// applying that *same* shrink to the expanded card too would be exactly
// the "just shrink the desktop interaction" mobile treatment the brief
// asks to avoid: a 301x400 card at, say, 0.55x scale renders barely wider
// than a phone's own status bar icons, nowhere near comfortably
// readable. While a card is selected, the composition's own scale is
// floored at this value instead — the expanded card (already centered)
// stays comfortably legible; the now-secondary dimmed cards may clip at
// the composition's own left/right edges under `overflow-hidden`, which
// is an acceptable trade: attention is supposed to be on the open card.
const MIN_SELECTED_SCALE = 0.78;

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"; // this project's own strong-ease-out (see components/motion/tokens.ts)
const STAGGER_MS = 60;
// Open/close/hover durations per the interaction brief this was rebuilt
// against: open is the deliberate, considered motion (picking a card up
// to look at it) so it gets the most time; close is the same motion in
// reverse but reads better a little quicker, the same "release should
// always be snappy" reasoning Nav's own old dropdown used; hover is
// restrained on purpose, a quick nudge rather than a considered move.
const OPEN_MS = 450;
const CLOSE_MS = 350;
const HOVER_MS = 180;
// Description fade/slide starts this far into the open motion rather than
// alongside it from frame zero — "reveal the description as part of the
// same motion... can fade/slide in slightly after the card begins
// expanding... do not make the text simply pop into existence." Closing
// has no such delay: the copy should be gone well before the card has
// finished shrinking back down, not still lingering in a card too small
// for it.
const DESCRIPTION_OPEN_DELAY_MS = 160;
const DESCRIPTION_MS = 280;
// A hovered card lifts slightly and eases about halfway out of its own
// resting tilt — enough to read as "this one's selectable" without
// flattening it the way selecting it for real does, which would leave
// hover and selected reading as the same amount of commitment.
const HOVER_LIFT = 10;
const HOVER_ROTATE_FACTOR = 0.45;
// Immediate horizontal neighbors nudge a few px further away on hover —
// "nearby cards can move apart... to create space" — anything past that
// stays put; the point is a small give right around the card being
// considered, not a wave through the whole stack.
const HOVER_NEIGHBOR_GAP = 7;

export default function AboutCardStack() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // How much to shrink the whole 655px-wide composition to fit inside
  // whatever width this component actually has — 1 (no change) on Home's
  // own 688px column and anything wider, less than that on a narrow phone
  // viewport. Measured via ResizeObserver rather than a fixed breakpoint
  // so it tracks the component's own actual rendered width at any
  // viewport size, not a guessed cutoff.
  const [scale, setScale] = useState(1);
  // Stays false only for the duration of the initial stagger, then true
  // forever after — see the effect below and its use as `delay` at the
  // call site. Not the same thing as `visible`: that one only tracks
  // *whether* the reveal has started, not whether it's finished, so
  // using it alone would still leave a later deselect re-reading as
  // "not yet revealed" and re-applying the mount-in stagger.
  const [hasRevealedOnce, setHasRevealedOnce] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);
    return () => motionQuery.removeEventListener("change", updateMotion);
  }, []);

  // Same hover-capability gate DotFieldCanvas.tsx already uses — a
  // touchscreen has no persistent "cursor" for the subtle hover-lift to
  // react to, and simulating it off a tap would just be a worse, laggier
  // version of the tap-to-open interaction touch already gets directly.
  useEffect(() => {
    // Reading matchMedia on mount, not syncing from props/state — same
    // pattern (and same justified exception) as Tag.tsx's own canHover
    // read and this component's reduced-motion read just above.
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

  // Flips true once, a beat after the mount-in stagger would have
  // finished playing (last card's own delay + its transition duration) —
  // not tied to `visible` directly, since that flips true the instant the
  // reveal *starts*, while this needs to stay false until it's actually
  // *done*. Read by every card below as whether to apply its own
  // STAGGER_MS delay at all: without this, deselecting (or selecting a
  // different card) kept reusing each card's original mount-in delay,
  // since at that point every card is back in the same "resting, not
  // selected, not dimmed" branch the real first-load stagger uses — so
  // returning to rest played out as the same one-after-another cascade
  // the entrance does, instead of one clean, synced motion.
  useEffect(() => {
    if (!visible || hasRevealedOnce) return;
    const timeout = setTimeout(() => setHasRevealedOnce(true), CARDS.length * STAGGER_MS + 500);
    return () => clearTimeout(timeout);
  }, [visible, hasRevealedOnce]);

  // Click/tap a card to bring it forward and reveal its description —
  // clicking the selected card again, clicking outside the composition,
  // or Escape all close it (same outside-click + Escape pattern Nav.tsx
  // already uses for its own dismiss). Clicking a *different* card while
  // one is open hands focus directly to it in the same render — this
  // component's whole layout is already a pure function of `selectedId`,
  // so there's no separate "close, then open" step to avoid: the old
  // card animates toward dimmed and the new one toward selected in the
  // same transition, simultaneously.
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

  return (
    // overflow-hidden as a safety guard, not the thing doing the actual
    // fitting anymore — the inner composition below now scales itself
    // down (see `scale` above) to fit whatever width this component
    // actually has, rather than cropping at its edges past 655px. Height
    // animates between the resting and expanded reservation (see
    // CONTAINER_EXPANDED_H) — scaled by the same factor, so the reserved
    // space always matches the composition's own *visible* size — so the
    // page content below this component moves out of the way instead of
    // being covered by it.
    <div
      ref={wrapperRef}
      className="flex w-full items-start justify-center overflow-hidden pt-6"
      style={{
        height: (selectedId ? CONTAINER_EXPANDED_H : CONTAINER_H) * effectiveScale + 24, // +24 = pt-6
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
          // otherIndex: this card's position among the *other* (non-
          // selected) cards specifically, e.g. the 3rd card overall might
          // be the 2nd "other" one once whichever card is selected is
          // excluded — that's what actually drives the stacked row's
          // layout below, not each card's own fixed array index.
          const otherIds = CARDS.filter((c) => c.id !== selectedId).map((c) => c.id);
          const hoveredIndex = hoveredId ? CARDS.findIndex((c) => c.id === hoveredId) : -1;
          return CARDS.map((card, i) => {
            // Only the immediate left/right neighbor of the hovered card
            // gets nudged — see HOVER_NEIGHBOR_GAP's own comment above.
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
  onToggle: () => void;
  onHoverChange: (hovered: boolean) => void;
}) {
  // dimmed here doubles as "some other card is selected" — that's
  // exactly when this one belongs in the stacked row instead of its own
  // resting spot, not just visually faded there.
  const x = selected ? SELECTED_X : dimmed ? OTHER_ROW_X + otherIndex * OTHER_STEP : card.x + neighborNudge;
  // Alternating +/- jitter per position in the row, not a perfectly
  // ruled line — a real hand-dealt deck never lands flush, and the tiny
  // stagger also helps separate each card's own visible edge from its
  // immediate neighbors.
  const y = selected ? SELECTED_Y : dimmed ? OTHER_ROW_Y + (otherIndex % 2 === 0 ? -OTHER_JITTER : OTHER_JITTER) : card.y - (hovered ? HOVER_LIFT : 0);
  // Selected straightens all the way to 0 (the "this one's in focus" cue
  // Tag.tsx's own hover state also uses); dimmed keeps its own natural
  // tilt now instead of flattening to 0 — a loosely overlapping huddle of
  // still-tilted cards reads as "the rest of the stack this was picked
  // from," where a flattened, evenly-spaced row read as a second,
  // disconnected composition (see OTHER_ROW_Y's own comment). Hover eases
  // partway toward flat without fully committing to it, the same
  // "selectable, not yet selected" distinction its lift/scale get.
  const rotate = selected ? 0 : dimmed ? card.rotate : card.rotate * (hovered ? 1 - HOVER_ROTATE_FACTOR : 1);
  const entranceScale = reducedMotion || visible ? 1 : 0.92; // only the mount-in animation ever uses transform:scale — the selected-size change uses real width/height instead, see the module doc comment above
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
        opacity: reducedMotion ? (dimmed ? DIM_OPACITY : 1) : visible ? (dimmed ? DIM_OPACITY : 1) : 0,
        // Selected is always frontmost; hovered lifts above the resting
        // stack (but never above a selected card, since hover is already
        // disabled the instant anything is selected); among the stacked
        // others, later otherIndex (further right) sits on top of
        // earlier ones, the same left-under-right layering an ordinary
        // fanned hand of cards would have. z-index isn't part of the
        // `transition` list below — it switches the instant this card
        // becomes selected, not partway through the move, so it always
        // passes over its neighbors immediately rather than partway.
        zIndex: selected ? 10 : hovered ? 6 : dimmed ? 2 + otherIndex : 1,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${entranceScale * hoverScale})`,
        transition: reducedMotion
          ? undefined
          : [
              `opacity ${SELECT_OPACITY_MS(selected, dimmed)}ms ${EASE_OUT} ${delay}ms`,
              `transform ${selected || dimmed ? transitionMs : hovered ? HOVER_MS : 500}ms ${EASE_OUT} ${selected || dimmed ? 0 : delay}ms`,
              `width ${transitionMs}ms ${EASE_OUT}`,
              `height ${transitionMs}ms ${EASE_OUT}`,
              `padding ${transitionMs}ms ${EASE_OUT}`,
              `border-radius ${transitionMs}ms ${EASE_OUT}`,
            ].join(", "),
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
          breaking. Height animates 60↔128 alongside the card itself,
          width stays w-full in both states since the padding either side
          of it doesn't change. rounded-[8px] at rest too (each card's own
          resting "Card / Default" node, e.g. 33:9845, gives this area the
          same 8px radius as the selected state — an earlier pass had this
          at 0 at rest, unrounded, which was never actually right). */}
      <div
        className="relative w-full shrink-0 overflow-hidden rounded-[8px]"
        style={{
          height: selected ? SELECTED_VIDEO_H : 60,
          transition: reducedMotion ? undefined : `height ${transitionMs}ms ${EASE_OUT}`,
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
      <div className="flex w-full flex-col gap-2">
        {/* Hidden (not just dimmed) once this card drops into the
            secondary row — five overlapping titles all pinned to the
            same bottom band was the actual source of the reported "messy
            pile" / "overlapping typography" underneath the active card.
            Each dimmed card still reads fine by color + artwork alone
            (per "show mainly their upper portions/artwork rather than
            overlapping titles"), and stays clickable regardless. */}
        <p
          aria-hidden={dimmed}
          className={`w-full break-words font-serif not-italic ${selected ? SELECTED_TITLE_TEXT : RESTING_TEXT}`}
          style={{
            color: card.textColor,
            opacity: dimmed ? 0 : 1,
            transition: reducedMotion
              ? undefined
              : `font-size ${transitionMs}ms ${EASE_OUT}, color ${transitionMs}ms ${EASE_OUT}, opacity ${transitionMs}ms ${EASE_OUT}`,
          }}
        >
          {card.text}
        </p>
        {/* Delayed relative to the card's own move (DESCRIPTION_OPEN_DELAY_MS)
            on the way in, no delay on the way out — "reveal the
            description as part of the same motion... can fade/slide in
            slightly after the card begins expanding... do not make the
            text simply pop into existence." Kept mounted at all times
            (not conditionally rendered) so it has something to animate
            *out* of when closing, rather than just vanishing. */}
        <p
          aria-hidden={!selected}
          className="w-full break-words font-sans text-[16px] leading-[normal] tracking-[-0.128px]"
          style={{
            color: card.textColor,
            opacity: selected ? 0.5 : 0,
            transform: `translateY(${selected ? 0 : 6}px)`,
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
  );
}

// Opacity keeps the mount-in stagger's own longer fade for a truly fresh
// reveal, but should react instantly (no extra delay stacking on top of
// an already-tuned open/close move) once the composition has been
// through its first reveal — same reasoning `hasRevealedOnce` already
// applies to `delay` itself, just mirrored here for the property that
// still needs *some* duration even at 0 delay so it doesn't hard-cut.
function SELECT_OPACITY_MS(selected: boolean, dimmed: boolean) {
  return selected ? OPEN_MS : dimmed ? CLOSE_MS : 400;
}
