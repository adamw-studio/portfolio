import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 138:6777 — same three paragraphs the page-by-page carousel's
// own ReflectionPage had, minus its own "Some questions that drove the
// workshop" sticky-note collage: this rebuild's re-fetch shows those
// same five notes as their own standalone section further down the
// page (QualityTiles), not nested under this copy.
export default function Reflection() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-2">
      <Heading size="section" className="tracking-[-0.8px]">
        Reflection on user’s feedback
      </Heading>
      <div className="flex w-full flex-col gap-4">
        <BodyCopy>
          After the interviews, we shared our findings with leadership and aligned on the need for a clear plan to
          turn these insights into action. I was invited to London to prepare and lead a workshop with the
          leadership team.
        </BodyCopy>
        <BodyCopy>
          Rather than jumping straight into features and solutions, I designed the session to push us beyond our
          usual ways of thinking and focus on bigger question: What should the next generation of Beacon become?
        </BodyCopy>
        <BodyCopy>
          The goal was to define a shared product vision, one that addressed the challenges we heard from users
          while also responding to shifts in the market and the rapidly evolving possibilities of AI.
        </BodyCopy>
      </div>
    </div>
  );
}
