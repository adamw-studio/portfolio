import { Heading, BodyCopy } from "@/components/case-study/primitives";
import LandscapeExhibit from "@/components/case-study/beacon/LandscapeExhibit";

// Figma 239:549 — a full redesign of this section, not a restyle: the
// interview-feedback paragraph, its two quotes, "What we changed" and
// both hairline dividers that used to sit between them are gone outright
// (confirmed against this node directly, not carried over on
// assumption — it goes straight from the intro paragraphs to the first
// exhibit row). "Next up: Ideation flow" is also gone as a muted-prefix
// subheading; its own copy now sits under a plain "Still tackling:
// ideation" heading, the same size/weight as the section's own "So
// where are we now?" title, not CardBody's old SUBHEADING treatment.
//
// New second beat — "Giving users back the wheel" — came out of a live
// copy pass on an earlier draft of this same redesign (see this
// commit's own message): the raw draft read "Voice control" as an
// unrelated feature note with no connection to the page's own
// "driver's seat, not passenger" thread from TurningPoint.tsx. Renamed
// and rewritten to make that connection explicit instead of coincidental,
// and "Value pool generation with Beam by your side" (which overclaimed
// a solved feature the paragraph underneath was actually describing as
// still unsolved) became "Still tackling: ideation", matching every
// other heading on this page in naming a story beat, not a capability.
//
// Exhibit imagery is new throughout — LandscapeExhibit.tsx (own doc
// comment has the full visual reasoning): five product screenshots
// (Beacon's own "Create new workspace" onboarding flow, and the new
// voice-control composer in its idle/listening states) floating over
// two shared landscape illustrations, Beacon's own painterly onboarding
// art reused as this section's own backdrop. The one black, unfilled
// exhibit between the two headings and the final image row matches this
// node's own "1 1" child with no asset at all (234:530) — an
// intentionally empty slot in the Figma file itself, not a fetch
// failure, reserved for a video this redesign doesn't supply yet.
export default function SoWhereAreWeNow() {
  return (
    <div className="flex w-full flex-col items-center gap-[60px]">
      <div className="flex w-full max-w-[512px] flex-col gap-6">
        <div className="flex w-full flex-col gap-2">
          <Heading size="section" className="tracking-[-0.8px]">
            So where are we now?
          </Heading>
          <BodyCopy>
            Since the workshop, I’ve been continuously iterating on the new direction for Beacon together with our
            Product Manager and working closely with our engineering team.
          </BodyCopy>
        </div>
        <div className="flex flex-col">
          <BodyCopy>We’re now approaching implementation of the first increment: Workspace generation.</BodyCopy>
          <BodyCopy>
            To get here, we explored multiple concepts, tested them with users, and used their feedback to refine
            the experience along the way.
          </BodyCopy>
        </div>
      </div>

      <div className="flex w-full max-w-[688px] flex-col gap-4">
        <LandscapeExhibit
          bg="/images/home/beacon-sowhere-landscape-brush.jpg"
          src="/images/home/beacon-sowhere-workspace-create.jpg"
          alt="Beacon's 'Create new workspace' onboarding screen, asking for a company name, workspace name, and whether the user wants to discover new venture ideas or validate an existing one"
          width={512}
        />
        <div className="flex w-full items-center gap-4">
          <div className="min-w-0 flex-1">
            <LandscapeExhibit
              bg="/images/home/beacon-sowhere-landscape-brush.jpg"
              src="/images/home/beacon-sowhere-workspace-objectives.jpg"
              alt="The onboarding flow's next step, asking for the company's objectives and any supporting documents"
              width={336}
            />
          </div>
          <div className="min-w-0 flex-1">
            <LandscapeExhibit
              bg="/images/home/beacon-sowhere-landscape-brush.jpg"
              src="/images/home/beacon-sowhere-workspace-loading.jpg"
              alt="A loading screen reading 'Now, it's time to explore ideas...' as Beacon sets up the new workspace"
              width={336}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-[512px] flex-col gap-6">
        <div className="flex w-full flex-col gap-2">
          <Heading size="section" className="tracking-[-0.8px]">
            Still tackling: ideation
          </Heading>
          <BodyCopy>
            The ideation phase has been one of our most challenging areas yet. Today, Beacon can generate multiple
            value pools to give users a head start, but our research showed that this isn’t enough. Users want to be
            more involved in the process. They want to shape, challenge, and develop ideas themselves rather than
            simply receive AI-generated suggestions.
          </BodyCopy>
        </div>
        <BodyCopy>
          That’s the problem we’re currently tackling: how might we combine the speed and intelligence of AI with
          the user’s own expertise and judgment? Below are a few snapshots of where that exploration is taking us.
        </BodyCopy>
        <div className="flex w-full flex-col gap-2">
          <Heading size="section" className="tracking-[-0.8px]">
            Giving users back the wheel
          </Heading>
          <BodyCopy>
            That same “driver’s seat, not passenger” thinking is shaping another change: a UI/UX refresh introducing
            voice control. Leadership leaned toward keeping the current structure, so this became the way to address
            it without a rebuild, a feature users had already asked for, and one that puts the sense of control back
            in their hands rather than the interface’s.
          </BodyCopy>
        </div>
      </div>

      <div className="flex w-full max-w-[688px] flex-col gap-4">
        <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ aspectRatio: "512 / 400" }} />
        <div className="flex w-full items-center gap-4">
          <div className="min-w-0 flex-1">
            <LandscapeExhibit
              bg="/images/home/beacon-sowhere-landscape-cliff.jpg"
              src="/images/home/beacon-sowhere-voice-idle.jpg"
              alt="Beacon's chat composer at rest, reading 'Ask Beam anything...' with a microphone icon for voice input"
              width={336}
            />
          </div>
          <div className="min-w-0 flex-1">
            <LandscapeExhibit
              bg="/images/home/beacon-sowhere-landscape-brush.jpg"
              src="/images/home/beacon-sowhere-voice-listening.jpg"
              alt="The same composer actively listening to a voice note, showing a live waveform and timer"
              width={336}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
