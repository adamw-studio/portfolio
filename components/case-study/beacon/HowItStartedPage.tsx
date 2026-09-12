import { CardBody, Eyebrow, Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

// Figma 105:3001 (desktop, 440px card) vs 122:4252 (mobile, 354px
// card) — the SAME "Where it started" org-chart diagram, hand-drawn
// twice, once per breakpoint. Diffing the two frames' own metadata
// (not a screenshot, and not the desktop frame alone) proves the
// cluster itself — Portfolio, the three product pills, and the
// connector — is a completely FIXED 246x148px block in both: every
// child's position lands on the exact same offset once you subtract
// each frame's own cluster origin (68,46 desktop; 33,36 mobile) — down
// to the pixel, nothing scaled. What actually moves is the empty
// margin around that fixed block: the diagram box's own WIDTH is 100%
// of the card's content width (382px desktop, 312px mobile — never a
// literal 382px baked in), and the fixed cluster just stays centered,
// both axes, inside whatever that box's width turns out to be — the
// same thing Figma's own mobile redraw does, not this box being scaled
// down from one.
const CLUSTER_WIDTH = 246;
const CLUSTER_HEIGHT = 148;

// The diagram box's own HEIGHT is the one value that doesn't reduce to
// pure centering — Figma draws it at 240px (382px-wide box) and 220px
// (312px-wide box), a smaller, independently-chosen number rather than
// "cluster height + a fixed margin" (92px vs 72px of vertical margin —
// not the same). Interpolated linearly off the diagram's own rendered
// width (a container query — see PortfolioDiagram's own wrapper) between
// those two exact points rather than picked as a round number: solving
// (312px → 220px), (382px → 240px) for clamp(min, A + Bcqw, max) gives
// B = 20/70 = 28.571429cqw, A = 220 - 28.571429% * 312/100 = 130.857143px.
const DIAGRAM_HEIGHT = "clamp(220px, calc(28.571429cqw + 130.857143px), 240px)";

const PORTFOLIO_PRODUCTS = [
  { label: "Beacon", top: 0, color: "#00a2c2" }, // this site's own established teal accent (globals.css's own comment on why it's a literal, not a token)
  { label: "I2I", top: 58, color: "#6458c3" },
  { label: "Orchestro", top: 116, color: "#007bff" }, // same blue BeaconComposer's own send button already uses
] as const;

function PortfolioDiagram() {
  return (
    // The [container-type:inline-size] query container has to be a
    // dedicated *wrapper*, not the diagram box itself: a cqw unit used
    // on a property of the element that establishes containment
    // resolves against that element's own nearest ANCESTOR container,
    // never against itself (confirmed live — DIAGRAM_HEIGHT's cqw term
    // was silently resolving against ScrollFadeCard's own outer
    // [container-type:inline-size] frame one level up, giving a
    // visibly too-tall box until this wrapper was split out).
    <div className="w-full [container-type:inline-size]">
      <div
        className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-bg-tertiary"
        style={{ height: DIAGRAM_HEIGHT }}
      >
        {/* The fixed 246x148 cluster — every child below is a plain,
            unscaled pixel position/size relative to *this* box's own
            top-left corner, matching both Figma references exactly (see
            the top-of-file comment for the reconciliation). Centering
            this one shrink-0 box (rather than each child independently)
            is what keeps the whole composition looking hand-placed
            instead of stretched at every width in between.

            transform:scale(...), on this one small internal cluster —
            not the whole card, which stays real layout sizing throughout
            (LANE_WIDTH) — is a deliberate, narrow exception, not the
            "scale the whole card down" anti-pattern: Figma's own two
            references only ever specify this fixed 246px-wide cluster
            down to a 312px-wide diagram box; this carousel's own mobile
            carousel-peek fix can push a real phone's card narrower than
            that (confirmed live: a 246px cluster clipped against its own
            234px diagram box at 390px viewport, with no Figma data at
            all for what should happen there). Scaling only kicks in
            below that 312px floor (min(1, ...) — at or above it this is
            a no-op, so the desktop/mobile-reference fidelity above is
            untouched), and only shrinks this one already-small graphic
            in place, not the surrounding text/padding/card. */}
        <div
          className="relative shrink-0"
          style={{ width: CLUSTER_WIDTH, height: CLUSTER_HEIGHT, transform: "scale(min(1, calc(100cqw / 312px)))" }}
        >
          {/* Figma's own connector (Vector 11) — a plain dashed branch
              from one point to three, exported as a single path.
              border-subtle, not the literal rgba(244,244,244,0.1)
              Figma's export hardcodes: that literal *is* border-subtle's
              own dark-theme value (compare globals.css), and the token
              is what actually inverts correctly in light theme instead
              of staying a dark-only line. */}
          <svg
            aria-hidden
            className="absolute"
            style={{ left: 75, top: 16, width: 68.5, height: 116.5 }}
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
            className="absolute flex h-8 items-center justify-center whitespace-nowrap rounded-full bg-bg-secondary px-2.5 font-sans text-[14px] leading-6 text-text-primary"
            style={{ left: 0, top: 58, width: 70 }}
          >
            Portfolio
          </span>
          {/* text-[#f4f4f4], not the theme-flipping text-text-primary:
              these three pills keep their own fixed saturated fill
              regardless of site theme (same reasoning OverviewPage's
              own always-dark cover gives its text a fixed literal), so
              the label needs to stay light against them either way
              rather than flipping to dark text on a bright color in
              light theme. */}
          {PORTFOLIO_PRODUCTS.map(({ label, top, color }) => (
            <span
              key={label}
              className="absolute flex h-8 w-[100px] items-center justify-center whitespace-nowrap rounded-full px-2.5 font-sans text-[14px] leading-6 text-[#f4f4f4]"
              style={{ left: 146, top, backgroundColor: color }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
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
// Still ScrollFadeCard: heading + step number + the diagram + both
// paragraphs land well past the card's 600px budget at every width
// (681px of content + padding by Figma's own desktop block heights).
export default function HowItStartedPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <CardBody>
        <div className="flex flex-col gap-1">
          {/* Tabular + lining + slashed-zero numerals (Figma's own
              font-feature-settings) — keeps "01" reading as a clean step
              number rather than an italic word, and stays correct once
              a later page needs "10" without the digits shifting width. */}
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[01]</Eyebrow>
          <Heading size="md">Where it started</Heading>
        </div>
        <PortfolioDiagram />
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
      </CardBody>
    </ScrollFadeCard>
  );
}
