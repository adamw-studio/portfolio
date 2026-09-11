import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 98:2390 — same bg-tertiary/border-disabled "quiet raised panel"
// treatment as the "How it started" card (96:2084), confirming that's
// this system's standard look for a text-only page, not a one-off. A
// plain aspect-ratio div, not ScrollFadeCard: at Figma's own 382-wide
// text column, the heading + both paragraphs comfortably fit inside the
// card's 600px budget with real room to spare (unlike "How it started"),
// so there's nothing here that would ever actually scroll. Same
// backdrop-blur-[16px] frosted-glass treatment too — see that file's own
// comment for why.
export default function FirstStepsPage() {
  return (
    <div
      className="flex w-full max-w-[440px] flex-col gap-6 overflow-hidden rounded-[20px] border border-border-disabled bg-bg-tertiary p-7 shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)] backdrop-blur-[16px]"
      style={{ aspectRatio: "440 / 600" }}
    >
      <Heading size="md">First steps</Heading>
      <div className="flex flex-col gap-6">
        <BodyCopy>
          When I took ownership of the product, it lacked a clear and consistent design direction. Several designers
          had contributed to it intermittently between client projects, resulting in fragmented pattern and
          experiences. My first priority was to create a structure and establish a stronger design foundation.
        </BodyCopy>
        <BodyCopy>
          I worked with leadership to align on extending the design system we had built for Orchestro across all
          three products. This gave us a shared foundation for implementing components, interaction patterns and
          experiences consistently across the product suite.
        </BodyCopy>
      </div>
    </div>
  );
}
