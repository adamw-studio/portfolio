import Image from "next/image";
import Nav from "@/components/Nav";
import { Chip } from "@/components/Chip";
import { Tag } from "@/components/Tag";
import AboutCardStack from "@/components/AboutCardStack";
import SelectedWorks from "@/components/SelectedWorks";
import HomeFooter from "@/components/HomeFooter";
import { Divider } from "@/components/Divider";
import { TimeMark, SculptorMark } from "@/components/marks";
import BarChartIcon from "@/components/icons/BarChartIcon";
import EqualsIcon from "@/components/icons/EqualsIcon";
import CuriosityIcon from "@/components/icons/CuriosityIcon";
import CraftsmanshipIcon from "@/components/icons/CraftsmanshipIcon";
import ResearchIcon from "@/components/icons/dots/ResearchIcon";
import SystemThinkingIcon from "@/components/icons/dots/SystemThinkingIcon";
import StrategyIcon from "@/components/icons/dots/StrategyIcon";
import DesignSystemIcon from "@/components/icons/dots/DesignSystemIcon";
import CraftCanvasCodeIcon from "@/components/icons/dots/CraftCanvasCodeIcon";
import BrandIdentityIcon from "@/components/icons/dots/BrandIdentityIcon";
import StakeholderIcon from "@/components/icons/dots/StakeholderIcon";
import { bodyText, heading } from "@/components/typography";

const whatIDo = [
  { icon: <ResearchIcon />, label: "Research" },
  { icon: <SystemThinkingIcon />, label: "System thinking" },
  { icon: <StrategyIcon />, label: "Product & design strategy" },
  { icon: <DesignSystemIcon />, label: "Design system" },
  { icon: <CraftCanvasCodeIcon />, label: "Craft in canvas & code" },
  { icon: <BrandIdentityIcon />, label: "Brand identity" },
  { icon: <StakeholderIcon />, label: "Stakeholder management" },
];

export default function Home() {
  return (
    <div className="theme-dark flex flex-1 flex-col bg-bg-default px-4">
      {/* Nav: top offset 24px (Figma). Content column: starts at 140px, so
          79px after the nav row ends (24 + 37 tall nav = 61; 140-61=79).
          37px, not the old 24px, once the nav's own inset-shadow "border"
          fix (matching Figma's non-layout-consuming stroke) landed. */}
      <div className="mx-auto w-full max-w-[688px] pt-6">
        <Nav />
      </div>

      <div className="mx-auto w-full max-w-[688px] pt-[79px]">
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
                  I was raised by a <Chip icon={<BarChartIcon />}>painter</Chip> and a{" "}
                  <Chip icon={<SculptorMark />}>sculptor</Chip>. I learned that craft matters. My first design
                  education didn’t come from software, it came from watching a painter and a sculptor at work.
                </p>
                <p className={bodyText}>
                  That foundation continues to shape how I approach designing today:{" "}
                  <Chip icon={<CuriosityIcon />}>curiosity</Chip>,{" "}
                  <Chip icon={<CraftsmanshipIcon />}>craftsmanship</Chip> and a{" "}
                  <Chip icon={<EqualsIcon />}>deep respect</Chip> for the people who touch, feel or use the
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

          <Divider />

          {/* gap-4 (16px): Figma keeps this section's header-to-content gap
              at 16px, unlike the 12px used everywhere else on this page. */}
          <SelectedWorks />
        </div>
      </div>

      {/* Divider stays constrained to the 688px content column (matches
          Figma), even though the section below it breaks out wider. */}
      <div className="mx-auto mt-[60px] w-full max-w-[688px]">
        <Divider />
      </div>

      {/* Breaks out of the 688px column: the card composition is ~832px
          wide on desktop, wider than the rest of the page's content. The
          heading is centered across the full section width too (unlike
          every other header on this page, which is left-aligned in the
          688px column) — matches Figma's centered "before" state. */}
      <div className="mt-[60px] flex flex-col gap-3 pb-16">
        <h2 className={`${heading} text-center`}>I&apos;m a designer who,</h2>
        <AboutCardStack />
      </div>

      <HomeFooter />
    </div>
  );
}
