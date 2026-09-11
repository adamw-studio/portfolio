import Image from "next/image";
import { themedIcon } from "@/components/themedIcon";

// Figma 90:1761 — a segmented pill, bottom-center, sharing the same
// solid bg-bg-default + border-border-disabled + backdrop-blur "glass
// chrome" convention Nav.tsx's own segmented control and BackButton.tsx
// already use elsewhere on the site (see either's own doc comment for
// why it's solid, not translucent-over-content). Deliberately just
// Prev/Next + a secondary counter — no dots, no autoplay, per the brief.
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
    <div className="fixed inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 px-4">
      {/* 03 / 08 — secondary on purpose (text-subtle, small), never the
          primary way to tell where you are in the story; kept above the
          pill rather than inside it so the pill's own two buttons stay
          the only interactive targets in it. */}
      <p className="font-sans text-[12px] tracking-[-0.06px] text-text-subtle" aria-hidden>
        {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </p>
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
