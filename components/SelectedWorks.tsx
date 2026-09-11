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
    description:
      "Ideas don’t become viable ventures by default. Designing how agentic AI helps founders research, validate and turn ideas into ventures.",
    role: "Lead designer",
    year: "2026",
    backdropSrc: "/images/home/selected-work-1-backdrop.jpg",
    backdropAlt: "",
    linked: true,
  },
  {
    id: "robotics",
    description:
      "Building robots is complex. Learning to build them shouldn’t be. Redesigning the robotics experience to help kids confidently build, code and learn on their own.",
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
  },
  {
    id: "monday",
    description:
      "A creative collective needs an identity, not a uniform. Designing a visual system that gives Monday a distinctive voice while leaving room for experimentation.",
    role: "Lead designer",
    year: "2026",
    backdropSrc: "/images/home/selected-work-4-cover.jpg",
    backdropAlt: "Red tote bag printed with the Monday wordmark, held up against a blue sky",
    linked: true,
  },
  {
    id: "documentary",
    description:
      "Translating an artist’s world from canvas to screen. Designing the poster and typography system for a documentary celebrating 40 years of creative work.",
    role: "Graphic Designer",
    year: "2025",
    backdropSrc: "/images/home/documentary-poster-closeup.jpg",
    backdropAlt: "Close-up of the \"Fekete Fehér Kék Zöld Piros\" film posters scattered together",
    bordered: true,
    linked: true,
  },
];

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
    </div>
  );
}

function ProjectCaption({ project }: { project: Project }) {
  return (
    // No gap between the role row and the description — Figma 57:24461's
    // own metadata has the description start at y=24, exactly the role
    // row's own height, with no added space between them. An earlier
    // pass had gap-1 (4px) here, plus a bumped 16px/font-medium size on
    // the description that Figma never actually specifies: the literal
    // node uses the exact same 14px/leading-6/tracking-[-0.112px]/
    // font-normal as the role row, just in text-primary instead of
    // text-subtle — not a distinct "title" style.
    <div className="flex flex-col text-[14px] leading-6 tracking-[-0.112px]">
      <div className="flex items-center gap-2.5 font-sans text-text-subtle">
        <p>{project.role}</p>
        <p>/</p>
        <p>{project.year}</p>
      </div>
      <p className="font-sans font-normal text-text-primary">{project.description}</p>
    </div>
  );
}

export default function SelectedWorks() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Drag-to-scroll state lives in a ref, not useState — it's read/written
  // every pointermove and must never itself trigger a re-render (that
  // would fight the scrollLeft writes below on every frame of the drag).
  const drag = useRef({ dragging: false, startX: 0, startScrollLeft: 0, moved: false });

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
    drag.current = { dragging: true, startX: e.clientX, startScrollLeft: el.scrollLeft, moved: false };
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      // Safari/older browsers can reject capture for a pointerId that's
      // already gone by the time this runs (a very fast click) — the
      // drag state above is already set either way, so this is safe to
      // ignore rather than let it throw out of the handler.
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const state = drag.current;
    if (!el || !state.dragging) return;
    const dx = e.clientX - state.startX;
    if (Math.abs(dx) > 3) state.moved = true;
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
