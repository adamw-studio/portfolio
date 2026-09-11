"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

// Figma 304:9017 ("locked"), 304:12070 ("Password Input - Active", typed
// but not yet wrong) and 304:12160 ("Password Input - Error").
//
// This is a soft content gate, not real access control: the password
// (passed in as a prop) ships in the client JS bundle and the check runs
// entirely in the browser, so anyone who reads the page source has it.
// That matches what's actually being asked for here — a "this project
// needs a password" prompt like the Figma prototype shows — not a secured
// backend. Don't reuse this for anything that needs to stay confidential.
export function PasswordGate({
  password,
  storageKey,
  children,
}: {
  password: string;
  storageKey: string;
  children: ReactNode;
}) {
  // Same reasoning as ThemeContext's theme default: window/sessionStorage
  // don't exist during SSR, so both the server-rendered HTML and the
  // client's *first* render need to agree on "locked" to avoid a
  // hydration mismatch — this corrects to the stored unlock immediately
  // after mount instead of trying to read storage in a lazy initializer.
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (window.sessionStorage.getItem(storageKey) === "unlocked") setUnlocked(true);
    } catch {
      // sessionStorage unavailable (private mode, disabled storage) — the
      // gate just asks again every visit instead of erroring.
    }
  }, [storageKey]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value) return;
    if (value === password) {
      setUnlocked(true);
      try {
        window.sessionStorage.setItem(storageKey, "unlocked");
      } catch {
        // Persistence is a nice-to-have; the unlocked state above still
        // holds for the rest of this page visit either way.
      }
    } else {
      setError(true);
    }
  }

  if (unlocked) return <>{children}</>;

  return (
    // pt-[100px]: Nav is fixed and bottom-anchored now (see Nav.tsx), so
    // this column no longer needs the 140px top reservation the old
    // top-center pill required — 100px matches this site's own
    // section-gap rhythm as plain top breathing room. BackButton stays
    // `fixed top-6` itself (see BackButton.tsx), independent of this
    // padding either way.
    <div className="relative mx-auto flex w-full max-w-[688px] flex-1 flex-col pb-[60px] pt-[100px]">
      {/* Same back button as every case study page (see BackButton) — the
          gate replaces the case study's content, not its chrome. */}
      <BackButton />

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full max-w-[336px] flex-col items-center gap-4">
          <p className="w-full text-center font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-primary">
            This project is password protected
          </p>

          <div className="flex w-full flex-col gap-2">
            <form onSubmit={handleSubmit}>
              {/* pr-1/pr-2 is a single exclusive ternary, never both classes
                  at once — see Nav.tsx for why that distinction (one string
                  choosing a class vs. two conflicting classes both present)
                  matters for which value actually wins. */}
              <div
                className={`flex w-full items-center gap-2 rounded-sm border border-border-subtle bg-bg-tertiary py-1 pl-2 focus-within:border-text-secondary ${value ? "pr-1" : "pr-2"}`}
              >
                <input
                  type="password"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="Password"
                  aria-invalid={error}
                  placeholder="Enter password"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (error) setError(false);
                  }}
                  className="w-full min-w-0 bg-transparent font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-primary placeholder:text-text-disabled focus:outline-none"
                />
                {/* Button only exists once there's something to submit —
                    Figma's default/empty state (304:9017) has no button at
                    all, it only appears once typing starts (304:12070). */}
                {value && (
                  <button
                    type="submit"
                    aria-label="Submit password"
                    className={`flex shrink-0 items-center justify-center rounded-sm p-1 transition-transform duration-100 active:scale-95 ${error ? "bg-[#f24822]" : "bg-[#6bc257]"}`}
                  >
                    <Image
                      src={error ? "/images/home/warning-circle.svg" : "/images/home/arrow-right.svg"}
                      alt=""
                      width={16}
                      height={16}
                    />
                  </button>
                )}
              </div>
            </form>
            {error && (
              <p className="w-full font-sans text-[12px] leading-4 text-[#f24822]">
                The password you entered is incorrect. Please try again or contact me.
              </p>
            )}
          </div>

          <Link
            href="/contact"
            className="text-center font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-secondary transition-colors hover:text-text-primary"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
