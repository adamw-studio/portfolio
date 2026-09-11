import Image from "next/image";
import { themedIcon } from "@/components/themedIcon";
import { insetBorder } from "@/components/typography";

/**
 * Empty bg-tertiary placeholder + inert prev/next controls (Figma
 * 283:6851 / 283:7221 and, since the case-study rebuild, 97:2131 too) —
 * every design that reserves room for a screenshot gallery here ships no
 * actual images yet, so this renders the frame the design calls for
 * without fabricating slides to page through. Reuses the exact
 * arrow-left/arrow-right assets SelectedWorks already uses for the same
 * disabled-affordance treatment. `width`/`height` default to the first
 * design's own 512x301 — a later reuse with a differently-sized frame
 * (the case-study system's own 382x240 card content, narrower than this
 * component's original 688px-column home) passes its own instead of
 * this component assuming every caller's frame is that same size.
 */
export function CaseStudyImagePlaceholder({ width = 512, height = 301 }: { width?: number; height?: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="max-w-full rounded-lg bg-bg-tertiary" style={{ width, height }} />
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label="Previous image"
          disabled
          className={`flex size-6 items-center justify-center rounded-full bg-bg-tertiary opacity-40 ${insetBorder}`}
        >
          <Image src="/images/home/arrow-left.svg" alt="" width={16} height={16} className={themedIcon} />
        </button>
        <button
          type="button"
          aria-label="Next image"
          disabled
          className={`flex size-6 items-center justify-center rounded-full bg-bg-tertiary opacity-40 ${insetBorder}`}
        >
          <Image src="/images/home/arrow-right.svg" alt="" width={16} height={16} className={themedIcon} />
        </button>
      </div>
    </div>
  );
}
