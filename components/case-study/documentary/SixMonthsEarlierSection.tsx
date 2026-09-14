import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 165:2773 — three paragraphs, each separated by a genuine
// blank-line paragraph in Figma's own text node, carried over verbatim
// from the old page-by-page SixMonthsEarlierPage.tsx.
export default function SixMonthsEarlierSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section">6 months earlier</Heading>
      <div className="flex flex-col gap-6">
        <BodyCopy>
          One day, my mom invited me to lunch. We started talking about her plans for her 60th birthday that autumn.
          She wanted to create a major catalogue of her work and organise a large exhibition. She had already done
          plenty of both, so I suggested something different. Something bigger.
        </BodyCopy>
        <BodyCopy>
          “Mom, what if we made a documentary about your career so far?” - She loved the idea. There was just one
          question: who could bring it to life?
        </BodyCopy>
        <BodyCopy>
          A close childhood friend of mine, Danijar Biro, is a director and video journalist. I reached out to him,
          and he enthusiastically took on the project. He assembled an incredible team, and together they created a
          remarkable 40-minute documentary celebrating my mom’s life, work and career so far.
        </BodyCopy>
      </div>
    </div>
  );
}
