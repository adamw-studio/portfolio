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
    // Figma 57:24474 — shorter than this project's own /work/monday copy,
    // dropping the leading "A creative collective needs an identity, not
    // a uniform." sentence outright, not just trimmed for space.
    description: "Designing a visual system that gives Monday a distinctive voice while leaving room for experimentation.",
    role: "Lead designer",
    year: "2026",
    backdropSrc: "/images/home/selected-work-4-cover.jpg",
    backdropAlt: "Red tote bag printed with the Monday wordmark, held up against a blue sky",
    linked: true,
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

// Figma 57:24456/61:107 — a small "Soon" badge on the design-system
// card's cover specifically: the one project with no case-study page
// yet (SelectedWorks.tsx's own PROJECTS entry renders it unlinked), so
// this is what actually explains that to a visitor instead of leaving
// an unlinked card with no comment. Fixed dark colors (bg-[#0d0d0d],
// white-based text/icon), not this site's theme-aware bg-default/
// text-* tokens: same reasoning as BeaconComposer's own glass panel —
// this sits on top of a photo/collage cover, not the page's own light/
// dark chrome, so it keeps one deliberate look regardless of site theme
// rather than flipping to a near-invisible light badge over that same
// dark photo in light mode.
function SoonBadge() {
  return (
    <div className="absolute right-4 top-5 flex items-center gap-1 rounded-m bg-[#0d0d0d] px-2 py-1">
      <svg viewBox="0 0 16 16" width={16} height={16} fill="none" className="shrink-0">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.11214 2.83939C5.86692 1.99026 6.90412 1.5 8 1.5C9.09588 1.5 10.1331 1.99026 10.8879 2.83939C11.6409 3.6866 12.0556 4.82429 12.0556 6C12.0556 8.27029 12.4879 9.60223 12.8856 10.348C13.0847 10.7213 13.2774 10.9522 13.4091 11.0839C13.4752 11.15 13.5267 11.1919 13.5569 11.2146C13.5721 11.226 13.582 11.2326 13.5859 11.2351L13.5867 11.2356C13.7793 11.3487 13.8738 11.5765 13.817 11.7934C13.7594 12.0133 13.5607 12.1667 13.3333 12.1667H2.66667C2.43932 12.1667 2.2406 12.0133 2.18299 11.7934C2.12618 11.5765 2.2207 11.3488 2.41334 11.2356L2.41414 11.2351C2.41799 11.2326 2.4279 11.226 2.44306 11.2146C2.47333 11.1919 2.5248 11.15 2.59089 11.0839C2.72261 10.9522 2.91533 10.7213 3.11438 10.348C3.51214 9.60223 3.94444 8.27029 3.94444 6C3.94444 4.82429 4.35906 3.6866 5.11214 2.83939ZM3.79305 11.1667H12.2069C12.1394 11.0615 12.0711 10.9458 12.0033 10.8186C11.5121 9.89777 11.0556 8.39638 11.0556 6C11.0556 5.05397 10.721 4.15684 10.1405 3.50375C9.56164 2.85259 8.79011 2.5 8 2.5C7.20989 2.5 6.43836 2.85259 5.85955 3.50375C5.27903 4.15684 4.94444 5.05397 4.94444 6C4.94444 8.39638 4.48786 9.89777 3.99673 10.8186C3.92893 10.9458 3.86064 11.0615 3.79305 11.1667ZM6.59579 12.9008C6.83466 12.7623 7.14062 12.8436 7.27918 13.0824C7.35243 13.2087 7.45758 13.3136 7.58409 13.3864C7.71059 13.4593 7.85402 13.4976 8.00001 13.4976C8.146 13.4976 8.28943 13.4593 8.41594 13.3864C8.54245 13.3136 8.64759 13.2087 8.72085 13.0824C8.85941 12.8436 9.16537 12.7623 9.40423 12.9008C9.6431 13.0394 9.72441 13.3454 9.58585 13.5842C9.42469 13.862 9.19337 14.0926 8.91505 14.253C8.63674 14.4133 8.32119 14.4976 8.00001 14.4976C7.67883 14.4976 7.36329 14.4133 7.08497 14.253C6.80666 14.0926 6.57534 13.862 6.41418 13.5842C6.27562 13.3454 6.35693 13.0394 6.59579 12.9008Z"
          fill="#F4F4F4"
          fillOpacity="0.4"
        />
      </svg>
      <p className="whitespace-nowrap font-sans text-[14px] leading-[normal] tracking-[-0.112px] text-[#F4F4F4]">Soon</p>
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
      {project.id === "design-system" && (
        <>
          <DesignSystemCollage />
          <SoonBadge />
        </>
      )}
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
