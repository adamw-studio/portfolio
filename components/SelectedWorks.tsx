"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { BeaconComposer } from "@/components/BeaconComposer";
import { DesignSystemCollage } from "@/components/DesignSystemCollage";

type Project = {
  /** Also doubles as the /work/[id] case study route slug, when `linked`. */
  id: string;
  description: string;
  role: string;
  year: string;
  backdropSrc?: string;
  backdropAlt?: string;
  /** Figma 55:11875 — the one card with a real border, not just the shared ring. */
  bordered?: boolean;
  /** false = no case-study page exists yet, renders as a static (unlinked) card. */
  linked?: boolean;
  /** Renders the "Coming soon" badge (Figma 74:159/74:197) when set. */
  comingSoon?: boolean;
  /** Fixed literal text color for that badge — unset uses the theme-aware
   * text-text-primary class instead. Monday's own badge (74:197) ties its
   * text directly to --text/text-primary (flips with site theme), while
   * design-system's (74:159) is a fixed #544831 instead — its cream
   * collage cover reads correctly in dark brown regardless of site theme,
   * confirmed as a real difference between the two, not a copy-paste of
   * one shared value. */
  comingSoonColor?: string;
};

// Figma 57:24419 — every card except Documentary reads "Lead designer"
// (lowercase d) as its role now, not each project's own more specific
// prior title ("UX Lead, Product Designer", "Brand Designer") — confirmed
// as a real, repeated, deliberate choice across 4 of 5 cards, not a
// one-off. Robotics' own year stays 2021-22 here rather than the "2026"
// this same fetch shows for it: unlike the role change, that read as a
// copy-pasted placeholder left over from duplicating another card's
// instance (Beacon and Monday, both genuinely 2026 projects, show the
// identical "2026") rather than a real edit to robotics' own accurate,
// already-established timeframe — worth a second look in Figma if that
// was actually intentional.
const PROJECTS: Project[] = [
  {
    id: "beacon",
    // Figma 57:24454 — shorter than this project's own /work/beacon copy,
    // dropping the leading "Ideas don't become viable ventures by
    // default." sentence outright, not just trimmed for space.
    description: "Designing how agentic AI helps founders research, validate and turn ideas into ventures.",
    role: "Lead designer",
    year: "2026",
    backdropSrc: "/images/home/selected-work-1-backdrop.jpg",
    backdropAlt: "",
    linked: true,
  },
  {
    id: "robotics",
    // Figma 57:24427 — shorter than this project's own /work/robotics
    // copy, dropping the leading "Building robots is complex. Learning
    // to build them shouldn't be." sentence outright, not just trimmed
    // for space.
    description: "Redesigning the robotics experience to help kids confidently build, code and learn on their own.",
    role: "Lead designer",
    year: "2021-22",
    backdropSrc: "/images/home/selected-work-2-cover.jpg",
    backdropAlt: "Robotics companion app displayed on a phone, resting on a table",
    linked: true,
  },
  {
    // Figma 55:11891 — a genuinely new project with no case-study page
    // yet (per live direction: render it unlinked rather than build a
    // placeholder /work route for it). No backdropSrc: its whole cover
    // is the DesignSystemCollage component instead of a single Image.
    id: "design-system",
    description: "Rethinking the system around how design, product and engineering can actually build together.",
    role: "Lead designer",
    year: "2024-",
    linked: false,
    comingSoon: true,
    comingSoonColor: "#544831",
  },
  {
    id: "monday",
    // Figma 74:197 — shorter still than the earlier 57:24474 fetch's own
    // copy ("Designing a visual system that gives Monday a distinctive
    // voice while leaving room for experimentation."); role is "Brand
    // Designer" here too, not the "Lead designer" 57:24419 gave every
    // other card — this later, more specific fetch of Monday's own card
    // supersedes both.
    description: "Designing a visual system for Monday, creative collective.",
    role: "Brand Designer",
    year: "2026",
    backdropSrc: "/images/home/selected-work-4-cover.jpg",
    backdropAlt: "Red tote bag printed with the Monday wordmark, held up against a blue sky",
    linked: true,
    comingSoon: true,
  },
  {
    id: "documentary",
    // Figma 57:24482 — shorter than this project's own /work/documentary
    // copy, dropping the trailing "for a documentary celebrating 40 years
    // of creative work" clause outright, not just trimmed for space.
    description: "Translating an artist’s world from canvas to screen. Designing the poster and typography system.",
    role: "Graphic Designer",
    year: "2025",
    backdropSrc: "/images/home/documentary-poster-closeup.jpg",
    backdropAlt: "Close-up of the \"Fekete Fehér Kék Zöld Piros\" film posters scattered together",
    bordered: true,
    linked: true,
  },
];

// Figma 74:159/74:197 — a translucent, blurred "Coming soon" pill,
// replacing the earlier solid-dark bell+"Soon" badge that node
// 57:24456/61:107 specified (that fetch is superseded outright, not
// layered alongside this one — Figma's own current cover exports show
// only this pill, no bell icon anywhere). bg-[rgba(248,236,215,0.23)] +
// backdrop-blur-[4px] is a fixed literal glass treatment, not a theme
// token — same reasoning as BeaconComposer's own glass panel: it sits on
// a photo/collage cover, not page chrome, so it keeps one deliberate
// look regardless of site theme. Text color is the one part that
// genuinely varies per card (see Project.comingSoonColor's own comment).
function ComingSoonBadge({ color }: { color?: string }) {
  return (
    <div
      className="absolute right-4 top-[17px] rounded-full bg-[rgba(248,236,215,0.23)] p-2 backdrop-blur-[4px]"
      style={{ color }}
    >
      <p className={`whitespace-nowrap font-sans text-[14px] font-semibold italic leading-[18px] tracking-[-0.112px] ${color ? "" : "text-text-primary"}`}>
        Coming soon
      </p>
    </div>
  );
}

function ProjectCover({ project }: { project: Project }) {
  return (
    <div
      className={`relative aspect-[688/496] w-full shrink-0 overflow-hidden rounded-2xl bg-bg-secondary shadow-[0_0_0_4px_var(--color-bg-tertiary)] ${
        project.bordered ? "border border-border-subtle" : ""
      }`}
    >
      {project.backdropSrc && (
        <Image src={project.backdropSrc} alt={project.backdropAlt ?? ""} fill className="object-cover" sizes="688px" />
      )}
      {project.id === "design-system" && <DesignSystemCollage />}
      {/* Figma 356:1192's own composition over Beacon's cover: a flat 20%
          black wash between the photo and the composer, there
          specifically so the composer's white text/borders read against
          a busy backdrop — not something the other projects need, since
          none of them layer UI on top of their image. */}
      {project.id === "beacon" && (
        <>
          <div aria-hidden className="absolute inset-0 bg-black/20" />
          <BeaconComposer />
        </>
      )}
      {project.comingSoon && <ComingSoonBadge color={project.comingSoonColor} />}
    </div>
  );
}

function ProjectCaption({ project }: { project: Project }) {
  return (
    // No gap between the role row and the description — Figma 57:24461's
    // own metadata has the description start at y=24, exactly the role
    // row's own height, with no added space between them.
    //
    // Figma 74:191 redesigns both rows onto the new purchased font
    // (Neue Montreal) with genuinely different treatments, not one
    // shared size anymore: the role row is italic (font-style, not a
    // different family) at 14px, the description is font-semibold at
    // 16px — no longer the plain 14px/font-normal the two used to share
    // before this font swap.
    <div className="flex flex-col leading-6">
      <div className="flex items-center gap-2.5 font-sans text-[14px] italic tracking-[-0.112px] text-text-subtle">
        <p>{project.role}</p>
        <p>/</p>
        <p>{project.year}</p>
      </div>
      <p className="font-sans text-[16px] font-semibold tracking-[-0.128px] text-text-primary">{project.description}</p>
    </div>
  );
}

export default function SelectedWorks() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Drag-to-scroll state lives in a ref, not useState — it's read/written
  // every pointermove and must never itself trigger a re-render (that
  // would fight the scrollLeft writes below on every frame of the drag).
  const drag = useRef({ dragging: false, startX: 0, startScrollLeft: 0, moved: false, pointerId: 0 });

  // Mouse-only: a real mouse has no native way to drag a horizontal
  // row (no trackpad-style two-finger swipe, and a vertical wheel
  // doesn't scroll sideways without an awkward Shift held down), so this
  // adds click-and-drag. Touch already gets real, better native
  // scrolling — its own momentum/rubber-banding — from `overflow-x-auto`
  // and `touch-pan-x` alone; hijacking touch pointer events here would
  // only fight that native behavior, not improve it.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { dragging: true, startX: e.clientX, startScrollLeft: el.scrollLeft, moved: false, pointerId: e.pointerId };
    // No setPointerCapture here anymore — see onPointerMove's own comment
    // for why capturing eagerly on every pointerdown, before knowing this
    // is actually a drag, was the real bug behind every card's own click-
    // through silently doing nothing.
  };

  // 8px, up from 3 for the same reason this now defers pointer capture
  // (below): a little headroom for a real click's own incidental
  // movement (cursor settling, trackpad/automation jitter) before
  // treating it as a drag at all, on top of the capture fix actually
  // being what unblocks the click.
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const state = drag.current;
    if (!el || !state.dragging) return;
    const dx = e.clientX - state.startX;
    if (!state.moved && Math.abs(dx) > 8) {
      state.moved = true;
      // Capturing only now — once this has genuinely become a drag, not
      // on every pointerdown regardless of what it turns out to be.
      // Reported live as every card's own Link click doing nothing:
      // setPointerCapture doesn't just keep routing *pointer* events to
      // this element past the target's own bounds (its documented,
      // intended job for a real drag) — per the Pointer Events spec it
      // also redirects the mouse-compatibility events browsers
      // synthesize alongside them, including `click`, so the click
      // event's own target became this scroll container instead of
      // whichever card the pointer was actually over, and a click
      // targeted at an *ancestor* of the Link never passes through it on
      // the way up — Link's own onClick simply never ran. A plain click
      // (this branch never runs, capture never happens) now reaches its
      // card's Link exactly the way a click outside this component
      // already always did.
      try {
        el.setPointerCapture(state.pointerId);
      } catch {
        // Safari/older browsers can reject capture for a pointerId
        // that's already gone by the time this runs — state.moved is
        // already set either way, so this is safe to ignore.
      }
    }
    el.scrollLeft = state.startScrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    drag.current.dragging = false;
  };

  // A card wrapped in <Link> would otherwise navigate at the end of every
  // drag (a pointerup is still a click) — swallowing just the click that
  // capped off an actual drag (state.moved) keeps real taps/clicks on a
  // still card working normally.
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    // id + scroll-mt-[120px]: kept even though the nav's own "Works" link
    // was removed (Figma 51:10930 drops that segment, see Nav.tsx) — no
    // remaining link on the site actually points at #selected-works
    // right now, but the id costs nothing to leave in place as a
    // deep-link target for whatever does next, rather than stripping it
    // preemptively.
    // No "Selected works" heading here — Figma 51:10930 has no such text
    // node anywhere above this row (confirmed via both the code export
    // and get_metadata, not a truncation artifact of the earlier, larger
    // fetch), unlike an earlier, separate fetch of just this section
    // (15:7365) which did have one. Following this node literally, on
    // direct instruction, rather than assuming that omission is a Figma
    // authoring gap.
    <div id="selected-works" className="scroll-mt-[120px]">
      {/* Figma 55:11849 — a full-bleed, horizontally-scrolling row of
          688px cards (58px gap at desktop width), not the single-card
          carousel this used to be. `relative left-1/2 w-screen
          -translate-x-1/2` breaks the row out of the page's own
          max-w-[688px] column regardless of that column's width — a
          standard full-bleed-from-centered-container technique, safe
          here specifically because html/body already carry `overflow-x:
          hidden` (globals.css), which clips the sub-pixel/scrollbar-gap
          overflow `w-screen` can introduce before it ever becomes page-
          level horizontal scroll. The scrolling itself stays entirely
          inside this row's own overflow-x-auto box, never the document —
          globals.css's own comment on that rule is updated alongside
          this to note the one legitimate exception. */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          // py-2, not just pb-2: setting overflow-x also forces the
          // *other* axis's computed overflow-y from "visible" to "auto"
          // (a real CSS rule, not a bug) — with no top padding, each
          // card's own 4px ring (ProjectCover's shadow-[0_0_0_4px_...])
          // had nowhere to render on its top edge and was getting
          // clipped by this scroller's own top edge, reported live as
          // "the floating ring is not correct." pt-2 gives it the same
          // clearance pb-2 already gave the bottom edge.
          className="scrollbar-none flex touch-pan-x cursor-grab gap-4 overflow-x-auto px-[max(16px,calc((100vw-688px)/2))] py-2 active:cursor-grabbing sm:gap-[58px]"
        >
          {PROJECTS.map((project) =>
            project.linked ? (
              <Link key={project.id} href={`/work/${project.id}`} className="flex w-[85vw] max-w-[688px] shrink-0 flex-col gap-4 sm:w-[688px]">
                <ProjectCover project={project} />
                <ProjectCaption project={project} />
              </Link>
            ) : (
              <div key={project.id} className="flex w-[85vw] max-w-[688px] shrink-0 flex-col gap-4 sm:w-[688px]">
                <ProjectCover project={project} />
                <ProjectCaption project={project} />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
