import Image from "next/image";
import { heading } from "@/components/typography";
import { themedIcon } from "@/components/themedIcon";
import { ICON_DURATION, EASE_OUT, MOTION_REDUCE } from "@/components/motion/tokens";

type Role = { title: string; company: string; period: string };

// Figma 15:7414/15:7419 — net-new section, not present in any earlier
// version of this page.
const ROLES: Role[] = [
  { title: "Building B2B AI tools", company: "@McKinsey & Company", period: "2024-Present" },
  { title: "Building client businesses", company: "@McKinsey & Company", period: "2023-2024" },
  { title: "Building B2C, B2B tools", company: "@UXStudio", period: "2021-2023" },
  { title: "Creating brand identity concepts", company: "@zwoelf", period: "2020 Jul-Sep" },
];

export default function Experience() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex w-full items-center justify-between">
        <h2 className={heading}>Experience</h2>
        {/* Figma 15:7415/15:7417/15:7418 — the same bare icon-button frame
            as before, now wired to its actual destination: a CV download,
            confirmed by the node's own Figma component description
            ("page, file, document, ... report, ... letter, ... sheet,
            article") plus the file the design points at. `download` (not
            a plain navigation link) so clicking it saves the PDF instead
            of leaving the page — the point of a résumé link is to hand
            someone a file, not send them to one. Hover/press feedback
            (bg-tertiary fill, a slight press-scale) added on top of
            Figma's bare resting state since this is now real interactive
            affordance, not a static frame.

            Tooltip (Figma 21:7761 — "Download CV" label, bg-secondary,
            radius-m, 12px text): the icon alone doesn't say what it does,
            so the label surfaces on hover/focus rather than only living in
            the aria-label. `group`/`relative` live on the *wrapping* span,
            not the link itself, so the tooltip's own absolute positioning
            is relative to a box that doesn't also carry the link's
            padding/border — centering it over the visible icon instead of
            the icon-plus-chrome. pointer-events-none keeps it from ever
            intercepting the hover/click it's describing. No open/close
            delay: unlike a dense toolbar where hover delay prevents
            accidental triggers, this is one isolated icon far down the
            page — a delay here would only make it feel slower to confirm
            what a rarely-seen icon does. */}
        <span className="group relative flex items-center">
          <a
            href="/files/adam-weber-cv.pdf"
            download="Adam Weber - CV.pdf"
            aria-label="Download CV (PDF)"
            className={`flex items-center rounded-full border border-border-subtle px-2.5 py-1 transition-[background-color,transform] ${ICON_DURATION} ${MOTION_REDUCE} hover:bg-bg-tertiary focus-visible:bg-bg-tertiary active:scale-[0.97]`}
          >
            <Image src="/images/home/page-icon.svg" alt="" width={16} height={16} className={themedIcon} />
          </a>
          <span
            aria-hidden
            className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 scale-95 whitespace-nowrap rounded-m bg-bg-secondary px-2.5 py-1.5 font-sans text-[12px] text-text-primary opacity-0 transition-[opacity,transform] ${ICON_DURATION} ${EASE_OUT} ${MOTION_REDUCE} group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100`}
          >
            Download CV
          </span>
        </span>
      </div>
      <div className="flex w-full flex-col gap-2 font-sans text-[14px] tracking-[-0.112px]">
        {ROLES.map((role) => (
          <div key={role.title} className="flex w-full items-start justify-between">
            <div className="flex items-start gap-2">
              <p className="text-text-primary">{role.title}</p>
              <p className="text-text-subtle">{role.company}</p>
            </div>
            <p className="whitespace-nowrap text-text-subtle">{role.period}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
