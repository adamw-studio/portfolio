/**
 * Hairline dashed divider between home page sections (Figma nodes
 * 238:12748, 238:12750). Figma exports this as a 1px image
 * (stroke="#F4F4F4" stroke-opacity="0.1" stroke-dasharray="4 4"), using
 * the existing --color-border-subtle token already used everywhere else
 * on this page (chips, nav, card borders) rather than an extra asset.
 *
 * Drawn via .divider-dashed (globals.css), a repeating-gradient
 * background rather than border-dashed — a border-style dash pattern
 * comes from the browser's own fixed ratio, not something CSS lets you
 * size, so there's no way to widen the gap specifically starting from
 * that. The gradient version deliberately runs wider than Figma's literal
 * 4px gap, to read as intentionally sparse next to the page's own 24px
 * dot-grid background rather than a dense line beside a sparse pattern.
 */
export function Divider() {
  return <div className="divider-dashed w-full" aria-hidden />;
}
