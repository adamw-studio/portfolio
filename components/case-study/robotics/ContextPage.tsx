import { Eyebrow, Heading, BodyCopy, TextCard } from "@/components/case-study/primitives";

// Figma 122:4354 — a plain text card, same treatment as Beacon's own
// "First steps"/"Collecting insights": a "[01]" step number, a heading,
// and three paragraphs at Figma's own Medium weight (matching
// HowItStartedPage's identical weight="medium" call for the same
// reason — this node specifically asks for PP Neue Montreal Medium,
// not Regular). Plain TextCard, not ScrollFadeCard directly: three
// paragraphs land inside the card's 600px budget at Figma's own 440px
// desktop width, same as every other text-only card here — TextCard's
// own built-in scroll+fade only actually engages once a narrow phone's
// aspect-ratio-shrunk card gets too short for this copy to fit at full
// size.
export default function ContextPage() {
  return (
    <TextCard>
      <div className="flex flex-col gap-1">
        <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[01]</Eyebrow>
        <Heading size="md">Context</Heading>
      </div>
      <div className="flex flex-col gap-6">
        <BodyCopy weight="medium">
          Revolution Robotics Foundation, founded in 2018, is a non-profit organization dedicated to making robotics
          education affordable, accessible, and fun for kids. They approached us to redesign their outdated mobile
          app, a key part of their mission to inspire the next generation of young engineers.
        </BodyCopy>
        <BodyCopy weight="medium">
          I joined the project as the UX Lead and UI Designer, working closely with an exceptional UX Researcher over
          the course of seven months. My role spanned from leading client communication and facilitating workshops to
          creating interactive prototypes and designing the final user interface.
        </BodyCopy>
        <BodyCopy weight="medium">
          Our goal was to reimagine the app experience — keeping it flexible and educational while reducing
          unnecessary complexity. Above all, we wanted to design an app that kids aged 8–14 could navigate
          independently, confidently building and programming robots without needing constant help from parents or
          instructors.
        </BodyCopy>
      </div>
    </TextCard>
  );
}
