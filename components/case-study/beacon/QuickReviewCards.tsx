"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Figma 158:1066 (resting fan) + twelve 109:35xx nodes, one small and
// one large card per project ("<Project> - Small"/"<Project> - Large",
// fetched by their own real node IDs this time, not the generic "Card /
// Default" name an earlier, shallower fetch returned). Two structurally
// different states, on direct correction — "the current interaction
// model is structurally different from the design, treat images 2 and
// 4 as the specification":
//
// 1. Resting fan (unchanged from the previous pass, already verified
//    against Figma's own flat screenshot pixel-for-pixel — see CARDS'
//    own comment below). Click any card to open the gallery.
// 2. Gallery: NOT "one giant selected card over a pile of the other
//    five" (this file's own previous model, ported wholesale from
//    AboutCardStack without checking whether Beacon's own expanded
//    state actually worked the same way — it doesn't). Every one of
//    the twelve nodes' own get_metadata position was fetched directly:
//    the six projects sit as three pairs per row, two rows, each pair
//    a small card + a large card side by side, small card first. Exact
//    gaps below are measured from those twelve absolute positions, not
//    estimated from the screenshot.
type CardData = {
  id: string;
  color: string;
  textColor: string;
  text: string;
  description: string;
  image: string;
  /** Pre-rotation top-left position (px), within the fan's own fixed
   * 705x196 reference frame — see FAN_W/FAN_H's own comment below. */
  x: number;
  y: number;
  rotate: number;
};

const CARD_W = 130;
const CARD_H = 162;
const CARD_RADIUS = 10; // --radius-m

// Position math: Figma exports a rotated element as a non-rotated
// wrapper div sized to that element's rotated bounding box, centered on
// the actual card — so each card's own pre-rotation (x, y) here is that
// wrapper's own center, re-based to this card's fixed 130x162 box
// (center - (65, 81)), computed from node 158:1066's own get_metadata
// (each of its six children's absolute canvas position). "A vision
// workshop" carries Figma's own rotate: 0 and needed no such back-
// computation — its frame already gives the unrotated box directly.
//
// Verified against Figma's own flat screenshot, not just trusted from
// the metadata numbers: rendered both this file's candidate y values
// and get_metadata's own raw (buggy, for negative rotations — see the
// git history on this file) y as filled rotated rectangles and diffed
// the resulting silhouette against Figma's own PNG export pixel-for-
// pixel. These values reproduce it — a single connected silhouette
// spanning the full frame width, matching notch-for-notch, and the
// resulting frame height (below) lands within a few hundredths of a
// px of Figma's own reported 195.125. If this ever needs re-measuring,
// repeat that comparison rather than trusting either tool's numbers on
// their own — get_metadata and get_design_context have each been wrong
// here before, in different, non-overlapping ways.
const CARDS: CardData[] = [
  {
    id: "joining-orchestro",
    color: "#f8ecd7",
    textColor: "#544831",
    text: "Joining Orchestro",
    description: "Became the first full-time designer, after 1.5 years building client projects at McKinsey & Company.",
    image: "/images/home/beacon-review-joining-orchestro.jpg",
    x: 18.75,
    y: 14.06,
    rotate: -15,
  },
  {
    id: "fragmented-product",
    color: "#ee3334",
    textColor: "#ede3e9",
    text: "A fragmented product",
    description: "Inherited Beacon with no consistent design direction across the experience.",
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
    description: "Led workshop for leadership in London to rethink what the next generation of Beacon should be.",
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
// Height: 196, recomputed from the six cards' own true rotated extents
// using the CARDS y-values above — lands almost exactly on this
// frame's own reported 195.125.
const FAN_W = 705;
const FAN_H = 196;

const RESTING_TEXT = "font-sans font-extrabold text-[16px] leading-[18px] tracking-[-0.128px]";
const RESTING_PADDING = 8;

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const STAGGER_MS = 60;
const HOVER_MS = 180;
const HOVER_LIFT = 12;
const HOVER_ROTATE_FACTOR = 0.45;
const HOVER_NEIGHBOR_GAP = 7;

// Gallery layout — measured directly off get_metadata's own absolute
// position for all twelve nodes (JoiningOrchestro/FragmentedProduct/
// Listening/VisionWorkshop/MeetBeam/WhatsNext, each "- Small" and
// "- Large"), not estimated from the screenshot: every pair's own small
// card sits immediately left of its large card (28px gap, both top-
// aligned), three pairs per row with 65px between pairs, two rows with
// 67px between them. The six projects' own reading order (left-to-
// right, top row then bottom) already matches CARDS' own array order
// above, so rendering CARDS in a 3-column grid reproduces Figma's own
// grouping with no re-sorting needed.
const GALLERY_SMALL_W = 130;
const GALLERY_SMALL_H = 162;
const GALLERY_LARGE_W = 301;
const GALLERY_LARGE_H = 400;
const GALLERY_PAIR_GAP = 28; // small → large, within one project's own pair
const GALLERY_COLUMN_GAP = 65; // between pairs, same row
const GALLERY_ROW_GAP = 67; // between the two rows
const GALLERY_PAIR_W = GALLERY_SMALL_W + GALLERY_PAIR_GAP + GALLERY_LARGE_W;
// Natural width at the full three-per-row layout — used only as the
// upper breakpoint in the column-count check below; every other
// dimension (actual rendered width/height at whatever column count
// that check picks) is computed at render time from `galleryColumns`.
const GALLERY_W = GALLERY_PAIR_W * 3 + GALLERY_COLUMN_GAP * 2;

const GALLERY_LARGE_TITLE = "font-sans font-extrabold text-[24px] leading-[28px] tracking-[-0.192px]";
// Figma's own expanded-card description node has no tracking override
// at all (unlike the collapsed title's -0.128px) — confirmed directly
// against 109:3520 etc.'s own generated CSS, not carried over from the
// old single-card-expand model's own description style.
const GALLERY_DESC = "font-sans text-[16px] leading-6";
const GALLERY_MS = 450;

function withAlpha(hex: string, alpha: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function QuickReviewCards() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [fanScale, setFanScale] = useState(1);
  const [galleryScale, setGalleryScale] = useState(1);
  const [galleryColumns, setGalleryColumns] = useState(3);
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

  // The fan scales-to-fit whatever width this component actually has —
  // same technique this file already used before this rewrite. The
  // gallery does the same, but against a per-breakpoint natural width
  // instead of always GALLERY_W's own full three-column 1507px: at a
  // narrow width, scaling a fixed three-per-row layout down to fit
  // shrinks its 16-24px type well past readable (reported live as
  // "shrink cards until text becomes unreadable" being exactly what
  // not to do) before the composition even needs to lose a column. Pick
  // the widest column count (3, 2, then 1 pair per row) that still fits
  // at scale 1, then only scale down the (now narrower) result if even
  // one column doesn't fit outright — matching the brief's own
  // "reduce project groups per row" over shrinking text into a single
  // illegible strip.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof ResizeObserver === "undefined") return;
    const update = () => {
      const w = wrapper.clientWidth;
      setFanScale(Math.min(1, w / FAN_W));
      const columns = w >= GALLERY_W ? 3 : w >= GALLERY_PAIR_W * 2 + GALLERY_COLUMN_GAP ? 2 : 1;
      const naturalWidth = GALLERY_PAIR_W * columns + GALLERY_COLUMN_GAP * (columns - 1);
      setGalleryColumns(columns);
      setGalleryScale(Math.min(1, w / naturalWidth));
    };
    update();
    const observer = new ResizeObserver(update);
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
    if (!galleryOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setGalleryOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGalleryOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [galleryOpen]);

  const fanHeight = FAN_H * fanScale + 24;
  const galleryRows = Math.ceil(CARDS.length / galleryColumns);
  const galleryNaturalW = GALLERY_PAIR_W * galleryColumns + GALLERY_COLUMN_GAP * (galleryColumns - 1);
  const galleryNaturalH = GALLERY_LARGE_H * galleryRows + GALLERY_ROW_GAP * (galleryRows - 1);
  const galleryHeight = galleryNaturalH * galleryScale + 24;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden"
      style={{
        height: galleryOpen ? galleryHeight : fanHeight,
        transition: reducedMotion ? undefined : `height ${GALLERY_MS}ms ${EASE_OUT}`,
      }}
    >
      {/* Fan — the active layer at rest (position: relative, so it sets
          this wrapper's own height); becomes an inert, absolutely-
          positioned backdrop the instant the gallery opens, so it never
          fights the gallery for layout space during the crossfade. */}
      <div
        className="flex w-full items-start justify-center pt-6"
        style={{
          position: galleryOpen ? "absolute" : "relative",
          inset: galleryOpen ? 0 : undefined,
          opacity: galleryOpen ? 0 : 1,
          pointerEvents: galleryOpen ? "none" : "auto",
          transition: reducedMotion ? undefined : `opacity ${GALLERY_MS}ms ${EASE_OUT}`,
        }}
      >
        <div
          className="relative shrink-0"
          style={{
            width: FAN_W,
            height: FAN_H,
            transform: `scale(${fanScale})`,
            transformOrigin: "top center",
          }}
        >
          {CARDS.map((card, i) => {
            const hoveredIndex = hoveredId ? CARDS.findIndex((c) => c.id === hoveredId) : -1;
            let neighborNudge = 0;
            if (hoveredIndex !== -1 && card.id !== hoveredId) {
              if (i === hoveredIndex - 1) neighborNudge = -HOVER_NEIGHBOR_GAP;
              else if (i === hoveredIndex + 1) neighborNudge = HOVER_NEIGHBOR_GAP;
            }
            const hovered = canHover && !galleryOpen && hoveredId === card.id;
            return (
              <FanCard
                key={card.id}
                card={card}
                visible={visible}
                reducedMotion={reducedMotion}
                delay={hasRevealedOnce ? 0 : i * STAGGER_MS}
                hovered={hovered}
                neighborNudge={neighborNudge}
                onToggle={() => setGalleryOpen(true)}
                onHoverChange={(isHovered) => setHoveredId((current) => (isHovered ? card.id : current === card.id ? null : current))}
              />
            );
          })}
        </div>
      </div>

      {/* Gallery — the reverse of the fan: inert backdrop at rest,
          becomes the active (position: relative) layer once open. */}
      <div
        className="flex w-full items-start justify-center pt-6"
        style={{
          position: galleryOpen ? "relative" : "absolute",
          inset: galleryOpen ? undefined : 0,
          opacity: galleryOpen ? 1 : 0,
          pointerEvents: galleryOpen ? "auto" : "none",
          transition: reducedMotion ? undefined : `opacity ${GALLERY_MS}ms ${EASE_OUT}`,
        }}
      >
        <div
          className="grid shrink-0"
          style={{
            width: galleryNaturalW,
            gridTemplateColumns: `repeat(${galleryColumns}, ${GALLERY_PAIR_W}px)`,
            columnGap: GALLERY_COLUMN_GAP,
            rowGap: GALLERY_ROW_GAP,
            transform: `scale(${galleryScale})`,
            transformOrigin: "top center",
          }}
        >
          {CARDS.map((card) => (
            <div key={card.id} className="flex items-start" style={{ gap: GALLERY_PAIR_GAP }}>
              <GalleryCard variant="small" card={card} onClick={() => setGalleryOpen(false)} />
              <GalleryCard variant="large" card={card} onClick={() => setGalleryOpen(false)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FanCard({
  card,
  visible,
  reducedMotion,
  delay,
  hovered,
  neighborNudge,
  onToggle,
  onHoverChange,
}: {
  card: CardData;
  visible: boolean;
  reducedMotion: boolean;
  delay: number;
  hovered: boolean;
  neighborNudge: number;
  onToggle: () => void;
  onHoverChange: (hovered: boolean) => void;
}) {
  const x = card.x + neighborNudge;
  const y = card.y - (hovered ? HOVER_LIFT : 0);
  const rotate = card.rotate * (hovered ? 1 - HOVER_ROTATE_FACTOR : 1);
  const entranceScale = reducedMotion || visible ? 1 : 0.92;
  const hoverScale = hovered ? 1.03 : 1;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${card.text}`}
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
        width: CARD_W,
        height: CARD_H,
        padding: RESTING_PADDING,
        borderRadius: CARD_RADIUS,
        backgroundColor: card.color,
        opacity: reducedMotion || visible ? 1 : 0,
        isolation: "isolate",
        zIndex: hovered ? 6 : 1,
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${entranceScale * hoverScale})`,
        transition: reducedMotion
          ? undefined
          : [`opacity 400ms ${EASE_OUT} ${delay}ms`, `transform ${hovered ? HOVER_MS : 500}ms ${EASE_OUT} ${delay}ms`].join(", "),
      }}
    >
      <div className="flex w-full shrink-0 flex-col gap-2">
        <div className="relative h-[60px] w-full shrink-0 overflow-hidden rounded-[8px]">
          <Image src={card.image} alt="" aria-hidden fill sizes="130px" className="object-cover" />
        </div>
        <div className="h-px w-full shrink-0" style={{ backgroundColor: card.textColor }} />
      </div>
      <p className={`w-full break-words ${RESTING_TEXT}`} style={{ color: card.textColor }}>
        {card.text}
      </p>
    </div>
  );
}

// Small and large gallery cards are two genuinely different Figma
// nodes, not one card CSS-scaled into the other (scaling the DOM large
// card down would blur its text and throw off its border-radius/
// padding relative to its own size) — rendered as two real variants
// sharing only the underlying project data. The small variant has no
// divider between image and title (confirmed against 109:3581 etc.'s
// own generated CSS — genuinely absent, not an oversight, unlike the
// fan card above which does have one).
function GalleryCard({ variant, card, onClick }: { variant: "small" | "large"; card: CardData; onClick: () => void }) {
  const large = variant === "large";
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${card.text}${large ? ", details" : ""} — close gallery`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="flex shrink-0 cursor-pointer flex-col justify-between overflow-hidden outline-none transition-transform duration-150 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-text-primary"
      style={{
        width: large ? GALLERY_LARGE_W : GALLERY_SMALL_W,
        height: large ? GALLERY_LARGE_H : GALLERY_SMALL_H,
        padding: large ? 12 : RESTING_PADDING,
        borderRadius: large ? 20 : CARD_RADIUS,
        backgroundColor: card.color,
      }}
    >
      {/* Large: image + title grouped at the top (gap-2), description
          pushed to the bottom by the outer justify-between, generous
          empty space between them. Small: no divider, no grouping —
          image alone at the top, title alone at the bottom, same
          justify-between doing the work directly (confirmed against
          109:3581 etc.'s own metadata: its title sits at y=118 while
          the image block ends at y=68, a ~50px gap plain gap-stacking
          wouldn't produce — this card is only 162px tall). */}
      {large ? (
        <div className="flex w-full shrink-0 flex-col gap-2">
          <div className="relative w-full shrink-0 overflow-hidden rounded-[8px]" style={{ height: 170 }}>
            <Image src={card.image} alt="" aria-hidden fill sizes="301px" className="object-cover" />
          </div>
          <p className={`w-full break-words ${GALLERY_LARGE_TITLE}`} style={{ color: card.textColor }}>
            {card.text}
          </p>
        </div>
      ) : (
        <div className="relative w-full shrink-0 overflow-hidden rounded-[8px]" style={{ height: 60 }}>
          <Image src={card.image} alt="" aria-hidden fill sizes="130px" className="object-cover" />
        </div>
      )}
      <p className={`w-full break-words ${large ? GALLERY_DESC : RESTING_TEXT}`} style={{ color: large ? withAlpha(card.textColor, 0.8) : card.textColor }}>
        {large ? card.description : card.text}
      </p>
    </div>
  );
}
