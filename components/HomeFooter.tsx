"use client";

import { useState } from "react";

const EMAIL = "adamweber54@gmail.com";
const textStyle = "text-[14px] leading-4 tracking-[-0.112px]";

/**
 * Home page footer — not to be confused with components/Footer.tsx, the
 * /work page's own (differently designed) footer. Two Figma layouts for
 * this: a wide single row (239:12759, lg+) with identity/email-card/
 * location side by side, and a narrower stacked one (245:14077, below lg)
 * with the email card on its own line above a two-column identity/
 * location row. They're different *groupings*, not just a reflow of the
 * same markup, so this renders both and toggles which is visible per
 * breakpoint rather than trying to force one structure to serve both.
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

  const emailCard = (
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
  );

  return (
    <footer className="w-full px-4 pb-6">
      {/* Stacked (below lg): email card on its own row, identity/location
          as a two-column row underneath. */}
      <div className="mx-auto flex w-full max-w-[400px] flex-col items-center gap-4 lg:hidden">
        {emailCard}
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

      {/* Wide (lg+): identity, email card centered on the same 688px
          column as the rest of the page's content, and location, all in
          one row. */}
      <div className="mx-auto hidden w-full max-w-[1392px] items-center gap-[85px] lg:flex">
        <div className={`flex shrink-0 items-center gap-4 whitespace-nowrap ${textStyle}`}>
          <p className="text-text-primary">Adam Weber</p>
          <p className="text-text-secondary">@2026 All Rights reserved</p>
        </div>

        <div className="mx-auto flex w-full max-w-[688px] items-center justify-center">{emailCard}</div>

        <div className={`flex shrink-0 items-center justify-end gap-4 whitespace-nowrap ${textStyle}`}>
          <p className="text-text-primary">Budapest</p>
          <p className="text-text-secondary">Hungary</p>
        </div>
      </div>
    </footer>
  );
}
