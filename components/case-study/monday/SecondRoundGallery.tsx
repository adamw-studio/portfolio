import { Eyebrow } from "@/components/case-study/primitives";
import { CardRow } from "@/components/case-study/CardRow";
import { GalleryCard } from "@/components/case-study/monday/GalleryCard";

// See FirstRoundGallery.tsx's own doc comment. All 4 slides bordered,
// each a genuine light/dark export pair (same darkSrc convention).
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

const SLIDES: { id: string; alt: string; src: string; darkSrc: string }[] = [
  { id: "1", alt: "Second round exploration 1", src: "/images/home/monday-second-round-1.png", darkSrc: "/images/home/monday-second-round-1-dark.png" },
  { id: "2", alt: "Second round exploration 2", src: "/images/home/monday-second-round-2.png", darkSrc: "/images/home/monday-second-round-2-dark.png" },
  { id: "3", alt: "Second round exploration 3", src: "/images/home/monday-second-round-3.png", darkSrc: "/images/home/monday-second-round-3-dark.png" },
  { id: "4", alt: "Second round exploration 4", src: "/images/home/monday-second-round-4.png", darkSrc: "/images/home/monday-second-round-4-dark.png" },
];

export default function SecondRoundGallery() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full max-w-[512px]" style={{ marginInline: "auto" }}>
        <Eyebrow>[ Second round ]</Eyebrow>
      </div>
      <CardRow
        ariaLabel="Second round explorations"
        cardWidth={512}
        gap={16}
        alignInset={ALIGN_INSET}
        items={SLIDES.map(({ id, alt, src, darkSrc }) => ({ id, content: <GalleryCard alt={alt} src={src} darkSrc={darkSrc} bordered /> }))}
      />
    </div>
  );
}
