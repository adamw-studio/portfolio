import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 206:5260.
export default function InsightsSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section" className="tracking-[-0.16px]">
        Insights
      </Heading>
      <BodyCopy>
        Creative collectives rarely have a single fixed expression. Their identity comes from the tension between
        different people, disciplines and ideas coming together. Rather than creating a conventional identity based
        on consistency alone, the opportunity was to build recognition through a small number of strong visual
        ingredients that could constantly be rearranged. The identity could behave more like a creative toolkit than
        a rigid set of brand rules.
      </BodyCopy>
    </div>
  );
}
