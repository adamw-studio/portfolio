import { Heading, BodyCopy, Exhibit } from "@/components/case-study/primitives";

// Figma 161:1632 — copy carried over verbatim from the old page-by-page
// ContextPage.tsx (confirmed against this fetch word-for-word), plus one
// new full-width diagram this rebuild adds: a hand-drawn "objectives"
// illustration replacing what used to be a bare paragraph with nothing
// under it. frame=false (no bg-tertiary box/rounded corners) — same
// reasoning as Beacon's own diagram exhibits: this is line art on a
// transparent background, meant to sit directly on the page rather than
// look like a boxed screenshot. Light/dark pair, not a single image —
// light ink on the light theme, white ink on dark, same colored strokes
// either way (Beacon's own established convention for this kind of
// asset).
export default function ContextSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section">Context</Heading>
      <div className="flex w-full flex-col gap-4">
        <BodyCopy weight="medium">
          Revolution Robotics Foundation, founded in 2018, is a non-profit organization dedicated to making robotics
          education affordable, accessible, and fun for kids. They approached us to redesign their outdated mobile
          app, a key part of their mission to inspire the next generation of young engineers.
          <br />
          <br />
          I joined the project as the UX Lead and UI Designer, working closely with an exceptional UX Researcher over
          the course of seven months. My role spanned from leading client communication and facilitating workshops to
          creating interactive prototypes and designing the final user interface.
          <br />
          <br />
          Our goal was to reimagine the app experience — keeping it flexible and educational while reducing
          unnecessary complexity. Above all, we wanted to design an app that kids aged 8–14 could navigate
          independently, confidently building and programming robots without needing constant help from parents or
          instructors.
        </BodyCopy>
        <Exhibit
          src="/images/home/robotics-objectives-diagram-light.png"
          darkSrc="/images/home/robotics-objectives-diagram-dark.png"
          alt="A hand-drawn diagram mapping the project's objectives"
          height={240}
          frame={false}
        />
      </div>
    </div>
  );
}
