"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { heading } from "@/components/typography";
import { themedIcon } from "@/components/themedIcon";
import { BeaconComposer } from "@/components/BeaconComposer";
import { playArrowTap } from "@/components/sound/arrowTap";

type Project = {
  /** Also doubles as the /work/[id] case study route slug. */
  id: string;
  description: string;
  role: string;
  year: string;
  backdropSrc: string;
  backdropAlt: string;
};

const PROJECTS: Project[] = [
  {
    id: "beacon",
    description:
      "Ideas don’t become viable ventures by default. Designing how agentic AI helps founders research, validate and turn ideas into ventures.",
    role: "Lead Designer",
    year: "2026",
    backdropSrc: "/images/home/selected-work-1-backdrop.jpg",
    backdropAlt: "",
  },
  {
    id: "robotics",
    description:
      "Building robots is complex. Learning to build them shouldn’t be. Redesigning the robotics experience to help kids confidently build, code and learn on their own.",
    role: "UX Lead, Product Designer",
    year: "2021-22",
    backdropSrc: "/images/home/selected-work-2-cover.jpg",
    backdropAlt: "Robotics companion app displayed on a phone, resting on a table",
  },
  {
    id: "documentary",
    description:
      "Translating an artist’s world from canvas to screen. Designing the poster and typography system for a documentary celebrating 40 years of creative work.",
    role: "Graphic Designer, Executive Producer",
    year: "2025",
    backdropSrc: "/images/home/documentary-poster-closeup.jpg",
    backdropAlt: "Close-up of the \"Fekete Fehér Kék Zöld Piros\" film posters scattered together",
  },
  {
    id: "monday",
    description:
      "A creative collective needs an identity, not a uniform. Designing a visual system that gives Monday a distinctive voice while leaving room for experimentation.",
    role: "Brand Designer",
    year: "2026",
    backdropSrc: "/images/home/selected-work-4-cover.jpg",
    backdropAlt: "Red tote bag printed with the Monday wordmark, held up against a blue sky",
  },
];

export default function SelectedWorks() {
  const [index, setIndex] = useState(0);
  const project = PROJECTS[index];

  return (
    // id + scroll-mt-[120px]: the nav's own "Works" link now jumps here
    // (Nav.tsx, /#selected-works) instead of navigating to the separate
    // /work index — scroll-margin-top keeps the fixed top nav (its own
    // ~40px bar + 24px top offset, plus real breathing room) from
    // covering the heading once the browser scrolls this into view.
    <div id="selected-works" className="flex scroll-mt-[120px] flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <h2 className={heading}>Selected works</h2>
        {/* Figma 15:7365 — the two arrow buttons now share one outer pill
            (a real border + 4px padding + 4px gap between them) rather
            than sitting as two independent freestanding circles with a
            gap and their own insetBorder each. Each inner circle keeps
            its own bg-tertiary fill — only the border moved from
            per-button to the shared wrapper.

            Loops rather than disabling at the ends (prev on the first
            project wraps to the last, next on the last wraps to the
            first) — the modulo handles both directions, including JS's
            own negative-mod quirk (-1 % 4 is -1, not 3) via the
            + PROJECTS.length before the final % . Neither arrow is ever
            disabled now, so there's no dead-looking button at either end
            of the set. */}
        <div className="flex items-center gap-1 rounded-full border border-border-subtle p-1">
          <button
            type="button"
            aria-label="Previous work"
            onClick={() => {
              setIndex((i) => (i - 1 + PROJECTS.length) % PROJECTS.length);
              playArrowTap();
            }}
            className="flex size-6 items-center justify-center rounded-full bg-bg-tertiary"
          >
            <Image src="/images/home/arrow-left.svg" alt="" width={16} height={16} className={themedIcon} />
          </button>
          <button
            type="button"
            aria-label="Next work"
            onClick={() => {
              setIndex((i) => (i + 1) % PROJECTS.length);
              playArrowTap();
            }}
            className="flex size-6 items-center justify-center rounded-full bg-bg-tertiary"
          >
            <Image src="/images/home/arrow-right.svg" alt="" width={16} height={16} className={themedIcon} />
          </button>
        </div>
      </div>

      <Link href={`/work/${project.id}`} className="flex flex-col gap-4">
        <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-bg-secondary">
          <Image
            key={project.backdropSrc}
            src={project.backdropSrc}
            alt={project.backdropAlt}
            fill
            className="object-cover"
            sizes="688px"
          />
          {/* Figma 356:1192's own composition over Beacon's cover: a flat
              20% black wash between the photo and the composer, there
              specifically so the composer's white text/borders read
              against a busy backdrop — not something the other three
              projects need, since none of them layer UI on top of their
              image. */}
          {project.id === "beacon" && (
            <>
              <div aria-hidden className="absolute inset-0 bg-black/20" />
              <BeaconComposer />
            </>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {/* 16px/medium, not the shared bodyText size — this line reads as
              the project's title, not body copy, so it gets its own
              explicit classes rather than changing bodyText (shared
              sitewide) or appending a conflicting text-[16px] after it,
              which would depend on Tailwind's generated stylesheet order
              to win over bodyText's own text-[14px]. */}
          <p className="font-sans text-[16px] font-medium leading-6 tracking-[-0.128px] text-text-primary">
            {project.description}
          </p>
          <div className="flex items-center justify-between text-text-secondary">
            <p className="font-sans text-[14px] leading-6 tracking-[-0.128px]">{project.role}</p>
            <p className="font-sans text-[14px] leading-6 tracking-[-0.128px]">{project.year}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
