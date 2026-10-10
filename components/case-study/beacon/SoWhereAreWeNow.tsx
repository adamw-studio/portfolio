import Image from "next/image";
import { Heading, BodyCopy } from "@/components/case-study/primitives";
import { CardRow } from "@/components/case-study/CardRow";

// NOT the page's own 512px text-column inset (KeyFindingsRow.tsx's own
// constant, which this file first copied) — that formula centers a
// notional 512px-wide thing, but this row's own cards are 688px wide.
// With `centered` below, CardRow applies this same value as BOTH left
// and right padding, so reusing the 512 figure left the row's padding
// sized for a card 176px narrower than the one actually in it — a
// constant 88px rightward offset from true viewport-center at every
// width, confirmed live (computed paddingLeft/Right matched the 512
// formula exactly, not the card's own real size) and reported live as
// "not good... the first image should be in the middle". Built from
// this row's own real 688px card width instead, so `centered` actually
// centers what's actually there.
const ALIGN_INSET = "max(1rem, calc((100vw - 688px) / 2))";

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
// Exhibit imagery is new throughout: product screenshots (Beacon's own
// "Create new workspace" onboarding flow, and the new voice-control
// composer in its idle/listening states) floating over shared landscape
// illustrations, Beacon's own painterly onboarding art reused as this
// section's own backdrop. Both image rows are real carousels now
// (Figma 235:526 and 244:698, each its own "Carouser" + Prev/dots/Next
// control — see each CardRow's own doc comment below for the full
// reasoning), not the static "hero + row of two" layout this section
// first shipped with. One slide in the second carousel is a reserved,
// still-empty video spot — matches that slide's own Figma node (246:757:
// a bare rect, no `src`) directly, not a fetch gap.
//
// Every exhibit renders through FlatCard: a single already-flattened
// image per slide, not live CSS layering of a separate background +
// inset screenshot. An earlier version of this section (LandscapeExhibit.tsx,
// since deleted) tried the live-layering approach and drifted from
// Figma's real proportions on every shape it was tried on — cropping a
// screenshot's own sidebar off, under-filling a card with visible
// letterbox bars, landing at the wrong size entirely once an aspect
// ratio was fixed. Every slide here is instead composited once, offline,
// directly from Figma's own layer offsets (confirmed via get_metadata on
// each node, never estimated) using Pillow's exact object-cover math —
// deterministic, not visually tuned, and not something this file's own
// CSS has to get right at render time.
function FlatCard({
  src,
  alt,
  aspect = "336 / 400",
  sizes = "(min-width: 688px) 336px, 46vw",
}: {
  src: string;
  alt: string;
  aspect?: string;
  sizes?: string;
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: aspect }}>
      <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
    </div>
  );
}

// The one slide that isn't a flattened FlatCard: the reserved spot
// (246:757) had no asset in Figma when this carousel was first built,
// so it rendered as a plain black box; supplied afterward as a real
// screen recording. A live <video> can't be baked into FlatCard's own
// static JPEG the way every other slide's screenshot was, so this
// layers it the same two-layer way LandscapeExhibit.tsx once tried to
// do EVERY slide (background bleed under an inset) — safe here
// specifically because there's only one geometry to get right, not five
// different ones, and because the numbers come straight from this
// node's own get_metadata (left 10.7558%/top 4.25%/width 78.4884%/
// height 91.25%, from 74,17,540,365 inside the 688x400 card), not
// eyeballed. rounded-lg on the inset, not the 8px every other slide's
// own inset uses — this node's own "1 1" rect is rounded-[12px], this
// project's own --radius-lg value, a real difference confirmed against
// the node, not an inconsistency to normalize away.
function VideoExhibitCard() {
  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: "688 / 400" }}>
      <Image
        src="/images/home/beacon-sowhere-carousel2-video-bg.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="(min-width: 688px) 688px, 92vw"
      />
      <div
        className="absolute overflow-hidden rounded-lg"
        style={{ left: "10.7558%", top: "4.25%", width: "78.4884%", height: "91.25%" }}
      >
        <video
          src="/videos/beacon/beacon-sowhere-voice-demo.mp4"
          poster="/images/home/beacon-sowhere-voice-demo-poster.jpg"
          aria-label="Screen recording demoing Beacon's voice control: Beam reading a quick overview aloud while the transcript scrolls alongside it"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </div>
  );
}

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

      {/* Figma 235:526 — rebuilt as an actual carousel on direct
          instruction, matching a later re-fetch of this exact node that
          now names its row "Carouser" and adds a Prev/dots/Next
          "Segmented Control" below it: a 688px viewport (get_metadata on
          244:687) showing one of three 688x400 slides at a time, the
          other two positioned past its right edge waiting to scroll in.
          CardRow is a precise match for that control already — Figma's
          own dot treatment (one wider "active" pill, matching
          classes down to `w-3.5` vs `w-2`) is CardRow's own existing
          Prev/dots/Next, not a new pattern built to look like it.
          cardWidth=688 is this row's real width (not the narrower 512px
          text column), so only one slide shows at a time here exactly
          as Figma's own clipped viewport does. gap=40, not CardRow's own
          12px default — this row's own gap-[40px] (get_metadata on
          244:687) — reported live as "no spacing between the cards" at
          the default: real, but easy to miss at 12px against two slides
          sharing the same background painting. centered: reported live
          ("the first image should be in the middle first, the other two
          to its right") — the first slide starts centered in the
          viewport with equal peek on both sides, matching this row's
          own gap-[40px]-and-clipped-viewport composition in Figma,
          rather than CardRow's other default (flush against the page's
          own left text margin, every peek on the right only) that every
          *other* row on this page (Quick review, Key findings) uses on
          purpose for a different reason — this carousel is Figma's own
          single clipped window, not a "scroll to see more of a long
          row" list like those two.

          Each slide is Figma's own flattened composite (background
          bleed + screenshot), but NOT from get_screenshot this time —
          get_screenshot on the two off-viewport slides (244:691/244:694)
          returned truncated/degenerate renders (Figma's renderer treats
          anything outside the parent "Carouser" frame's own clip as
          partially or fully invisible). Composited locally instead,
          directly from this node's own raw layers (get_design_context):
          each slide's background and screenshot use the SAME offsets
          Figma specifies (confirmed via get_metadata, not estimated) —
          card 1's background placed at -500,-369 and its screenshot
          inset at 100,35/488x329; cards 2-3 share one background
          placement (-902,-434) and the identical screenshot inset as
          card 1. Built with Pillow at exact pixel math (object-cover
          scale + center-crop per layer, an 8px-radius mask on the inset,
          both scaled 2x for a retina-sharp result from the same
          4096px-wide screenshot sources already used elsewhere on this
          page) rather than CSS layering — every earlier attempt at this
          same composite via live CSS (LandscapeExhibit.tsx, since
          deleted) drifted from Figma's real proportions across three
          separate tries; this is deterministic instead of visually
          tuned.

          Wrapped in a plain <div className="w-full">, not returned
          bare — the same real bug GalleryD.tsx hit on Monday's page
          (see that file's own doc comment for the fuller mechanism):
          without this wrapper, CardRow's own full-bleed root (`relative
          left-1/2 w-screen -translate-x-1/2`) becomes a DIRECT child of
          this component's own outer `items-center` flex column, and
          `items-center` centers that (much wider, 100vw) element based
          on its own size before the left/translate math runs, throwing
          the whole calculation off — confirmed live: the scroller's own
          full-bleed root resolved to a left offset hundreds of px away
          from where the (correctly-fixed) alignInset math alone would
          put it, explaining why centering kept reading as wrong even
          after that fix. Every earlier CardRow caller on this site
          either already had a non-`items-center` wrapper for its own
          Eyebrow caption, or (Quick review/Key findings) never used
          `centered` in the first place, which happens to make this
          exact bug invisible either way — this is the first row on
          Beacon's own page to need the wrapper on its own merits. */}
      <div className="w-full">
        <CardRow
          ariaLabel="Workspace generation onboarding flow"
          cardWidth={688}
          gap={40}
          alignInset={ALIGN_INSET}
          centered
          items={[
            {
              id: "create",
              content: (
                <FlatCard
                  src="/images/home/beacon-sowhere-carousel-create.jpg"
                  alt="Beacon's 'Create new workspace' onboarding screen, asking for a company name, workspace name, and whether the user wants to discover new venture ideas or validate an existing one, floating over Beacon's own painterly onboarding backdrop"
                  aspect="688 / 400"
                  sizes="(min-width: 688px) 688px, 92vw"
                />
              ),
            },
            {
              id: "objectives",
              content: (
                <FlatCard
                  src="/images/home/beacon-sowhere-carousel-objectives.jpg"
                  alt="The onboarding flow's next step, asking for the company's objectives and any supporting documents, floating over Beacon's own painterly onboarding backdrop"
                  aspect="688 / 400"
                  sizes="(min-width: 688px) 688px, 92vw"
                />
              ),
            },
            {
              id: "loading",
              content: (
                <FlatCard
                  src="/images/home/beacon-sowhere-carousel-loading.jpg"
                  alt="A loading screen reading 'Now, it's time to explore ideas...' as Beacon sets up the new workspace, floating over Beacon's own painterly onboarding backdrop"
                  aspect="688 / 400"
                  sizes="(min-width: 688px) 688px, 92vw"
                />
              ),
            },
          ]}
        />
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

      {/* Figma 244:698 — this row's own carousel, same "Carouser" pattern
          as the one above (get_metadata on 246:754: a 688px viewport,
          three 688x400 slides at x=0/728/1456), same CardRow treatment
          for the same reasons (see that row's own doc comment above —
          cardWidth/gap/alignInset/centered/the items-center wrapper all
          apply identically here, not re-explained per slide).

          Slide 1 was the reserved video spot (246:757 — a bare 540x365
          rect, no `src` in Figma) until a real screen recording was
          supplied directly afterward (Voice-Video.mov, converted via
          avconvert — no ffmpeg in this environment — to a 1280x720 web
          asset, ~10MB down from the source's 55MB); see
          VideoExhibitCard's own doc comment above for why this one
          slide layers a live <video> instead of using FlatCard like
          every other slide. Slides 2-3 reuse the exact voice-idle/
          voice-listening screenshots this row already had, just
          recomposited at this carousel's own per-slide geometry
          (confirmed via get_metadata, not assumed to match the first
          carousel's): slide 2 shares the wide background crop and
          488x329 inset every non-hero slide on this page uses, but
          slide 3's own inset is a real outlier — 783x528, and
          positioned 174px above the card's own top edge — a deliberately
          closer, more cropped view of the "Listening…" screen, not a
          mistake to normalize toward the other slides' shared geometry. */}
      <div className="w-full">
        <CardRow
          ariaLabel="Voice control"
          cardWidth={688}
          gap={40}
          alignInset={ALIGN_INSET}
          centered
          items={[
            {
              id: "video-demo",
              content: <VideoExhibitCard />,
            },
            {
              id: "voice-idle",
              content: (
                <FlatCard
                  src="/images/home/beacon-sowhere-carousel2-voice-idle.jpg"
                  alt="Beacon's chat composer at rest, reading 'Ask Beam anything...' with a microphone icon for voice input, floating over Beacon's own painterly onboarding backdrop"
                  aspect="688 / 400"
                  sizes="(min-width: 688px) 688px, 92vw"
                />
              ),
            },
            {
              id: "voice-listening",
              content: (
                <FlatCard
                  src="/images/home/beacon-sowhere-carousel2-voice-listening.jpg"
                  alt="The same composer actively listening to a voice note, showing a live waveform and timer, floating over Beacon's own painterly onboarding backdrop, shown in a closer crop"
                  aspect="688 / 400"
                  sizes="(min-width: 688px) 688px, 92vw"
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
