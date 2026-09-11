import Image from "next/image";

// Figma 55:11891/55:11893 — the one project card with no case-study page
// yet (see SelectedWorks.tsx's own comment on why it renders unlinked),
// so this is purely a static visual: two stacked background photos plus
// three overlapping product screenshots, one of them tilted. Every
// position/size below is a literal Figma px value converted to a
// percentage of the card's own fixed 688x496 box (get_metadata confirmed
// that exact size) rather than kept as hardcoded pixels — this card
// renders at `w-[85vw] sm:w-[688px]` (SelectedWorks.tsx), so percentages
// are what let the collage scale down cleanly on narrow viewports
// instead of overflowing a shrunken card.
export function DesignSystemCollage() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <Image src="/images/home/design-system-bg-1.jpg" alt="" fill className="object-cover" sizes="688px" />
      <Image src="/images/home/design-system-bg-2.jpg" alt="" fill className="object-cover" sizes="688px" />

      {/* "Color Tokens" panel — left-[16.41%] top-[15.93%], 38.52% x 62.30% of the card */}
      <div className="absolute left-[16.41%] top-[15.93%] h-[62.3%] w-[38.52%] overflow-hidden rounded-lg shadow-[0px_4px_8px_0px_rgba(0,0,0,0.12)]">
        <Image src="/images/home/design-system-screenshot-tokens.png" alt="" fill className="object-cover" sizes="265px" />
      </div>

      {/* "Buttons" panel — left-[-6.69%] top-[46.35%], 54.48% x 61.28% */}
      <div className="absolute left-[-6.69%] top-[46.35%] h-[61.28%] w-[54.48%] overflow-hidden rounded-lg shadow-[0px_4px_8px_0px_rgba(0,0,0,0.12)]">
        <Image src="/images/home/design-system-screenshot-buttons.png" alt="" fill className="object-cover" sizes="375px" />
      </div>

      {/* "Documentation" panel — left-[27.49%] top-[43.5%], 57.33% x 66.99%, tilted 4.52deg */}
      <div className="absolute left-[27.49%] top-[43.5%] flex h-[66.99%] w-[57.33%] items-center justify-center">
        <div className="relative h-[94.24%] w-[94.23%] rotate-[4.52deg] overflow-hidden rounded-lg shadow-[0px_4px_8px_0px_rgba(0,0,0,0.12)]">
          <Image src="/images/home/design-system-screenshot-docs.png" alt="" fill className="object-cover" sizes="372px" />
        </div>
      </div>
    </div>
  );
}
