import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 166:3047 — two paragraphs, separated by a genuine blank-line
// paragraph in Figma, carried over verbatim from the old page-by-page
// ContributionPage.tsx.
export default function ContributionSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section">Contribution to the project</Heading>
      <div className="flex flex-col gap-6">
        <BodyCopy>
          I contributed to the project by designing the film’s poster and developing the typography system that
          aligned with the documentary’s visual language.
        </BodyCopy>
        <BodyCopy>
          Additionally, I organised the premiere event, which was held at the renowned Ludwig Museum in Hungary.
        </BodyCopy>
      </div>
    </div>
  );
}
