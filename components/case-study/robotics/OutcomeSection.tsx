import { Heading, BodyCopy, Exhibit } from "@/components/case-study/primitives";

// Figma 161:1979 — the old page-by-page OutcomePage.tsx's own intro
// paragraph and two library exhibits carry over verbatim (captions/alt
// text already matched this fetch word-for-word before this rebuild
// started), and so does its closing "In total, we tested..." paragraph
// and "By the end of the project" sub-heading. What's genuinely new: the
// old four-tile HIGHLIGHTS grid (Rewired IA / 10+ usability issues /
// Learning Mode / 100+ screens) is gone, replaced by one full-bleed
// hand-drawn diagram carrying the same four beats as a single flowchart
// — HIGHLIGHTS and its own Highlight tile component are dropped from
// this file entirely, not left dead alongside the new image.
export default function OutcomeSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section">Outcome</Heading>
      <BodyCopy>
        The outcome was a complete transformation of the app: a restructured information architecture, a refreshed
        UI and brand direction, and a cohesive design system to support future scalability.
      </BodyCopy>
      <div className="flex w-full flex-col items-center gap-6">
        <Exhibit
          src="/images/home/robotics-outcome-library-1.jpg"
          alt="A grid of design-system component variants: card layouts with motor and sensor controls in different states"
          caption="I’ve created a comprehensive design library that helped engineers continue to work on implementing new features in the future."
          height={350}
        />
        <Exhibit
          src="/images/home/robotics-outcome-library-2.jpg"
          alt="Filter panels and phone-screen mockups showing the app's Learning Mode and coding screens"
          height={350}
        />
      </div>
      <BodyCopy>
        In total, we tested our designs with 45 kids, ensuring the final product was not only intuitive and fun but
        also genuinely empowering for young users learning to build and code robots on their own.
      </BodyCopy>
      <p className="w-full font-sans text-[16px] font-semibold leading-6 text-text-primary">By the end of the project</p>
      <Exhibit
        src="/images/home/robotics-outcome-diagram-light.png"
        darkSrc="/images/home/robotics-outcome-diagram-dark.png"
        alt="A hand-drawn flowchart: rewired IA of the app, 10+ usability issues fixed, a new Learning Mode feature to get quick help, and 100+ screens designed in Figma"
        height={350}
        frame={false}
      />
    </div>
  );
}
