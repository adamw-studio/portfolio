import { Eyebrow } from "@/components/case-study/primitives";
import { CardRow } from "@/components/case-study/CardRow";
import { GalleryCard } from "@/components/case-study/monday/GalleryCard";

// See FirstRoundGallery.tsx's own doc comment. All 4 slides bordered,
// all with real exported images.
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

const SLIDES: { id: string; alt: string; src: string }[] = [
  { id: "1", alt: "Second round exploration 1", src: "/images/home/monday-second-round-1.jpg" },
  { id: "2", alt: "Second round exploration 2", src: "/images/home/monday-second-round-2.jpg" },
  { id: "3", alt: "Second round exploration 3", src: "/images/home/monday-second-round-3.jpg" },
  { id: "4", alt: "Second round exploration 4", src: "/images/home/monday-second-round-4.jpg" },
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
        alignInset={ALIGN_INSET}
        items={SLIDES.map(({ id, alt, src }) => ({ id, content: <GalleryCard alt={alt} src={src} bordered /> }))}
      />
    </div>
  );
}
