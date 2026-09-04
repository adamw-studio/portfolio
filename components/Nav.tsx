import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Home", icon: "/images/home/home-simple.svg", active: true },
  { href: "/work", label: "Selected works", icon: "/images/home/box-iso.svg" },
  { href: "/playground", label: "Playground", icon: "/images/home/bounce-right.svg" },
  { href: "/contact", label: "Get in touch", icon: "/images/home/edit-pencil.svg" },
];

export default function Nav() {
  return (
    <div className="flex w-full items-center justify-between">
      <Image src="/images/home/logo-mark-small.svg" alt="Adam Weber" width={36} height={12} />
      <nav className="flex items-center gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-sm px-2 py-1 text-[14px] leading-4 tracking-[-0.128px] backdrop-blur-md ${
              link.active ? "bg-bg-tertiary text-text-primary" : "text-text-secondary"
            }`}
          >
            {/* Inactive icons already carry fill-opacity:0.4 baked into the
                SVG itself (matches Figma's icon/icon-subtle token) — no
                extra CSS opacity needed, that would double-dim them. */}
            <Image src={link.icon} alt="" width={16} height={16} />
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
