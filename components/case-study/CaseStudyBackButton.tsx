import Image from "next/image";
import Link from "next/link";
import { themedIcon } from "@/components/themedIcon";

// Figma 91:1838 — top-center, "‹ Back to Home" with a real label, not
// the sitewide BackButton.tsx's icon-only top-*left* pill: this
// presentation shell replaces the site's own Nav entirely while a case
// study is open (per the brief's "minimal interface chrome" — the
// Home/Play segmented control has no place in a full-viewport
// presentation), so this is that page's only way back, and gets a
// clearer label for it.
export function CaseStudyBackButton() {
  return (
    <Link
      href="/"
      className="fixed inset-x-0 top-6 z-20 mx-auto flex w-fit items-center gap-1 rounded-full border border-border-disabled bg-bg-default px-3 py-2 backdrop-blur-[5px] transition-transform duration-100 active:scale-95"
    >
      <Image src="/images/home/arrow-left.svg" alt="" width={16} height={16} className={themedIcon} />
      <span className="font-sans text-[14px] tracking-[-0.112px] text-text-primary">Back to Home</span>
    </Link>
  );
}
