import { Heading, BodyCopy, Exhibit } from "@/components/case-study/primitives";

// Same swap as HowItStarted.tsx/FragmentedProduct.tsx's own diagrams,
// on the same instruction, applied here to this section's own "Beam"
// panel (Figma 158:1222): the three quote pills + connector-arrow
// composition are replaced by a single flat exhibit image with two
// real theme-specific exports (transparent PNGs — dark ink for light
// theme, light ink for dark theme), frameless (no bg-bg-tertiary/
// rounded card box) to match the other three diagram swaps' own
// "remove backgrounds and borders" follow-up. Panel height 350px, this
// node's own measured height (get_metadata) — same figure this file's
// own previous quote-panel build already used for its padding math.
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
        <Exhibit
          src="/images/home/beacon-beam-diagram-light.png"
          darkSrc="/images/home/beacon-beam-diagram-dark.png"
          alt="Three annotated notes tracing the Beam concept: What if the entire journey could unfold through conversation? Users stay in control, Beacon guides rather than dictates. We called it Beam, a concept inspired by light and guidance, replacing rigid flows with a more fluid path forward."
          height={350}
          frame={false}
        />
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
