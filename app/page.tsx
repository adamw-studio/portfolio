import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import { Chip } from "@/components/Chip";
import AboutCardStack from "@/components/AboutCardStack";
import { TimeMark, BrushMark, SculptorMark, CuriosityMark, CraftsmanshipMark, DeepRespectMark } from "@/components/marks";

const whatIDo = [
  { icon: "/images/home/icons-v3/epic1-research.svg", label: "Research" },
  { icon: "/images/home/icons-v3/epic2-systems.svg", label: "System thinking" },
  { icon: "/images/home/icons-v3/epic3-strategy.svg", label: "Product & design strategy" },
  { icon: "/images/home/icons-v3/epic4-designsystem.svg", label: "Design system" },
  { icon: "/images/home/icons-v3/epic5-craft.svg", label: "Craft in canvas & code" },
  { icon: "/images/home/icons-v3/epic6-brand.svg", label: "Brand identity" },
  { icon: "/images/home/icons-v3/epic7-stakeholder.svg", label: "Stakeholder management" },
];

// Body copy shares one style throughout: 14px/24px line-height, tracking
// -0.128px, in Geist. Headings switched to Gentium Basic (serif) per this
// design revision — kept at the 16px size requested earlier rather than
// reverting to Figma's own 20px, and dropped font-medium since Gentium
// Basic has no medium weight (and Figma doesn't call for one here either).
const bodyText = "font-sans text-[14px] leading-6 tracking-[-0.128px] text-text-primary";
const heading = "font-serif text-[16px] leading-6 tracking-[-0.8px] text-text-primary";
// Inset shadow instead of a real border: Figma's stroke doesn't consume
// layout space, but a CSS border always would on an explicitly-sized box
// (see Nav.tsx for the full story on this).
const insetBorder = "shadow-[inset_0_0_0_1px_var(--color-border-subtle)]";

function Tag({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1 rounded-xs border border-border-subtle px-1.5 py-0.5">
      <Image src={icon} alt="" width={20} height={20} />
      <span className="whitespace-nowrap font-sans text-[14px] tracking-[-0.128px] text-text-primary">
        {label}
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="theme-dark flex flex-1 flex-col bg-bg-default px-4">
      {/* Nav: top offset 24px (Figma). Content column: starts at 140px, so
          92px after the nav row ends (24 + 24 tall nav = 48; 140-48=92). */}
      <div className="mx-auto w-full max-w-[688px] pt-6">
        <Nav />
      </div>

      <div className="mx-auto w-full max-w-[688px] pt-[92px]">
        <div className="flex flex-col gap-[60px]">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h1 className={heading}>Hey, I’m Adam</h1>
              <div className="flex flex-col gap-4">
                <p className={bodyText}>
                  A Senior Product Designer with{" "}
                  <Chip icon={<TimeMark />} radius="sm">
                    5 years &amp; 4 months
                  </Chip>{" "}
                  of experience across banking, media, education and enterprise tech at McKinsey &amp; Company, and
                  now building 0 → 1 B2B products.
                </p>
                <p className={bodyText}>
                  I currently lead design for{" "}
                  <Chip icon={<Image src="/images/home/beacon-icon.svg" alt="" width={22} height={12} />} radius="sm">
                    Beacon
                  </Chip>
                  , a B2B SaaS that helps businesses ideate and validate new business ventures with the power of
                  agentic AI. I also co-design{" "}
                  <Chip radius="sm">Orchestro</Chip>, an AI organisational tracking tool for agile teams that turns
                  messy objectives, key results into alignment.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className={heading}>What shapes me</h2>
              <div className="flex flex-col gap-4">
                <p className={bodyText}>
                  I was raised by a <Chip icon={<BrushMark />}>painter</Chip> and a{" "}
                  <Chip icon={<SculptorMark />}>sculptor</Chip>. I learned that craft matters. My first design
                  education didn’t come from software, it came from watching a painter and a sculptor at work.
                </p>
                <p className={bodyText}>
                  That foundation continues to shape how I approach designing today:{" "}
                  <Chip icon={<CuriosityMark />}>curiosity</Chip>,{" "}
                  <Chip icon={<CraftsmanshipMark />}>craftsmanship</Chip> and a{" "}
                  <Chip icon={<DeepRespectMark />}>deep respect</Chip> for the people who touch, feel or use the
                  things I design.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className={heading}>What I do</h2>
              <div className="flex flex-col gap-4">
                <p className={bodyText}>
                  I own my work end to end, from early concepts to shipped outcomes. I’ve worked on large enterprise
                  products as well as smaller, ambitious ones, but I’m most energized when I’m close to the problem,
                  shaping ideas from the ground up and seeing my work make a real difference.
                </p>
                <p className={bodyText}>
                  That’s when design feels most meaningful to me: when a small team comes together around an
                  existing problem, cares deeply about solving it, and maybe, along the way, changes a little piece
                  of the world.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {whatIDo.map((item) => (
                    <Tag key={item.label} icon={item.icon} label={item.label} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* gap-4 (16px): Figma keeps this section's header-to-content gap
              at 16px, unlike the 12px used everywhere else on this page. */}
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <h2 className={heading}>Selected works</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous work"
                  disabled
                  className={`flex size-6 items-center justify-center rounded-full bg-bg-tertiary disabled:cursor-not-allowed ${insetBorder}`}
                >
                  <Image src="/images/home/arrow-left.svg" alt="" width={16} height={16} />
                </button>
                <button
                  type="button"
                  aria-label="Next work"
                  className={`flex size-6 items-center justify-center rounded-full bg-bg-tertiary ${insetBorder}`}
                >
                  <Image src="/images/home/arrow-right.svg" alt="" width={16} height={16} />
                </button>
              </div>
            </div>

            <Link href="/work" className="flex flex-col gap-4">
              <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-bg-secondary">
                <Image
                  src="/images/home/selected-work-backdrop.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="688px"
                />
                <div
                  className="absolute overflow-hidden rounded-lg blur-[1px]"
                  style={{ left: 79, top: 86, width: 530, height: 358 }}
                >
                  <Image
                    src="/images/home/selected-work-screen.jpg"
                    alt="Beacon product screen"
                    fill
                    className="object-cover"
                    sizes="530px"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className={bodyText}>
                  Ideas don’t become viable ventures by default. Designing how agentic AI helps founders research,
                  validate and turn ideas into ventures.
                </p>
                <div className="flex items-center justify-between text-text-secondary">
                  <p className="font-sans text-[14px] leading-6 tracking-[-0.128px]">Lead Designer</p>
                  <p className="font-sans text-[14px] leading-6 tracking-[-0.128px]">2026</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Breaks out of the 688px column: the card composition is ~832px
          wide on desktop, wider than the rest of the page's content. */}
      <div className="mt-[60px] flex flex-col gap-3 pb-24">
        <div className="mx-auto w-full max-w-[688px]">
          <h2 className={heading}>About me</h2>
        </div>
        <AboutCardStack />
      </div>
    </div>
  );
}
