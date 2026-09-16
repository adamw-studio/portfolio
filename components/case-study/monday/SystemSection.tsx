import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 207:6081. The two "Constant:"/"Variable:" rows (207:6086/
// 207:6103) are a left-rule callout Figma draws with a real 2px
// border, not a component this system has elsewhere — built local
// rather than generalizing a shared component off one page's own use.
function RuleItem({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex w-full flex-col gap-1 border-l-2 border-border-subtle pl-4">
      <p className="font-sans text-[14px] font-semibold leading-6 text-text-primary">{label}</p>
      <BodyCopy>{children}</BodyCopy>
    </div>
  );
}

export default function SystemSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-2">
        <Heading size="section" className="tracking-[-0.16px]">
          System
        </Heading>
        <BodyCopy>
          The core graphic form becomes a modular system. It can be rotated, mirrored, repeated, cropped and
          combined, producing a large family of compositions from a deliberately small visual vocabulary. A grid
          provides enough structure to keep those compositions coherent, while the graphic element is allowed to
          break that structure.
          <br />
          <br />
          This creates two layers within the system:
        </BodyCopy>
      </div>
      <div className="flex w-full flex-col gap-4">
        <RuleItem label="Constant:">wordmark / typography, palette and underlying geometry</RuleItem>
        <RuleItem label="Variable:">scale, orientation, repetition, cropping and composition</RuleItem>
      </div>
      <BodyCopy>Instead of defining one fixed brand layout, the system defines rules for generating many layouts.</BodyCopy>
    </div>
  );
}
