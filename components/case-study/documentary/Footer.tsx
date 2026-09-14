// Figma 165:2824 — same name/rights + location content as Robotics' own
// local Footer.tsx (built local there rather than widen the shared
// HomeFooter.tsx to fit a narrower column; same reasoning applies here).
export default function Footer() {
  return (
    <div className="flex w-full items-center justify-between font-sans text-[14px] font-normal leading-4 tracking-[-0.112px]">
      <div className="flex items-start gap-2">
        <p className="text-text-primary">Adam Weber</p>
        <p className="text-text-secondary">@2026 All Rights reserved</p>
      </div>
      <div className="flex items-center justify-end gap-2">
        <p className="text-text-primary">Budapest</p>
        <p className="text-text-secondary">Hungary</p>
      </div>
    </div>
  );
}
