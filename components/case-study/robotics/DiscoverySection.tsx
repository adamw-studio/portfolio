import { Heading, BodyCopy, Exhibit } from "@/components/case-study/primitives";

// Figma 161:1637 — same two intro paragraphs and two photo exhibits as
// the old page-by-page DiscoveryPage.tsx (assets/captions carried over
// verbatim), but this fetch drops that page's own "Joining a live
// robotics session" InsightTag/sub-heading wrapper entirely — just the
// two paragraphs, then the two images directly beneath, confirmed
// against this node rather than assumed kept. height=350 (not the old
// page's 240): this rebuild's own exhibits are drawn taller here,
// matching Figma's own h-[350px] boxes for both images.
export default function DiscoverySection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section">Discovery</Heading>
      <div className="flex w-full flex-col gap-4">
        <BodyCopy>
          Through discovery workshops and early research, we gained a deep understanding of the brand’s mission,
          business goals, and user needs.
        </BodyCopy>
        <BodyCopy>
          We conducted usability testing with kids aged 8–14 to evaluate the existing app, uncover pain points, and
          identify opportunities for improvement.
        </BodyCopy>
      </div>
      <div className="flex w-full flex-col items-center gap-6">
        <Exhibit
          src="/images/home/robotics-discovery-kit.jpg"
          alt="A robotics kit's parts and cables laid out on a workshop table, ready for assembly"
          caption="Kids had a difficult time to follow the onboarding flow within the app"
          height={350}
        />
        <Exhibit
          src="/images/home/robotics-discovery-control.jpg"
          alt="Kids controlling an assembled robot with a phone, seen from above"
          caption="Kids loved navigation of the control center, but they were asking for a way to watch the robots through the screen"
          height={350}
        />
      </div>
    </div>
  );
}
