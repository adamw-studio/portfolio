import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    // gap-36 (144px) between the logo and the Work/About links is fine on
    // desktop (Figma's own spacing) but on a narrow phone it alone eats
    // most of the row's own available width, squeezing "Get in touch"
    // (a two-word link with no wrap protection) down to a sliver that
    // wraps across three lines instead of staying on one — a smaller gap
    // below `sm` (640px) plus whitespace-nowrap on every link as a safety
    // net fixes both the squeeze and its symptom.
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 pt-6">
      <div className="flex items-center gap-6 sm:gap-36">
        <Link href="/" aria-label="Home" className="shrink-0">
          <Image src="/images/logo-mark.svg" alt="Adam Weber" width={48} height={16} priority />
        </Link>
        <nav className="flex items-center gap-2">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-xs px-3 py-1.5 text-[14px] font-medium leading-4 tracking-[-0.056px] backdrop-blur-md transition-colors ${
                i === 0
                  ? "bg-bg-tertiary text-text-primary"
                  : "text-text-subtle hover:text-text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <Link
        href="/contact"
        className="shrink-0 whitespace-nowrap rounded-xs px-3 py-1.5 text-[14px] font-medium leading-4 tracking-[-0.056px] text-text-subtle backdrop-blur-md transition-colors hover:text-text-primary"
      >
        Get in touch
      </Link>
    </header>
  );
}
