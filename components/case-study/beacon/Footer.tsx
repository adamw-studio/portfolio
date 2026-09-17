// Same name/rights + location content as every other case study's own
// local Footer (e.g. case-study/robotics/Footer.tsx — see that file's
// own comment for why this is duplicated per page rather than sharing
// one component: each page's own narrative column width differs from
// the home page's HomeFooter). Beacon was the one case study missing
// this entirely until now — reported live ("the footer should always
// be displayed across the website, except the Playground").
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
