"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { bodyText, heading, insetBorder } from "@/components/typography";
import { themedIcon } from "@/components/themedIcon";

type Project = {
  /** Also doubles as the /work/[id] case study route slug. */
  id: string;
  description: string;
  role: string;
  year: string;
  backdropSrc: string;
  backdropAlt: string;
  // Beacon's Figma composition layers a second, blurred product screenshot
  // inset over the backdrop — later projects may just be a single flat
  // image, so this stays optional per-project rather than a fixed shape.
  inset?: { src: string; alt: string; left: number; top: number; width: number; height: number };
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
    inset: {
      src: "/images/home/selected-work-1-screen.jpg",
      alt: "Beacon product screen",
      left: 79,
      top: 86,
      width: 530,
      height: 358,
    },
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
    backdropSrc: "/images/home/selected-work-3-cover.jpg",
    backdropAlt: "Black and white behind-the-scenes photo of a documentary film crew interviewing the artist on a residential street",
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
  const canGoPrev = index > 0;
  const canGoNext = index < PROJECTS.length - 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-center justify-between">
        <h2 className={heading}>Selected works</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous work"
            disabled={!canGoPrev}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`flex size-6 items-center justify-center rounded-full bg-bg-tertiary disabled:cursor-not-allowed disabled:opacity-40 ${insetBorder}`}
          >
            <Image src="/images/home/arrow-left.svg" alt="" width={16} height={16} className={themedIcon} />
          </button>
          <button
            type="button"
            aria-label="Next work"
            disabled={!canGoNext}
            onClick={() => setIndex((i) => Math.min(PROJECTS.length - 1, i + 1))}
            className={`flex size-6 items-center justify-center rounded-full bg-bg-tertiary disabled:cursor-not-allowed disabled:opacity-40 ${insetBorder}`}
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
          {project.inset && (
            <div
              className="absolute overflow-hidden rounded-lg blur-[1px]"
              style={{ left: project.inset.left, top: project.inset.top, width: project.inset.width, height: project.inset.height }}
            >
              <Image src={project.inset.src} alt={project.inset.alt} fill className="object-cover" sizes={`${project.inset.width}px`} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className={bodyText}>{project.description}</p>
          <div className="flex items-center justify-between text-text-secondary">
            <p className="font-sans text-[14px] leading-6 tracking-[-0.128px]">{project.role}</p>
            <p className="font-sans text-[14px] leading-6 tracking-[-0.128px]">{project.year}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
