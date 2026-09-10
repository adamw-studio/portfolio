import Image from "next/image";
import { heading } from "@/components/typography";
import { themedIcon } from "@/components/themedIcon";

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
        {/* Figma shows this as a bare icon-button frame with no href or
            click target defined anywhere in the file — kept as a plain,
            non-interactive div rather than inventing a destination (a
            résumé link, most likely) it doesn't actually have yet. */}
        <div className="flex items-center rounded-full border border-border-subtle px-2.5 py-1">
          <Image src="/images/home/page-icon.svg" alt="" width={16} height={16} className={themedIcon} />
        </div>
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
