import Image from "next/image";

// Figma's stroke is drawn "inside" and doesn't consume layout space (unlike
// a CSS `border`, which always adds to an auto-sized box's total dimensions
// — confirmed this the hard way: a real border was inflating these pills by
// a couple of px beyond Figma's declared size). An inset box-shadow is the
// layout-neutral equivalent, so explicit sizes below match Figma exactly.
const insetBorder = "shadow-[inset_0_0_0_1px_var(--color-border-subtle)]";

export default function FloatingNav() {
  return (
    <div className="flex w-full justify-center pt-6">
      <div className={`flex h-9 w-[120px] items-center justify-between rounded-full bg-bg-default p-1.5 ${insetBorder}`}>
        <button
          type="button"
          aria-label="Adam Weber"
          className={`flex size-6 items-center justify-center overflow-hidden rounded-full ${insetBorder}`}
        >
          <Image src="/images/home/nav-avatar.jpg" alt="" width={24} height={24} className="size-full object-cover" />
        </button>
        <Image src="/images/home/logo-mark-small.svg" alt="Adam Weber" width={36} height={12} />
        <button
          type="button"
          aria-label="Open menu"
          className={`flex size-6 items-center justify-center rounded-full ${insetBorder}`}
        >
          <Image src="/images/home/menu.svg" alt="" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
