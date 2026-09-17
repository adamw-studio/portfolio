import { CardRow } from "@/components/case-study/CardRow";
import { GalleryCard } from "@/components/case-study/monday/GalleryCard";

// Figma 207:6124/207:6165 — no caption, 6 slides now, all bordered.
// Reported live as "a huge bug": the middle Figma node (207:6165) reads
// on the canvas as four narrow ~160px photo crops composited into one
// filmstrip, and an earlier pass (FilmstripSlide.tsx, now deleted)
// built exactly that literally. But each of those four "crops" is
// actually its own complete, finished poster (a Monday wordmark, a
// full photo in its own oval frame, a red decorative border, and a
// tagline) — cropping any one of them down to a 160px sliver inside a
// 512px card doesn't show "part of a filmstrip," it destroys the
// poster (the tagline unreadable, most of the photo cropped away).
// What Figma's own canvas shows as an overlapping crop collage is a
// preview composition, not the intended per-slide result — the four
// posters render here as four separate full slides instead, the same
// "one image, one full legible card" shape every other slide on this
// page already uses.
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

const SLIDES: { id: string; alt: string; src: string }[] = [
  { id: "1", alt: "Monday identity in use 5", src: "/images/home/monday-gallery-e-1.jpg" },
  { id: "2", alt: "Monday poster 1", src: "/images/home/monday-filmstrip-1.jpg" },
  { id: "3", alt: "Monday poster 2", src: "/images/home/monday-filmstrip-2.jpg" },
  { id: "4", alt: "Monday poster 3", src: "/images/home/monday-filmstrip-3.jpg" },
  { id: "5", alt: "Monday poster 4", src: "/images/home/monday-filmstrip-4.jpg" },
  { id: "6", alt: "Monday identity in use 6", src: "/images/home/monday-gallery-e-3.jpg" },
];

export default function GalleryE() {
  return (
    <CardRow
      ariaLabel="Monday identity in use, set two"
      cardWidth={512}
      gap={16}
      alignInset={ALIGN_INSET}
      centered
      items={SLIDES.map(({ id, alt, src }) => ({ id, content: <GalleryCard alt={alt} src={src} bordered /> }))}
    />
  );
}
