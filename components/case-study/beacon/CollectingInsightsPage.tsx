import { Heading, BodyCopy, TextCard } from "@/components/case-study/primitives";

// Figma 98:2427 — same text-only card treatment as "First steps"
// (98:2390). Three paragraphs still land well inside the card's 600px
// budget (Figma's own text block is 360px tall against a 600px card),
// so there's nothing here that would ever actually need to scroll
// either — TextCard's own frame is enough, no ScrollFadeCard needed.
export default function CollectingInsightsPage() {
  return (
    <TextCard>
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
    </TextCard>
  );
}
