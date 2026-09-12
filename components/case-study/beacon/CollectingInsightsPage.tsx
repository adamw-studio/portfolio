import { Divider } from "@/components/Divider";
import { Eyebrow, Heading, BodyCopy, TextCard } from "@/components/case-study/primitives";

// A single research finding (Figma 115:3788 etc.) — a bold title with a
// muted description directly beneath it, no gap between them (the list
// of three findings gets its own gap-4 instead). Kept local rather than
// a new primitive until a second page actually needs this exact shape;
// BodyCopy already covers the muted description half, the bold title
// has no shared equivalent yet.
function KeyFinding({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex w-full flex-col items-start">
      <p className="font-sans text-[14px] font-semibold leading-6 tracking-[-0.112px] text-text-primary">{title}</p>
      <BodyCopy muted>{description}</BodyCopy>
    </div>
  );
}

const KEY_FINDINGS: { title: string; description: string }[] = [
  {
    title: "The framework helps with rigor but is a demo constraint",
    description:
      "The enforced sequencing was appreciated for preventing shortcuts and encouraging thorough exploration of the solution space, but for client demos the constraints (e.g., selection caps and step-by-step flows) can be perceives as arbitrary or overly “consultant-like”, killing client excitement.",
  },
  {
    title: "Limited editability and weak iterative refinement",
    description:
      "Users want the ability to “refine/regenerate” within components and work in an iterative manner; today, changes often require manual rewrite or restarting sections. When the tool over-indexes on one angle early, it is hard to steer it back without rework, which reduces efficiency gains.",
  },
  {
    title: "UX can feel cluttered; users lose the storyline",
    description:
      "Navigation and information density can make it hard to track how value pools, problems, and ventures connect and present to the client a coherent and persuasive story.",
  },
];

// Figma 105:3089 — a "[03]" step number (continuing "Where it started"/
// "First steps"'s own [01]/[02]), and a new "Key findings" section
// appended after the same three paragraphs this page already had,
// separated by the same dashed hairline the site already uses
// elsewhere (Divider.tsx) rather than reproducing Figma's own literal
// export of that exact line as a one-off asset.
export default function CollectingInsightsPage() {
  return (
    <TextCard>
      <div className="flex flex-col gap-1">
        <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[03]</Eyebrow>
        <Heading size="md">Collecting insights</Heading>
      </div>
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
      <Divider />
      <div className="flex flex-col gap-4">
        <Heading size="section">Key findings</Heading>
        <div className="flex flex-col gap-4">
          {KEY_FINDINGS.map(({ title, description }) => (
            <KeyFinding key={title} title={title} description={description} />
          ))}
        </div>
      </div>
    </TextCard>
  );
}
