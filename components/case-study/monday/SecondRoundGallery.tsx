import { Eyebrow } from "@/components/case-study/primitives";
import { CardRow } from "@/components/case-study/CardRow";
import { GalleryCard } from "@/components/case-study/monday/GalleryCard";

// See FirstRoundGallery.tsx's own doc comment. All 4 slides bordered,
// each a genuine light/dark export pair (same darkSrc convention).
//
// .jpg, not .png, from the start this time — the earlier "dark poster
// card" versions of these 4 wordmark-lockup explorations were replaced
// live with flat mark-on-#F6F3E7/mark-on-black art, the same simple
// treatment First Round's marks use. That's exactly the near-2-color
// image shape that made Next's dev image optimizer mis-encode as an
// indexed PNG and render as flat gray in Chromium (see
// FirstRoundGallery.tsx's own doc comment for the full diagnosis) — so
// these were saved as JPEG up front rather than hitting that bug again.
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

const SLIDES: { id: string; alt: string; src: string; darkSrc: string }[] = [
  { id: "1", alt: "Second round exploration 1", src: "/images/home/monday-second-round-1.jpg", darkSrc: "/images/home/monday-second-round-1-dark.jpg" },
  { id: "2", alt: "Second round exploration 2", src: "/images/home/monday-second-round-2.jpg", darkSrc: "/images/home/monday-second-round-2-dark.jpg" },
  { id: "3", alt: "Second round exploration 3", src: "/images/home/monday-second-round-3.jpg", darkSrc: "/images/home/monday-second-round-3-dark.jpg" },
  { id: "4", alt: "Second round exploration 4", src: "/images/home/monday-second-round-4.jpg", darkSrc: "/images/home/monday-second-round-4-dark.jpg" },
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
