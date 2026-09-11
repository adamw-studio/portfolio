import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 98:2427 — same text-only card treatment as "First steps"
// (98:2390): a plain aspect-ratio div, not ScrollFadeCard. Three
// paragraphs still land well inside the card's 600px budget (Figma's
// own text block is 360px tall against a 600px card), so there's
// nothing here that would ever actually need to scroll either. Same
// backdrop-blur-[16px] frosted-glass treatment too — see HowItStarted-
// Page's own comment for why.
export default function CollectingInsightsPage() {
  return (
    <div
      className="flex w-full max-w-[440px] flex-col gap-6 overflow-hidden rounded-[20px] border border-border-disabled bg-bg-tertiary p-7 shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)] backdrop-blur-[16px]"
      style={{ aspectRatio: "440 / 600" }}
    >
      <Heading size="md">Collecting insights</Heading>
      <div className="flex flex-col gap-6">
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
