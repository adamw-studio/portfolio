import type { ReactNode } from "react";
import Image from "next/image";
import { Divider } from "@/components/Divider";
import { Eyebrow, Heading, BodyCopy, ScrollFadeCard } from "@/components/case-study/primitives";

// Figma 120:4168 ("agile") — a small looping-arrow glyph that flags each
// insights/findings tag below. fill="currentColor" (not the exported
// SVG's own literal rgba(244,244,244,0.4)) so it inherits text-subtle
// and actually flips with the site's light/dark theme, the same reason
// every other page here maps a Figma color to a token instead of a
// fixed literal. Kept local rather than promoted to components/icons/ —
// nothing else in this system needs this exact glyph yet.
function LoopIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.35355 0.97978C8.54881 1.17504 8.54881 1.49162 8.35355 1.68689L7.51651 2.52393C10.3119 2.78429 12.5 5.13661 12.5 8C12.5 11.0376 10.0376 13.5 7 13.5H1.33333C1.05719 13.5 0.833333 13.2761 0.833333 13C0.833333 12.7239 1.05719 12.5 1.33333 12.5H7C9.48528 12.5 11.5 10.4853 11.5 8C11.5 5.71025 9.78983 3.81993 7.5771 3.53666L8.35355 4.31311C8.54881 4.50838 8.54881 4.82496 8.35355 5.02022C8.15829 5.21548 7.84171 5.21548 7.64645 5.02022L5.97978 3.35355C5.78452 3.15829 5.78452 2.84171 5.97978 2.64645L7.64645 0.97978C7.84171 0.784518 8.15829 0.784518 8.35355 0.97978ZM4.93691 3.41669C5.07497 3.65585 4.99301 3.96164 4.75386 4.09969C3.40557 4.87802 2.5 6.33355 2.5 8C2.5 9.01362 2.83453 9.94766 3.39942 10.6997C3.56526 10.9205 3.52072 11.2339 3.29992 11.3998C3.07913 11.5656 2.7657 11.5211 2.59985 11.3003C1.90936 10.381 1.5 9.23759 1.5 8C1.5 5.96183 2.6089 4.18325 4.25391 3.23364C4.49306 3.09558 4.79885 3.17754 4.93691 3.41669ZM12.6464 10.6464C12.8417 10.4512 13.1583 10.4512 13.3536 10.6464L15.0202 12.3131C15.2155 12.5084 15.2155 12.825 15.0202 13.0202L13.3536 14.6869C13.1583 14.8821 12.8417 14.8821 12.6464 14.6869C12.4512 14.4916 12.4512 14.175 12.6464 13.9798L13.4596 13.1667H11.6667C11.3905 13.1667 11.1667 12.9428 11.1667 12.6667C11.1667 12.3905 11.3905 12.1667 11.6667 12.1667H13.4596L12.6464 11.3536C12.4512 11.1583 12.4512 10.8417 12.6464 10.6464Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InsightTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-lg bg-bg-secondary px-2.5 py-0.5 font-sans text-[14px] leading-6 text-text-secondary">
      <LoopIcon className="size-4 shrink-0 text-text-subtle" />
      {children}
    </span>
  );
}

// A labeled research finding under an "Insights gained"/"Ideation Phase"
// tag — a bold title with its own content directly beneath, no gap
// (matching CollectingInsightsPage's own KeyFinding shape). Kept local
// and separate from that component rather than shared: both of this
// page's findings keep their content at full text-primary opacity,
// never text-subtle/muted, which KeyFinding has no variant for.
function Finding({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex w-full flex-col items-start">
      <p className="font-sans text-[14px] font-semibold leading-6 text-text-primary">{title}</p>
      {children}
    </div>
  );
}

// A full-width screenshot exhibit: a 240px-tall image over a bg-tertiary
// fallback fill (in case the image is still loading), with its own
// small centered caption underneath — Figma's own repeated pattern for
// the four "what we changed"/"what we're exploring" snapshots below.
//
// `video`: renders a looping, autoplaying, muted <video> instead of an
// <Image> — this exhibit's own asset (325:353 in the design-studio
// file, "Beacon-IdeationFlow") is a screen recording, not a still. It's
// the same source already sitting in this project as
// beacon-gallery-1.mp4/-poster.jpg (confirmed by content, not just
// name) — reused rather than re-exported. autoPlay+loop+muted+
// playsInline is what actually satisfies "make sure it works and
// loops" with zero JS: no user gesture is required to start a muted
// video, and `loop` repeats it natively once it ends.
function Exhibit({
  src,
  alt,
  caption,
  video = false,
  poster,
}: {
  src: string;
  alt: string;
  caption: string;
  video?: boolean;
  poster?: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="relative h-[240px] w-full overflow-hidden rounded-2xl bg-bg-tertiary">
        {video ? (
          <video
            src={src}
            poster={poster}
            aria-label={alt}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Image src={src} alt={alt} fill className="object-cover" sizes="(min-width: 480px) 384px, 100vw" />
        )}
      </div>
      <p className="max-w-[312px] text-center font-sans text-[10px] leading-normal text-text-secondary">{caption}</p>
    </div>
  );
}

// Figma 115:4032 — a "[06]" step number (continuing 01-05), the card's
// intro trimmed down to make room for two rounds of "insights gained"
// findings (each behind its own tag), and four screenshot exhibits
// illustrating what changed along the way. This page was already the
// longest card here even before this grew it further, so ScrollFadeCard
// (already in place) does real, expected work now — most viewports will
// scroll this card's full length rather than see it all at once.
//
// The card's own surface is bg-tertiary-solid (opaque), not bg-tertiary
// (5% alpha) + backdrop-blur: reported live as the page's own dot-grid
// background still showing through the card, just softened by the blur
// rather than actually hidden — a translucent surface can't fully block
// what's behind it no matter how much it's blurred. globals.css's own
// comment on bg-tertiary-solid has the exact blend. The exhibits' own
// bg-tertiary fallback fill is unrelated — it's fully covered by a real
// photo once that loads, and sits behind this now-opaque card either
// way, so it never has anything patterned to leak through.
//
// The hero screenshot (115:4049) is a placeholder-plus-image pair, not
// a single object-cover fill — same technique OverviewPage's own
// backdrop/screen thumbnail already uses: an outer bg-tertiary frame
// that clips, with the real screenshot as an oversized inner layer
// positioned inside it (left 19px/top 16px, 530x358 against the
// frame's own 382x220), so only a specific top-left-anchored crop
// shows rather than whatever object-fit:cover's own auto-centering
// would pick. Figma's literal pixels become percentages of that same
// 382x220 frame (4.97%/7.27% offset, 138.7%/162.7% size) so it still
// holds at the card's own narrower mobile widths.
export default function SoWhereAreWeNowPage() {
  return (
    <ScrollFadeCard
      style={{ aspectRatio: "440 / 600" }}
      className="w-full max-w-[440px] rounded-[20px] border border-border-disabled bg-bg-tertiary-solid shadow-[0px_1px_16px_0px_rgba(23,23,23,0.06)]"
    >
      <div className="flex flex-col gap-6 p-7">
        <div className="flex flex-col gap-1">
          <Eyebrow style={{ fontFeatureSettings: '"zero" 1, "lnum" 1, "tnum" 1' }}>[06]</Eyebrow>
          <Heading size="md">So, where are we now?</Heading>
        </div>
        <BodyCopy>
          Since the workshop, I’ve been continuously iterating on the new direction for Beacon together with my PM,
          Milan.
        </BodyCopy>
        <div className="relative h-[220px] w-full overflow-hidden rounded-lg bg-bg-tertiary">
          <div className="absolute left-[4.97%] top-[7.27%] h-[162.73%] w-[138.74%] overflow-hidden rounded-lg">
            <Image
              src="/images/home/beacon-ideation-value-pools.jpg"
              alt="Screenshot of the Beacon Ideation view: a list of AI-generated value pools alongside a detail panel for one of them, with a Compare action to evaluate options side by side"
              fill
              className="object-cover"
              sizes="(min-width: 480px) 384px, 100vw"
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <BodyCopy>We’re now approaching implementation of the first increment: Workspace generation.</BodyCopy>
          <BodyCopy>
            To get here, we explored multiple concepts, tested them with users, and used their feedback to refine
            the experience along the way.
          </BodyCopy>
        </div>

        <Divider />

        <div className="flex w-full flex-col items-start gap-3">
          <InsightTag>Insights gained</InsightTag>
          <div className="flex w-full flex-col items-start gap-4">
            <Finding title="Canvas - Chat spatial disconnect">
              <div className="flex w-full flex-col items-start gap-1">
                <BodyCopy>“ Now what I struggle is like, I am looking my problem here, but the conversation is far away, is on the other side”</BodyCopy>
                <BodyCopy>“ I kind of have to mentally bounce between left and right for my actions...”</BodyCopy>
              </div>
            </Finding>
            <Finding title="What we changed">
              <BodyCopy>
                The feedback revealed that separating the conversation from the canvas was splitting users’
                attention. In the next iteration, we brought guidance and actions closer to where users were already
                working.
              </BodyCopy>
            </Finding>
          </div>
        </div>

        <Exhibit
          src="/images/home/beacon-chat-composer-exhibit.jpg"
          alt="The chat composer relocated to the center of the workspace canvas, presenting a multiple-choice question inline with the conversation"
          caption="We moved the chat composer to the center of the creation flow, keeping the conversation and users’ attention in one place."
        />
        <Exhibit
          src="/images/home/beacon-floating-island-exhibit.jpg"
          alt="A floating “Up next” card hovering over the workspace canvas, surfacing the next step directly on top of the content"
          caption="We brought key actions directly onto the workspace canvas as a floating island, making the next step easier to discover and act on."
        />

        <Divider />

        <div className="flex w-full flex-col items-start gap-3">
          <InsightTag>Ideation Phase</InsightTag>
          <div className="flex flex-col gap-6">
            <BodyCopy>
              The ideation phase has been one of our most challenging areas yet. Today, Beacon can generate multiple
              value pools to give users a head start, but our research showed that this isn’t enough.
            </BodyCopy>
            <BodyCopy>
              Users want to be more involved in the process. They want to shape, challenge, and develop ideas
              themselves rather than simply receive AI-generated suggestions.
            </BodyCopy>
            <BodyCopy>
              That’s the problem we’re currently tackling: how might we combine the speed and intelligence of AI
              with the user’s own expertise and judgment? Below are a few snapshots of where that exploration is
              taking us.
            </BodyCopy>
          </div>
        </div>

        <Exhibit
          src="/images/home/beacon-value-pool-decision-exhibit.jpg"
          alt="Close-up of the Beacon Ideation detail panel's Get Started and Compare actions, letting a user weigh one value pool against another before committing"
          caption="Allow a more collaborative approach when users need to make a decision on which Value Pool they want to continue"
        />
        <Exhibit
          video
          src="/images/home/beacon-gallery-1.mp4"
          poster="/images/home/beacon-gallery-1-poster.jpg"
          alt="Looping screen recording of the Beacon workspace: navigating between a company's profile sections while a generated value-pool card and its supporting research stay open alongside"
          caption="Helping users to understand more clearly what is happening, what’s the next step and what is the flow they will need to go through"
        />
      </div>
    </ScrollFadeCard>
  );
}
