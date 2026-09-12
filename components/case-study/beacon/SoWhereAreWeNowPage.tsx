import Image from "next/image";
import { Divider } from "@/components/Divider";
import { CardBody, Eyebrow, Heading, BodyCopy, ScrollFadeCard, InsightTag, Finding, Exhibit } from "@/components/case-study/primitives";

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
      <CardBody>
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
      </CardBody>
    </ScrollFadeCard>
  );
}
