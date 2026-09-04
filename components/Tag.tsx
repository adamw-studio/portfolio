import type { ReactNode } from "react";

/**
 * "What I do" pill (Research, System thinking, ...). Same group-hover/
 * group-focus animation pattern as Chip — see Chip.tsx for the full
 * rationale. Icon is a component (typically one of components/icons/dots)
 * rather than an image path, so it can be an animated primitive instead of
 * a static raster/SVG file reference.
 */
export function Tag({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div tabIndex={0} className="group flex items-center gap-1 rounded-xs border border-border-subtle px-1.5 py-0.5">
      {icon}
      <span className="whitespace-nowrap font-sans text-[14px] tracking-[-0.128px] text-text-primary">{label}</span>
    </div>
  );
}
