// Figma 165:2807 ("Header") — same eyebrow + headline + key-value meta
// shape as Robotics' own Header.tsx, but this project's own meta block
// only has Project/Year (no Team row here — that's a full Team list of
// its own further down in ContextSection.tsx instead, not a header
// summary line).
const metaRow = "flex w-full items-center justify-between font-sans text-[14px] leading-normal tracking-[-0.112px]";

export default function Header() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-3">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2.5 font-sans text-[14px] italic leading-6 tracking-[-0.112px] text-text-subtle">
          <p>Graphic Designer, Executive Producer</p>
          <p>/</p>
          <p>2025</p>
        </div>
        <p className="font-sans text-[24px] font-semibold leading-6 tracking-[-0.192px] text-text-primary">
          Designing the poster and typography system for a documentary
        </p>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <div className={metaRow}>
          <p className="text-text-subtle">Project</p>
          <p className="text-right text-text-primary">Symphony of Disorder</p>
        </div>
        <div className={metaRow}>
          <p className="text-text-subtle">Year</p>
          <p className="text-right text-text-primary">2025</p>
        </div>
      </div>
    </div>
  );
}
