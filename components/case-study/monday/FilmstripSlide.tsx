import Image from "next/image";

// Figma 207:6165 — one carousel slide that's actually four photo crops
// laid out as a filmstrip wider than its own 512px frame (the four
// images together span ~640px, clipped by this frame's own
// overflow-hidden), the first and last crops deliberately bleeding off
// either edge rather than each image sitting fully inside it. Positions
// below are that literal composition (left/width in px against Figma's
// own 512px reference frame) converted to percentages of this slide's
// own box, so the same crop holds proportionally at whatever width the
// carousel actually renders at, not just 512px.
const IMAGES: { src: string; leftPct: number; widthPct: number }[] = [
  { src: "/images/home/monday-filmstrip-1.jpg", leftPct: (-71 / 512) * 100, widthPct: (159.9 / 512) * 100 },
  { src: "/images/home/monday-filmstrip-2.jpg", leftPct: (88 / 512) * 100, widthPct: (160 / 512) * 100 },
  { src: "/images/home/monday-filmstrip-3.jpg", leftPct: (248 / 512) * 100, widthPct: (160 / 512) * 100 },
  { src: "/images/home/monday-filmstrip-4.jpg", leftPct: (408 / 512) * 100, widthPct: (159.9 / 512) * 100 },
];

export function FilmstripSlide() {
  return (
    <div className="relative size-full">
      {IMAGES.map((img, i) => (
        <div key={i} className="absolute inset-y-0" style={{ left: `${img.leftPct}%`, width: `${img.widthPct}%` }}>
          <Image src={img.src} alt="" fill className="object-cover" sizes="160px" />
        </div>
      ))}
    </div>
  );
}
