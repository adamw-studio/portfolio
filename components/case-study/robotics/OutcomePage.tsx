import type { ReactNode } from "react";
import { CardBody, Eyebrow, Heading, BodyCopy, ScrollFadeCard, Exhibit } from "@/components/case-study/primitives";

// Figma 122:4839 — four "by the end of the project" highlight cards,
// each a fixed 130x162px colored tile: an empty icon slot (Figma's own
// node has nothing in it — a reserved spot the design never actually
// filled, not a failed asset export) over a thin hairline, then a bold
// label pinned to the bottom via justify-between. Colors and text tints
// are fixed literals per card (matching this system's own established
// reasoning for saturated accent tiles — Beacon's OverviewPage/
// HowItStartedPage product pills — not this system's theme-flipping
// tokens), reproduced directly from Figma rather than mapped to a
// token that would drift the tile's own designed contrast.
const HIGHLIGHTS: { bg: string; text: string; label: ReactNode }[] = [
  { bg: "#0055bf", text: "#e8eff8", label: "Rewired of IA of the app" },
  { bg: "#fff03b", text: "#363f22", label: "10+ usability issues were fixed" },
  {
    bg: "#fff03b",
    text: "#363f22",
    // "New Feature: " is Medium Italic in Figma — a style/weight pair
    // this project doesn't actually have a font file for (layout.tsx
    // loads Regular/Medium/Semibold at style:normal, a plain Italic at
    // 400, and Extrabold/Semibold Italic cuts — no Medium Italic).
    // font-medium + the `italic` class falls back to the browser's own
    // synthetic oblique for these two words rather than a true italic
    // cut — close enough for a two-word prefix inside a small tile,
    // not worth carrying a whole extra webfont file for.
    label: (
      <>
        <span className="font-medium italic">New Feature: </span>
        Learning Mode to get quick help
      </>
    ),
  },
  { bg: "#0055bf", text: "#e8eff8", label: "100+ screens were designed in Figma" },
];

function Highlight({ bg, text, label }: { bg: string; text: string; label: ReactNode }) {
  return (
    <div className="flex h-[162px] w-[130px] shrink-0 flex-col items-start justify-between rounded-[10px] p-2" style={{ backgroundColor: bg }}>
      <div className="flex w-full flex-col items-start gap-2">
        {/* Empty in Figma's own node — a reserved icon slot the design
            never filled, left as-is rather than inventing an icon. */}
        <div className="h-[60px] w-full" aria-hidden />
        <div className="h-px w-full" style={{ backgroundColor: text }} aria-hidden />
      </div>
      {/* font-extrabold with no `italic` class — layout.tsx registers
          the ExtraboldItalic file itself under style:"normal" so plain
          font-extrabold resolves to it (see ReflectionPage's own
          sticky-note comment for the fuller reasoning). */}
      <p className="w-full font-sans text-[16px] font-extrabold leading-[18px] tracking-[-0.128px]" style={{ color: text }}>
        {label}
      </p>
    </div>
  );
}

// Figma 122:4576 — a "[04]" step number, two exhibits (the second has
// no caption in Figma — Exhibit's own `caption` prop is optional
// exactly for this), a closing pair of paragraphs, and the highlight-
// tile grid above. ScrollFadeCard directly: two 240px exhibits plus
// four 162px-tall tiles land well past the card's 600px budget at every
// width.
export default function OutcomePage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <CardBody>
        <div className="flex flex-col gap-1">
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[04]</Eyebrow>
          <Heading size="md">Outcome</Heading>
        </div>
        <BodyCopy>
          The outcome was a complete transformation of the app: a restructured information architecture, a refreshed
          UI and brand direction, and a cohesive design system to support future scalability.
        </BodyCopy>
        <Exhibit
          src="/images/home/robotics-outcome-library-1.jpg"
          alt="A grid of design-system component variants: card layouts with motor and sensor controls in different states"
          caption="I’ve created a comprehensive design library that helped engineers continue to work on implementing new features in the future."
        />
        <Exhibit
          src="/images/home/robotics-outcome-library-2.jpg"
          alt="Filter panels and phone-screen mockups showing the app's Learning Mode and coding screens"
        />
        <BodyCopy>
          In total, we tested our designs with 45 kids, ensuring the final product was not only intuitive and fun but
          also genuinely empowering for young users learning to build and code robots on their own.
        </BodyCopy>
        <p className="w-full font-sans text-[14px] font-semibold leading-6 text-text-primary">By the end of the project:</p>
        <div className="flex w-full flex-wrap items-center justify-center gap-2">
          {HIGHLIGHTS.map(({ bg, text, label }, i) => (
            <Highlight key={i} bg={bg} text={text} label={label} />
          ))}
        </div>
      </CardBody>
    </ScrollFadeCard>
  );
}
