import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 148:7463 ("Cosmos DS" diagram, re-fetched) — supersedes the
// earlier hand-built version of this same diagram (114:3707-era, a CSS
// dashed path plus "Foundational components"/"Beacon-specific"/etc.
// sub-labels): this fetch's own node has none of those sub-labels at
// all, just the same four pills (Cosmos DS on top, Athena/Metis/Pantheon
// DS below) connected by three real hand-drawn arrow strokes — the same
// asset family HowItStarted.tsx's own "Portfolio" diagram uses, not a
// CSS-drawn path. Reference frame, pill positions and percentage
// conversion all mirror that file exactly (same 512x240 frame, same
// technique) since both diagrams now share one visual language.
//
// This asset trio came back with fill:#0D0D0D baked in (light theme's
// own ink) rather than the Portfolio diagram's #F4F4F4 — apparently
// whichever mode was active in Figma at each export differed between
// the two fetches. Needs the *reverse* of themedIcon's own invert
// direction as a result (see components/themedIcon.ts — that helper
// assumes a white source): no invert in light theme, invert only under
// `.theme-dark`.
const REFERENCE_WIDTH = 512;
const REFERENCE_HEIGHT = 240;
const LABEL_FONT_SIZE = "clamp(10px, 2.734cqw, 14px)";

const PILLS = [
  { label: "Cosmos DS", left: 204, top: 65, width: 104 },
  { label: "Athena DS", left: 92, top: 148, width: 104 },
  { label: "Metis DS", left: 204, top: 148, width: 104 },
  { label: "Pantheon DS", left: 316, top: 148, width: 104 },
] as const;

const STROKES = [
  { src: "/images/home/beacon-ds-arrow-1.svg", left: 169, top: 95.24, width: 86.834, height: 37.118, delay: 0 },
  { src: "/images/home/beacon-ds-arrow-2.svg", left: 252.23, top: 97.42, width: 8.481, height: 44.51, delay: 100 },
  { src: "/images/home/beacon-ds-arrow-3.svg", left: 255.46, top: 95, width: 88.421, height: 34.679, delay: 200 },
] as const;

function pct(value: number, of: number) {
  return `${(value / of) * 100}%`;
}

function DesignSystemDiagram() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-bg-tertiary [container-type:inline-size]"
      style={{ aspectRatio: `${REFERENCE_WIDTH} / ${REFERENCE_HEIGHT}` }}
    >
      {PILLS.map(({ label, left, top, width }) => (
        <span
          key={label}
          className="absolute flex h-8 items-center justify-center whitespace-nowrap rounded-lg border border-border-subtle bg-bg-tertiary px-3 font-sans leading-6 text-text-primary"
          style={{ left: pct(left, REFERENCE_WIDTH), top: pct(top, REFERENCE_HEIGHT), width: pct(width, REFERENCE_WIDTH), fontSize: LABEL_FONT_SIZE }}
        >
          {label}
        </span>
      ))}
      {/* aria-hidden: purely decorative — the pill labels above already
          carry the one relationship (Cosmos DS contains Athena, Metis,
          Pantheon) a screen reader needs. */}
      {STROKES.map(({ src, left, top, width, height, delay }) => (
        // eslint-disable-next-line @next/next/no-img-element -- a hand-drawn Figma stroke export, not a next/image-optimizable photo
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className="connector-stroke absolute [.theme-dark_&]:invert"
          style={{
            left: pct(left, REFERENCE_WIDTH),
            top: pct(top, REFERENCE_HEIGHT),
            width: pct(width, REFERENCE_WIDTH),
            height: pct(height, REFERENCE_HEIGHT),
            animationDelay: `${delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default function FragmentedProduct() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-2">
      <Heading size="section" className="tracking-[-0.8px]">
        A fragmented product
      </Heading>
      <div className="flex w-full flex-col gap-4">
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
        <DesignSystemDiagram />
      </div>
    </div>
  );
}
