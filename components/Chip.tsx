import type { ReactNode } from "react";

/**
 * Inline pill/badge used throughout the body copy (e.g. "Beacon",
 * "painter"). Figma varies both radius and fill by section: the
 * "Hey, I'm Adam" paragraph's chips (Beacon/Orchestro, radius-sm/8px) get
 * a real bg-tertiary fill (confirmed on a later re-fetch of that
 * paragraph, 46:10668 — an earlier pass had removed the fill from every
 * chip, before that specific node had been re-checked); everywhere else
 * (radius-xs/6px, e.g. PlaygroundCard's own tag chip) stays border-only,
 * no fill, matching that pass's own original finding for those.
 *
 * `group` + tabIndex: any animated icon passed as `icon` (see
 * components/icons/) uses Tailwind's group-hover:/group-focus: variants
 * to animate when *this* chip is hovered or focused — no JS needed here,
 * the chip itself doesn't need to know which icon it's hosting. tabIndex
 * makes the chip keyboard-focusable so the same animation triggers on
 * focus, not just hover.
 *
 * backdrop-blur-sm: on the border-only (radius-xs) chips, this still
 * does real work with no fill of its own — a backdrop filter blurs
 * whatever's behind the element, not the element's own background,
 * softening the page's dot-grid pattern (globals.css) where it sits
 * under a chip. Harmless (if redundant) to keep on the now-filled
 * radius-sm chips too, rather than branching the class list further for
 * a visually unnoticeable difference.
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
      className={`group inline-flex items-center gap-1 border border-border-subtle px-1.5 py-0.5 align-middle font-sans text-[14px] leading-[normal] tracking-[-0.128px] text-text-primary backdrop-blur-sm ${
        radius === "sm" ? "rounded-sm bg-bg-tertiary" : "rounded-xs bg-transparent"
      } ${medium ? "font-medium" : "font-normal"}`}
    >
      {icon}
      {children}
    </span>
  );
}
