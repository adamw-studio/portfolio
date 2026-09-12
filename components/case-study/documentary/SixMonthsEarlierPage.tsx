import { Eyebrow, Heading, BodyCopy, TextCard } from "@/components/case-study/primitives";

// Figma 126:5248 — a "[02]" step number and three paragraphs, each
// separated by a genuine blank-line paragraph in Figma's own text node
// (unlike Context's own two adjacent paragraphs) — reproduced as three
// separate BodyCopy elements in a gap-6 column, this system's own
// established pattern for that blank-line spacing. Plain TextCard: all
// three paragraphs land inside the card's 600px budget at Figma's own
// 440px desktop width.
export default function SixMonthsEarlierPage() {
  return (
    <TextCard>
      <div className="flex flex-col gap-1">
        <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[02]</Eyebrow>
        <Heading size="md">6 months earlier</Heading>
      </div>
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
    </TextCard>
  );
}
