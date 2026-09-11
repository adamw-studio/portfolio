"use client";

import { useEffect, useRef, useState } from "react";

type CardData = {
  id: string;
  color: string;
  /** Title color, used at rest and (mostly) at expanded too — four of six
   * cards genuinely share one value across both states, confirmed directly
   * against each card's own resting AND expanded nodes (76:293/76:299 etc.);
   * "prototype" and "details" are the two real exceptions, whose expanded
   * nodes (76:315/76:325) both independently converge on the same new
   * #ede3e9 rather than their own resting color — not a fetch glitch, since
   * two unrelated cards landing on the identical value isn't a coincidence.
   * This field always reflects the *current*, most-recently-confirmed
   * color, so those two no longer match what an older pass had recorded
   * for them at rest. */
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

// Reordered on direct instruction (visual left-to-right only — no
// color/text/video/description touched): "learning" now sits first,
// "prototype" second, swapping both their array position AND their
// x/y/rotate slot values with each other. Both matter, not just one:
// array order alone drives i-based behavior elsewhere in this file
// (neighborNudge's hover-adjacency check, the initial reveal stagger
// delay, and otherIndex/OTHER_SLOTS for the settled row once a card is
// selected — all keyed off each card's position among the others, not
// its own fixed identity), while x/y/rotate is what actually moves a
// card's *resting* position on screen; changing only one would either
// move the card without its hover/stagger/settled-row behavior
// following, or vice versa.
const CARDS: CardData[] = [
  {
    id: "learning",
    color: "#f8ecd7",
    textColor: "#544831",
    text: "What shaped me through the years",
    description:
      "I was raised by a painter and a sculptor. I learned that craft matters. My first design education didn’t come from software, it came from watching a painter and sculptor at work.",
    x: 10,
    y: 21,
    rotate: -7.55,
    video: "about-card-learning.mp4",
  },
  {
    id: "prototype",
    // Figma 76:268/76:315 — red now (#ee3334), not the old orange
    // (#f83e00); textColor #ede3e9, not #ffffbc — confirmed on both the
    // resting AND expanded nodes directly, not carried over from the
    // much older #f83e00/#ffffbc pair this had before today's redesign.
    color: "#ee3334",
    textColor: "#ede3e9",
    text: "Foundation",
    // Figma 57:24536/76:315 — "...today: with curiosity, craftsmanship..."
    // (adds "with"), and "That foundation I got from my parents..." not
    // "The foundation...", adding back who it came from.
    description:
      "That foundation I got from my parents continues to shape how I approach designing today: with curiosity, craftsmanship and a deep respect for the people who touch, feel or use the things I design.",
    x: 123,
    y: 23,
    rotate: 5.09,
    video: "about-card-prototype.mp4",
  },
  {
    id: "details",
    // Figma 76:273 — purple now, not the old blue, and the title grew
    // to "What do I care about" (was "I care about"). textColor #ede3e9,
    // not #eceaf8 — an earlier pass landed a few hex digits off; 76:325's
    // expanded node independently confirms #ede3e9 too (the same value
    // Foundation's own title also converged on), which is what caught it.
    color: "#6458c3",
    textColor: "#ede3e9",
    text: "What do I care about",
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

// Expanded-card size — Figma's own literal numbers (node 37:10045,
// "Card / Default" 34:10015), not a scaled-up version of the resting
// card. An earlier pass here deliberately shrank this to a 2x scale
// (260x324) in response to live feedback that it read as a near-modal
// feature card — but the actual cause of that (confirmed against this
// same node's own screenshot) was the settled row sitting with no real
// negative space below it and its titles hidden, not the literal size.
// With the settled row now using Figma's own fixed positions (see
// OTHER_SLOTS below) this reverts to the real numbers.
const SELECTED_W = 301;
const SELECTED_H = 400;
const SELECTED_RADIUS = 20;
const SELECTED_PADDING = 12;
const SELECTED_VIDEO_H = 170;
// Same font as RESTING_TEXT's own title (PP Neue Montreal Extrabold
// Italic, see its comment below) at the expanded size instead — Figma's
// six expanded "Card / Default" nodes (76:299/76:315/76:325/76:335/
// 76:348/76:358) all confirm this directly. An earlier, separate fetch
// of just Foundation's own expanded node (57:24536, from before today's
// font swap) had this as Gentium Book Plus serif; this newer, complete
// re-check across all six supersedes that.
const SELECTED_TITLE_TEXT = "font-sans font-extrabold text-[24px] leading-[28px] tracking-[-0.192px]";
// Figma's own "elevation/subtle" effect style (DROP_SHADOW #17171766,
// offset 0/1, radius 2) — only ever on the selected card. Both ends of
// this string share the same offset/blur and differ only in alpha, so a
// plain CSS transition on `box-shadow` interpolates it smoothly rather
// than needing a separate opacity layer.
const SELECTED_SHADOW = (alpha: number) => `0px 1px 2px 0px rgba(23,23,23,${alpha})`;
// Figma 76:293 (and its five siblings, 76:268/76:273/76:278/76:283/
// 76:288) — font-['PP_Neue_Montreal:Extrabold_Italic'], not this card's
// former font-serif. "Extrabold Italic" is the actual font FILE selected
// (the glyphs themselves are drawn slanted), not a CSS italic applied on
// top of an upright cut — Figma's own `not-italic` on these nodes is
// just confirming the CSS font-style property is normal, which is
// exactly what `italic` (Tailwind's font-style utility) is deliberately
// NOT set to here; the slant comes from font-extrabold + the
// ExtraboldItalic style loaded into --font-sans (layout.tsx) resolving
// for that weight, not from font-style at all.
const RESTING_TEXT = "font-sans font-extrabold text-[16px] leading-[18px] tracking-[-0.128px]";

// Figma's expanded description text isn't `card.textColor` at full
// strength — it's that same color at 0.8 alpha (five of six expanded
// nodes read exactly this; "design"'s own node says 0.5, but five
// independent cards agreeing points to 0.8 being the real intended
// value and "design" being the one not yet refreshed, same judgment
// call as the divider-color and textColor corrections above). Baked
// into the `color` value itself via this helper, not left to a
// separate `opacity` — that CSS property is already spoken for by this
// same paragraph's own open/close reveal transition (0 hidden -> 1
// shown), so the 0.8 has to live in the color, not stack as a second
// multiplied opacity on top of it.
function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
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
// No opacity-based dimming on the card surface itself — these are meant
// to read as opaque physical cards genuinely stacked on top of one
// another (occlusion via z-index/geometry), not translucent panels. An
// earlier pass used a reduced opacity here for visual hierarchy, but
// applied to the whole card element that's exactly what let overlapping
// neighbors show through each other's bodies — confirmed live (the blue
// "I care about" card visibly bleeding through "Foundation," the black
// "Building design systems" card's artwork showing through into
// "Prototype with AI," multiple titles occupying the same space).
// Secondary/settled emphasis is communicated by scale, position and
// z-order alone now (see OTHER_SLOTS/OTHER_SLOT_Z below), matching
// Figma's own settled cards, which carry no opacity token at all.

// The settled row's own five fixed positions — measured directly off
// Figma node 37:10045 (Group 5, 539x539 bounding box; get_metadata on
// each of its five card children), not computed generically. Figma gives
// exactly one worked example (Foundation open, the other five settled)
// but its own screenshot makes the geometry's intent unambiguous: each
// card keeps its own native rotation (confirmed — every settled card's
// rotation here exactly matches that card's own CARDS[].rotate value)
// and drops into one of five slots that read, left to right, in the
// SAME order the cards themselves are listed in CARDS (learning, details,
// workflows, design, shipcode) — i.e. the slots are a property of
// "this card's position among the ones still in the deck," not of any
// specific card identity. That's exactly what `otherIndex` already
// tracks, so OTHER_SLOTS[otherIndex] generalizes cleanly to any card
// being the one pulled out, not just Foundation.
//
// Each rotated card's own Figma export is a non-rotated wrapper sized to
// its rotated bounding box with the real 130x162 card centered inside —
// same back-computation as CARDS[].x/y (see the top-of-file comment):
// wrapperCenterX/Y = wrapperX/Y + wrapperW/H / 2, then this card's own
// pre-rotation top-left = wrapperCenter - (65, 81). The two unrotated
// cards (workflows, shipcode) needed no such step.
//
// x values are relative to Group 5's own left edge; OPEN_ORIGIN_X
// re-bases that onto this component's own coordinate frame using the
// selected card's own known offset within Group 5 (118px) against
// SELECTED_X, so the settled row and the active card share one
// consistent origin regardless of CONTAINER_W.
const OPEN_ORIGIN_X = SELECTED_X - 118;
const OTHER_SLOTS: { x: number; y: number }[] = [
  { x: OPEN_ORIGIN_X + 21.3, y: 364.45 }, // learning ("What shaped me through the years")
  { x: OPEN_ORIGIN_X + 108.7, y: 359.91 }, // details ("I care about")
  { x: OPEN_ORIGIN_X + 198.7, y: 367.04 }, // workflows ("Loves a good design critique")
  { x: OPEN_ORIGIN_X + 326.98, y: 367.04 }, // design ("Building design systems")
  { x: OPEN_ORIGIN_X + 409.0, y: 367.0 }, // shipcode ("Prototype with AI")
];
// Figma's own paint order for the settled row isn't strictly left-to-
// right — the "design" card (slot 3) sits topmost despite "shipcode"
// (slot 4) being further right — so this is measured off the export's
// own DOM order (later = higher) rather than assumed from slot index.
const OTHER_SLOT_Z = [1, 2, 3, 5, 4];

// Tallest point of the settled row's own rotated bounding boxes (the
// "design" card reaches deepest, to 539.14px below Group 5's own top —
// matching Group 5's own measured height exactly), plus a little
// breathing room below it — not a formula off SELECTED_H, since the row
// no longer sits at a fixed offset from the active card's own bottom
// edge (see OTHER_SLOTS above; it partially tucks behind it instead, the
// same way Figma's own composition does).
const CONTAINER_EXPANDED_H = 556;

// On a narrow viewport the whole composition already scales down (see
// `scale` below) so all six cards stay fully on-screen at rest — but
// applying that *same* shrink to the expanded card too would be exactly
// the "just shrink the desktop interaction" mobile treatment the brief
// asks to avoid: a 301x400 card at, say, 0.55x scale renders barely wider
// than a phone's own status bar icons, nowhere near comfortably
// readable. While a card is selected, the composition's own scale is
// floored at this value instead — the expanded card (already centered)
// stays comfortably legible; the now-secondary settled cards may clip at
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
// Description fade/slide starts ~65% through the open motion (290 of
// 450ms) rather than alongside it from frame zero — "reveal the body
// content approximately 60–70% through the expansion... do not reveal
// the description immediately while the card is still tiny." Closing has
// no such delay: the copy should be gone well before the card has
// finished shrinking back down, not still lingering in a card too small
// for it.
const DESCRIPTION_OPEN_DELAY_MS = 290;
const DESCRIPTION_MS = 220;
// A hovered card lifts slightly (10–16px per the brief) and eases about
// halfway out of its own resting tilt — enough to read as "this one's
// selectable" without flattening it the way selecting it for real does,
// which would leave hover and selected reading as the same amount of
// commitment.
const HOVER_LIFT = 12;
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
  // Flooring the *composition's* scale at MIN_SELECTED_SCALE keeps the
  // open card legible on a narrow phone, but the settled row's own
  // OTHER_SLOTS are wide enough (spanning most of the 655px reference
  // frame) that even at that floor, their rendered footprint can still
  // exceed the actual wrapper width — reported live as the outermost
  // settled cards clipping at both edges under this component's own
  // overflow-hidden. xCompress pulls every settled card's own x position
  // an *additional* amount toward the composition's horizontal center
  // (on top of the uniform scale above), solved exactly (not a rough
  // ratio) so the two outermost settled slots' own rendered edges land
  // right at this wrapper's actual left/right bounds — never past them,
  // and no tighter than that once they already fit. 1 (no extra pull) on
  // any viewport where the floor isn't actively overriding a smaller
  // natural scale — every width this design was originally built
  // against. Only the settled row's own x is affected; the open card's
  // own centered position doesn't need it.
  let xCompress = 1;
  if (selectedId && scale < MIN_SELECTED_SCALE) {
    // scale is exactly wrapper.clientWidth / CONTAINER_W here (the
    // un-clamped branch of Math.min(1, ...) above), so this recovers the
    // real wrapper width without a second measured value to keep in sync.
    const wrapperWidth = scale * CONTAINER_W;
    const settledCenterX = SELECTED_X + SELECTED_W / 2;
    const offsetX = (wrapperWidth - CONTAINER_W * effectiveScale) / 2;
    const leftSlotX = OTHER_SLOTS[0].x;
    const rightSlotX = OTHER_SLOTS[OTHER_SLOTS.length - 1].x;
    // Largest k (0-1) that keeps compressedX*effectiveScale + offsetX >= 0
    // for the leftmost slot...
    const kLeft = (-offsetX / effectiveScale - settledCenterX) / (leftSlotX - settledCenterX);
    // ...and compressedX*effectiveScale + offsetX + CARD_W*effectiveScale
    // <= wrapperWidth for the rightmost one.
    const kRight = ((wrapperWidth - offsetX) / effectiveScale - CARD_W - settledCenterX) / (rightSlotX - settledCenterX);
    xCompress = Math.max(0, Math.min(1, kLeft, kRight));
  }

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
  // dimmed here doubles as "some other card is selected" — that's
  // exactly when this one belongs in its own fixed settled slot (see
  // OTHER_SLOTS) instead of its own resting spot.
  const slot = OTHER_SLOTS[otherIndex];
  // xCompress (see its own comment at the call site) pulls a settled
  // card's slot toward the open card's own horizontal center on a narrow
  // phone, on top of the uniform scale every card already gets — at 1
  // (every viewport this design was built against) this is exactly
  // `slot.x`, unchanged.
  const settledCenterX = SELECTED_X + SELECTED_W / 2;
  const x = selected ? SELECTED_X : dimmed ? settledCenterX + (slot.x - settledCenterX) * xCompress : card.x + neighborNudge;
  const y = selected ? SELECTED_Y : dimmed ? slot.y : card.y - (hovered ? HOVER_LIFT : 0);
  // Selected straightens all the way to 0 (the "this one's in focus" cue
  // Tag.tsx's own hover state also uses); dimmed keeps its own natural
  // tilt — every settled card in Figma's own worked example keeps
  // exactly its own resting rotation, not a flattened or slot-specific
  // one. Hover eases partway toward flat without fully committing to it,
  // the same "selectable, not yet selected" distinction its lift/scale
  // get.
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
        // Fully opaque at all times except the one-time pre-mount
        // entrance fade (visible === false, before this card has ever
        // been revealed) — every other state (resting, hovered,
        // selected, or settled/dimmed while a sibling is open) stays at
        // opacity: 1. These are meant to read as opaque physical cards
        // occluding one another via z-index/geometry, not translucent
        // panels a neighbor can show through.
        opacity: reducedMotion || visible ? 1 : 0,
        boxShadow: SELECTED_SHADOW(selected ? 0.4 : 0),
        // isolation: isolate gives this card its own stacking context so
        // nothing about a sibling's own z-index/blend behavior can reach
        // across into it — belt-and-suspenders alongside the opacity
        // fix above, not a substitute for it.
        isolation: "isolate",
        // Selected is always frontmost; hovered lifts above the resting
        // stack (but never above a selected card, since hover is already
        // disabled the instant anything is selected); among the settled
        // row, OTHER_SLOT_Z reproduces Figma's own paint order for that
        // slot rather than assuming later-otherIndex-on-top, since Figma's
        // own composition doesn't actually layer them left-to-right (see
        // OTHER_SLOT_Z's own comment). z-index isn't part of the
        // `transition` list below — it switches the instant this card
        // becomes selected, not partway through the move, so it always
        // passes over its neighbors immediately rather than partway.
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
      <div className="flex w-full shrink-0 flex-col gap-2">
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
        {/* Figma 76:293 etc. — a hairline divider (0.5px stroke, "Vector
            10") between the video and the title, present only in the
            *resting* card (this same card's own expanded node, e.g.
            Foundation's 57:24536, has no such line at all — confirmed
            absent, not just unfetched). Colored per-card to match that
            card's own textColor: five of the six cards' own divider
            assets literally are that exact hex; the sixth ("I care
            about", #EDE3E9 vs. its own title's #eceaf8) is close enough
            to read as the same intended pair that it's almost certainly
            Figma's own asset not getting re-exported after that card's
            text color was last tweaked — textColor used uniformly here
            rather than hardcoding one card's own slightly-off exception. */}
        {!selected && <div className="h-px w-full shrink-0" style={{ backgroundColor: card.textColor }} />}
      </div>
      <div className="flex w-full flex-col gap-2">
        {/* Stays visible on a settled (dimmed) card — Figma's own
            37:10045 renders every settled card's title in full (no
            opacity token on any of them), and OTHER_SLOTS' real Figma
            positions give each one enough of its own space that titles
            don't collide the way an evenly-spaced generic row's did. An
            earlier pass hid this entirely on dimmed cards to paper over
            that collision; fixing the positions properly removed the
            actual cause, so the title stays. */}
        <p
          className={`w-full break-words ${selected ? SELECTED_TITLE_TEXT : RESTING_TEXT}`}
          style={{
            color: card.textColor,
            transition: reducedMotion ? undefined : `font-size ${transitionMs}ms ${EASE_OUT}, color ${transitionMs}ms ${EASE_OUT}`,
          }}
        >
          {card.text}
        </p>
        {/* Figma's six expanded "Card / Default" nodes all add this same
            hairline divider directly below the title (absent from every
            resting node, which instead has it above the title, between
            it and the video — a structural flip, not the same element
            just restyled). Rendered only when selected, matching Figma's
            own expanded-only placement; no open/close transition of its
            own since the title/description around it don't fade this in
            gradually either — it's part of the same one-beat font/color
            swap those already do. */}
        {selected && <div className="h-px w-full shrink-0" style={{ backgroundColor: card.textColor }} />}
        {/* Collapsed to zero layout height via the grid-rows 0fr/1fr trick
            (not just opacity: 0) whenever this card isn't selected — kept
            mounted throughout (not conditionally rendered) so it still
            has something to animate *out* of on close, but plain
            `opacity: 0` alone left its own real line-height sitting in
            the flex column below the title, pushing the title itself
            up off the card's own bottom edge and leaving a block of
            blank card-color space where the invisible copy still lived.
            grid-template-rows *is* a layout property, but it's the
            standard CSS-only way to animate toward "auto" height, and
            it's the layout dimension actually at fault here — the inner
            paragraph's own opacity/translateY still does the visual
            reveal on top of it. */}
        <div
          className="grid w-full"
          style={{
            gridTemplateRows: selected ? "1fr" : "0fr",
            transition: reducedMotion ? undefined : `grid-template-rows ${transitionMs}ms ${EASE_OUT}`,
          }}
        >
          {/* Delayed relative to the card's own move
              (DESCRIPTION_OPEN_DELAY_MS, ~65% through OPEN_MS) on the way
              in, no delay on the way out — "reveal the body content
              approximately 60–70% through the expansion... do not reveal
              the description immediately while the card is still tiny." */}
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
