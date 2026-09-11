import Image from "next/image";
import Nav from "@/components/Nav";
import { Chip } from "@/components/Chip";
import { Tag } from "@/components/Tag";
import AboutCardStack from "@/components/AboutCardStack";
import FlourishDivider from "@/components/FlourishDivider";
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
        {/* Figma 46:10661 — two rhythms, not one flat gap throughout: the
            intro text and the card cluster share their own tighter 100px
            gap (nested below), while every *other* top-level section —
            that whole intro+cards group, each flourish divider, "What I
            do", "Selected works" — sits 120px apart at this outer level.
            An earlier pass had all of these on one flat 100px gap;
            re-checked directly against this node's own metadata rather
            than assumed unchanged. */}
        <div className="flex flex-col gap-[120px]">
          {/* Figma 37:10046 — the intro is centered now (was left-aligned),
              a small hand-drawn flourish sits above the heading, and the
              bio copy is shorter/rewritten entirely, dropping the
              "5 years & 4 months" chip and both projects' own long
              descriptions in favor of one compact paragraph. "What shapes
              me" is gone from this design outright, not just relocated. */}
          <div className="flex flex-col gap-[100px]">
            <div className="flex flex-col items-center gap-6">
              {/* No flourish above the heading anymore — removed per live
                  feedback. 24px specifically for this heading, not the
                  shared `heading` token's own 20px — "What I do" and
                  "Selected works" (the token's other two call sites) stay
                  at 20px, so this can't just bump the shared value. */}
              <h1 className="font-serif text-[24px] leading-6 tracking-[-0.8px] text-text-primary">Hey, I’m Adam</h1>
              {/* Figma 46:10668 — three explicit lines, not one flowing
                  paragraph left to wrap on its own: line 2 in particular
                  (the Beacon/Orchestro chips) is its own row with its own
                  flex layout. flex-wrap on that row (rather than the
                  whitespace-nowrap Figma's own export defaults every
                  single-line text node to) is the actual safety net for
                  narrow viewports — Figma gives no mobile variant of this
                  node, and at typical/wide widths the row already fits on
                  one line without needing to forbid wrapping outright.
                  Copy on line 3 changed too: "I've worked across brand
                  design, new products, enterprise software" is now "I've
                  gone from brand design to building products from scratch
                  and working on enterprise software." */}
              <div className={`flex flex-col items-center gap-2 text-center ${bodyText}`}>
                <p>I’m a Senior Product Designer at McKinsey &amp; Company.</p>
                <p className="flex flex-wrap items-center justify-center gap-2">
                  <span>Currently leading design for</span>
                  <Chip
                    icon={<Image src="/images/home/beacon-icon.svg" alt="" width={22} height={12} className={themedIcon} />}
                    radius="sm"
                  >
                    Beacon
                  </Chip>
                  <span>and co-designing</span>
                  {/* Orchestro + its trailing "." share their own tight,
                      gap-less inline group (Figma's own 46:10679, gap-2px)
                      so the period hugs the chip rather than picking up
                      this row's own 8px inter-item gap like every other
                      sibling here does. */}
                  <span className="inline-flex items-center">
                    <Chip radius="sm">Orchestro</Chip>
                    <span>.</span>
                  </span>
                  <span>Over the last 5+ years,</span>
                </p>
                <p>I’ve gone from brand design to building products from scratch and working on enterprise software.</p>
              </div>
            </div>

            {/* Figma 14:7194 — narrower (655px) than the 688px column it
                lives in, so it doesn't need to break out of the column as
                its own full-width section the way it once did. */}
            <AboutCardStack />
          </div>

          {/* Figma 46:10661 — the same hand-drawn flourish used above
              "Hey, I'm Adam" reused as a section divider, replacing the
              plain 40px solid rule this page used here before (that
              rule's own 15:7412 reference has apparently been superseded
              — this newer node reuses the flourish asset at both divider
              positions instead). Draws in on scroll rather than
              immediately like the heading's own instance, since this one
              starts below the fold — see FlourishDivider's own comment
              for why that needs a different (but equally fail-safe)
              technique than the heading flourish's pure-CSS one. */}
          <FlourishDivider />

          <div className="flex flex-col gap-6">
            <h2 className={heading}>What I do</h2>
            <div className="flex flex-col gap-7">
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

          <FlourishDivider />

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
