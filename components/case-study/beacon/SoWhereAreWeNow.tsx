import Image from "next/image";
import { Heading, BodyCopy, LoopIcon, NotesIcon, Exhibit } from "@/components/case-study/primitives";

// Figma 148:7705 (re-fetched) — this section got noticeably shorter than
// the version it replaces: the "floating island" exhibit and the whole
// "Ideation phase" block (2 more exhibits + 2 more paragraphs) are gone
// from THIS node entirely. They didn't disappear from the page — Figma
// promoted "Ideation phase" to its own top-level section with a real
// heading of its own ("Ideation flow", node 148:8593 — see that file),
// not a subsection nested under this one any more. This file now covers
// only the intro + hero screenshot + "Insights gained" findings.
//
// Other real changes from the version this replaces:
// - The hero screenshot now comes AFTER all three intro paragraphs, not
//   between the first and the other two.
// - "Insights gained" is a plain section heading now (Heading
//   size="section"), not the small icon+pill InsightTag component.
// - The two findings each carry their own distinct icon (NotesIcon for
//   "Canvas - Chat spatial disconnect", LoopIcon for "What we changed"),
//   not one shared icon reused for both — and the first finding sits in
//   its own bordered panel, the second doesn't.
// - No dashed divider between the intro block and "Insights gained" —
//   just a 44px gap, confirmed against this node's own export (no
//   divider/vector present at all here, unlike earlier version of this
//   page which had one).
export default function SoWhereAreWeNow() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-2">
      <Heading size="section" className="tracking-[-0.8px]">
        So, where are we now?
      </Heading>
      <div className="flex w-full flex-col gap-11">
        <div className="flex w-full flex-col gap-4">
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
          <div className="relative h-[300px] w-full overflow-hidden rounded-2xl bg-bg-tertiary">
            <div className="absolute left-[4.3%] top-[7%] h-[119.33%] w-[103.52%] overflow-hidden rounded-xl">
              <Image
                src="/images/home/beacon-ideation-nike-value-pools.jpg"
                alt="Screenshot of the Beacon Ideation view: a list of AI-generated value pools for a US athletic-footwear company alongside a detail panel for 'AI performance intelligence', with a Compare action to evaluate options side by side"
                fill
                className="object-cover"
                sizes="(min-width: 480px) 512px, 100vw"
              />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <Heading size="section" className="tracking-[-0.8px]">
            Insights gained
          </Heading>
          <div className="flex w-full flex-col gap-7">
            <div className="flex w-full flex-col items-start gap-2 rounded-lg border border-border-subtle p-2">
              <div className="flex w-full items-center gap-2">
                <NotesIcon className="size-4 shrink-0 text-text-subtle" />
                <p className="font-sans text-[14px] font-semibold leading-6 text-text-primary">Canvas - Chat spatial disconnect</p>
              </div>
              <div className="flex w-full flex-col items-start gap-1">
                <p className="font-sans text-[14px] italic leading-6 text-text-secondary">
                  “ Now what I struggle is like, I am looking my problem here, but the conversation is far away, is on the other side”
                </p>
                <p className="font-sans text-[14px] italic leading-6 text-text-secondary">
                  “ I kind of have to mentally bounce between left and right for my actions...”
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full flex-col items-start">
                <div className="flex w-full items-center gap-2">
                  <LoopIcon className="size-4 shrink-0 text-text-subtle" />
                  <p className="font-sans text-[14px] font-semibold leading-6 text-text-primary">What we changed</p>
                </div>
                <BodyCopy>
                  The feedback revealed that separating the conversation from the canvas was splitting users’
                  attention. In the next iteration, we brought guidance and actions closer to where users were
                  already working.
                </BodyCopy>
              </div>
              <Exhibit
                src="/images/home/beacon-ideation-question-exhibit.jpg"
                alt="A structured guided question ('Starting fresh or validating something you already have?') surfaced inline with the chat composer at the center of the workspace, with Skip and Continue actions"
                caption="We moved the chat composer to the center of the creation flow, keeping the conversation and users’ attention in one place."
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
