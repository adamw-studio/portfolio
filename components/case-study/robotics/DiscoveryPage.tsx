import { CardBody, Eyebrow, Heading, BodyCopy, ScrollFadeCard, InsightTag, Exhibit } from "@/components/case-study/primitives";

// Figma 122:4371 — a "[02]" step number, two intro paragraphs, then a
// single "Joining a live robotics session" finding (InsightTag +
// paragraph + two photo exhibits) — one round of findings, not two like
// "Iterations"/Beacon's "So, where are we now?", so there's no Divider
// before or after it.
//
// ScrollFadeCard directly, not TextCard: the two full-width 240px
// exhibits push this well past the card's 600px budget at every width.
export default function DiscoveryPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <CardBody>
        <div className="flex flex-col gap-1">
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[02]</Eyebrow>
          <Heading size="md">Discovery</Heading>
        </div>
        <div className="flex flex-col gap-6">
          <BodyCopy>
            Through discovery workshops and early research, we gained a deep understanding of the brand’s mission,
            business goals, and user needs.
          </BodyCopy>
          <BodyCopy>
            We conducted usability testing with kids aged 8–14 to evaluate the existing app, uncover pain points, and
            identify opportunities for improvement.
          </BodyCopy>
        </div>
        <div className="flex w-full flex-col items-start gap-3">
          <InsightTag>Joining a live robotics session</InsightTag>
          <div className="flex w-full flex-col items-start gap-3">
            <BodyCopy>
              We attended a live robotics session for kids over the weekend. Our goal was to sit down with the teams
              and learn firsthand how they’re using the kit and application together, ask questions about their
              experience, and identify areas for improvement.
            </BodyCopy>
            <Exhibit
              src="/images/home/robotics-discovery-kit.jpg"
              alt="A robotics kit's parts and cables laid out on a workshop table, ready for assembly"
              caption="Kids had a difficult time to follow the onboarding flow within the app"
            />
            <Exhibit
              src="/images/home/robotics-discovery-control.jpg"
              alt="Kids controlling an assembled robot with a phone, seen from above"
              caption="Kids loved navigation of the control center, but they were asking for a way to watch the robots through the screen"
            />
          </div>
        </div>
      </CardBody>
    </ScrollFadeCard>
  );
}
