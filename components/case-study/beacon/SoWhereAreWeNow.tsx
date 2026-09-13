import { Heading, BodyCopy, Eyebrow, Exhibit } from "@/components/case-study/primitives";

// Figma 158:1354 — a full restructure of this section, folding what
// used to be its own separate top-level page section (IdeationFlow.tsx,
// "Next up: Ideation flow") back into THIS one as its own final
// subsection, not a sibling of it — this fetch's own single frame
// contains both, back to back, with a hairline divider between them
// (and a second one further up), not two independently-spaced page
// sections. IdeationFlow.tsx is removed outright; BeaconLongForm.tsx no
// longer renders it separately.
//
// Real content changes from the version this replaces, confirmed
// directly against this node rather than carried over on assumption:
// - The Nike value-pools hero screenshot (beacon-ideation-nike-value-
//   pools.jpg) is gone. Not relocated — this node has no third exhibit
//   in the intro at all.
// - "Insights gained" is gone as its own heading, and so is the NotesIcon-
//   bordered-panel / LoopIcon treatment the two findings used to have.
//   In its place: one flowing paragraph ending in the same two
//   interview quotes, now plain italic text-subtle (not text-secondary,
//   not boxed).
// - Two hairline dividers (Figma "Vector 52/53", a 1px border-subtle
//   line) now separate the page's own three real beats here: the
//   interview-feedback paragraph, "What we changed", and "Next up:
//   Ideation flow" — a structural device this section didn't have
//   before.
// - The Ideation subsection gained a third exhibit slot ahead of the
//   two it already had: Figma's own "Frame 2147204703" child has no
//   fill at all (an intentionally still-empty spot, not an asset this
//   fetch failed to surface), labeled with the same bracketed Eyebrow
//   style "[ Quick review ]" already uses elsewhere on this page.
//   Filled directly with a real screen recording supplied afterward
//   (the author's own Figma canvas working the Ideation problem space)
//   — compressed from a 150MB/3022x1790 source via avconvert
//   (Preset960x540, no ffmpeg in this environment) down to a real web
//   asset, with a first-frame poster extracted the same way this site's
//   other video exhibits already use one.
// - The gallery video's own caption text is unchanged, and this node's
//   own flat export of that same beat is a raw 1920x1080 GIF (1000+
//   frames, ~400MB) rather than a video — reused as-is (beacon-
//   gallery-1.mp4 + its poster) rather than importing that GIF
//   verbatim; it's the same screen recording, just exported differently,
//   and the site's own already-optimized loop is the better asset.
function Divider() {
  return <div className="h-px w-full bg-border-subtle" />;
}

const SUBHEADING = "font-sans text-[16px] font-semibold leading-6 text-text-primary";

export default function SoWhereAreWeNow() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-6">
      <div className="flex w-full flex-col gap-2">
        <Heading size="section" className="tracking-[-0.8px]">
          So where are we now?
        </Heading>
        <div className="flex w-full flex-col">
          <BodyCopy>
            Since the workshop, I’ve been continuously iterating on the new direction for Beacon together with my PM,
            Milan.
          </BodyCopy>
          <div className="flex flex-col">
            <BodyCopy>We’re now approaching implementation of the first increment: Workspace generation.</BodyCopy>
            <BodyCopy>
              To get here, we explored multiple concepts, tested them with users, and used their feedback to refine
              the experience along the way.
            </BodyCopy>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col">
          <BodyCopy>
            Conducting usability testing sessions throughout the process highlighted areas for improvement. Several
            users noted that the canvas and chat interactions felt disjointed.
          </BodyCopy>
          <BodyCopy className="italic" muted>
            “ Now what I struggle is like, I am looking my problem here, but the conversation is far away, is on the
            other side”
          </BodyCopy>
          <BodyCopy className="italic" muted>
            “ I kind of have to mentally bounce between left and right for my actions...”
          </BodyCopy>
        </div>
        <Divider />
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col">
            <p className={SUBHEADING}>What we changed</p>
            <BodyCopy>
              In the next iteration, we brought guidance and actions closer to where users were already working and
              moved the chat composer to the center of the creation flow, keeping the conversation and user’s
              attention in one place.
            </BodyCopy>
          </div>
          <Exhibit
            src="/images/home/beacon-ideation-question-exhibit.jpg"
            alt="A structured guided question ('Starting fresh or validating something you already have?') surfaced inline with the chat composer at the center of the workspace, with Skip and Continue actions"
            caption="We moved the chat composer to the center of the creation flow, keeping the conversation and users’ attention in one place."
            height={350}
          />
        </div>
      </div>

      <Divider />

      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full flex-col">
          <p className={SUBHEADING}>
            <span className="text-text-subtle">Next up:</span> Ideation flow
          </p>
          <BodyCopy>
            The ideation phase has been one of our most challenging areas yet. Today, Beacon can generate multiple
            value pools to give users a head start, but our research showed that this isn’t enough. Users want to be
            more involved in the process. They want to shape, challenge, and develop ideas themselves rather than
            simply receive AI-generated suggestions.
          </BodyCopy>
        </div>

        <div className="flex w-full flex-col gap-2">
          <Eyebrow>[ My creative process &amp; thinking through the problem space for Ideation phase ]</Eyebrow>
          <Exhibit
            video
            src="/images/home/beacon-ideation-process.mp4"
            poster="/images/home/beacon-ideation-process-poster.jpg"
            alt="Screen recording of the author's own Figma canvas working through the Ideation phase's problem space, sketching and annotating as the thinking develops"
            height={350}
          />
        </div>

        <div className="flex w-full flex-col gap-2">
          <BodyCopy>
            That’s the problem we’re currently tackling: how might we combine the speed and intelligence of AI with
            the user’s own expertise and judgment? Below are a few snapshots of where that exploration is taking us.
          </BodyCopy>
          <div className="py-3">
            <Exhibit
              src="/images/home/beacon-value-pool-compare-exhibit.jpg"
              alt="Close-up of the Beacon Ideation detail panel's Get Started and Compare actions, letting a user weigh one value pool against another before committing"
              caption="Allow a more collaborative approach when users need to make a decision on which Value Pool they want to continue"
              height={350}
            />
          </div>
          <Eyebrow>Prototype:</Eyebrow>
          <div className="py-3">
            <Exhibit
              video
              src="/images/home/beacon-gallery-1.mp4"
              poster="/images/home/beacon-gallery-1-poster.jpg"
              alt="Looping screen recording of the Beacon workspace: navigating between a company's profile sections while a generated value-pool card and its supporting research stay open alongside"
              caption="Assisting users in gaining a clearer understanding of the current situation, the next steps, and the overall process they will follow"
              height={350}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
