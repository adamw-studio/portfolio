import { CardBody, Eyebrow, Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";
import { YouTubeFacade } from "@/components/YouTubeFacade";

// Figma 126:5254 — a "[11]" step number (the last narrative card, after
// the photo-gallery interlude), a synopsis in three paragraphs, and a
// click-to-load trailer embed. Reuses YouTubeFacade (already built for
// this exact project's own trailer, DocumentaryCaseStudy's original
// long-scroll version) rather than reproducing Figma's own static
// play-button placeholder as a dead image — the facade already shows
// the real video's own thumbnail with an identical play affordance at
// rest, and swaps in the actual embed on click.
//
// aspect-[382/280]: Figma's own literal h-280 against this card's own
// 382px content width (440 minus this card's own 28px padding on each
// side) — same "convert a fixed height at a reference width into a
// ratio" technique every other image/video block in this system uses.
//
// ScrollFadeCard directly, not TextCard: three paragraphs plus a 280px
// video land well past the card's 600px budget at every width.
export default function WatchTeaserPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <CardBody>
        <div className="flex flex-col gap-1">
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[11]</Eyebrow>
          <Heading size="md">Watch teaser</Heading>
        </div>
        <div className="flex flex-col gap-6">
          <BodyCopy>
            Symphony of Disorder is a retrospective cinematic journey through the life and work of sensitive painter
            Éva Köves, reflecting the cultural and social transformations of post-socialist Hungary.
          </BodyCopy>
          <BodyCopy>
            After graduating in 1989, she entered a new chapter in her life, a personal turning point that coincided
            with the beginning of a profound transformation in the country’s social structures.
          </BodyCopy>
          <BodyCopy>
            Through her art and career, the hopes, illusions, and dilemmas of the 1990s come into focus, evoking the
            fragile balance between historical change and personal transformation.
          </BodyCopy>
        </div>
        <YouTubeFacade videoId="0xcBtP-4AYY" title="Symphony of Disorder — trailer" wrapperClassName="w-full aspect-[382/280] rounded-xl" />
      </CardBody>
    </ScrollFadeCard>
  );
}
