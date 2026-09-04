import type { ReactNode } from "react";

/**
 * Inline pill/badge used throughout the body copy (e.g. "Beacon",
 * "painter", "5 years & 4 months"). Border-only (no fill) per this design
 * revision — previously had a bg-tertiary fill. Figma varies the radius by
 * section: the "Hey, I'm Adam" paragraph's three chips (Time/Beacon/
 * Orchestro) use radius-sm (8px), everywhere else uses radius-xs (6px).
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
      className={`inline-flex items-center gap-1 border border-border-subtle bg-transparent px-1.5 py-0.5 align-middle font-sans text-[14px] leading-[normal] tracking-[-0.128px] text-text-primary ${
        radius === "sm" ? "rounded-sm" : "rounded-xs"
      } ${medium ? "font-medium" : "font-normal"}`}
    >
      {icon}
      {children}
    </span>
  );
}
