import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 138:6103 — same three paragraphs the page-by-page carousel's
// own CollectingInsightsPage had, minus its own "Key findings" text
// list: that content is now KeyFindingsRow, its own browsable section
// further down the page, not a subsection stacked under this copy.
export default function CollectingInsights() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-2">
      <Heading size="section" className="tracking-[-0.8px]">
        Collecting insights
      </Heading>
      <div className="flex w-full flex-col gap-4">
        <BodyCopy>
          Once we aligned on a consistent visual language, I shifted my focus to understanding Beacon more deeply:
          how it worked, how people were using it, and where the experience was falling short.
        </BodyCopy>
        <BodyCopy>
          I had heard many perspectives from leadership and colleagues who had previously worked on the product, but
          I wanted to go beyond internal assumptions and hear directly from users. So I started interviewing existing
          Beacon users and confirm, build up the personas we build for.
        </BodyCopy>
        <BodyCopy>
          The first round of interviews revealed a clear pattern: people loved the concept of Beacon, but struggled
          with the experience. They described the product as outdated, found it difficult to navigate between stages
          and most importantly didn’t fully trust the AI-generated outputs they received.
        </BodyCopy>
      </div>
    </div>
  );
}
