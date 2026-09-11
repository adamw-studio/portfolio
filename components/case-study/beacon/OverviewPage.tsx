import { Eyebrow, Heading, Checklist } from "@/components/case-study/primitives";

// Figma 87:1192/87:1442 gives this card a literal 512px width and a 24px
// headline — reported live as reading too big once real Chrome-on-a-Mac
// viewport heights (roughly 700-950px of usable window, depending on
// display/scaling — there's no one fixed number) were actually accounted
// for: the full headline + 8-item summary comfortably exceeded that, so
// the card either clipped against the nav or forced the whole page to
// scroll, breaking the "one composed viewport" premise. Sized down from
// the literal spec instead: a narrower 440px column, a smaller heading
// (Heading's own new `sm`), and a denser checklist — legible at normal
// reading distance, just not oversized for what has to share the screen
// with it. max-h + overflow-y-auto is a safety net, not the primary fix:
// on anything but an unusually short window this fits without ever
// needing to scroll; on one that's genuinely too short, the card scrolls
// internally rather than the whole page do.
export default function OverviewPage() {
  return (
    <div className="flex w-full max-w-[440px] flex-col gap-5 overflow-y-auto rounded-[20px] border border-border-subtle bg-bg-default p-6 shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]" style={{ maxHeight: "min(600px, 76dvh)" }}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <Eyebrow>Lead designer</Eyebrow>
          <Eyebrow>/</Eyebrow>
          <Eyebrow>2026</Eyebrow>
        </div>
        <Heading size="sm">Designing how agentic AI helps founders research, validate and turn ideas into ventures.</Heading>
      </div>
      <div className="flex flex-col gap-2">
        <Eyebrow>Short summary</Eyebrow>
        <Checklist
          dense
          items={[
            "Worked closely with the team to establish design’s role in our build process",
            "By defining a clear design vision and principles, I built a scalable, robust design system that unified the product experience",
            "Introduced collaborative reviews, embedded design earlier in our development process - demonstrated how design could drive clarity, efficiency and innovation",
            "Grew the design team and managed to create a more design-aware culture, that values user experience at every stage",
            "Built much closer partnerships with our product, engineering and leadership teams",
            "Ran UX-research projects so that even in a B2B environment - where user contact can often be limited - we’ve made it a priority to talk to our users directly, listen to their needs and user their input & feedback to guide our decisions",
            "Currently, leading the redesign of the platform and transforming it into a chat-led experience",
            "Building working prototypes with Cursor to test our new feature ideas more quickly and iteratively",
          ]}
        />
      </div>
    </div>
  );
}
