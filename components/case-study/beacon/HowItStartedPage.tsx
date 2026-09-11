import { CaseStudyImagePlaceholder } from "@/components/CaseStudyImagePlaceholder";
import { Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

// Figma 96:2084 — unlike the Overview cover (87:1442), this card's own
// bg/border/text tokens map exactly onto this project's real
// --color-bg-tertiary/border-disabled/text-primary values (not a
// coincidence: compare app/globals.css's dark-theme block), so it uses
// this system's shared theme classes directly rather than the Overview
// page's fixed literals. bg-tertiary + border-disabled specifically —
// not bg-default/border-subtle — reads as a quiet raised panel sitting
// on the page's own background rather than a second opaque surface;
// same pairing Nav's own segmented control already uses for its
// "elevated" look. backdrop-blur-[16px] on top of that (not in the
// original Figma export, reported live as wanting the card to read as
// smooth glass rather than the page's own dot grid bleeding through its
// translucent fill sharply) — same "frosted panel over busy content"
// technique as BeaconComposer's own glass panel, just a gentler blur
// for a full card surface rather than a small floating control.
//
// ScrollFadeCard, not a plain div: the heading + both paragraphs + the
// placeholder gallery add up to comfortably more than the card's own
// 600px budget (Figma's own 96:2092 — a blurred strip pinned to the
// card's last 40px — is that same "content runs past the card" tell,
// just solved there with a static mask instead of a real scroll).
//
// aspectRatio: "440 / 600", the same formula OverviewPage's own card
// sizes itself by — not a flat max-height. Both cards sit side by side
// in the same filmstrip (CaseStudyStage) and need to shrink together by
// identical math as the viewport narrows; a max-height cap doesn't
// track width at all, which is what let this card render visibly
// shorter than the one beside it once its own width dropped below
// literal 440px — reported live.
export default function HowItStartedPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)] backdrop-blur-[16px]"
    >
      <div className="flex flex-col gap-6 p-7">
        <Heading size="md">How it started</Heading>
        <div className="flex flex-col gap-6">
          <BodyCopy>
            After 1.5 years of working on client business-building projects at McKinsey, I joined Orchestro (formerly
            LINK) as its first full-time designer. Orchestro is an internal B2B platform that helps businesses define
            and track their goals, consolidate information into a unified view, and uncover bottlenecks and
            opportunities through AI-powered insights.
          </BodyCopy>
          <BodyCopy>
            Over time, the team went through significant changes. Six months ago, two additional products - Beacon
            and I2I - joined the Orchestro portfolio. With three products and two designers on the team, we divided
            ownership across the product suite and I took on the role of Lead Designer for Beacon and stayed as
            co-designer for Orchestro.
          </BodyCopy>
        </div>
        <CaseStudyImagePlaceholder width={382} height={240} />
      </div>
    </ScrollFadeCard>
  );
}
