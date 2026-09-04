"use client";

import { useState } from "react";

const EMAIL = "adamweber54@gmail.com";

/**
 * Home page footer (Figma 239:12759) — not to be confused with
 * components/Footer.tsx, the /work page's own (differently designed)
 * footer. Three columns in one row: identity (left), an email-copy card
 * centered on the same 688px column as the rest of the page's content, and
 * location (right). The middle card's wrapper mirrors the exact w-[688px]
 * Figma gives it so it lines up with that column regardless of how much
 * room the left/right text ends up taking.
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
    <footer className="w-full px-4 pb-6">
      <div className="mx-auto flex w-full max-w-[1392px] items-center gap-[85px]">
        <div className="flex shrink-0 items-center gap-4 whitespace-nowrap text-[14px] leading-4 tracking-[-0.112px] text-text-primary">
          <p>Adam Weber</p>
          <p>@2026 All Rights reserved</p>
        </div>

        <div className="mx-auto flex w-full max-w-[688px] items-center justify-center">
          <div className="flex w-full max-w-[400px] items-center justify-between rounded-m border border-border-subtle bg-bg-default py-1.5 pl-2 pr-1.5">
            <p className="text-[14px] leading-6 tracking-[-0.112px] text-text-primary">{EMAIL}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-sm bg-bg-tertiary px-3 py-1 text-[14px] font-medium leading-4 tracking-[-0.112px] text-text-primary"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-4 whitespace-nowrap text-[14px] leading-4 tracking-[-0.112px] text-text-primary">
          <p>Budapest</p>
          <p>Hungary</p>
        </div>
      </div>
    </footer>
  );
}
