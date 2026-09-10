import Image from "next/image";
import Nav from "@/components/Nav";
import HomeFooter from "@/components/HomeFooter";
import { Divider } from "@/components/Divider";
import { CaseStudyImageCarousel } from "@/components/CaseStudyImageCarousel";
import { ThemeProvider } from "@/components/ThemeContext";
import { BackButton } from "@/components/BackButton";

// Figma 283:7177 ("Revolution Robotics") — same narrative-rewrite pass as
// BeaconCaseStudy (283:6644): small hero thumbnail instead of a full-width
// banner, dimmed inline sub-headings, and gallery placeholders where the
// design reserves room for screenshots it doesn't ship yet. See
// BeaconCaseStudy.tsx for the shared rationale (page shell, prose tokens,
// CaseStudyImagePlaceholder).
const sectionBody = "font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-primary";
const sectionHeading = "font-serif text-[20px] leading-6 tracking-[-0.8px] text-text-subtle";

const CONTEXT_PARAGRAPHS = [
  "Revolution Robotics Foundation, founded in 2018, is a non-profit organization dedicated to making robotics education affordable, accessible, and fun for kids. They approached us to redesign their outdated mobile app, a key part of their mission to inspire the next generation of young engineers.",
  "I joined the project as the UX Lead and UI Designer, working closely with an exceptional UX Researcher over the course of seven months. My role spanned from leading client communication and facilitating workshops to creating interactive prototypes and designing the final user interface.",
  "Our goal was to reimagine the app experience — keeping it flexible and educational while reducing unnecessary complexity. Above all, we wanted to design an app that kids aged 8–14 could navigate independently, confidently building and programming robots without needing constant help from parents or instructors.",
];

// Figma 284:7332, 284:7337, 284:7345, 284:7354, 284:7359 — the "Context"
// gallery's 5 real slides. Each of those nodes actually exports several
// stacked, fully-overlapping <img> layers (a Figma duplicate-layer
// artifact); only the last/topmost one in each is the picture actually
// visible on the canvas, confirmed by screenshotting one of the nodes
// directly rather than assuming — so that's the one file kept per slide.
const CONTEXT_GALLERY = [
  { src: "/images/home/robotics-gallery-1.jpg", alt: "Workshop notes and the robotics kit on a table" },
  { src: "/images/home/robotics-gallery-2.jpg", alt: "Robot kit parts and cables laid out for assembly" },
  { src: "/images/home/robotics-gallery-3.jpg", alt: "Kids assembling a robot on the floor with a phone controller" },
  { src: "/images/home/robotics-gallery-4.png", alt: "Workshop whiteboard with sticky notes mapping the customer journey" },
  { src: "/images/home/robotics-gallery-5.png", alt: "Assembled robot in front of its Challenge Kit packaging" },
];

// Figma 297:8001, 297:8004, 297:8007, 284:7367 — the "Outcome" gallery's
// 4 slides, in the order the user's own frame names spelled out
// ("Image-1" through "Image-4"). The first three are the user's own
// high-resolution exports (1797-1830px wide) of Figma's "iphone-12--blue"
// phone-mockup component, placed directly rather than reconstructed:
// a flattened screenshot of the whole composed mockup node is capped at
// that node's own on-canvas size (512x301, matching this gallery's
// display box) and read as visibly soft once actually rendered, and
// hand-reconstructing the frame from its raw vector body/screen-mask
// layers (tried in between) came out visibly wrong — proportions off,
// the mask misaligned (see git history for that attempt). frame: "phone"
// shows a slide at its own aspect ratio (object-contain) rather than
// cropping it to fill the box (object-cover), needed for these real
// phone photos. robotics-outcome-design-system.png (284:7367, Image-4,
// not a phone) has no separate raw asset on its own composited node, so
// it uses its highest-resolution constituent layer instead (2132x1624).
const OUTCOME_GALLERY = [
  { src: "/images/home/robotics-outcome-configure.png", alt: "App screen: configuring a robot's motors", frame: "phone" as const },
  { src: "/images/home/robotics-outcome-coding.png", alt: "App screen: coding mode with drive, motors, sensors and lights blocks", frame: "phone" as const },
  { src: "/images/home/robotics-outcome-control.png", alt: "App screen: manually controlling a robot's movement and arm", frame: "phone" as const },
  { src: "/images/home/robotics-outcome-design-system.png", alt: "Design system screens: header variants, dropdowns, and widgets", frame: "phone" as const },
];

const OUTCOME_PARAGRAPHS = [
  "Through discovery workshops and early research, we gained a deep understanding of the brand’s mission, business goals, and user needs. We conducted usability testing with kids aged 8–14 to evaluate the existing app, uncover pain points, and identify opportunities for improvement.",
  "These insights guided every step of our redesign process. By running iterative usability tests throughout the project, we continuously refined our concepts based on real user feedback — ensuring that every design decision was validated and grounded in data.",
  "The outcome was a complete transformation of the app: a restructured information architecture, a refreshed UI and brand direction, and a cohesive design system to support future scalability.",
  "In total, we tested our designs with 45 kids, ensuring the final product was not only intuitive and fun but also genuinely empowering for young users learning to build and code robots on their own.",
];

function ProseSection({ heading, paragraphs }: { heading: string; paragraphs: string[] }) {
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

export default function RoboticsCaseStudy() {
  return (
    <ThemeProvider>
      <Nav />

      {/* pt-[140px]: same nav-clearance offset as the home page (Nav is
          `fixed`, so this column carries the whole gap itself). The back
          button sits inside that same gap, absolutely positioned so it
          doesn't add any extra height of its own — its Figma position
          (y:30) lines up with the fixed nav pill's own vertical center. */}
      <div className="relative mx-auto w-full max-w-[688px] pb-[60px] pt-[140px]">
        <BackButton />

        <div className="flex flex-col gap-12">
          {/* Small 248x147 hero thumbnail, replacing the old full-width
              408px banner — same source photo (robotics-hero.png), just
              cropped smaller to match the new layout. */}
          {/* flex-col on narrow viewports — see BeaconCaseStudy for why a
              fixed 248px image forces the headline/meta row into an
              unreadably narrow strip beside it on a phone. */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-lg bg-bg-tertiary sm:h-[147px] sm:w-[248px]">
              <Image
                src="/images/home/robotics-hero.png"
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 640px) 248px, 100vw"
                priority
              />
            </div>
            <div className="flex w-full flex-col items-start justify-between gap-4 sm:h-[147px] sm:flex-1 sm:gap-0">
              <p className="font-serif text-[20px] leading-6 tracking-[-0.8px] text-text-primary">
                Building robots is complex. Learning to build them shouldn’t be. Redesigning the robotics experience
                to help kids confidently build, code and learn on their own.
              </p>
              {/* Client/Year on one row, Team on its own full-width row
                  below — not three identical stacked rows like the
                  earlier version of this hero. */}
              <div className="flex w-full flex-col gap-2 font-sans text-[14px] tracking-[-0.112px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-text-primary">Client:</p>
                    <p className="text-text-subtle">Revolution Robotics</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-text-primary">Year</p>
                    <p className="text-text-subtle">2021-22</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-text-primary">Team:</p>
                  <p className="text-text-subtle">Borbala German (UX-Research) &amp; Adam Weber (UX Lead)</p>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-6">
            <ProseSection heading="Context" paragraphs={CONTEXT_PARAGRAPHS} />
            <CaseStudyImageCarousel slides={CONTEXT_GALLERY} />
            <ProseSection heading="Outcome" paragraphs={OUTCOME_PARAGRAPHS} />
            <CaseStudyImageCarousel slides={OUTCOME_GALLERY} />
          </div>
        </div>
      </div>

      <HomeFooter />
    </ThemeProvider>
  );
}
