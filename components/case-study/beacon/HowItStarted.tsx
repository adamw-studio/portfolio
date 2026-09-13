import { Heading, BodyCopy } from "@/components/case-study/primitives";
import { themedIcon } from "@/components/themedIcon";

// Figma 148:7438 ("Portfolio" diagram, re-fetched a second time) —
// supersedes both earlier builds of this same diagram:
//
// 1. All four pills are plain bg-tertiary/border-subtle/text-primary,
//    not individually colored (confirmed twice now).
// 2. There are genuinely THREE arrows, Portfolio fanning out to all
//    three of Beacon/I2I/Orchestro — this reverses this file's own
//    previous conclusion (that only one arrow, to Orchestro, was real
//    and the other two strokes were broken/leftover animation frames).
//    That read turned out to be wrong: it was built off an earlier
//    fetch of this same diagram whose own screenshot happened to render
//    the Beacon/I2I strokes too faintly to read as real, not because
//    they aren't. This fetch's own screenshot shows all three arrows
//    clearly and unambiguously.
//
// The three stroke assets (Vector 12/13/14) came back with fill:#F4F4F4
// baked in this time — dark theme's own ink, matching this node's own
// dark-mode screenshot directly, no opacity or color fix-up needed
// beyond the standard themedIcon flip (components/themedIcon.ts) every
// other fixed-white icon on this site already uses.
const REFERENCE_WIDTH = 512;
const REFERENCE_HEIGHT = 240;
const LABEL_FONT_SIZE = "clamp(10px, 2.734cqw, 14px)";

const PILLS = [
  { label: "Portfolio", left: 214, top: 63, width: 84 },
  { label: "Beacon", left: 112, top: 148, width: 84 },
  { label: "I2I", left: 214, top: 148, width: 84 },
  { label: "Orchestro", left: 316, top: 148, width: undefined },
] as const;

// left/top/width/height in px, at the 512x240 reference — converted to
// percentages of that frame below so the diagram holds together at any
// rendered width, same technique FragmentedProduct's own
// DesignSystemDiagram already uses.
const STROKES = [
  { src: "/images/home/beacon-portfolio-arrow-1.svg", left: 169, top: 95.24, width: 86.834, height: 37.118, delay: 0 },
  { src: "/images/home/beacon-portfolio-arrow-2.svg", left: 252.23, top: 97.42, width: 8.481, height: 44.51, delay: 100 },
  { src: "/images/home/beacon-portfolio-arrow-3.svg", left: 255.46, top: 95, width: 88.421, height: 34.679, delay: 200 },
] as const;

function pct(value: number, of: number) {
  return `${(value / of) * 100}%`;
}

function PortfolioDiagram() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-bg-tertiary [container-type:inline-size]"
      style={{ aspectRatio: `${REFERENCE_WIDTH} / ${REFERENCE_HEIGHT}` }}
    >
      {PILLS.map(({ label, left, top, width }) => (
        <span
          key={label}
          className="absolute flex h-8 items-center justify-center whitespace-nowrap rounded-lg border border-border-subtle bg-bg-tertiary px-3 font-sans leading-6 text-text-primary"
          style={{
            left: pct(left, REFERENCE_WIDTH),
            top: pct(top, REFERENCE_HEIGHT),
            width: width ? pct(width, REFERENCE_WIDTH) : "auto",
            fontSize: LABEL_FONT_SIZE,
          }}
        >
          {label}
        </span>
      ))}
      {/* aria-hidden: purely decorative — the pill labels above already
          carry the one relationship (Portfolio contains Beacon, I2I,
          Orchestro) a screen reader needs. */}
      {STROKES.map(({ src, left, top, width, height, delay }) => (
        // eslint-disable-next-line @next/next/no-img-element -- a hand-drawn Figma stroke export, not a next/image-optimizable photo
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden
          className={`connector-stroke absolute ${themedIcon}`}
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
        <PortfolioDiagram />
      </div>
    </div>
  );
}
