import { CardRow } from "@/components/case-study/CardRow";
import { GalleryCard } from "@/components/case-study/monday/GalleryCard";

// See FirstRoundGallery.tsx's own doc comment. No caption. Only the
// first slide (207:5484) is bordered — the other three (207:5494/
// 6477/6479) draw no border at all, a real per-slide difference
// confirmed against each node, not an inconsistency to normalize away.
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

const SLIDES: { id: string; alt: string; src: string; bordered?: boolean }[] = [
  { id: "1", alt: "Monday identity in use 1", src: "/images/home/monday-gallery-d-1.jpg", bordered: true },
  { id: "2", alt: "Monday identity in use 2", src: "/images/home/monday-gallery-d-2.jpg" },
  { id: "3", alt: "Monday identity in use 3", src: "/images/home/monday-gallery-d-3.jpg" },
  { id: "4", alt: "Monday identity in use 4", src: "/images/home/monday-gallery-d-4.jpg" },
];

export default function GalleryD() {
  return (
    <CardRow
      ariaLabel="Monday identity in use, set one"
      cardWidth={512}
      alignInset={ALIGN_INSET}
      items={SLIDES.map(({ id, alt, src, bordered }) => ({ id, content: <GalleryCard alt={alt} src={src} bordered={bordered} /> }))}
    />
  );
}
