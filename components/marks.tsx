import { ICON_DURATION, EASE_POP, MOTION_REDUCE, STAGGER_STEP_MS } from "@/components/motion/tokens";

/**
 * Small bespoke colored-shape icons used inline throughout the home page
 * (e.g. the clock next to "5 years & 4 months", the sculptor mark next to
 * "sculptor"). These aren't a standard icon set in Figma — each is a set of
 * absolutely-positioned rectangles inside a 20x20 box — so they're
 * reproduced here from Figma's exact per-shape coordinates rather than
 * substituted with generic icons.
 *
 * The "painter" (bar chart), "curiosity" (2x2 squares), "craftsmanship"
 * (vertical bars) and "deep respect" (equals sign) marks moved to
 * components/icons/ as animated SVG components — see
 * BarChartIcon/CuriosityIcon/CraftsmanshipIcon/EqualsIcon. Time and
 * Sculptor weren't part of that original 11-icon list, but they sit right
 * next to marks that do animate (in the same "I was raised by a [painter]
 * and a [sculptor]" sentence), so leaving them inert reads as a bug, not a
 * deliberate omission — they get the same group-hover/group-focus
 * staggered-pop treatment as Curiosity for consistency.
 */
type Rect = { x: number; y: number; w: number; h: number };

const popClass = `origin-center transition-transform ${ICON_DURATION} ${EASE_POP} ${MOTION_REDUCE} group-hover:scale-[1.15] group-focus:scale-[1.15]`;

function ShapeMark({ color, shapes }: { color: string; shapes: Rect[] }) {
  return (
    <span className="relative inline-block size-5 shrink-0 overflow-hidden" aria-hidden>
      {shapes.map((s, i) => (
        <span
          key={i}
          className={`absolute ${popClass}`}
          style={{ left: s.x, top: s.y, width: s.w, height: s.h, backgroundColor: color, transitionDelay: `${i * STAGGER_STEP_MS}ms` }}
        />
      ))}
    </span>
  );
}

export const TimeMark = () => (
  <ShapeMark
    color="#00a2c2"
    shapes={[
      { x: 9, y: 9, w: 2, h: 2 },
      { x: 9, y: 1, w: 2, h: 8 },
      { x: 11, y: 9, w: 7, h: 2 },
    ]}
  />
);

// Reproduced with the same wrapper-then-rotate structure Figma itself
// exports for rotated shapes. Color synced to Figma's current site-wide
// two-tone palette (#fff1b5 cream / #00a2c2 teal, replacing what used to
// be a wider per-icon color set). The rotated bar keeps its static
// -rotate-[27.52deg] on the `rotate` CSS property; the hover/focus pop
// animates `scale` independently (Tailwind v4 keeps these as separate
// standalone properties), so the two don't fight each other.
export const SculptorMark = () => (
  <span className="relative inline-block size-5 shrink-0 overflow-hidden" aria-hidden>
    <span
      className="absolute flex items-center justify-center"
      style={{ left: 2.82, top: 0.59, width: 9.368, height: 6.82 }}
    >
      <span
        className={`block -rotate-[27.52deg] ${popClass}`}
        style={{ width: 9, height: 3, backgroundColor: "#00a2c2", transitionDelay: "0ms" }}
      />
    </span>
    <span
      className={`absolute ${popClass}`}
      style={{ left: 5, top: 8, width: 10, height: 3, backgroundColor: "#00a2c2", transitionDelay: `${STAGGER_STEP_MS}ms` }}
    />
    <span
      className={`absolute ${popClass}`}
      style={{ left: 1, top: 14, width: 18, height: 3, backgroundColor: "#00a2c2", transitionDelay: `${2 * STAGGER_STEP_MS}ms` }}
    />
  </span>
);
