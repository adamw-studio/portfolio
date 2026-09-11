import type { ReactNode } from "react";
import { Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

// Figma 100:2564 etc. — a small "sticky note" flourish peeking from
// behind each workshop question: a colored, rotated rounded-rect with
// two tiny icon-subtle marks on it, clipped to the pill's own small
// height so only a sliver of it actually shows. Kept local to this page
// rather than promoted to primitives.tsx — nothing else in this system
// needs a colored-icon tag yet, and Chip.tsx (the sitewide inline-chip
// primitive) is a plain border/fill pill with no equivalent to this
// visual, not a close enough match to extend instead of building this.
// Colors are fixed literals, not theme tokens — five arbitrary per-
// question accents, not a role that flips with light/dark (compare
// OverviewPage's own reasoning for the same choice).
function WorkshopTag({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="relative inline-flex shrink-0 items-center overflow-hidden rounded-xs border border-border-subtle py-0.5 pl-11 pr-1.5">
      <span aria-hidden className="absolute -left-1 top-1.5 h-[42px] w-9 -rotate-[9deg]">
        <span className="relative block h-[38px] w-[30px] rounded-[4px]" style={{ backgroundColor: color }}>
          <span className="absolute left-[7px] top-1 h-0.5 w-4 rounded-full bg-icon-subtle" />
          <span className="absolute left-[3px] top-1 size-0.5 rounded-full bg-icon-subtle" />
        </span>
      </span>
      <span className="relative font-sans text-[14px] whitespace-nowrap tracking-[-0.112px] text-text-primary">{children}</span>
    </span>
  );
}

const WORKSHOP_QUESTIONS: { color: string; text: string }[] = [
  { color: "#d9a900", text: "What is quality?" },
  { color: "#00a2c2", text: "Why are we drawn to things that are quality?" },
  { color: "#e5522e", text: "10 star experience" },
  { color: "#0d99ff", text: "What makes a great product?" },
  { color: "#d92100", text: "Treasure island" },
];

// Figma 100:2524 — the heading + 3 paragraphs + question-tag row add up
// to just over the card's own 600px budget (604px by Figma's own text-
// block heights), so this is back to ScrollFadeCard like "How it
// started" — "First steps"/"Collecting insights" fit without it, this
// one doesn't quite.
export default function ReflectionPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)] backdrop-blur-[16px]"
    >
      <div className="flex flex-col gap-6 p-7">
        <Heading size="md">Reflection on user’s feedback</Heading>
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
        <div className="flex flex-col gap-2">
          <BodyCopy muted>Some questions that drove the workshop:</BodyCopy>
          <div className="flex flex-wrap items-center gap-2">
            {WORKSHOP_QUESTIONS.map(({ color, text }) => (
              <WorkshopTag key={text} color={color}>
                {text}
              </WorkshopTag>
            ))}
          </div>
        </div>
      </div>
    </ScrollFadeCard>
  );
}
