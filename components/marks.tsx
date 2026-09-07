import { ShapeIcon } from "@/components/icons/ShapeIcon";

// Time (next to "5 years & 4 months") and Sculptor (next to "sculptor")
// used to be hand-coded here as sets of absolutely-positioned rectangles,
// reproduced from Figma's exact per-shape coordinates since they weren't
// a standard icon set. Figma has since replaced every one of these
// inline word-marks — Time, Sculptor, Painter, Curiosity, Craftsmanship,
// Deep respect — with a real vector "masked-letter-grid" glyph per word;
// see components/icons/ShapeIcon for why those render as actual SVG
// assets now instead of hand-drawn primitives.
export const TimeMark = () => <ShapeIcon name="time" />;

export const SculptorMark = () => <ShapeIcon name="sculptor" />;
