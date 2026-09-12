import { Fragment } from "react";
import { Eyebrow, Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

const BEAM_QUOTES = [
  "What if the entire journey could unfold through conversation?",
  "Users stay in control. Beacon guides rather than dictates.",
  "We called it “Beam”: a concept inspired by light and guidance, replacing rigid flows with a more fluid path forward.",
];

// Figma 115:3953 — a "[05]" step number (continuing 01-04), and the old
// single "what if you could talk to Beam" paragraph becomes a bordered
// panel of three short pull-quotes joined by dashed connectors, framing
// the Beam concept as a small sequence of ideas rather than one dense
// paragraph. Panel and pills are sized with w-full/percentage widths
// rather than Figma's literal 382px/327px — this card already varies in
// width from 440px down to a narrow phone's own viewport (every other
// page here follows the same rule), and a hardcoded pixel width would
// either overflow or leave mismatched margins once the card resizes.
//
// The connector is a one-off inline dashed line, not Divider.tsx's own
// .divider-dashed: that class's repeating-gradient runs left-to-right
// for a full-width section hairline, not top-to-bottom for a short
// decorative link between two stacked pills.
function BeamConnector() {
  return (
    <div
      aria-hidden
      className="h-[34px] w-px self-center"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, var(--color-border-subtle) 0, var(--color-border-subtle) 8px, transparent 8px, transparent 16px)",
      }}
    />
  );
}

// Figma 105:2564 etc. — same text-only card treatment as "First steps"/
// "Collecting insights", but the new Beam panel pushes this page past
// the card's 600px budget, so it switches to ScrollFadeCard directly
// (opaque bg-tertiary-solid, same reasoning as "Reflection"/"How it
// started": a translucent bg-tertiary card would let the page's own
// dot-grid show through).
export default function TurningPointPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <div className="flex flex-col gap-6 p-7">
        <div className="flex flex-col gap-1">
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[05]</Eyebrow>
          <Heading size="md">Turning point</Heading>
        </div>
        <BodyCopy>
          The workshop marked a turning point. We started thinking about Beacon differently, not as a rigid,
          step-by-step experience, but as something more conversational, flexible, and user-led.
        </BodyCopy>
        <div className="flex w-full flex-col items-center gap-3 rounded-2xl bg-bg-tertiary p-6">
          {BEAM_QUOTES.map((quote, index) => (
            <Fragment key={quote}>
              {index > 0 && <BeamConnector />}
              <div className="flex w-full items-center justify-center rounded-xl border border-border-subtle px-2.5 py-1">
                <p className="font-sans text-[14px] font-semibold leading-6 text-text-primary">{quote}</p>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="flex flex-col gap-6">
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
    </ScrollFadeCard>
  );
}
