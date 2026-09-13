// Figma 136:6000 — this rebuild's own hero: no gradient cover card
// (the page-by-page carousel's own OverviewPage had one; this long-form
// rebuild's re-fetch of the page shows plain text directly on the page
// background instead, confirmed as a real design change, not a missing
// fetch). Same eyebrow/headline copy as that old cover card, so the
// project's own framing carries over unchanged even though its
// presentation doesn't.
export default function Hero() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-1">
      <div className="flex items-center gap-2.5 font-sans text-[14px] italic leading-6 tracking-[-0.112px] text-text-subtle">
        <p>Lead designer</p>
        <p>/</p>
        <p>2026</p>
      </div>
      <p className="font-sans text-[24px] font-semibold leading-7 tracking-[-0.192px] text-text-primary">
        Designing how agentic AI helps founders research, validate and turn ideas into ventures.
      </p>
    </div>
  );
}
