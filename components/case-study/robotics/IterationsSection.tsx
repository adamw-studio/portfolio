import { Heading, BodyCopy, Exhibit } from "@/components/case-study/primitives";

// Figma 161:1641 — carries the old IterationsPage.tsx's own intro
// paragraph and its flow-diagram/gallery photo exhibits forward
// (captions verbatim), but this fetch drops the InsightTag/Divider/
// Finding structure entirely: no "Insights gained" tag, no two titled
// Findings — just one new full-bleed diagram (the hand-drawn "insights
// gained" illustration this rebuild adds) between the flow exhibit and
// the gallery one, then the two Findings' own copy flattened into a
// single plain paragraph plus the same muted total line. Text
// reproduced verbatim from this node, typo included ("kids experience
// with robotics") — not this file's own error to silently correct.
export default function IterationsSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section">Iterations</Heading>
      <BodyCopy>
        We conducted usability testing sessions throughout the project, allowing us to refine our designs iteratively
        based on user feedback. This approach ensured that our designs and decisions were thoroughly tested and
        validated, leading to improved product usability.
      </BodyCopy>
      <div className="flex w-full flex-col items-center gap-6">
        <Exhibit
          src="/images/home/robotics-iterations-flow.jpg"
          alt="A UX flow diagram mapping the robot-configuration screen's states and an interactive-components map, in white wireframe lines on black"
          caption="Prototypes were developed and iteratively improved, starting with the most complex flow, the robot configuration."
          height={350}
        />
        <Exhibit
          src="/images/home/robotics-insights-diagram-light.png"
          darkSrc="/images/home/robotics-insights-diagram-dark.png"
          alt="A hand-drawn diagram mapping the insights gained from testing"
          height={350}
          frame={false}
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <BodyCopy>
          This challenging flow was usability tested with kids experience with robotics, including remote testing
          with children whose first language was English and also for further flows, parents of kids without
          robotics experience were recruited via Facebook advertising.
        </BodyCopy>
        <BodyCopy muted>A total of 11 prototypes were tested by the end of the project.</BodyCopy>
      </div>
      <Exhibit
        src="/images/home/robotics-gallery-1.jpg"
        alt="Workshop notes and the robotics kit laid out on a table"
        caption="For live testing sessions with kids, we prepared food, drink and a little gift, which was a special part for your robotics kit - provided by the company"
        height={350}
      />
    </div>
  );
}
