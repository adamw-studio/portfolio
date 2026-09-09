"use client";

import { useState } from "react";
import Image from "next/image";
import { themedIcon } from "@/components/themedIcon";
import { insetBorder } from "@/components/typography";

// frame: "phone" centers the slide at its own aspect ratio (object-contain)
// instead of cropping it to fill the box (object-cover) — for a phone
// mockup photo whose own aspect ratio doesn't match this box's, cover
// would crop off its sides. A hand-built vector device frame was tried
// here first (reconstructing Figma's phone-mockup component from its raw
// body/screen-mask paths) but came out visibly wrong (see the git history
// for that attempt) — a real exported photo of the actual mockup, shown
// at its own proportions, is simpler and matches Figma exactly.
type Slide = {
  src: string;
  alt: string;
  frame?: "phone";
  /** Silent, looping video instead of a static image for this slide —
   * `src` doubles as its poster frame (shown before the video can play,
   * and as the fallback if it can't). Figma's own "Project GIF" asset for
   * this slide was a genuine animated GIF, but at 1920x1080 it was a
   * 408MB file — transcoded to this instead, ~230x smaller, since a
   * silent autoplaying <video> loop is the actual web-equivalent of a
   * GIF, not a literal .gif file. */
  video?: string;
  /** Figma's oversized-crop technique (see BeaconCaseStudy's hero card,
   * the first place this shipped): an image rendered larger than, and
   * offset within, this slide's own box, so what's visible is a
   * deliberate art-directed slice — a screen recording composited over a
   * background photo — rather than one flat image. */
  overlay?: { src: string; alt: string; left: number; top: number; width: number; height: number };
};

/**
 * A working version of CaseStudyImagePlaceholder's gallery frame (Figma
 * 283:7221 and siblings) — same size and prev/next chrome, but backed by
 * real slides with actual navigation, for the one gallery per case study
 * that has images to show. Client component (needs the current-index
 * state); CaseStudyImagePlaceholder stays a server component for the
 * still-empty galleries elsewhere.
 *
 * Prev/next disabled state mirrors SelectedWorks.tsx's own carousel
 * buttons exactly (disabled:opacity-40, no wraparound) rather than
 * inventing a different disabled treatment for the same interaction.
 */
export function CaseStudyImageCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const canPrev = index > 0;
  const canNext = index < slides.length - 1;
  const slide = slides[index];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-[301px] w-[512px] max-w-full items-center justify-center overflow-hidden rounded-lg bg-bg-tertiary">
        {slide.video ? (
          // key={slide.video} — same reasoning as the Image below: forces
          // a fresh <video> element on slide change, since a native video
          // element won't otherwise reload/restart for a changed src.
          <video
            key={slide.video}
            src={slide.video}
            poster={slide.src}
            autoPlay
            loop
            muted
            playsInline
            className="size-full object-cover"
          />
        ) : (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            className={slide.frame === "phone" ? "object-contain p-4" : "object-cover"}
            sizes="512px"
          />
        )}
        {slide.overlay && (
          <div
            className="absolute"
            style={{ left: slide.overlay.left, top: slide.overlay.top, width: slide.overlay.width, height: slide.overlay.height }}
          >
            <Image src={slide.overlay.src} alt={slide.overlay.alt} fill className="object-cover" sizes="530px" />
          </div>
        )}
      </div>
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label="Previous image"
          disabled={!canPrev}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className={`flex size-6 items-center justify-center rounded-full bg-bg-tertiary disabled:cursor-not-allowed disabled:opacity-40 ${insetBorder}`}
        >
          <Image src="/images/home/arrow-left.svg" alt="" width={16} height={16} className={themedIcon} />
        </button>
        <button
          type="button"
          aria-label="Next image"
          disabled={!canNext}
          onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}
          className={`flex size-6 items-center justify-center rounded-full bg-bg-tertiary disabled:cursor-not-allowed disabled:opacity-40 ${insetBorder}`}
        >
          <Image src="/images/home/arrow-right.svg" alt="" width={16} height={16} className={themedIcon} />
        </button>
      </div>
    </div>
  );
}
