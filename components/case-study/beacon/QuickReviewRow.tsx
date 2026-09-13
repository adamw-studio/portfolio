import { Eyebrow, SummaryCard } from "@/components/case-study/primitives";
import { CardRow } from "@/components/case-study/CardRow";

// Figma 136:6008/136:5942 — a six-card TL;DR of the whole page below,
// one card per section, browsable with the same scroll/scale/Prev-Next
// feel CaseStudyStage already established for this site's page-level
// carousels (see CardRow's own doc comment).
//
// Card 2's description is NOT what Figma's own node literally says —
// that node repeats card 1's exact text ("Became the first full-time
// designer, after 1.5 years building client projects at McKinsey.")
// verbatim under the "A fragmented product" heading, which doesn't
// describe that heading at all and is identical, word for word, to the
// card right next to it. Two adjacent cards landing on the exact same
// sentence isn't a legitimate content choice to reproduce — it reads as
// an unfinished copy-paste in the source file. Replaced with a line
// that actually summarizes this page's own "A fragmented product"
// section below, matching every other card's own pattern (a one-line
// distillation of its section, not a repeat of a neighbor).
const QUICK_REVIEW = [
  { id: "joining-orchestro", heading: "Joining Orchestro", description: "Became the first full-time designer, after 1.5 years building client projects at McKinsey." },
  { id: "fragmented-product", heading: "A fragmented product", description: "Took ownership of a product suite with no consistent design direction across it." },
  { id: "listening-to-users", heading: "Listening to users", description: "Interviews revealed people liked the concept, but didn’t trust the AI outputs." },
  { id: "vision-workshop", heading: "A vision workshop", description: "Led leadership in London to rethink what the next generation of Beacon should be." },
  { id: "meet-beam", heading: "Meet Beam", description: "Reimagined Beacon as a conversational, chat-led experience with an AI companion." },
  { id: "designing-whats-next", heading: "Designing what’s next", description: "Now prototyping how AI speed and human judgment work together in ideation." },
] as const;

// Same inset the page's own narrow 512px column centers itself with
// (Hero.tsx etc., via its parent's items-center) — passed to CardRow so
// its cards' own left edge lands on that exact same x instead of the
// row centering itself as an independent, wider block.
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

// The image slot's own asset, supplied after the initial build (when it
// was still Figma's own unfilled placeholder — see SummaryCard's doc
// comment): a small looping brand clip, authored as two separate
// exports ("Beacon-Dark"/"Beacon-Light" — the filenames are what say
// which theme each belongs to, there's no other metadata distinguishing
// them), not one clip meant to read correctly against either page
// background. Every card in this row shares the same pair — the six
// cards summarize six different beats of one project, not six different
// pieces of footage.
const QUICK_REVIEW_MEDIA = {
  light: "/videos/beacon/beacon-quick-review-light.mp4",
  dark: "/videos/beacon/beacon-quick-review-dark.mp4",
};

export default function QuickReviewRow() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full max-w-[512px]" style={{ marginInline: "auto" }}>
        <Eyebrow>[ Quick review ]</Eyebrow>
      </div>
      <CardRow
        ariaLabel="Quick review of the Beacon case study"
        cardWidth={301}
        alignInset={ALIGN_INSET}
        items={QUICK_REVIEW.map(({ id, heading, description }) => ({
          id,
          content: <SummaryCard heading={heading} description={description} media={QUICK_REVIEW_MEDIA} />,
        }))}
      />
    </div>
  );
}
