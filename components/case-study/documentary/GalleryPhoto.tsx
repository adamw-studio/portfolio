import Image from "next/image";

// Figma's own repeated "h-[400px] w-[300px] rounded-[20px]" gallery-card
// shape, used by both the "Some work in-progress images" and
// "Contributions" CardRow rows below — a fixed 300x400 photo tile, not
// this system's other 440x600 ImageCard (that one is a full page-by-page
// carousel slide; these sit inside an embedded horizontal CardRow, the
// same relationship SummaryCard has to Beacon's own Key findings row).
export default function GalleryPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-[400px] w-[300px] shrink-0 overflow-hidden rounded-[20px] bg-bg-tertiary">
      <Image src={src} alt={alt} fill className="object-cover" sizes="300px" />
    </div>
  );
}
