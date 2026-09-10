/**
 * Hairline divider between home page and case-study sections (Figma
 * 325:270, superseding the earlier dashed version at 238:12748/238:12750
 * — Figma's own export dropped the stroke-dasharray, so this is now a
 * plain solid line, not a design oversight to preserve). Same
 * --color-border-subtle token already used everywhere else (chips, nav,
 * card borders) rather than an extra asset — Figma's export is
 * `stroke="#F4F4F4" stroke-opacity="0.1"`, exactly that token's value.
 */
export function Divider() {
  return <div className="h-px w-full bg-border-subtle" aria-hidden />;
}
