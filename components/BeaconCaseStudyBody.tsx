import Image from "next/image";
import Link from "next/link";
import HomeFooter from "@/components/HomeFooter";
import { Divider } from "@/components/Divider";
import { Tag } from "@/components/Tag";
import { CaseStudyImagePlaceholder } from "@/components/CaseStudyImagePlaceholder";
import { themedIcon } from "@/components/themedIcon";
import { insetBorder } from "@/components/typography";

// The actual case-study content, split out from BeaconCaseStudy.tsx so it
// can be next/dynamic-imported with ssr:false there. Beacon is
// password-gated (PasswordGate.tsx) — if this content lived directly in
// BeaconCaseStudy's own server-rendered JSX, Next.js would still have to
// serialize all of it (every paragraph, the headline, all the way down)
// into the page's initial HTML/flight payload for the client component to
// receive as `children`, whether or not the gate ever displays it — visible
// to anyone via "View Source" or a plain curl, no password or JS needed.
// Loading it as a separate chunk, fetched only after a correct submit,
// keeps the actual copy out of the page until then.
//
// Figma 283:6644 — full narrative rewrite of the Beacon case study,
// replacing the earlier hero+Outcomes-checklist version (257:77178).
// Same page shell as before (ThemeProvider wrapping a fixed Nav, a
// centered 688px column, HomeFooter) — see that history for the
// back-arrow/Nav rationale, still unchanged here.

// This page's own prose style — 14px Geist at tracking -0.112px, not the
// sitewide bodyText token's -0.128px. Confirmed against Figma's dev-mode
// export for every text block on this page; the previous Outcomes list
// already used this same value.
const sectionBody = "font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-primary";
// This page's inline sub-headings ("How it started", "My first steps", …)
// render dimmed (text-subtle) rather than full-strength — unlike the
// page-level heading token used for the hero title, h1/h2s elsewhere.
const sectionHeading = "font-serif text-[20px] leading-6 tracking-[-0.8px] text-text-subtle";
// "Some questions that drove the workshop:" — same size/tracking as
// sectionBody, but dimmed like sectionHeading rather than full-strength.
const sectionSubtleBody = "font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-subtle";

// Each section's copy, kept as separate paragraphs (rendered with a blank
// line between them) rather than one flat block — matches Figma's visible
// paragraph breaks; RoboticsCaseStudy's "Outcome" section does the same
// with inline <br /><br />.
type Section = { heading: string; paragraphs: string[] };

const SECTIONS_BEFORE_IMAGE_1: Section[] = [
  {
    heading: "How it started",
    paragraphs: [
      "After 1.5 years of working on client business-building projects at McKinsey, I joined Orchestro (formerly LINK) as its first full-time designer. Orchestro is an internal B2B platform that helps businesses define and track their goals, consolidate information into a unified view, and uncover bottlenecks and opportunities through AI-powered insights. Over time, the team went through significant changes. Six months ago, two additional products - Beacon and I2I - joined the Orchestro portfolio. With three products and two designers on the team, we divided ownership across the product suite and I took on the role of Lead Designer for Beacon and stayed as co-designer for Orchestro.",
    ],
  },
  {
    heading: "My first steps",
    paragraphs: [
      "When I took ownership of the product, it lacked a clear and consistent design direction. Several designers had contributed to it intermittently between client projects, resulting in fragmented pattern and experiences. My first priority was to create a structure and establish a stronger design foundation.",
      "I worked with leadership to align on extending the design system we had built for Orchestro across all three products. This gave us a shared foundation for implementing components, interaction patterns and experiences consistently across the product suite.",
    ],
  },
];

const SECTIONS_AFTER_IMAGE_1: Section[] = [
  {
    heading: "Collecting insights",
    paragraphs: [
      "Once we aligned on a consistent visual language, I shifted my focus to understanding Beacon more deeply: how it worked, how people were using it, and where the experience was falling short.",
      "I had heard many perspectives from leadership and colleagues who had previously worked on the product, but I wanted to go beyond internal assumptions and hear directly from users. So I started interviewing existing Beacon users and confirm, build up the personas we build for.",
      "The first round of interviews revealed a clear pattern: people loved the concept of Beacon, but struggled with the experience. They described the product as outdated, found it difficult to navigate between stages and most importantly didn’t fully trust the AI-generated outputs they received.",
    ],
  },
];

// "Reflection on the feedback" carries the workshop-questions Tag row
// nested inside it, so it's handled separately rather than folded into
// the generic Section list above.
const REFLECTION_PARAGRAPHS = [
  "After the interviews, we shared our findings with leadership and aligned on the need for a clear plan to turn these insights into action. I was invited to London to prepare and lead a workshop with the leadership team.",
  "Rather than jumping straight into features and solutions, I designed the session to push us beyond our usual ways of thinking and focus on bigger question: What should the next generation of Beacon become?",
  "The goal was to define a shared product vision, one that addressed the challenges we heard from users while also responding to shifts in the market and the rapidly evolving possibilities of AI.",
];

const WORKSHOP_QUESTIONS: { label: string; color: string }[] = [
  { label: "What is quality?", color: "#d9a900" },
  { label: "Why are we drawn to things that are quality?", color: "#00a2c2" },
  { label: "10 star experience", color: "#e5522e" },
  { label: "What makes a great product?", color: "#0d99ff" },
  { label: "Treasure island", color: "#d92100" },
];

const SECTIONS_AFTER_REFLECTION: Section[] = [
  {
    heading: "The turning point",
    paragraphs: [
      "The workshop marked a turning point. We started thinking about Beacon differently, not as a rigid, step-by-step experience, but as something more conversational, flexible, and user-led.",
      "What if you could move through the entire journey with a chat companion by your side? What if you could simply talk to Beam, our AI companion, name after a “beam of light”, and let the experience adapt around you?",
      "From there, we aligned ( and felt the support from leadership) on an incremental path toward Beacon 2.0; gradually introducing our new visual language while rethinking the core product experience.",
      "My role was to continue learning from our users while designing this new direction. Beacon 2.0 would become a chat-led experience, introducing new interaction patterns that allow users to navigate more freely, explore ideas naturally, and stay in control of their journey, putting them in the driver’s seat rather than making them a passenger.",
    ],
  },
  {
    heading: "So, where are we now?",
    paragraphs: [
      "Since the workshop, I’ve been continuously iterating on the new direction for Beacon together with my PM, Milan. We’re now approaching implementation of the first increment: Workspace generation. To get here, we explored multiple concepts, tested them with users, and used their feedback to refine the experience along the way.",
      "The ideation phase has been one of our most challenging areas yet. Today, Beacon can generate multiple value pools to give users a head start, but our research showed that this isn’t enough. Users want to be more involved in the process. They want to shape, challenge, and develop ideas themselves rather than simply receive AI-generated suggestions.",
      "That’s the problem we’re currently tackling: how might we combine the speed and intelligence of AI with the user’s own expertise and judgment? Below are a few snapshots of where that exploration is taking us.",
    ],
  },
];

function ProseSection({ heading, paragraphs }: Section) {
  return (
    <div className="flex flex-col items-start gap-2">
      <p className={sectionHeading}>{heading}</p>
      <p className={sectionBody}>
        {paragraphs.map((paragraph, i) => (
          <span key={i}>
            {paragraph}
            {i < paragraphs.length - 1 && (
              <>
                <br />
                <br />
              </>
            )}
          </span>
        ))}
      </p>
    </div>
  );
}

export default function BeaconCaseStudyBody() {
  return (
    <>
      {/* pt-[140px]: same nav-clearance offset as the home page (Nav is
          `fixed`, so this column carries the whole gap itself). The back
          button sits inside that same gap, absolutely positioned so it
          doesn't add any extra height of its own — its Figma position
          (y:30) lines up with the fixed nav pill's own vertical center. */}
      <div className="relative mx-auto w-full max-w-[688px] pb-[60px] pt-[140px]">
        <Link
          href="/"
          aria-label="Back to home"
          className={`absolute left-0 top-[30px] flex size-6 items-center justify-center rounded-full p-1 ${insetBorder}`}
        >
          <Image src="/images/home/work-back-arrow.svg" alt="" width={16} height={16} className={themedIcon} />
        </Link>

        <div className="flex flex-col gap-12">
          {/* Small 248x147 hero thumbnail — the same backdrop+inset-screen
              composition as the "Selected works" card on the home page
              (SelectedWorks.tsx), just cropped smaller here, so this
              reuses those exact assets rather than new Figma exports. */}
          {/* flex-col on narrow viewports: the fixed 248px image alone
              eats most of a phone's width, leaving barely any room for
              the headline beside it and clipping most of the meta row
              entirely. Stacking removes that fixed-width competition —
              sm: and up returns to the original side-by-side layout. */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-lg bg-bg-tertiary sm:h-[147px] sm:w-[248px]">
              <Image
                src="/images/home/selected-work-1-backdrop.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 640px) 248px, 100vw"
              />
              <div className="absolute left-[19px] top-4 h-[358px] w-[530px] overflow-hidden rounded-lg blur-[1px]">
                <Image
                  src="/images/home/selected-work-1-screen.jpg"
                  alt="Beacon product screen"
                  fill
                  className="object-cover"
                  sizes="530px"
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-start justify-between gap-4 sm:h-[147px] sm:flex-1 sm:gap-0">
              <p className="whitespace-pre-wrap font-serif text-[20px] leading-6 tracking-[-0.8px] text-text-primary">
                Ideas don’t become viable ventures by default.  Designing how agentic AI helps founders research,
                validate and turn ideas into ventures.
              </p>
              <div className="flex w-full items-center justify-between font-sans text-[14px] tracking-[-0.112px]">
                <div className="flex items-center gap-2">
                  <p className="text-text-primary">Project</p>
                  <p className="text-text-subtle">Beacon &amp; Orchestro</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-text-primary">Year</p>
                  <p className="text-text-subtle">2024-2026</p>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-6">
            {SECTIONS_BEFORE_IMAGE_1.map((section) => (
              <ProseSection key={section.heading} {...section} />
            ))}

            <CaseStudyImagePlaceholder />

            {SECTIONS_AFTER_IMAGE_1.map((section) => (
              <ProseSection key={section.heading} {...section} />
            ))}

            <div className="flex flex-col items-start gap-2">
              <p className={sectionHeading}>Reflection on the feedback</p>
              <div className="flex w-full flex-col gap-4">
                <p className={sectionBody}>
                  {REFLECTION_PARAGRAPHS.map((paragraph, i) => (
                    <span key={i}>
                      {paragraph}
                      {i < REFLECTION_PARAGRAPHS.length - 1 && (
                        <>
                          <br />
                          <br />
                        </>
                      )}
                    </span>
                  ))}
                </p>
                <div className="flex flex-col gap-2">
                  <p className={sectionSubtleBody}>Some questions that drove the workshop:</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {WORKSHOP_QUESTIONS.map(({ label, color }) => (
                      <Tag key={label} label={label} color={color} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {SECTIONS_AFTER_REFLECTION.map((section) => (
              <ProseSection key={section.heading} {...section} />
            ))}

            <CaseStudyImagePlaceholder />
          </div>
        </div>
      </div>

      <HomeFooter />
    </>
  );
}
