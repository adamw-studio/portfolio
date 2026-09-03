import type { ReactNode } from "react";

/**
 * Inline pill/badge used throughout the body copy (e.g. "Beacon",
 * "painter", "5 years & 4 months"). 24px tall (6px/2px padding around
 * ~19-20px text), matching the surrounding 24px line-height so it sits
 * flush inline within wrapped paragraphs.
 */
export function Chip({ icon, children, medium = false }: { icon?: ReactNode; children: ReactNode; medium?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xs bg-bg-tertiary px-1.5 py-0.5 align-middle font-sans text-[14px] leading-[normal] tracking-[-0.128px] text-text-primary ${
        medium ? "font-medium" : "font-normal"
      }`}
    >
      {icon}
      {children}
    </span>
  );
}
