import { CardRow } from "@/components/case-study/CardRow";
import { GalleryCard } from "@/components/case-study/monday/GalleryCard";

// Figma 207:6124 — no caption, 2 slides, both bordered (207:6165, 207:6126).
// Replaces an earlier 6-slide version (2 identity shots bookending 4 poster
// crops, see git history) — reported live, node by node: the two new images
// (a back-view product shot and a hanger shot, in that exact Figma order)
// replace the old identity pair, and all four poster slides were reported
// live as "remove these" (both the car-crane and ping-pong light/dark
// pairs) — this row is product photography only now, posters dropped
// entirely, not just visually hidden.
//
// Wrapped in a plain <div className="w-full"> — see GalleryD.tsx's own
// doc comment for the real bug this fixes (CardRow's full-bleed root
// landing at the wrong X entirely once it's a direct child of an
// `items-center` flex column, not just this file's own concern).
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

const SLIDES: { id: string; alt: string; src: string }[] = [
  { id: "1", alt: "Monday t-shirt, back view", src: "/images/home/monday-tee-back.jpg" },
  { id: "2", alt: "Monday t-shirt on a hanger", src: "/images/home/monday-tee-hanger.jpg" },
];

export default function GalleryE() {
  return (
    <div className="w-full">
      <CardRow
        ariaLabel="Monday identity in use, set two"
        cardWidth={512}
        gap={16}
        alignInset={ALIGN_INSET}
        centered
        items={SLIDES.map(({ id, alt, src }) => ({ id, content: <GalleryCard alt={alt} src={src} bordered /> }))}
      />
    </div>
  );
}
