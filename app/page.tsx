import Image from "next/image";
import Nav from "@/components/Nav";
import { Chip } from "@/components/Chip";
import { Tag } from "@/components/Tag";
import AboutCardStack from "@/components/AboutCardStack";
import SelectedWorks from "@/components/SelectedWorks";
import HomeFooter from "@/components/HomeFooter";
import { Divider } from "@/components/Divider";
import { ThemeProvider } from "@/components/ThemeContext";
import { themedIcon } from "@/components/themedIcon";
import { TimeMark, SculptorMark } from "@/components/marks";
import BarChartIcon from "@/components/icons/BarChartIcon";
import EqualsIcon from "@/components/icons/EqualsIcon";
import CuriosityIcon from "@/components/icons/CuriosityIcon";
import CraftsmanshipIcon from "@/components/icons/CraftsmanshipIcon";
import { bodyText, heading } from "@/components/typography";

// Every "What I do" tag shares one identical icon shape (Figma 203:2034)
// but its own fixed brand color, the same in both themes — except Brand
// identity, which stays a theme-swapping neutral (see Tag.tsx's color
// prop, omitted here on purpose for that one).
const whatIDo: { label: string; color?: string }[] = [
  { label: "Research", color: "#d9a900" },
  { label: "System thinking", color: "#00a2c2" },
  { label: "Product & design strategy", color: "#e5522e" },
  { label: "Design system", color: "#0d99ff" },
  { label: "Craft in canvas & code", color: "#d92100" },
  { label: "Brand identity" },
  { label: "Stakeholder management", color: "#46723c" },
];

export default function Home() {
  return (
    <ThemeProvider>
      {/* Nav is `fixed` (see Nav.tsx) — out of normal document flow, so it
          no longer pushes this content down on its own. This column's own
          top padding carries the *entire* offset now: 140px (Figma) =
          24px nav top offset + 37px nav height + 79px gap after it,
          previously split between a dedicated nav wrapper and this div. */}
      <Nav />

      <div className="mx-auto w-full max-w-[688px] pt-[140px]">
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
                  <Chip
                    icon={<Image src="/images/home/beacon-icon.svg" alt="" width={22} height={12} className={themedIcon} />}
                    radius="sm"
                  >
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
                  {whatIDo.map(({ label, color }) => (
                    <Tag key={label} label={label} color={color} />
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
      <div className="mt-[60px] flex flex-col gap-3 pb-9">
        <h2 className={`${heading} text-center`}>I&apos;m a designer who,</h2>
        <AboutCardStack />
      </div>

      <HomeFooter />
    </ThemeProvider>
  );
}
