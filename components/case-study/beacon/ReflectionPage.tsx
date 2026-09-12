import type { ReactNode } from "react";
import { Eyebrow, Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

// Figma 115:3802 — the workshop-questions row becomes a small scattered
// collage of colored "sticky notes", one per question, each individually
// rotated and holding its own text color. Figma's own export overlaps
// these five notes via CSS-Grid stacking + per-note margins (all five
// sharing one grid cell) — a technique that doesn't survive a responsive
// card: it assumes one fixed-width absolute canvas, but this card's own
// width varies from 440px down to a narrow phone's viewport. Reinterpreted
// here as a responsive flex-wrap row instead, keeping every note's exact
// size/color/text/rotation/text-color from Figma — the wrap naturally
// reflows at any card width, unlike a fixed absolute collage that would
// clip or overlap unpredictably once the card itself resizes.
//
// Text uses font-extrabold with no `italic` class — layout.tsx registers
// the ExtraboldItalic file itself under style:"normal" specifically so
// plain font-extrabold resolves to it (see its own comment for why);
// adding `italic` here would ask for a second, non-existent cut.
function StickyNote({
  color,
  textColor,
  rotate,
  children,
}: {
  color: string;
  textColor: string;
  rotate: number;
  children: ReactNode;
}) {
  return (
    <div
      className="flex shrink-0 items-start rounded-[10px] p-2 font-sans font-extrabold text-[16px] leading-[18px] tracking-[-0.128px]"
      style={{ width: 130, height: 162, backgroundColor: color, color: textColor, transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  );
}

const WORKSHOP_QUESTIONS: { color: string; textColor: string; rotate: number; text: string }[] = [
  { color: "#d9a900", textColor: "#4b3c06", rotate: 0, text: "What is quality?" },
  { color: "#00a2c2", textColor: "#0d0d0d", rotate: 6.41, text: "Why are we drawn to things that are quality?" },
  { color: "#e5522e", textColor: "#290e07", rotate: -6.82, text: "What would be your 11-star experience" },
  { color: "#0d99ff", textColor: "#0a2a40", rotate: 0, text: "What makes a great product?" },
  { color: "#d92100", textColor: "#fff8f7", rotate: 15, text: "Treasure Island" },
];

// Figma 115:3802 — a "[04]" step number, continuing "Where it started"/
// "First steps"/"Collecting insights"'s own [01]/[02]/[03] (this page
// previously had none).
//
// bg-tertiary-solid (opaque), not bg-tertiary (5% alpha) + backdrop-
// blur: reported live as the page's own dot-grid background still
// showing through the card surface, just softened by the blur rather
// than actually hidden — a translucent surface can't fully block what's
// behind it no matter how much it's blurred. globals.css's own comment
// on bg-tertiary-solid has the exact blend.
export default function ReflectionPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <div className="flex flex-col gap-6 p-7">
        <div className="flex flex-col gap-1">
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[04]</Eyebrow>
          <Heading size="md">Reflection on user’s feedback</Heading>
        </div>
        <div className="flex flex-col gap-6">
          <BodyCopy>
            After the interviews, we shared our findings with leadership and aligned on the need for a clear plan to
            turn these insights into action. I was invited to London to prepare and lead a workshop with the
            leadership team.
          </BodyCopy>
          <BodyCopy>
            Rather than jumping straight into features and solutions, I designed the session to push us beyond our
            usual ways of thinking and focus on bigger question: What should the next generation of Beacon become?
          </BodyCopy>
          <BodyCopy>
            The goal was to define a shared product vision, one that addressed the challenges we heard from users
            while also responding to shifts in the market and the rapidly evolving possibilities of AI.
          </BodyCopy>
        </div>
        <div className="flex flex-col gap-3">
          <BodyCopy muted>Some questions that drove the workshop:</BodyCopy>
          <div className="flex flex-wrap gap-3 py-2">
            {WORKSHOP_QUESTIONS.map(({ color, textColor, rotate, text }) => (
              <StickyNote key={text} color={color} textColor={textColor} rotate={rotate}>
                {text}
              </StickyNote>
            ))}
          </div>
        </div>
      </div>
    </ScrollFadeCard>
  );
}
