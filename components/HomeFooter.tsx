"use client";

import { useState } from "react";

const EMAIL = "weberadam54@gmail.com";
const textStyle = "text-[14px] leading-4 tracking-[-0.112px]";

/**
 * Home page footer (Figma 245:14077) — not to be confused with
 * components/Footer.tsx, the /work page's own (differently designed)
 * footer. This frame is exactly 688px wide, matching the main content
 * column every other section on this page sits in — not a narrow/mobile
 * variant of a separate wide layout (that was a wrong read of an earlier
 * fetch; there's only one footer layout here, always at this width).
 * Email card centered on top, identity/location as a two-column row
 * underneath.
 */
export default function HomeFooter() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — nothing
      // meaningful to fall back to, fail silently.
    }
  };

  return (
    // pb-[100px], not Figma's own pb-6: Nav is now a fixed bottom-center
    // pill (see Nav.tsx) that sits on top of whatever's underneath it —
    // this footer is the thing most often underneath it, since it's the
    // last content on every page that has one. 100px clears the pill's
    // closed-state footprint (24px bottom offset + 36px tall) with real
    // margin to spare, matching this site's own 100px section-gap rhythm
    // rather than a value picked just to avoid the pill.
    <footer className="w-full px-4 pb-[100px]">
      <div className="mx-auto flex w-full max-w-[688px] flex-col items-center gap-4">
        <div className="flex w-full max-w-[400px] items-center justify-between rounded-m border border-border-subtle bg-bg-default py-1.5 pl-2 pr-1.5">
          <p className={`${textStyle} leading-6 text-text-secondary`}>{EMAIL}</p>
          <button
            type="button"
            onClick={handleCopy}
            className={`rounded-sm bg-bg-tertiary px-3 py-1 font-medium ${textStyle} text-text-primary`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className={`flex w-full items-center justify-between ${textStyle}`}>
          <div className="flex flex-col items-start gap-2">
            <p className="text-text-primary">Adam Weber</p>
            <p className="text-text-secondary">@2026 All Rights reserved</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-text-primary">Budapest</p>
            <p className="text-text-secondary">Hungary</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
