import { Fragment } from "react";
import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 154:348 (re-fetched) — same three-quote Beam panel and the same
// hand-drawn connector asset (Vector 13, reused twice) as the previous
// fetch, but this one's own metadata caught a real sizing mismatch: the
// quote pills aren't full-width inside the panel. Each one is a fixed
// 328px, centered within the 512px panel (93px of breathing room on
// both sides), not stretched out to fill the panel's own padded
// content box — and the panel's padding is vertical-only (29px), not
// the uniform p-6 this file guessed at before a real fetch measured it.
// Same fill:#0D0D0D-baked-in situation as FragmentedProduct.tsx's own
// arrows — needs the reverse of themedIcon's own invert direction
// (invert only in dark theme).
const BEAM_QUOTES = [
  "What if the entire journey could unfold through conversation?",
  "Users stay in control. Beacon guides rather than dictates.",
  "We called it “Beam”: a concept inspired by light and guidance, replacing rigid flows with a more fluid path forward.",
];

function BeamConnector() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a hand-drawn Figma stroke export, not a next/image-optimizable photo
    <img src="/images/home/beacon-beam-arrow.svg" alt="" aria-hidden className="h-[34px] w-[6px] self-center [.theme-dark_&]:invert" />
  );
}

export default function TurningPoint() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-2">
      <Heading size="section" className="tracking-[-0.8px]">
        Turning point
      </Heading>
      <div className="flex w-full flex-col gap-4">
        <BodyCopy>
          The workshop marked a turning point. We started thinking about Beacon differently, not as a rigid,
          step-by-step experience, but as something more conversational, flexible, and user-led.
        </BodyCopy>
        <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-bg-tertiary px-4 py-[29px]">
          {BEAM_QUOTES.map((quote, index) => (
            <Fragment key={quote}>
              {index > 0 && <BeamConnector />}
              <div className="flex w-full max-w-[328px] items-center justify-center rounded-xl border border-border-subtle px-2.5 py-1">
                <p className="font-sans text-[14px] font-semibold leading-6 text-text-primary">{quote}</p>
              </div>
            </Fragment>
          ))}
        </div>
        <BodyCopy>
          We aligned on an incremental path toward Beacon 2.0; gradually introducing our new visual language while
          rethinking the core product experience.
        </BodyCopy>
        <BodyCopy>
          My role was to continue learning from our users while designing this new direction. Beacon 2.0 would
          become a chat-led experience, introducing new interaction patterns that allow users to navigate more
          freely, explore ideas naturally, and stay in control of their journey, putting them in the driver’s seat
          rather than making them a passenger.
        </BodyCopy>
      </div>
    </div>
  );
}
