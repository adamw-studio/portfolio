import type { ReactNode } from "react";

/**
 * Inline highlighted term used throughout the bio copy (e.g. "Beacon",
 * "5 years - 4 months", "curiosity"). Sized to sit inline within a 24px
 * line-height paragraph: 4px padding + 16px text = 24px tall, matching
 * Figma's per-word chip components exactly.
 */
export function Pill({ children, className = "" }: { children: ReactNode; className?: string }) {
  // No default text color here: Tailwind resolves conflicting same-specificity
  // utilities (e.g. text-text-primary vs text-text-link) by their order in
  // the generated stylesheet, not by position in this string — so a hardcoded
  // default here would silently beat a caller-supplied color override. Every
  // call site passes its own color class instead (see Home page usages).
  return (
    <span
      className={`inline-flex items-center rounded-sm bg-bg-secondary px-1 py-1 align-middle text-[14px] font-medium leading-4 tracking-[-0.056px] ${className}`}
    >
      {children}
    </span>
  );
}
