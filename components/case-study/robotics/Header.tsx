// Figma 161:1720 ("Header") — Beacon's own Hero.tsx pattern (eyebrow +
// headline) plus a Project/Year/Team key-value block Beacon's own header
// doesn't have (161:1720's later 164:25xx group) — this project page
// carries real project metadata Beacon's single-sentence header never
// needed room for.
const metaRow = "flex w-full items-center justify-between font-sans text-[14px] leading-normal tracking-[-0.112px]";

export default function Header() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-3">
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center gap-2.5 font-sans text-[14px] italic leading-6 tracking-[-0.112px] text-text-subtle">
          <p>UX Lead, UI Designer</p>
          <p>/</p>
          <p>2021-2022</p>
        </div>
        <p className="font-sans text-[24px] font-semibold leading-6 tracking-[-0.192px] text-text-primary">
          Making kids robotics programs affordable, accessible, educational, fair and fun
        </p>
      </div>
      <div className="flex w-full flex-col gap-1.5">
        <div className={metaRow}>
          <p className="text-text-subtle">Project</p>
          <p className="text-right text-text-primary">Revolution Robotics</p>
        </div>
        <div className={metaRow}>
          <p className="text-text-subtle">Year</p>
          <p className="text-right text-text-primary">2021-22</p>
        </div>
        <div className={metaRow}>
          <p className="text-text-subtle">Team</p>
          <p className="text-right text-text-primary">Borbala German (UX Researcher)</p>
        </div>
      </div>
    </div>
  );
}
