import Image from "next/image";
import { Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

// Figma 101:2893 — a plain screenshot block, not the shared Media
// primitive: Media always adds its own border-border-subtle stroke
// (right for a placeholder frame), but this node has none, just the
// image itself over a bg-tertiary fallback fill — same reasoning
// OverviewPage's own image block already hand-rolled this rather than
// reusing Media. The source file was Figma's own export for this node,
// but exported as an ~1000-frame animated GIF (some pre-existing motion
// asset embedded as this fill, not a real screen recording of Beacon) —
// its own first frame is the actual static screenshot the canvas shows,
// so that's what's committed here as a plain jpg.
//
// The card's own surface is bg-tertiary-solid (opaque), not bg-tertiary
// (5% alpha) + backdrop-blur: reported live as the page's own dot-grid
// background still showing through the card, just softened by the blur
// rather than actually hidden — a translucent surface can't fully block
// what's behind it no matter how much it's blurred. globals.css's own
// comment on bg-tertiary-solid has the exact blend. The screenshot's own
// bg-tertiary fallback fill below is unrelated — it's fully covered by a
// real photo once that loads, and sits behind this now-opaque card
// either way, so it never has anything patterned to leak through.
export default function SoWhereAreWeNowPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <div className="flex flex-col gap-6 p-7">
        <Heading size="md">So, where are we now?</Heading>
        <div className="relative h-[220px] w-full overflow-hidden rounded-lg bg-bg-tertiary">
          <Image
            src="/images/home/beacon-exploration-snapshot.jpg"
            alt="A snapshot of the Beacon workspace-generation exploration: a chat panel guiding a new workspace setup alongside a generated company brief"
            fill
            className="object-cover"
            sizes="(min-width: 480px) 384px, 100vw"
          />
        </div>
        <div className="flex flex-col gap-6">
          <BodyCopy>
            Since the workshop, I’ve been continuously iterating on the new direction for Beacon together with my PM,
            Milan. We’re now approaching implementation of the first increment: Workspace generation. To get here, we
            explored multiple concepts, tested them with users, and used their feedback to refine the experience
            along the way.
          </BodyCopy>
          <BodyCopy>
            The ideation phase has been one of our most challenging areas yet. Today, Beacon can generate multiple
            value pools to give users a head start, but our research showed that this isn’t enough. Users want to be
            more involved in the process. They want to shape, challenge, and develop ideas themselves rather than
            simply receive AI-generated suggestions.
          </BodyCopy>
          <BodyCopy>
            That’s the problem we’re currently tackling: how might we combine the speed and intelligence of AI with
            the user’s own expertise and judgment? Below are a few snapshots of where that exploration is taking us.
          </BodyCopy>
        </div>
      </div>
    </ScrollFadeCard>
  );
}
