import { Eyebrow } from "@/components/case-study/primitives";
import { CardRow } from "@/components/case-study/CardRow";
import { GalleryCard } from "@/components/case-study/monday/GalleryCard";

// Same free-scroll/drag/Prev-Next/dots row every other project page's
// own galleries already use (CardRow — see that file's own doc comment
// for why it replaced an earlier hard-paginated carousel here), just
// with this page's own landscape 512/300 cards instead of CardRow's
// usual portrait SummaryCard tiles. Slide 1 (207:5668) was empty in the
// design itself, reported live as wrong once a real video existed for
// it; slides 2-4 have real exported images, each supplied as a genuine
// light/dark pair (the wordmark/icon marks are white-on-dark and
// black-on-light versions of the same mark, not a color a CSS filter
// could derive), matching primitives.tsx's own Exhibit darkSrc
// convention.
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

const SLIDES: { id: string; alt: string; src?: string; darkSrc?: string; bordered?: boolean; video?: boolean }[] = [
  { id: "1", alt: "First round exploration 1", src: "/videos/monday/first-round-1.mp4", video: true, bordered: true },
  {
    id: "2",
    alt: "First round exploration 2",
    src: "/images/home/monday-first-round-2.png",
    darkSrc: "/images/home/monday-first-round-2-dark.png",
    bordered: true,
  },
  {
    id: "3",
    alt: "First round exploration 3",
    src: "/images/home/monday-first-round-3.png",
    darkSrc: "/images/home/monday-first-round-3-dark.png",
    bordered: true,
  },
  {
    id: "4",
    alt: "First round exploration 4",
    src: "/images/home/monday-first-round-4.png",
    darkSrc: "/images/home/monday-first-round-4-dark.png",
    bordered: true,
  },
];

export default function FirstRoundGallery() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full max-w-[512px]" style={{ marginInline: "auto" }}>
        <Eyebrow>[ First round ]</Eyebrow>
      </div>
      <CardRow
        ariaLabel="First round explorations"
        cardWidth={512}
        gap={16}
        alignInset={ALIGN_INSET}
        items={SLIDES.map(({ id, alt, src, darkSrc, bordered, video }) => ({
          id,
          content: <GalleryCard alt={alt} src={src} darkSrc={darkSrc} bordered={bordered} video={video} />,
        }))}
      />
    </div>
  );
}
