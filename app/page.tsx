import Image from "next/image";
import Nav from "@/components/Nav";
import { Chip } from "@/components/Chip";
import { Tag } from "@/components/Tag";
import AboutCardStack from "@/components/AboutCardStack";
import SelectedWorks from "@/components/SelectedWorks";
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
          never pushes this content down on its own. Nav is back at the
          *top* of the viewport again (Figma 41:10445's own redesign,
          after a stint bottom-anchored). 180px (100px section-gap rhythm
          + a requested 80px on top) is real breathing room *below* the
          bar itself, not just clearance — the previous 100px cleared its
          ~36px height + 24px offset with only ~40px left over, which
          read as cramped directly under a fixed bar rather than as an
          intentional gap. */}
      <Nav />

      <div className="mx-auto w-full max-w-[688px] pt-[180px]">
        <div className="flex flex-col gap-[100px]">
          {/* Figma 37:10046 — the intro is centered now (was left-aligned),
              a small hand-drawn flourish sits above the heading, and the
              bio copy is shorter/rewritten entirely, dropping the
              "5 years & 4 months" chip and both projects' own long
              descriptions in favor of one compact paragraph. "What shapes
              me" is gone from this design outright, not just relocated —
              the card cluster and "What I do" now share this same flat
              100px rhythm as everything else on the page, rather than
              being nested together in their own tighter-gapped group the
              way "What shapes me"/"What I do" used to be. */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-3">
              <Image
                src="/images/home/hey-adam-flourish.svg"
                alt=""
                width={75}
                height={5}
                className={themedIcon}
              />
              <h1 className={heading}>Hey, I’m Adam</h1>
            </div>
            <p className={`${bodyText} text-center`}>
              I’m a Senior Product Designer at McKinsey &amp; Company. Currently leading design for{" "}
              <Chip
                icon={<Image src="/images/home/beacon-icon.svg" alt="" width={22} height={12} className={themedIcon} />}
                radius="sm"
              >
                Beacon
              </Chip>{" "}
              and co-designing <Chip radius="sm">Orchestro</Chip>. Over the last 5+ years, I’ve worked across brand
              design, new products, enterprise software.
            </p>
          </div>

          {/* Figma 14:7194 — narrower (655px) than the 688px column it
              lives in, so it doesn't need to break out of the column as
              its own full-width section the way it once did. */}
          <AboutCardStack />

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
        </div>
      </div>

      {/* HomeFooter renders as its own full-bleed <footer> outside this
          column (it does its own 688px centering + horizontal page
          padding, since Robotics/Beacon/Documentary also render it
          directly with no such column around it) — so unlike Selected
          works and everything above it, it gets none of the gap-[100px]
          flex spacing for free. Figma's own footer content (15:7443) is a
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
