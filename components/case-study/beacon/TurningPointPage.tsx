import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 101:2685 — same text-only card treatment as "First steps"/
// "Collecting insights": a plain aspect-ratio div, not ScrollFadeCard.
// Four paragraphs still land inside the card's 600px budget (Figma's
// own text block is 456px tall against a 600px card), so nothing here
// needs to scroll. Same backdrop-blur-[16px] frosted-glass treatment
// too — see HowItStartedPage's own comment for why.
export default function TurningPointPage() {
  return (
    <div
      className="flex w-full max-w-[440px] flex-col gap-6 overflow-hidden rounded-[20px] border border-border-disabled bg-bg-tertiary p-7 shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)] backdrop-blur-[16px]"
      style={{ aspectRatio: "440 / 600" }}
    >
      <Heading size="md">Turning point</Heading>
      <div className="flex flex-col gap-6">
        <BodyCopy>
          The workshop marked a turning point. We started thinking about Beacon differently, not as a rigid,
          step-by-step experience, but as something more conversational, flexible, and user-led.
        </BodyCopy>
        <BodyCopy>
          What if you could move through the entire journey with a chat companion by your side? What if you could
          simply talk to Beam, our AI companion, name after a “beam of light”, and let the experience adapt around
          you?
        </BodyCopy>
        <BodyCopy>
          From there, we aligned ( and felt the support from leadership) on an incremental path toward Beacon 2.0;
          gradually introducing our new visual language while rethinking the core product experience.
        </BodyCopy>
        <BodyCopy>
          My role was to continue learning from our users while designing this new direction. Beacon 2.0 would become
          a chat-led experience, introducing new interaction patterns that allow users to navigate more freely,
          explore ideas naturally, and stay in control of their journey, putting them in the driver’s seat rather
          than making them a passenger.
        </BodyCopy>
      </div>
    </div>
  );
}
