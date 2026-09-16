import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 206:5224 — tracking-[-0.16px] on the heading is this page's own
// literal value (confirmed against the node directly), one notch
// tighter than Heading's shared "section" size ships by default
// (primitives.tsx's own comment: that default deliberately omits
// tracking, matching Robotics' own Context heading, which has none) —
// overridden here via className rather than changed in the shared
// component, since it's this page's own difference, not a correction
// to what Robotics already has right.
export default function ContextSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section" className="tracking-[-0.16px]">
        Context
      </Heading>
      <BodyCopy>
        Monday is a collective built around collaboration, experimentation and making. The identity needed to give
        the group a recognisable presence without becoming overly corporate or polished. It had to work as a studio
        signature while leaving enough freedom for different disciplines, collaborators and creative outputs to live
        within it.
        <br />
        <br />
        The challenge was therefore not simply to design a logo, but to create the beginnings of a visual identity
        that could feel distinctive, flexible and culturally relevant.
      </BodyCopy>
    </div>
  );
}
