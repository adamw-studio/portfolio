// Figma 161:1726 — same name/rights + location content as the home
// page's own HomeFooter.tsx, but that component is hardcoded to the
// home page's own 688px column (max-w-[688px]), not this page's
// narrower 512px one — built local rather than risk widening Beacon's
// (and every other page's) shared footer to fit a case-study page that
// doesn't use it.
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
