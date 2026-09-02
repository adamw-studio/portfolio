import Image from "next/image";

export default function FloatingNav() {
  return (
    <div className="flex w-full justify-center pt-6">
      <div className="flex items-center gap-3 rounded-full border border-border-subtle bg-bg-default p-1.5">
        <button
          type="button"
          aria-label="Toggle theme"
          className="flex items-center rounded-full border border-border-subtle p-1"
        >
          <Image src="/images/home/half-moon.svg" alt="" width={16} height={16} />
        </button>
        <Image src="/images/home/logo-mark-small.svg" alt="Adam Weber" width={36} height={12} />
        <button
          type="button"
          aria-label="Open menu"
          className="flex items-center rounded-full border border-border-subtle p-1"
        >
          <Image src="/images/home/menu.svg" alt="" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
