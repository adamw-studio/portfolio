import Image from "next/image";
import Nav from "@/components/Nav";
import HomeFooter from "@/components/HomeFooter";
import { Divider } from "@/components/Divider";
import { CaseStudyImageCarousel } from "@/components/CaseStudyImageCarousel";
import { YouTubeFacade } from "@/components/YouTubeFacade";
import { ThemeProvider } from "@/components/ThemeContext";
import { BackButton } from "@/components/BackButton";

// Figma 288:7846 ("Symphony of Disorder") — same page shell and prose
// tokens as BeaconCaseStudy/RoboticsCaseStudy (small hero thumbnail,
// dimmed inline sub-headings, gap-12 hero/divider/content rhythm). See
// those files for the shared rationale.
const sectionBody = "font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-primary";
const sectionHeading = "font-serif text-[20px] leading-6 tracking-[-0.8px] text-text-subtle";

const CONTEXT_PARAGRAPHS = [
  "Both of my parents are accomplished artists, my mother is a painter and my father is a sculptor. Creativity has always been at the heart of our family life, shaping the way we think, work and connect with one another.",
  "Last year, we celebrated my mother’s 60th birthday by creating a special tribute that honors her artistic journey.",
];

const SIX_MONTHS_EARLIER_PARAGRAPHS = [
  "One day, my mom invited me to lunch. We started talking about her plans for her 60th birthday that autumn. She wanted to create a major catalogue of her work and organise a large exhibition. She had already done plenty of both, so I suggested something different. Something bigger.",
  "“Mom, what if we made a documentary about your career so far?” - She loved the idea. There was just one question: who could bring it to life?",
  "A close childhood friend of mine, Danijar Biro, is a director and video journalist. I reached out to him, and he enthusiastically took on the project. He assembled an incredible team, and together they created a remarkable 40-minute documentary celebrating my mom’s life, work and career so far.",
];

// Figma 299:8014, 299:8016, 299:8018, 299:8020, 299:8034 — 5 more slides
// added to this gallery (named "2" through "6" in Figma, following on
// from the poster photo already here as slide 1).
const CONTRIBUTION_GALLERY = [
  { src: "/images/home/documentary-poster.jpg", alt: "Black and white \"Fekete Fehér Kék Zöld Piros\" film posters scattered together" },
  { src: "/images/home/documentary-design-process.jpg", alt: "Poster design process in Photoshop, layered comps of the film poster" },
  { src: "/images/home/documentary-premiere.jpg", alt: "The film poster projected on screen at the premiere" },
  { src: "/images/home/documentary-bts.jpg", alt: "Behind the scenes: the crew filming with a camera and boom microphone" },
  { src: "/images/home/documentary-poster-rooftop.jpg", alt: "The film poster held up against a rooftop view" },
  { src: "/images/home/documentary-poster-closeup.jpg", alt: "Close-up of the film posters scattered together" },
];

// Figma 301:8145 — added since this page was first built, along with the
// two new dividers around Trailer below it (301:8067, 301:8069).
const TEAM = [
  { role: "Director -", name: "Bíró Danijar" },
  { role: "Photography -", name: "Czeglédi Mátyás" },
  { role: "Camera -", name: "Teleki Mihály" },
  { role: "Editor -", name: "Kozma G. Leó" },
  { role: "Sound & Music -", name: "Lőrinczi Áron" },
  { role: "Executive Producer -", name: "Wéber Ádám" },
];

const STARRING = [
  "Köves Éva",
  "Sztojánovits Andrea",
  "Laudancsek Katalin",
  "Szipőcs Krisztina",
  "Alföldi Róbert",
  "Kaszás Gábor",
  "Petrányi Zsolt",
  "Gál András",
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

export default function DocumentaryCaseStudy() {
  return (
    <ThemeProvider>
      <Nav />

      {/* pt-[100px]: Nav is fixed and bottom-anchored now (see Nav.tsx),
          so this column no longer needs the 140px top reservation the old
          top-center pill required — 100px matches this site's own
          section-gap rhythm as plain top breathing room. BackButton stays
          `fixed top-6` itself (see BackButton.tsx), independent of this
          padding either way. */}
      <div className="relative mx-auto w-full max-w-[688px] pb-[60px] pt-[100px]">
        <BackButton />

        <div className="flex flex-col gap-12">
          {/* Small 248x147 hero thumbnail, same treatment as the other two
              rewritten case studies. */}
          {/* flex-col on narrow viewports — see BeaconCaseStudy for why a
              fixed 248px image forces the headline/meta row into an
              unreadably narrow strip beside it on a phone. */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-lg bg-bg-tertiary sm:h-[147px] sm:w-[248px]">
              <Image
                src="/images/home/documentary-hero.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 640px) 248px, 100vw"
                priority
              />
            </div>
            <div className="flex w-full flex-col items-start justify-between gap-4 sm:h-[147px] sm:flex-1 sm:gap-0">
              <p className="font-serif text-[20px] leading-6 tracking-[-0.8px] text-text-primary">
                Translating an artist’s world from canvas to screen. Designing the poster and typography system for a
                documentary celebrating 40 years of creative work.
              </p>
              {/* Project/Year on one row, Role on its own full-width row
                  below — same pattern as Robotics' Client/Year + Team. */}
              <div className="flex w-full flex-col gap-2 font-sans text-[14px] tracking-[-0.112px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-text-primary">Project:</p>
                    <p className="text-text-subtle">Symphony of Disorder</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-text-primary">Year</p>
                    <p className="text-text-subtle">2025</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-text-primary">Role:</p>
                  <p className="text-text-subtle">Graphic Designer, Executive Producer</p>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-6">
            <ProseSection heading="Context" paragraphs={CONTEXT_PARAGRAPHS} />
            <ProseSection heading="6 months earlier" paragraphs={SIX_MONTHS_EARLIER_PARAGRAPHS} />

            <Divider />

            <div className="flex w-full flex-col items-start gap-2">
              <p className={sectionHeading}>Trailer</p>
              <div className="flex w-full justify-center">
                <YouTubeFacade videoId="0xcBtP-4AYY" title="Symphony of Disorder — trailer" />
              </div>
            </div>

            <Divider />

            <ProseSection
              heading="My contribution to the project"
              paragraphs={[
                "I contributed to the project by designing the film’s poster and developing the typography system that aligned with the documentary’s visual language. Additionally, I organised the premiere event, which was held at the renowned Ludwig Museum in Hungary.",
              ]}
            />
            <CaseStudyImageCarousel slides={CONTRIBUTION_GALLERY} />

            <div className="flex flex-col items-start gap-2">
              <p className={sectionHeading}>Team</p>
              <div className="flex flex-col items-start font-sans text-[14px] tracking-[-0.112px]">
                {TEAM.map(({ role, name }) => (
                  <div key={role} className="flex items-center gap-2">
                    <p className="text-text-primary">{role}</p>
                    <p className="leading-6 text-text-subtle">{name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start gap-2">
              <p className={sectionHeading}>Starring</p>
              <div className="flex flex-col items-start font-sans text-[14px] tracking-[-0.112px] text-text-subtle">
                {STARRING.map((name) => (
                  <p key={name}>{name}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <HomeFooter />
    </ThemeProvider>
  );
}
