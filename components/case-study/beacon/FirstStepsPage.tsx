import { CardBody, Eyebrow, Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

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
//
// [container-type:inline-size] + clamp(...cqw...) font-sizes below:
// reported live (a real-device screenshot) as badly broken on a narrow
// phone — this row packs three pills *and* three captions into one
// line, denser than "Where it started"'s own diagram, and every label
// here was still a fixed 14px while its pill's own width kept shrinking
// as a plain percentage of the card's own (now narrower, since the
// mobile carousel-peek fix) width. Fixed text in a shrinking box only
// ever ends one way. Container query units tie each label's font-size
// to this diagram's *own* rendered width instead of the viewport, so it
// shrinks in lockstep with the pills/positions around it — pinned at
// 14px once the diagram is back near its own 382px reference size (any
// desktop card), floored at 10px so it never goes illegibly small.
// Padding is em-based (0.7em/0.3em, matching the original 10px/4px at
// the 14px reference) so it shrinks together with the font instead of
// staying a fixed px amount once the text around it has already shrunk.
// Pills also switch from a hard `width` to `minWidth`: at the very
// narrowest real phones the floored 10px text can still slightly exceed
// its originally-designed slot, and a pill that's free to grow past
// that minimum (rather than clipping/overflowing it) is the graceful
// failure mode.
//
// The three "-specific" captions additionally pick up whiteSpace:
// nowrap, which "Foundational components" already had but these never
// did — an absolutely-positioned, width:auto element still wraps once
// the shrink-to-fit space between its own `left` and the container's
// far edge narrows below its text's natural width; that wrap (not
// overflow) is what actually produced the garbled, multi-line collision
// in the reported screenshot.
const LABEL_FONT_SIZE = "clamp(10px,3.66cqw,14px)";

function DesignSystemDiagram() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-bg-tertiary [container-type:inline-size]"
      style={{ aspectRatio: "382 / 252" }}
    >
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
        className="absolute flex items-center justify-center whitespace-nowrap rounded-full bg-bg-secondary px-[0.7em] py-[0.3em] font-sans leading-6 text-text-primary"
        style={{ left: "38.22%", top: "8.33%", minWidth: "24.08%", fontSize: LABEL_FONT_SIZE }}
      >
        Cosmos DS
      </span>
      <Eyebrow style={{ position: "absolute", left: "29.58%", top: "22.22%", whiteSpace: "nowrap", fontSize: LABEL_FONT_SIZE }}>
        Foundational components
      </Eyebrow>
      <span
        className="absolute flex items-center justify-center whitespace-nowrap rounded-full bg-bg-secondary px-[0.7em] py-[0.3em] font-sans leading-6 text-text-primary"
        style={{ left: "4.71%", top: "67.86%", minWidth: "22.25%", fontSize: LABEL_FONT_SIZE }}
      >
        Athena DS
      </span>
      <span
        className="absolute flex items-center justify-center whitespace-nowrap rounded-full bg-bg-secondary px-[0.7em] py-[0.3em] font-sans leading-6 text-text-primary"
        style={{ left: "40.31%", top: "67.86%", minWidth: "19.63%", fontSize: LABEL_FONT_SIZE }}
      >
        Metis DS
      </span>
      {/* right, not left+minWidth like the other two pills: this is the
          rightmost column, so letting its floored-font content grow past
          its designed minWidth (same reasoning as the other pills, see
          this file's top comment) has to grow *leftward* into this row's
          own existing whitespace, not rightward straight into — and,
          since the diagram itself clips overflow, off — the card's own
          edge. Confirmed live at 375px: left-anchored, this pill and its
          caption clipped at the container's right edge; right-anchored,
          they don't. */}
      <span
        className="absolute flex items-center justify-center whitespace-nowrap rounded-full bg-bg-secondary px-[0.7em] py-[0.3em] font-sans leading-6 text-text-primary"
        style={{ right: "4.97%", top: "67.86%", minWidth: "25.92%", fontSize: LABEL_FONT_SIZE }}
      >
        Pantheon DS
      </span>
      <Eyebrow
        style={{ position: "absolute", left: "2.88%", top: "82.14%", width: "auto", whiteSpace: "nowrap", fontSize: LABEL_FONT_SIZE }}
      >
        Beacon-specific
      </Eyebrow>
      <Eyebrow
        style={{ position: "absolute", left: "41.62%", top: "82.14%", width: "auto", whiteSpace: "nowrap", fontSize: LABEL_FONT_SIZE }}
      >
        I2I-specific
      </Eyebrow>
      <Eyebrow
        style={{
          position: "absolute",
          right: "3%",
          top: "86.9%",
          width: "auto",
          whiteSpace: "nowrap",
          fontSize: LABEL_FONT_SIZE,
          transform: "translateY(-50%)",
        }}
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
      <CardBody>
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
      </CardBody>
    </ScrollFadeCard>
  );
}
