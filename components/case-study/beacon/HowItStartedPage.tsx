import { Eyebrow, Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

// Figma 114:3662 — a small org-chart-style diagram: "Portfolio" branching
// into the three products it actually held at this point in the story
// (Beacon, I2I, Orchestro), matching the copy below it almost word for
// word ("two additional products... joined the Orchestro portfolio").
// Real content, not a placeholder like the noise-texture graphic this
// slot used to hold — literal Figma layout, but every position is a
// percentage of this box's own 382x240 frame (not the literal px),
// since the whole thing scales as one unit with the card's own width
// below 472px viewports (CaseStudyStage's own LANE_WIDTH), the same
// technique OverviewPage's own screenshot-crop already uses.
//
// bg-bg-tertiary (translucent), not -solid: this box's own parent card
// is already fully opaque (bg-tertiary-solid), so there's no page
// background left for a translucent tint to leak through here — the
// dot-bleed problem that forced -solid onto the *card* itself doesn't
// apply to something nested safely inside it.
//
// [container-type:inline-size] + clamp(...cqw...) font-size: this
// diagram's own pills held up fine at every width tested before the
// mobile carousel-peek fix narrowed cards further, but "First steps"'s
// own denser diagram broke badly at that new width with the exact same
// fixed-14px-text-in-a-shrinking-pill construction — see that file's
// own doc comment for the full reasoning. Applying the same fix here
// too rather than waiting for this one to visibly break the same way.
const LABEL_FONT_SIZE = "clamp(10px,3.66cqw,14px)";

const PORTFOLIO_PRODUCTS = [
  { label: "Beacon", top: "19.17%", color: "#00a2c2" }, // this site's own established teal accent (globals.css's own comment on why it's a literal, not a token)
  { label: "I2I", top: "43.33%", color: "#6458c3" },
  { label: "Orchestro", top: "67.5%", color: "#007bff" }, // same blue BeaconComposer's own send button already uses
] as const;

function PortfolioDiagram() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-bg-tertiary [container-type:inline-size]">
      {/* Figma's own connector (Vector 11) — a plain dashed branch from
          one point to three, exported as a single path. border-subtle,
          not the literal rgba(244,244,244,0.1) Figma's export hardcodes:
          that literal *is* border-subtle's own dark-theme value (compare
          globals.css), and the token is what actually inverts correctly
          in light theme instead of staying a dark-only line. */}
      <svg
        aria-hidden
        className="absolute"
        style={{ left: "37.43%", top: "25.83%", width: "17.93%", height: "48.54%" }}
        viewBox="0 0 68.5 117.5"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 58.5H30M30 58.5V0.5H68.5M30 58.5H68.5M30 58.5V117H68.5"
          stroke="var(--color-border-subtle)"
          strokeDasharray="8 8"
        />
      </svg>
      <span
        className="absolute flex items-center justify-center whitespace-nowrap rounded-full bg-bg-secondary px-[0.7em] py-[0.3em] font-sans leading-6 text-text-primary"
        style={{ left: "17.8%", top: "43.33%", minWidth: "18.32%", fontSize: LABEL_FONT_SIZE }}
      >
        Portfolio
      </span>
      {/* text-[#f4f4f4], not the theme-flipping text-text-primary: these
          three pills keep their own fixed saturated fill regardless of
          site theme (same reasoning OverviewPage's own always-dark cover
          gives its text a fixed literal), so the label needs to stay
          light against them either way rather than flipping to dark text
          on a bright color in light theme. */}
      {PORTFOLIO_PRODUCTS.map(({ label, top, color }) => (
        <span
          key={label}
          className="absolute flex items-center justify-center whitespace-nowrap rounded-full px-[0.7em] py-[0.3em] font-sans leading-6 text-[#f4f4f4]"
          style={{ left: "56.02%", top, minWidth: "26.18%", fontSize: LABEL_FONT_SIZE, backgroundColor: color }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

// Figma 105:3001 — this card's own redesign: "How it started" retitled
// "Where it started" with a "[01]" step number above it, and the image
// moved from after the copy to right after the heading.
//
// bg-tertiary-solid (opaque), not bg-tertiary (5% alpha) + backdrop-
// blur: reported live as the page's own dot-grid background still
// showing through the card surface, just softened by the blur rather
// than actually hidden — a translucent surface can't fully block what's
// behind it no matter how much it's blurred. globals.css's own comment
// on bg-tertiary-solid has the exact blend.
//
// Still ScrollFadeCard: heading + step number + the 240px diagram +
// both paragraphs land well past the card's 600px budget (709px by
// Figma's own block heights).
export default function HowItStartedPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <div className="flex flex-col gap-6 p-7">
        <div className="flex flex-col gap-1">
          {/* Tabular + lining + slashed-zero numerals (Figma's own
              font-feature-settings) — keeps "01" reading as a clean step
              number rather than an italic word, and stays correct once
              a later page needs "10" without the digits shifting width. */}
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[01]</Eyebrow>
          <Heading size="md">Where it started</Heading>
        </div>
        <div className="aspect-[382/240] w-full">
          <PortfolioDiagram />
        </div>
        <div className="flex flex-col gap-6">
          <BodyCopy weight="medium">
            After 1.5 years of working on client business-building projects at McKinsey, I joined Orchestro (formerly
            LINK) as its first full-time designer. Orchestro is an internal B2B platform that helps businesses define
            and track their goals, consolidate information into a unified view, and uncover bottlenecks and
            opportunities through AI-powered insights.
          </BodyCopy>
          <BodyCopy weight="medium">
            Over time, the team went through significant changes. Six months ago, two additional products - Beacon
            and I2I - joined the Orchestro portfolio. With three products and two designers on the team, we divided
            ownership across the product suite and I took on the role of Lead Designer for Beacon and stayed as
            co-designer for Orchestro.
          </BodyCopy>
        </div>
      </div>
    </ScrollFadeCard>
  );
}
