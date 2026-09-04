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
 * BarChartIcon/CuriosityIcon/CraftsmanshipIcon/EqualsIcon.
 */
type Rect = { x: number; y: number; w: number; h: number };

function ShapeMark({ color, shapes }: { color: string; shapes: Rect[] }) {
  return (
    <span className="relative inline-block size-5 shrink-0 overflow-hidden" aria-hidden>
      {shapes.map((s, i) => (
        <span
          key={i}
          className="absolute"
          style={{ left: s.x, top: s.y, width: s.w, height: s.h, backgroundColor: color }}
        />
      ))}
    </span>
  );
}

export const TimeMark = () => (
  <ShapeMark
    color="#0d99ff"
    shapes={[
      { x: 9, y: 9, w: 2, h: 2 },
      { x: 9, y: 1, w: 2, h: 8 },
      { x: 11, y: 9, w: 7, h: 2 },
    ]}
  />
);

// Replaced: was a solid brown/tan (#bf8c59) L-shaped block; now a blue
// (#2e8cd1) mark with one rotated bar, reproduced with the same
// wrapper-then-rotate structure Figma itself exports for rotated shapes.
export const SculptorMark = () => (
  <span className="relative inline-block size-5 shrink-0 overflow-hidden" aria-hidden>
    <span
      className="absolute flex items-center justify-center"
      style={{ left: 2.82, top: 0.59, width: 9.368, height: 6.82 }}
    >
      <span className="block -rotate-[27.52deg]" style={{ width: 9, height: 3, backgroundColor: "#2e8cd1" }} />
    </span>
    <span className="absolute" style={{ left: 5, top: 8, width: 10, height: 3, backgroundColor: "#2e8cd1" }} />
    <span className="absolute" style={{ left: 1, top: 14, width: 18, height: 3, backgroundColor: "#2e8cd1" }} />
  </span>
);
