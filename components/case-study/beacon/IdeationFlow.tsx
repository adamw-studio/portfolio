import { Heading, BodyCopy, Exhibit } from "@/components/case-study/primitives";

// Figma 148:8593 ("Ideation flow") — new as its own top-level section:
// this content used to live as a subsection inside "So, where are we
// now?" (an InsightTag pill labeled "Ideation phase"), but this fetch
// promotes it to a real section with its own heading, "Ideation flow"
// (not "Ideation phase" — the label itself changed too), and reorders
// its content: the closing paragraph ("That's the problem we're
// currently tackling...") now comes AFTER both exhibits, not before
// them.
//
// The two exhibit images/video are the same assets SoWhereAreWeNow.tsx
// already established for these exact captions (beacon-value-pool-
// compare-exhibit.jpg, beacon-gallery-1.mp4) — this fetch's own second
// exhibit exported as two flattened static frames layered on top of each
// other (Figma's own way of representing a video it can't embed), not a
// second real asset to source.
export default function IdeationFlow() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-2">
      <Heading size="section" className="tracking-[-0.8px]">
        Ideation flow
      </Heading>
      <BodyCopy>
        The ideation phase has been one of our most challenging areas yet. Today, Beacon can generate multiple value
        pools to give users a head start, but our research showed that this isn’t enough. Users want to be more
        involved in the process. They want to shape, challenge, and develop ideas themselves rather than simply
        receive AI-generated suggestions.
      </BodyCopy>
      <div className="py-3">
        <Exhibit
          src="/images/home/beacon-value-pool-compare-exhibit.jpg"
          alt="Close-up of the Beacon Ideation detail panel's Get Started and Compare actions, letting a user weigh one value pool against another before committing"
          caption="Allow a more collaborative approach when users need to make a decision on which Value Pool they want to continue"
          height={300}
        />
      </div>
      <div className="py-3">
        <Exhibit
          video
          src="/images/home/beacon-gallery-1.mp4"
          poster="/images/home/beacon-gallery-1-poster.jpg"
          alt="Looping screen recording of the Beacon workspace: navigating between a company's profile sections while a generated value-pool card and its supporting research stay open alongside"
          caption="Helping users to understand more clearly what is happening, what’s the next step and what is the flow they will need to go through"
          height={300}
        />
      </div>
      <BodyCopy>
        That’s the problem we’re currently tackling: how might we combine the speed and intelligence of AI with the
        user’s own expertise and judgment? Below are a few snapshots of where that exploration is taking us.
      </BodyCopy>
    </div>
  );
}
