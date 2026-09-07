import type { ReactNode } from "react";

/**
 * Inline pill/badge used throughout the body copy (e.g. "Beacon",
 * "painter", "5 years & 4 months"). Border-only (no fill) per this design
 * revision — previously had a bg-tertiary fill. Figma varies the radius by
 * section: the "Hey, I'm Adam" paragraph's three chips (Time/Beacon/
 * Orchestro) use radius-sm (8px), everywhere else uses radius-xs (6px).
 *
 * `group` + tabIndex: any animated icon passed as `icon` (see
 * components/icons/) uses Tailwind's group-hover:/group-focus: variants
 * to animate when *this* chip is hovered or focused — no JS needed here,
 * the chip itself doesn't need to know which icon it's hosting. tabIndex
 * makes the chip keyboard-focusable so the same animation triggers on
 * focus, not just hover.
 *
 * backdrop-blur-sm: works even with no fill of its own — a backdrop
 * filter blurs whatever's behind the element, not the element's own
 * background. Softens the page's dot-grid pattern (globals.css) where it
 * sits under a chip, the same frosted-glass treatment the nav already
 * uses at a much larger radius.
 */
export function Chip({
  icon,
  children,
  medium = false,
  radius = "xs",
}: {
  icon?: ReactNode;
  children: ReactNode;
  medium?: boolean;
  radius?: "xs" | "sm";
}) {
  return (
    <span
      tabIndex={0}
      className={`group inline-flex items-center gap-1 border border-border-subtle bg-transparent px-1.5 py-0.5 align-middle font-sans text-[14px] leading-[normal] tracking-[-0.128px] text-text-primary backdrop-blur-sm ${
        radius === "sm" ? "rounded-sm" : "rounded-xs"
      } ${medium ? "font-medium" : "font-normal"}`}
    >
      {icon}
      {children}
    </span>
  );
}
