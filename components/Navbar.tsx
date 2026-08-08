import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 pt-6">
      <div className="flex items-center gap-36">
        <Link href="/" aria-label="Home">
          <Image src="/images/logo-mark.svg" alt="Adam Weber" width={48} height={16} priority />
        </Link>
        <nav className="flex items-center gap-2">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xs px-3 py-1.5 text-[14px] font-medium leading-4 tracking-[-0.056px] backdrop-blur-md transition-colors ${
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
        className="rounded-xs px-3 py-1.5 text-[14px] font-medium leading-4 tracking-[-0.056px] text-text-subtle backdrop-blur-md transition-colors hover:text-text-primary"
      >
        Get in touch
      </Link>
    </header>
  );
}
