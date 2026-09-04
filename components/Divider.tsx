/**
 * Hairline dashed divider between home page sections (Figma nodes
 * 238:12748, 238:12750). Figma exports this as a 1px image
 * (stroke="#F4F4F4" stroke-opacity="0.1" stroke-dasharray="4 4"), but
 * that's exactly the existing --color-border-subtle token already used
 * everywhere else on this page (chips, nav, card borders) — a plain
 * dashed border reproduces it pixel-for-pixel without an extra asset.
 */
export function Divider() {
  return <div className="w-full border-t border-dashed border-border-subtle" aria-hidden />;
}
