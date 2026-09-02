import type { ReactNode } from "react";

/**
 * The label+content row pattern used throughout the new home page ("Who am
 * I", "What shapes me", "What I do", "About"). The content column stays at
 * the same centered position used site-wide (max-w-[688px] mx-auto on the
 * page); the label hangs in the left margin via absolute positioning at a
 * fixed 99px width (Figma's widest label, "What shapes me") + 16px gap, so
 * every label right-aligns to the same edge regardless of its own text
 * length — matching Figma's grid exactly without needing a real CSS grid
 * (which would size each row's label column independently and misalign
 * rows with different-length labels).
 */
export default function LabeledRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative flex flex-col items-start">
      <span className="absolute top-0 right-[calc(100%+16px)] w-[99px] shrink-0 text-right font-heros-cn text-[16px] italic text-text-subtle">
        {label}
      </span>
      <div className="w-full">{children}</div>
    </div>
  );
}
