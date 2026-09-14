import Image from "next/image";

// Figma 166:3063 — the same four end-credit contact-sheet photos as the
// old page-by-page CreditsCollagePage.tsx, stacked edge to edge in
// their own real aspect ratios, but sized into this row's own fixed
// 300x400 gallery slot instead of that page's full 440x600 scrolling
// card: the stack's own combined height (~656px at 300px width) genuinely
// overflows this box, and Figma's own node clips it with a plain
// overflow-hidden rather than a scrollable card — a peek at the top of
// the stack, not the full sequence, matching this row's other cards
// (each a single static photo, nothing else here scrolls internally).
const PHOTOS = [
  { src: "/images/home/documentary-credits-1.jpg", alt: "A torn film-strip contact sheet with sound and music credits", ratio: "1960 / 1070" },
  { src: "/images/home/documentary-credits-2.jpg", alt: "\"Directed by Danijar Bíró\" credit card over a bicycle-wheel photo", ratio: "2206 / 1202" },
  { src: "/images/home/documentary-credits-3.jpg", alt: "\"Photography Mátyás Czeglédi\" credit card over an out-of-focus photo", ratio: "1884 / 1036" },
  { src: "/images/home/documentary-credits-4.jpg", alt: "Additional film-strip credit cards continuing the sequence", ratio: "439 / 240" },
] as const;

export default function CreditsCollageCard() {
  return (
    <div className="relative h-[400px] w-[300px] shrink-0 overflow-hidden rounded-[20px] bg-bg-tertiary">
      <div className="absolute left-0 top-0 flex w-full flex-col items-start">
        {PHOTOS.map(({ src, alt, ratio }) => (
          <div key={src} className="relative w-full shrink-0" style={{ aspectRatio: ratio }}>
            <Image src={src} alt={alt} fill className="object-cover" sizes="300px" />
          </div>
        ))}
      </div>
    </div>
  );
}
