import Image from "next/image";
import Link from "next/link";
import FloatingNav from "@/components/FloatingNav";
import LabeledRow from "@/components/LabeledRow";

const whatIDo = [
  { icon: "/images/home/icons/group1-research.svg", label: "Research" },
  { icon: "/images/home/icons/group2-systems.svg", label: "Systems thinking" },
  { icon: "/images/home/icons/group3-strategy.svg", label: "Product & design strategy" },
  { icon: "/images/home/icons/group4-designsystem.svg", label: "Design system" },
  { icon: "/images/home/icons/group5-craft.svg", label: "Craft in canvas + code" },
  { icon: "/images/home/icons/group6-branding.svg", label: "Branding" },
  { icon: "/images/home/icons/group7-stakeholder.svg", label: "Stakeholder management" },
];

// Body copy shares one style throughout: 16px/24px line-height, tracking
// -0.128px, in TeX Gyre Heros (Figma's body/regular style).
const bodyText = "font-heros text-[16px] leading-6 tracking-[-0.128px] text-text-primary";

function Divider() {
  return <Image src="/images/home/divider.svg" alt="" width={688} height={1} className="h-px w-full" unoptimized />;
}

function Tag({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-m border border-border-subtle px-3 py-1.5">
      <Image src={icon} alt="" width={20} height={20} />
      <span className="whitespace-nowrap font-heros text-[16px] leading-[15px] tracking-[-0.128px] text-text-primary">
        {label}
      </span>
    </div>
  );
}

/** Small decorative marks for the About traits — reproduced from Figma's
 * exact per-shape coordinates (these read as bespoke/generative glyphs
 * rather than a standard icon set, so faithfully copying the shapes is more
 * honest than substituting a real icon). */
function TraitIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative size-5 shrink-0 overflow-hidden bg-bg-tertiary">
      {children}
    </div>
  );
}

const traits: { label: string; icon: React.ReactNode }[] = [
  {
    label: "prototypes with AI",
    icon: (
      <TraitIcon>
        <div className="absolute left-0 top-0 size-2.5" style={{ backgroundColor: "#009951" }} />
      </TraitIcon>
    ),
  },
  {
    label: "builds design systems",
    icon: (
      <TraitIcon>
        <div className="absolute left-0 top-0 size-2.5" style={{ backgroundColor: "#00a2c2" }} />
        <div className="absolute left-2.5 top-2.5 size-2.5" style={{ backgroundColor: "#00a2c2" }} />
      </TraitIcon>
    ),
  },
  {
    label: "rethinks team’s workflows",
    icon: (
      <TraitIcon>
        <div className="absolute left-[15px] top-0 flex h-[18px] w-[3px] items-center justify-center">
          <div className="-rotate-90">
            <div className="h-[3px] w-[18px]" style={{ backgroundColor: "#f24822" }} />
          </div>
        </div>
        <div className="absolute left-[2px] top-[11px] flex h-[9px] w-[3px] items-center justify-center">
          <div className="rotate-90">
            <div className="h-[3px] w-[9px]" style={{ backgroundColor: "#f24822" }} />
          </div>
        </div>
      </TraitIcon>
    ),
  },
  {
    label: "believes in the power of creative thinking",
    icon: (
      <TraitIcon>
        <div className="absolute left-[5px] top-[5px] size-2.5" style={{ backgroundColor: "#0d99ff" }} />
      </TraitIcon>
    ),
  },
  {
    label: "obsessed about the smallest details",
    icon: (
      <TraitIcon>
        <div className="absolute left-[9px] top-[9px] size-0.5" style={{ backgroundColor: "#ffcd29" }} />
      </TraitIcon>
    ),
  },
  {
    label: "..want to ship code",
    icon: (
      <TraitIcon>
        <div className="absolute left-[2px] top-[3px] h-[14px] w-[2px]" style={{ backgroundColor: "#ebffee" }} />
      </TraitIcon>
    ),
  },
  {
    label: "loves design crit sessions",
    icon: (
      <TraitIcon>
        <div className="absolute left-[14px] top-[14px] size-1" style={{ backgroundColor: "#ebaff4" }} />
        <div className="absolute left-[9px] top-[9px] size-0.5" style={{ backgroundColor: "#ebaff4" }} />
        <div className="absolute left-[2px] top-[2px] size-1" style={{ backgroundColor: "#ebaff4" }} />
      </TraitIcon>
    ),
  },
];

export default function Home() {
  return (
    <div className="theme-dark flex flex-1 flex-col bg-bg-default px-4">
      <FloatingNav />

      {/* pt-[80px]: gap from Figma metadata between the nav (ends 60px from
          page top) and the content column (starts at 140px). */}
      <div className="mx-auto flex w-full max-w-[688px] flex-col gap-12 pt-[80px]">
        <div className="flex flex-col gap-10">
          <LabeledRow label="Who am I">
            <div className="flex flex-col gap-2">
              <p className={bodyText}>
                A Senior Product Designer with <span className="italic">5 years - 4 months</span> of experience
                across banking, education and enterprise tech at McKinsey&Company, and now building 0 → 1 B2B
                products.
              </p>
              <p className={bodyText}>
                I currently <span className="italic">lead design for Beacon</span>, a B2B SaaS that helps businesses
                ideate and validate new business ventures with the power of agentic AI. I also{" "}
                <span className="italic">co-design Orchestro</span>, an AI organisational tracking tool for agile
                teams that turns messy inputs into alignment.
              </p>
            </div>
          </LabeledRow>

          <LabeledRow label="What shapes me">
            <div className="flex flex-col gap-2">
              <p className={bodyText}>
                I was raised by a painter and a sculptor. I learned that craft matters. My first design education
                didn&rsquo;t come from software, it came from watching a painter and a sculptor at work.
              </p>
              <p className={bodyText}>
                That foundation continues to shape how I approach designing today:{" "}
                <span className="italic">curiosity</span>, <span className="italic">craftsmanship</span> and a{" "}
                <span className="italic">deep respect for the people</span> who touch, feel or use the things I
                design.
              </p>
              <p className={bodyText}>
                As technology evolves, I believe the role of design is not just to build faster, but to create
                products that feel thoughtful, useful and distinctly human.
              </p>
            </div>
          </LabeledRow>

          <LabeledRow label="What I do">
            <div className="flex flex-col gap-4">
              <p className={bodyText}>I own my work from concept to shipped product outcomes.</p>
              <div className="flex flex-wrap items-center gap-2">
                {whatIDo.map((item) => (
                  <Tag key={item.label} icon={item.icon} label={item.label} />
                ))}
              </div>
            </div>
          </LabeledRow>
        </div>

        <Divider />

        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <p className="font-heros-cn text-[16px] leading-6 tracking-[-0.128px] text-text-primary">
              Selected works
            </p>
            <div className="flex items-center justify-end gap-2">
              <p className="font-heros-cn text-[16px] leading-6 tracking-[-0.128px] text-text-primary">2021-2026</p>
              <Link
                href="/work"
                aria-label="View selected works"
                className="flex items-center rounded-full border border-border-subtle p-1"
              >
                <Image src="/images/home/arrow-up-right.svg" alt="" width={16} height={16} />
              </Link>
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
                Ideas don&rsquo;t become viable ventures by default. Designing how agentic AI helps founders
                research, validate and turn ideas into ventures.
              </p>
              <div className="flex items-center justify-between text-text-secondary">
                <p className="font-heros text-[16px] leading-6 tracking-[-0.128px]">Lead Designer</p>
                <p className="font-heros text-[16px] leading-6 tracking-[-0.128px]">2026</p>
              </div>
            </div>
          </Link>
        </div>

        <Divider />

        <LabeledRow label="About">
          <div className="flex flex-col gap-4">
            <p className={bodyText}>I am a multidisciplinary designer who,</p>
            <div className="flex flex-wrap items-center gap-2">
              {traits.map((trait) => (
                <div
                  key={trait.label}
                  className="flex items-center gap-2 rounded-m border border-border-subtle px-3 py-1.5"
                >
                  {trait.icon}
                  <span className="whitespace-nowrap font-heros text-[16px] leading-[15px] tracking-[-0.128px] text-text-primary">
                    {trait.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </LabeledRow>
      </div>
    </div>
  );
}
