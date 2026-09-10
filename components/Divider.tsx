/**
 * Hairline dashed divider between home page and case-study sections
 * (Figma 325:270). This node has flip-flopped mid-project — briefly a
 * plain solid stroke, now back to dashed but at "8 8" rather than the
 * original "4 4" this first shipped with — so the ratio here tracks
 * whatever Figma's export literally says today, not a value carried
 * forward from an earlier version of this same node.
 *
 * Drawn via .divider-dashed (globals.css), a repeating-gradient
 * background rather than border-dashed — a border-style dash pattern
 * comes from the browser's own fixed ratio, not something CSS lets you
 * size, so there's no way to match an exact dash/gap length from there.
 */
export function Divider() {
  return <div className="divider-dashed w-full" aria-hidden />;
}
