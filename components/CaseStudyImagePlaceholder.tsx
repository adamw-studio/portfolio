import Image from "next/image";
import { themedIcon } from "@/components/themedIcon";
import { insetBorder } from "@/components/typography";

/**
 * Empty bg-tertiary placeholder + inert prev/next controls, shared by
 * BeaconCaseStudy and RoboticsCaseStudy (Figma 283:6851 / 283:7221 and
 * others) — both designs reserve room for a screenshot gallery here but
 * ship no actual images yet, so this renders the frame the design calls
 * for without fabricating slides to page through. Reuses the exact
 * arrow-left/arrow-right assets SelectedWorks already uses for the same
 * disabled-affordance treatment.
 */
export function CaseStudyImagePlaceholder() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="h-[301px] w-[512px] max-w-full rounded-lg bg-bg-tertiary" />
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
