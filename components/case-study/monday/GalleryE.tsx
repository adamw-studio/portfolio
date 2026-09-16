import { CardRow } from "@/components/case-study/CardRow";
import { GalleryCard } from "@/components/case-study/monday/GalleryCard";
import { FilmstripSlide } from "@/components/case-study/monday/FilmstripSlide";

// See FirstRoundGallery.tsx's own doc comment. No caption, 3 slides,
// all bordered. The middle slide is the four-photo filmstrip composite
// (see FilmstripSlide.tsx).
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

export default function GalleryE() {
  return (
    <CardRow
      ariaLabel="Monday identity in use, set two"
      cardWidth={512}
      alignInset={ALIGN_INSET}
      items={[
        { id: "1", content: <GalleryCard alt="Monday identity in use 5" src="/images/home/monday-gallery-e-1.jpg" bordered /> },
        { id: "2", content: <GalleryCard alt="Monday identity filmstrip" content={<FilmstripSlide />} bordered /> },
        { id: "3", content: <GalleryCard alt="Monday identity in use 6" src="/images/home/monday-gallery-e-3.jpg" bordered /> },
      ]}
    />
  );
}
