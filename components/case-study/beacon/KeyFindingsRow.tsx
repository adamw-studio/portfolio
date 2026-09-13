import { Eyebrow, SummaryCard } from "@/components/case-study/primitives";
import { CardRow } from "@/components/case-study/CardRow";

// Figma 138:6709/138:6708 — the same three findings the page-by-page
// carousel's own CollectingInsightsPage listed as a plain stacked text
// block (KEY_FINDINGS there), re-presented here as its own browsable row
// instead — this rebuild's "Collecting insights" section (below) now
// carries only its three intro paragraphs, with these findings promoted
// to a first-class row of their own rather than a subsection.
const KEY_FINDINGS = [
  {
    id: "framework-rigor",
    heading: "The framework helps with rigor but is a demo constraint",
    description:
      "The enforced sequencing was appreciated for preventing shortcuts and encouraging thorough exploration of the solution space, but for client demos the constraints (e.g., selection caps and step-by-step flows) can be perceives as arbitrary or overly “consultant-like”, killing client excitement.",
  },
  {
    id: "limited-editability",
    heading: "Limited editability and weak iterative refinement",
    description:
      "Users want the ability to “refine/regenerate” within components and work in an iterative manner; today, changes often require manual rewrite or restarting sections. When the tool over-indexes on one angle early, it is hard to steer it back without rework, which reduces efficiency gains.",
  },
  {
    id: "ux-cluttered",
    heading: "UX can feel cluttered; users lose the storyline",
    description:
      "Navigation and information density can make it hard to track how value pools, problems, and ventures connect and present to the client a coherent and persuasive story.",
  },
] as const;

// Same inset the page's own narrow 512px column centers itself with —
// see QuickReviewRow's own comment on why this is passed to CardRow
// instead of letting the row center itself as an independent block.
const ALIGN_INSET = "max(1rem, calc((100vw - 512px) / 2))";

export default function KeyFindingsRow() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="w-full max-w-[512px]" style={{ marginInline: "auto" }}>
        <Eyebrow>[ Key findings ]</Eyebrow>
      </div>
      <CardRow
        ariaLabel="Key findings from user research"
        cardWidth={300}
        alignInset={ALIGN_INSET}
        items={KEY_FINDINGS.map(({ id, heading, description }) => ({
          id,
          content: <SummaryCard heading={heading} description={description} />,
        }))}
      />
    </div>
  );
}
