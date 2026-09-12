import Image from "next/image";
import { themedIcon } from "@/components/themedIcon";
import { LANE_WIDTH } from "@/components/case-study/CaseStudyStage";

// Figma 90:1761 — a segmented pill sharing the same solid bg-bg-default
// + border-border-disabled + backdrop-blur "glass chrome" convention
// Nav.tsx's own segmented control and BackButton.tsx already use
// elsewhere on the site (see either's own doc comment for why it's
// solid, not translucent-over-content). Deliberately just Prev/Next —
// no counter, no dots, no autoplay, per the brief. `count` still comes
// through as a prop (used for the atEnd bound below) even with no
// "NN / NN" text rendering it anymore.
//
// Anchored a fixed 24px below the *card's own* bottom edge, not a flat
// bottom-6 — reported live as the pill feeling disconnected, floating
// in empty page space below whatever the card happened to leave behind
// it. CaseStudyStage's own cards are vertically centered in a 100svh
// stage and size themselves by aspect-ratio(440/600) against their own
// width — this works that same formula backwards to land 24px under
// that edge at any viewport, without this component needing to measure
// anything. Imports CaseStudyStage's own LANE_WIDTH rather than
// hardcoding the same expression a second time: this used to duplicate
// it as a literal string, and a later mobile-peek fix to LANE_WIDTH's
// own formula would have silently desynced the two (the pill landing
// at the wrong height) if this weren't sharing the one export instead.
const CARD_BOTTOM_GAP_PX = 24;
const PILL_TOP = `calc(50svh + (${LANE_WIDTH} * 600 / 440) / 2 + ${CARD_BOTTOM_GAP_PX}px)`;

export function CaseStudyNav({
  index,
  count,
  onPrev,
  onNext,
}: {
  index: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const atStart = index === 0;
  const atEnd = index === count - 1;

  return (
    <div className="fixed inset-x-0 z-20 flex justify-center px-4" style={{ top: PILL_TOP }}>
      <div className="flex items-center gap-1 rounded-full border border-border-disabled bg-bg-default p-1 backdrop-blur-[5px]">
        <button
          type="button"
          aria-label="Previous page"
          disabled={atStart}
          onClick={onPrev}
          className="flex items-center justify-center rounded-full border border-border-disabled px-3 py-2 transition-[background-color,opacity] duration-150 enabled:hover:bg-bg-tertiary disabled:opacity-30"
        >
          <Image src="/images/home/arrow-left.svg" alt="" width={16} height={16} className={themedIcon} />
        </button>
        <button
          type="button"
          aria-label="Next page"
          disabled={atEnd}
          onClick={onNext}
          className="flex items-center justify-center rounded-full border border-border-disabled px-3 py-2 transition-[background-color,opacity] duration-150 enabled:hover:bg-bg-tertiary disabled:opacity-30"
        >
          <Image src="/images/home/arrow-right.svg" alt="" width={16} height={16} className={themedIcon} />
        </button>
      </div>
    </div>
  );
}
