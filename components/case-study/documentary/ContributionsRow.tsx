import { Eyebrow } from "@/components/case-study/primitives";
import { CardRow } from "@/components/case-study/CardRow";
import GalleryPhoto from "@/components/case-study/documentary/GalleryPhoto";
import CreditsCollageCard from "@/components/case-study/documentary/CreditsCollageCard";

// Figma 166:3058 ("[ Contributions ]") — the second of this page's two
// CardRow galleries. Its own second slot is the four-photo end-credits
// collage (CreditsCollageCard, carried over from the old page-by-page
// CreditsCollagePage.tsx) rather than a plain photo.
//
// Figma's own last slot here (166:3067) is the same stacked image pair
// as the first row's own last card, which reproduced faithfully meant
// the identical window-portrait photo closing out both rows — reported
// live as one too many, so this row's own copy of it is dropped; the
// photo still closes the first row (WorkInProgressRow.tsx).
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

export default function ContributionsRow() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full max-w-[512px]" style={{ marginInline: "auto" }}>
        <Eyebrow>[ Contributions ]</Eyebrow>
      </div>
      <CardRow
        ariaLabel="Contributions to the project"
        cardWidth={300}
        alignInset={ALIGN_INSET}
        items={[
          {
            id: "stairwell",
            content: (
              <GalleryPhoto
                src="/images/home/documentary-bts-stairwell.jpg"
                alt="Two crew members on a stairwell, backlit by a window"
              />
            ),
          },
          { id: "credits-collage", content: <CreditsCollageCard /> },
          {
            id: "stairwell-2",
            content: (
              <GalleryPhoto
                src="/images/home/documentary-bts-stairwell-2.jpg"
                alt="A crew member descending a stairwell, backlit by a window"
              />
            ),
          },
          {
            id: "studio-conversation-2",
            content: (
              <GalleryPhoto
                src="/images/home/documentary-bts-studio-conversation-2.jpg"
                alt="Éva Köves and a crew member talking in the studio doorway"
              />
            ),
          },
          {
            id: "design-process-3",
            content: (
              <GalleryPhoto
                src="/images/home/documentary-design-process-3.jpg"
                alt="A laptop screen showing typography options during the design process"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
