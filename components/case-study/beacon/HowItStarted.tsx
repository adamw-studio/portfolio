import { Heading, BodyCopy, Exhibit } from "@/components/case-study/primitives";

// The hand-built pill+arrow diagram this file used to render (three
// separate hand-drawn stroke SVGs fanning from a "Portfolio" pill down
// to Beacon/I2I/Orchestro, on a staggered reveal) is replaced by a
// single flat exhibit image on direct instruction: "change the image
// placeholder here... two versions, one for light theme and one for
// dark theme." Two real theme-specific exports (transparent PNGs — dark
// ink for light theme, light ink for dark theme), not the previous
// single-asset-plus-invert-filter approach, since a plain CSS invert
// wouldn't have been needed here either way (the old strokes were
// already single-color) — this is a wholesale illustration swap, not a
// re-theme of the old one.
export default function HowItStarted() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-2">
      <Heading size="section" className="tracking-[-0.8px]">
        How it started
      </Heading>
      <div className="flex w-full flex-col gap-4">
        <BodyCopy>
          After 1.5 years of working on client business-building projects at McKinsey, I joined Orchestro (formerly
          LINK) as its first full-time designer. Orchestro is an internal B2B platform that helps businesses define
          and track their goals, consolidate information into a unified view, and uncover bottlenecks and
          opportunities through AI-powered insights.
        </BodyCopy>
        <BodyCopy>
          Six months ago, two additional products - Beacon and I2I - joined the Orchestro portfolio. With three
          products and two designers on the team, we divided ownership across the product suite and I took on the
          role of Lead Designer for Beacon and stayed as co-designer for Orchestro.
        </BodyCopy>
        <Exhibit
          src="/images/home/beacon-portfolio-diagram-light.png"
          darkSrc="/images/home/beacon-portfolio-diagram-dark.png"
          alt="Diagram showing Portfolio fanning out into three products: Beacon, I2I, and Orchestro"
          frame={false}
        />
      </div>
    </div>
  );
}
