import Image from "next/image";
import { themedIcon } from "@/components/themedIcon";

// Figma 206:5264 — this page's own header shape (year, title, then a
// Website/Role key-value block) rather than Robotics' own Project/Year/
// Team one (see that page's own Header.tsx) — a real per-project
// difference, not something to force into one shared component.
const metaRow = "flex w-full items-center justify-between font-sans text-[14px] leading-normal tracking-[-0.112px]";

export default function Header() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-3">
      <div className="flex w-full flex-col gap-1">
        <p className="font-sans text-[14px] italic leading-6 tracking-[-0.112px] text-text-subtle">2026</p>
        <p className="font-sans text-[24px] font-semibold leading-6 tracking-[-0.192px] text-text-primary">
          Designing a visual system for Monday, a creative collective
        </p>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <div className={metaRow}>
          <p className="text-text-subtle">Website</p>
          <a
            href="https://monnndayyy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-primary transition-colors hover:text-text-secondary"
          >
            Monday
            <Image src="/images/home/arrow-up-right.svg" alt="" width={16} height={16} className={themedIcon} />
          </a>
        </div>
        <div className={metaRow}>
          <p className="text-text-subtle">Role</p>
          <p className="text-right text-text-primary">Brand Designer</p>
        </div>
      </div>
    </div>
  );
}
