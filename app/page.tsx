import Image from "next/image";
import Nav from "@/components/Nav";
import { Chip } from "@/components/Chip";
import { Tag } from "@/components/Tag";
import AboutCardStack from "@/components/AboutCardStack";
import SelectedWorks from "@/components/SelectedWorks";
import Experience from "@/components/Experience";
import HomeFooter from "@/components/HomeFooter";
import { ThemeProvider } from "@/components/ThemeContext";
import { themedIcon } from "@/components/themedIcon";
import { bodyText, heading } from "@/components/typography";

// Every "What I do" tag shares one identical icon shape (Figma 203:2034)
// but its own fixed brand color, the same in both themes. Figma 15:7301
// (current) gives every tag a real fixed color now, including Brand
// identity — which used to be the one asymmetric case (a theme-swapping
// neutral gray, falling back to --tag-icon-bg with no color prop here;
// see Tag.tsx's own doc comment for that history). Figma also swapped
// which color which tag carries: Craft in canvas & code is purple
// (#a16ea9, Brand identity's old color) and Brand identity is red
// (#d92100, Craft in canvas & code's old color) — not a coincidental
// near-match, confirmed against the current file directly.
const whatIDo: { label: string; color?: string }[] = [
  { label: "Research", color: "#d9a900" },
  { label: "System thinking", color: "#00a2c2" },
  { label: "Product & design strategy", color: "#e5522e" },
  { label: "Design system", color: "#0d99ff" },
  { label: "Craft in canvas & code", color: "#a16ea9" },
  { label: "Brand identity", color: "#d92100" },
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
        <div className="flex flex-col gap-[100px]">
          {/* Figma 15:7360 — 100px between the intro bio and the card
              cluster, the same gap this outer column uses between every
              other top-level section, not the tighter 40px "What shapes
              me"/"What I do" share below. */}
          <div className="flex flex-col gap-[100px]">
            <div className="flex flex-col gap-3">
              <h1 className={heading}>Hey, I’m Adam</h1>
              <div className="flex flex-col gap-4">
                <p className={bodyText}>
                  A Senior Product Designer with <Chip radius="sm">5 years &amp; 4 months</Chip> of experience across
                  banking, media, education and enterprise tech at McKinsey &amp; Company, and now building 0 → 1 B2B
                  products.
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

            {/* Figma 14:7194 — the card cluster now sits directly under the
                intro bio, before "What shapes me", with no heading of its
                own (the old "I'm a designer who," label is gone). It's also
                narrower now (655px) than the 688px column it lives in, so
                unlike before, it no longer needs to break out of the column
                as its own full-width section below the fold. */}
            <AboutCardStack />
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3">
              <h2 className={heading}>What shapes me</h2>
              <div className="flex flex-col gap-4">
                <p className={bodyText}>
                  I was raised by a <Chip>painter</Chip> and a <Chip>sculptor</Chip>. I learned that craft matters. My
                  first design education didn’t come from software, it came from watching a painter and a sculptor
                  at work.
                </p>
                <p className={bodyText}>
                  That foundation continues to shape how I approach designing today: <Chip>curiosity</Chip>,{" "}
                  <Chip>craftsmanship</Chip> and a <Chip>deep respect</Chip> for the people who touch, feel or use
                  the things I design.
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

          {/* Figma 15:7412 — a short 40px centered rule, not the full-width
              dashed Divider this page previously used twice (before and
              after Selected works). The current file only shows this one,
              once, here — Divider itself stays for the case-study pages,
              which still use it (see Divider.tsx), just not this page
              anymore. */}
          <div className="flex w-full justify-center">
            <div aria-hidden className="h-px w-10 bg-border-subtle" />
          </div>

          <SelectedWorks />

          <Experience />
        </div>
      </div>

      {/* HomeFooter renders as its own full-bleed <footer> outside this
          column (it does its own 688px centering + horizontal page
          padding, since Robotics/Beacon/Documentary also render it
          directly with no such column around it) — so unlike Experience
          and everything above it, it gets none of the gap-[100px] flex
          spacing for free. Figma's own footer content (15:7443) is a
          full member of that same 100px-gapped column, so this margin
          reproduces that gap by hand instead, without changing
          HomeFooter itself and risking the spacing every other page
          using it already has tuned around its current no-top-margin
          behavior. */}
      <div className="mt-[100px]">
        <HomeFooter />
      </div>
    </ThemeProvider>
  );
}
