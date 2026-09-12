import { Divider } from "@/components/Divider";
import { CardBody, Eyebrow, Heading, BodyCopy, ScrollFadeCard, InsightTag, Finding, Exhibit } from "@/components/case-study/primitives";

// Figma 122:4552 — a "[03]" step number, an intro paragraph and its own
// exhibit, a dashed divider, one round of "Insights gained" findings
// plus a muted total line, and a closing exhibit — no divider between
// the findings and that last exhibit, matching Figma exactly (unlike
// Beacon's "So, where are we now?", which dividers both rounds of
// findings symmetrically).
export default function IterationsPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <CardBody>
        <div className="flex flex-col gap-1">
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[03]</Eyebrow>
          <Heading size="md">Iterations</Heading>
        </div>
        <BodyCopy>
          We conducted usability testing sessions throughout the project, allowing us to refine our designs
          iteratively based on user feedback. This approach ensured that our designs and decisions were thoroughly
          tested and validated, leading to improved product usability.
        </BodyCopy>
        <Exhibit
          src="/images/home/robotics-iterations-flow.jpg"
          alt="A UX flow diagram mapping the robot-configuration screen's states and an interactive-components map, in white wireframe lines on black"
          caption="Prototypes were developed and iteratively improved, starting with the most complex flow, the robot configuration."
        />

        <Divider />

        <div className="flex w-full flex-col items-start gap-3">
          <InsightTag>Insights gained</InsightTag>
          <div className="flex w-full flex-col items-start gap-4">
            <Finding title="Testing with long-time users">
              <BodyCopy>
                This challenging flow was usability tested with kids experienced with robotics, including remote
                testing with children whose first language was English.
              </BodyCopy>
            </Finding>
            <Finding title="Potential first-time users">
              <BodyCopy>
                For further flows, parents of kids without robotics experience were recruited via Facebook
                advertising.
              </BodyCopy>
            </Finding>
            <BodyCopy muted>A total of 11 prototypes were tested by the end of the project.</BodyCopy>
          </div>
        </div>

        <Exhibit
          src="/images/home/robotics-gallery-1.jpg"
          alt="Workshop notes and the robotics kit laid out on a table"
          caption="For live testing sessions with kids, we prepared food, drink and a little gift, which was a special part for your robotics kit - provided by the company"
        />
      </CardBody>
    </ScrollFadeCard>
  );
}
