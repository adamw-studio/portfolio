import { Eyebrow } from "@/components/case-study/primitives";
import { CardRow } from "@/components/case-study/CardRow";
import GalleryPhoto from "@/components/case-study/documentary/GalleryPhoto";

// Figma 165:2984 ("[ Some work in-progress images ]") — six BTS/process
// photos in a browsable row, the same CardRow embedded-scroller Beacon's
// own Key findings row uses (cardWidth=300, matching this row's own
// literal 300x400 card size exactly rather than SummaryCard's).
//
// Five of these six photos are genuinely new to the project (sourced via
// download_assets on this node, saved under public/images/home/); the
// sixth (documentary-bts-outdoor.jpg) is a byte-identical re-export of a
// photo the old page-by-page carousel already used — confirmed via a
// pixel diff before reusing the existing file instead of saving a
// duplicate.
const IMAGES = [
  {
    id: "backlit-interview",
    src: "/images/home/documentary-bts-backlit-interview.jpg",
    alt: "Two crew members silhouetted against a bright window during an interview setup",
  },
  {
    id: "design-process-2",
    src: "/images/home/documentary-design-process-2.jpg",
    alt: "A laptop screen showing the poster design file open in editing software",
  },
  {
    id: "studio-conversation",
    src: "/images/home/documentary-bts-studio-conversation.jpg",
    alt: "Éva Köves and a crew member in conversation inside the sunlit studio",
  },
  {
    id: "notebook-sketch",
    src: "/images/home/documentary-notebook-sketch.jpg",
    alt: "A hand sketching in a notebook, an early stage of the poster design process",
  },
  {
    id: "bts-outdoor",
    src: "/images/home/documentary-bts-outdoor.jpg",
    alt: "The crew filming Éva Köves on a residential street during production",
  },
  {
    id: "window-portrait",
    src: "/images/home/documentary-window-portrait.jpg",
    alt: "Éva Köves looking out a window in soft afternoon light",
  },
] as const;

// Same inset-based centering as Beacon's own KeyFindingsRow — see that
// file's own comment for why this is passed to CardRow rather than
// letting the row center itself independently.
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

export default function WorkInProgressRow() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full max-w-[512px]" style={{ marginInline: "auto" }}>
        <Eyebrow>[ Some work in-progress images ]</Eyebrow>
      </div>
      <CardRow
        ariaLabel="Some work in-progress images"
        cardWidth={300}
        alignInset={ALIGN_INSET}
        items={IMAGES.map(({ id, src, alt }) => ({ id, content: <GalleryPhoto src={src} alt={alt} /> }))}
      />
    </div>
  );
}
