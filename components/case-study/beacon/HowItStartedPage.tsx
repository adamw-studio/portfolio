import { Eyebrow, Heading, BodyCopy, Media, ScrollFadeCard } from "@/components/case-study/primitives";

// Figma 105:3001 — this card's own redesign: "How it started" retitled
// "Where it started" with a "[01]" step number above it, the image
// moved from after the copy to right after the heading, and the old
// gallery-with-inert-arrows (97:2131/CaseStudyImagePlaceholder) dropped
// for a single plain placeholder box instead. Figma's own fill for that
// box is a busy teal/white noise-and-linework graphic, not a real
// screenshot of anything Beacon-shaped — same tell as this card's own
// former gallery slot (ship no actual images yet rather than
// fabricating content), so this stays a plain Media placeholder rather
// than reproducing that texture as if it were real.
//
// bg-tertiary/border-disabled + backdrop-blur-[16px] card treatment,
// unchanged from before this redesign.
//
// Still ScrollFadeCard: heading + step number + the now-bigger 240px
// image + both paragraphs land well past the card's 600px budget
// (709px by Figma's own block heights) — more overflow than before,
// if anything, now that the image sits above the copy instead of a
// smaller gallery slot below it.
export default function HowItStartedPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)] backdrop-blur-[16px]"
    >
      <div className="flex flex-col gap-6 p-7">
        <div className="flex flex-col gap-1">
          {/* Tabular + lining + slashed-zero numerals (Figma's own
              font-feature-settings) — keeps "01" reading as a clean step
              number rather than an italic word, and stays correct once
              a later page needs "10" without the digits shifting width. */}
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[01]</Eyebrow>
          <Heading size="md">Where it started</Heading>
        </div>
        <Media ratio="382/240" />
        <div className="flex flex-col gap-6">
          <BodyCopy weight="medium">
            After 1.5 years of working on client business-building projects at McKinsey, I joined Orchestro (formerly
            LINK) as its first full-time designer. Orchestro is an internal B2B platform that helps businesses define
            and track their goals, consolidate information into a unified view, and uncover bottlenecks and
            opportunities through AI-powered insights.
          </BodyCopy>
          <BodyCopy weight="medium">
            Over time, the team went through significant changes. Six months ago, two additional products - Beacon
            and I2I - joined the Orchestro portfolio. With three products and two designers on the team, we divided
            ownership across the product suite and I took on the role of Lead Designer for Beacon and stayed as
            co-designer for Orchestro.
          </BodyCopy>
        </div>
      </div>
    </ScrollFadeCard>
  );
}
