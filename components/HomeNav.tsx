import Image from "next/image";
import Link from "next/link";

const links = [
  { href: "/", label: "Home", icon: "/images/icons/home-simple.svg", active: true },
  { href: "/playground", label: "Playground", icon: "/images/icons/bounce-right.svg" },
  { href: "/about", label: "About", icon: "/images/icons/peace-hand.svg" },
  { href: "/contact", label: "Get in touch", icon: "/images/icons/pen-connect-wifi.svg" },
];

export default function HomeNav() {
  return (
    <nav className="flex w-full items-center justify-center gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-2 rounded-xs px-2 py-1 text-[14px] font-medium leading-4 tracking-[-0.056px] backdrop-blur-md transition-colors ${
            link.active ? "bg-bg-tertiary text-text-primary" : "text-text-secondary hover:text-text-primary"
          }`}
        >
          <Image
            src={link.icon}
            alt=""
            width={16}
            height={16}
            className={link.active ? "opacity-100" : "opacity-70"}
          />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
