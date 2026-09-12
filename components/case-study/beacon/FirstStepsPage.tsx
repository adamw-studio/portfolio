import { Eyebrow, Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

// Figma 114:3707 — a second org-chart diagram, same idea as "Where it
// started"'s own Portfolio/Beacon/I2I/Orchestro one but one level
// deeper: "Cosmos DS" (the foundational system) branching down into the
// three product-specific systems built on top of it, matching this
// card's own copy ("extending the design system... across all three
// products"). Real content, not a placeholder.
//
// The connector is a hand-rotated version of the same branching path
// "Where it started"'s own diagram uses, not a CSS transform: Figma's
// own source rotates a *portrait* copy of that path 90° to get this
// landscape one, but reproducing that literally means a rotated
// element's own layout box no longer matches its visual (painted)
// bounding box, which every position here is a percentage of — far
// simpler to pre-rotate the path's own coordinates once by hand
// (swap-and-mirror the original "M0 58.5H30…" logic for this diagram's
// own stem-to-span ratio) and place a single flat, unrotated SVG.
function DesignSystemDiagram() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-bg-tertiary" style={{ aspectRatio: "382 / 252" }}>
      <svg
        aria-hidden
        className="absolute"
        style={{ left: "15.71%", top: "36.11%", width: "67.15%", height: "27.18%" }}
        viewBox="0 0 257.5 68.5"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M130.5 0V30M130.5 30H257V68.5M130.5 30V68.5M130.5 30H0.5V68.5"
          stroke="var(--color-border-subtle)"
          strokeDasharray="8 8"
        />
      </svg>
      <span
        className="absolute flex items-center justify-center whitespace-nowrap rounded-full bg-bg-secondary px-2.5 py-1 font-sans text-[14px] leading-6 text-text-primary"
        style={{ left: "38.22%", top: "8.33%", width: "24.08%" }}
      >
        Cosmos DS
      </span>
      <Eyebrow style={{ position: "absolute", left: "29.58%", top: "22.22%", whiteSpace: "nowrap" }}>
        Foundational components
      </Eyebrow>
      <span
        className="absolute flex items-center justify-center whitespace-nowrap rounded-full bg-bg-secondary px-2.5 py-1 font-sans text-[14px] leading-6 text-text-primary"
        style={{ left: "4.71%", top: "67.86%", width: "22.25%" }}
      >
        Athena DS
      </span>
      <span
        className="absolute flex items-center justify-center whitespace-nowrap rounded-full bg-bg-secondary px-2.5 py-1 font-sans text-[14px] leading-6 text-text-primary"
        style={{ left: "40.31%", top: "67.86%", width: "19.63%" }}
      >
        Metis DS
      </span>
      <span
        className="absolute flex items-center justify-center whitespace-nowrap rounded-full bg-bg-secondary px-2.5 py-1 font-sans text-[14px] leading-6 text-text-primary"
        style={{ left: "69.11%", top: "67.86%", width: "25.92%" }}
      >
        Pantheon DS
      </span>
      <Eyebrow style={{ position: "absolute", left: "2.88%", top: "82.14%", width: "auto" }}>Beacon-specific</Eyebrow>
      <Eyebrow style={{ position: "absolute", left: "41.62%", top: "82.14%", width: "auto" }}>I2I-specific</Eyebrow>
      <Eyebrow
        style={{ position: "absolute", left: "82.2%", top: "86.9%", width: "auto", transform: "translate(-50%, -50%)" }}
      >
        Orchestro-specific
      </Eyebrow>
    </div>
  );
}

// Figma 105:3030 — this card's own redesign: a "[02]" step number above
// the heading (continuing "Where it started"'s own "[01]"), and the new
// design-system diagram appended after the copy. Same bg-tertiary-solid
// (opaque) card treatment as every other text card in this system —
// see HowItStartedPage's own comment for why it isn't bg-tertiary (5%
// alpha) + backdrop-blur any more.
//
// Now ScrollFadeCard, not the plain TextCard this page used before:
// the diagram's own 252px pushes the heading + step number + both
// paragraphs + diagram past the card's 600px budget (672px total),
// which fit without it when this page was still just text.
export default function FirstStepsPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <div className="flex flex-col gap-6 p-7">
        <div className="flex flex-col gap-1">
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[02]</Eyebrow>
          <Heading size="md">First steps</Heading>
        </div>
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
        <DesignSystemDiagram />
      </div>
    </ScrollFadeCard>
  );
}
