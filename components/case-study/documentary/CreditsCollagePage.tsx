import Image from "next/image";
import { ScrollFadeCard } from "@/components/case-study/primitives";

// Figma 126:5292 — four film-strip contact-sheet photos stacked edge to
// edge (no padding, no eyebrow/heading, matching this system's other
// full-bleed "gallery interlude" cards) — the negative-radius bleed
// Figma's own export uses to cover the card's own border with the image
// (left:-1px, w:440 against the card's own 440px frame) reduces to the
// same thing here: the image stack is a direct child of ScrollFadeCard,
// not CardBody, so nothing insets it.
//
// ScrollFadeCard, not the plain ImageCard every *other* gallery card in
// this project uses: these four photos' own literal aspect ratios add
// up to ~962px at a 440px-wide card — well past the 600px frame height
// — so this is the one gallery card that genuinely needs the scroll+
// fade safety net to see the bottom two photos, not a single image
// that always exactly fills its own box.
const PHOTOS = [
  { src: "/images/home/documentary-credits-1.jpg", alt: "A torn film-strip contact sheet with sound and music credits", ratio: "1960 / 1070" },
  { src: "/images/home/documentary-credits-2.jpg", alt: "\"Directed by Danijar Bíró\" credit card over a bicycle-wheel photo", ratio: "2206 / 1202" },
  { src: "/images/home/documentary-credits-3.jpg", alt: "\"Photography Mátyás Czeglédi\" credit card over an out-of-focus photo", ratio: "1884 / 1036" },
  { src: "/images/home/documentary-credits-4.jpg", alt: "Additional film-strip credit cards continuing the sequence", ratio: "439 / 240" },
] as const;

export default function CreditsCollagePage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <div className="flex w-full flex-col items-start">
        {PHOTOS.map(({ src, alt, ratio }) => (
          <div key={src} className="relative w-full shrink-0" style={{ aspectRatio: ratio }}>
            <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 480px) 440px, 100vw" />
          </div>
        ))}
      </div>
    </ScrollFadeCard>
  );
}
