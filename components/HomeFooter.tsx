const textStyle = "text-[14px] leading-4 tracking-[-0.112px]";

/**
 * Home page footer (Figma 51:11042) — a plain single-row identity/
 * location strip now, not this frame's own earlier design (245:14077,
 * an email-copy pill centered above this same row). That pill is gone
 * outright on direct instruction ("remove the input field"), not just
 * visually hidden — the footer's only job now is this one row. Email
 * is still reachable elsewhere on the page (the intro's own Email/
 * LinkedIn/Instagram row, page.tsx) and in PasswordGate's own contact
 * link, both a real mailto already, independent of this component.
 *
 * No client-side state left (that lived entirely in the removed copy
 * button), so this drops "use client" and goes back to a plain server
 * component — nothing here needs the browser.
 *
 * Not to be confused with components/Footer.tsx, the /work page's own
 * (differently designed) footer. This frame is exactly 688px wide,
 * matching the main content column every other section on this page
 * sits in — not a narrow/mobile variant of a separate wide layout.
 */
export default function HomeFooter() {
  return (
    // pb-6 (24px), not the old pb-[100px]: that value cleared a fixed
    // bottom-center nav pill this site no longer has — Nav.tsx moved
    // back to a top-anchored bar a while before this file was last
    // touched, so the footer had been carrying 100px of now-pointless
    // clearance ever since, sitting well off the actual bottom of the
    // screen on any page short enough to show it without scrolling.
    // Reported live as wanting the footer to actually sit at the
    // screen's own bottom edge with real (not leftover-from-history)
    // breathing room — 24px.
    <footer className="w-full px-4 pb-6">
      <div className={`mx-auto flex w-full max-w-[688px] items-center justify-between ${textStyle}`}>
        <div className="flex items-start gap-2">
          <p className="text-text-primary">Adam Weber</p>
          <p className="text-text-secondary">@2026 All Rights reserved</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <p className="text-text-primary">Budapest</p>
          <p className="text-text-secondary">Hungary</p>
        </div>
      </div>
    </footer>
  );
}
