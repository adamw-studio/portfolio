import { Eyebrow, Heading, BodyCopy, TextCard } from "@/components/case-study/primitives";

// Figma 126:5268 — a "[04]" step number and two paragraphs separated by
// a genuine blank-line paragraph in Figma (unlike Context's own two
// adjacent paragraphs), reproduced as two BodyCopy elements in a gap-6
// column. Plain TextCard: both paragraphs land comfortably inside the
// card's 600px budget at Figma's own 440px desktop width.
export default function ContributionPage() {
  return (
    <TextCard>
      <div className="flex flex-col gap-1">
        <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[04]</Eyebrow>
        <Heading size="md">Contribution to the project</Heading>
      </div>
      <div className="flex flex-col gap-6">
        <BodyCopy>
          I contributed to the project by designing the film’s poster and developing the typography system that
          aligned with the documentary’s visual language.
        </BodyCopy>
        <BodyCopy>
          Additionally, I organised the premiere event, which was held at the renowned Ludwig Museum in Hungary.
        </BodyCopy>
      </div>
    </TextCard>
  );
}
