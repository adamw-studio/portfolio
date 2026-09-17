import { CardRow } from "@/components/case-study/CardRow";
import { GalleryCard } from "@/components/case-study/monday/GalleryCard";

// Figma 207:6124/207:6125 — no caption, 4 slides, all bordered, in the
// row's own native order: 207:6165, 207:6126, 207:6163, 217:6587.
// Replaces an earlier 6-slide version (2 identity shots bookending 4
// separately-exported poster crops, see git history) — reported live,
// node by node: the first two slides here (a back-view product shot and
// a hanger shot) replaced the old identity pair, and the 4 separate
// poster slides were reported live as "remove these" (both the
// car-crane and ping-pong light/dark pairs, shown zoomed-in).
//
// Slide 3 (207:6163) looks like 4 more poster panels but is a single
// exported asset (2048x1200, exactly 512:300 — no cropping needed) —
// confirmed live via AskUserQuestion after the poster removal made this
// look like a regression: the user clarified "it is one image that I
// shared (within that shows 4), but it is 1". Not a reintroduction of
// the removed per-poster slides; it's Figma's own flattened export of
// that same layout as one flat card image, added back as ONE slide.
//
// Slide 4 is a plain single image (a tote bag on a stand) — get_screenshot
// on 217:6587 earlier returned a misleadingly-cropped sliver (clipped by
// the row's own scroll-offset ancestor at fetch time); get_design_context
// returns the correct full, uncropped export. The image itself is now
// 220:6622's tighter crop of that same photo, not 217:6587's — reported
// live: both nodes render the identical photo (217:6587 wider, 220:6622
// tighter), and the tighter crop should replace this slide's image
// in place rather than being appended as a 5th slide.
//
// Both poster.jpg (slide 3) and tote-bag.jpg (slide 4) are re-saved
// through Pillow instead of sips — sips carried over odd EXIF/density
// metadata from the Figma PNG export (288 dpi, a garbled TIFF resolution
// block) that made Chromium's <img> loader hang indefinitely on the
// Next.js image-optimizer's resized output while curl/fetch/
// createImageBitmap all decoded the same bytes fine — a real, narrow
// bug, confirmed by reproducing it, then fixing it by stripping that
// metadata, not by the routine "stale dev cache" explanation that fit
// every earlier false alarm like it this session.
//
// Wrapped in a plain <div className="w-full"> — see GalleryD.tsx's own
// doc comment for the real bug this fixes (CardRow's full-bleed root
// landing at the wrong X entirely once it's a direct child of an
// `items-center` flex column, not just this file's own concern).
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

const SLIDES: { id: string; alt: string; src: string }[] = [
  { id: "1", alt: "Monday t-shirt, back view", src: "/images/home/monday-tee-back.jpg" },
  { id: "2", alt: "Monday t-shirt on a hanger", src: "/images/home/monday-tee-hanger.jpg" },
  { id: "3", alt: "Monday posters", src: "/images/home/monday-poster-filmstrip.jpg" },
  { id: "4", alt: "Monday tote bag", src: "/images/home/monday-tote-bag.jpg" },
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
