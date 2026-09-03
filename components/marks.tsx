/**
 * Small bespoke colored-shape icons used inline throughout the home page
 * (e.g. the clock next to "5 years & 4 months", the brush next to
 * "painter"). These aren't a standard icon set in Figma — each is a set of
 * absolutely-positioned rectangles inside a 20x20 box — so they're
 * reproduced here from Figma's exact per-shape coordinates rather than
 * substituted with generic icons.
 */
type Rect = { x: number; y: number; w: number; h: number };

function ShapeMark({ color, shapes, withBg = true }: { color: string; shapes: Rect[]; withBg?: boolean }) {
  return (
    <span
      className={`relative inline-block size-5 shrink-0 overflow-hidden ${withBg ? "bg-bg-tertiary" : ""}`}
      aria-hidden
    >
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

export const BrushMark = () => (
  <ShapeMark
    color="#e5522e"
    shapes={[
      { x: 2, y: 2, w: 2, h: 14 },
      { x: 6, y: 4, w: 2, h: 12 },
      { x: 10, y: 6, w: 2, h: 10 },
      { x: 14, y: 8, w: 2, h: 8 },
      { x: 1, y: 17, w: 16, h: 3 },
    ]}
  />
);

export const SculptorMark = () => (
  <ShapeMark
    color="#bf8c59"
    shapes={[
      { x: 2, y: 0, w: 12, h: 16 },
      { x: 16, y: 2, w: 3, h: 4 },
      { x: 15, y: 12, w: 4, h: 3 },
      { x: 6, y: 17, w: 3, h: 2 },
    ]}
  />
);

export const CuriosityMark = () => (
  <ShapeMark
    color="#f59e0a"
    shapes={[
      { x: 4, y: 4, w: 4, h: 4 },
      { x: 12, y: 4, w: 4, h: 4 },
      { x: 4, y: 12, w: 4, h: 4 },
      { x: 12, y: 12, w: 4, h: 4 },
    ]}
  />
);

export const CraftsmanshipMark = () => (
  <ShapeMark
    color="#6bc257"
    shapes={[
      { x: 3, y: 0, w: 4, h: 14 },
      { x: 12, y: 6, w: 4, h: 14 },
    ]}
  />
);

export const DeepRespectMark = () => (
  <ShapeMark
    color="#0085db"
    shapes={[
      { x: 2, y: 4, w: 16, h: 4 },
      { x: 2, y: 12, w: 16, h: 4 },
    ]}
  />
);

export const DesignerMark = () => (
  <ShapeMark
    color="#8c61d9"
    shapes={[
      { x: 0, y: 0, w: 20, h: 2 },
      { x: 0, y: 0, w: 2, h: 20 },
      { x: 5, y: 5, w: 8, h: 8 },
      { x: 16, y: 15, w: 3, h: 3 },
    ]}
  />
);

// "About me" trait icons
export const PrototypeAIMark = () => (
  <ShapeMark withBg={false} color="#009951" shapes={[{ x: 0, y: 0, w: 10, h: 10 }]} />
);

export const BuildsDesignSystemsMark = () => (
  <ShapeMark
    withBg={false}
    color="#00a2c2"
    shapes={[
      { x: 10, y: 10, w: 10, h: 10 },
      { x: 0, y: 0, w: 10, h: 10 },
    ]}
  />
);

export const RethinksWorkflowsMark = () => (
  <ShapeMark
    withBg={false}
    color="#784da8"
    shapes={[
      { x: 0, y: 0, w: 6, h: 3 },
      { x: 7, y: 6, w: 6, h: 3 },
      { x: 14, y: 12, w: 6, h: 3 },
      { x: 0, y: 17, w: 20, h: 3 },
    ]}
  />
);

export const BelievesCreativeMark = () => (
  <ShapeMark withBg={false} color="#0d99ff" shapes={[{ x: 5, y: 5, w: 10, h: 10 }]} />
);

export const ObsessedDetailsMark = () => (
  <ShapeMark withBg={false} color="#ffcd29" shapes={[{ x: 9, y: 9, w: 2, h: 2 }]} />
);

export const ShipCodeMark = () => (
  <ShapeMark withBg={false} color="#ebffee" shapes={[{ x: 2, y: 3, w: 2, h: 14 }]} />
);

export const LovesCritMark = () => (
  <ShapeMark
    withBg={false}
    color="#ebaff4"
    shapes={[
      { x: 14, y: 14, w: 4, h: 4 },
      { x: 9, y: 9, w: 2, h: 2 },
      { x: 2, y: 2, w: 4, h: 4 },
    ]}
  />
);
