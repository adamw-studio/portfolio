"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import Nav from "@/components/Nav";
import { PlaygroundArchiveBall } from "@/components/PlaygroundArchiveBall";

// Figma 221:6748 (card) + 221:6903 (Input-Password's 3 states: Default,
// Active, Error) — replaces the earlier plain-text/flat-input version
// (304:9017 / 304:12070 / 304:12160, see git history) with a card that
// borrows its whole shape from Playground's own "Archive" signpost
// (PlaygroundCard.tsx's ArchiveBody): identical rounded-3xl/bg-tertiary/
// p-4/gap-7 card, the exact same PlaygroundArchiveBall pill (down to the
// literal gradient hex values — this component doesn't invent a second
// "dark speaker" look, it reuses the one that already exists), and the
// same italic font-extrabold/italic heading pair. Figma's own node for
// this page doesn't visually distinguish the two — same pill, same type
// treatment — so this reuses the real component (bouncing ball, reduced-
// motion handling and all) rather than a static copy of its markup.
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
  label,
  children,
}: {
  password: string;
  storageKey: string;
  // The locked screen's own Nav — reported live: it should show the
  // same project navbar the unlocked page does, not a bare back button
  // with no project label/date/theme toggle. Optional only so a future
  // gate with no natural project label still compiles; every current
  // call site passes one.
  label?: string;
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
    // pt-32 sm:pt-36: the same top reservation every other Nav-topped
    // page's own content column uses below the fixed full-bleed bar
    // (e.g. BeaconLongForm.tsx) — this used to be a bare 100px tailored
    // to a standalone BackButton with no Nav at all; now that Nav
    // actually renders here too, its content sits at the same height
    // Nav's own bar implies everywhere else, not a one-off value.
    <div className="relative mx-auto flex w-full max-w-[688px] flex-1 flex-col pb-[60px] pt-32 sm:pt-36">
      {/* Same project navbar every unlocked case-study page renders —
          reported live: the locked screen should show it too, not a
          bare back button with no project label/date/theme toggle.
          Nav owns its own back-to-home link whenever `label` is passed,
          so this replaces BackButton.tsx's last remaining call site
          outright (that file is now dead code, deleted alongside this
          change — see its own git history for why it used to need to
          exist here specifically). */}
      <Nav label={label} />

      <div className="flex flex-1 flex-col items-center justify-center">
        {/* 336px: Figma 221:6748's own card width, and — unlike that
            node's fixed 304px input — the input inside still stretches
            w-full to it, matching how every other flexible-width surface
            on this site treats a Figma pixel width as a max, not a fixed
            size. */}
        <div className="flex w-full max-w-[336px] flex-col gap-4">
          <div className="flex w-full flex-col gap-7 rounded-3xl bg-bg-tertiary p-4">
            <PlaygroundArchiveBall className="relative h-[114px] w-full shrink-0 touch-none overflow-hidden rounded-full bg-gradient-to-b from-[#38383d] via-[#2e2e33] to-[#242429] shadow-[inset_0px_0.5px_0.5px_0px_rgba(255,255,255,0.06)]" />

            <div className="flex w-full flex-col gap-3">
              <div className="flex flex-col gap-[2px] font-sans text-[16px] leading-[18px] tracking-[-0.128px]">
                <p className="italic font-extrabold text-text-primary">Password</p>
                <p className="italic text-text-subtle">This project is password protected.</p>
              </div>

              <div className="flex w-full flex-col gap-2">
                <form onSubmit={handleSubmit}>
                  {/* pr-1/pr-2 is a single exclusive ternary, never both classes
                      at once — see Nav.tsx for why that distinction (one string
                      choosing a class vs. two conflicting classes both present)
                      matters for which value actually wins. */}
                  <div
                    className={`relative flex w-full items-center gap-2 rounded-sm border border-border-subtle bg-bg-tertiary py-1 pl-2 focus-within:border-text-secondary ${value ? "pr-1" : "pr-2"}`}
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
                      // text-transparent + an explicit caret-color: the real
                      // input still owns focus, typing, paste and a11y — only
                      // its own native masked-dot rendering is hidden, so the
                      // decorative dot row below (one dot per character, see
                      // its own comment) is the only masking the visitor
                      // actually sees, matching the geometry of Figma's Frame
                      // 154 (6px circles, 8px apart) without its fixed count.
                      className="w-full min-w-0 bg-transparent font-sans text-[14px] leading-6 tracking-[-0.112px] text-transparent placeholder:text-text-disabled focus:outline-none"
                      style={{ caretColor: "var(--color-text-secondary)" }}
                    />
                    {/* Figma's Frame 154 is a fixed 14-dot image — a static
                        mockup of "some password is typed", not a literal
                        14-character example. Rendered as a static 14 dots
                        regardless of length, this read as broken live ("it
                        shows the dots even when I start typing" — one
                        keystroke jumping straight to 14 dots looks like the
                        input ignored what was actually typed). One dot per
                        character instead — real per-keystroke feedback, and
                        still Figma's own dot geometry/spacing. Capped at 24
                        (the input's own ~280px content width fits about
                        that many before the row would overflow the field)
                        and clipped by the row's own overflow-hidden past
                        that, the same way a real input's text would scroll/
                        truncate rather than blow out the field's width.
                        aria-hidden throughout — the real <input>'s value is
                        what a screen reader (and password managers) sees. */}
                    {value && (
                      <div
                        aria-hidden
                        className="pointer-events-none absolute left-2 right-1 flex items-center gap-[2px] overflow-hidden"
                      >
                        {Array.from({ length: Math.min(value.length, 24) }, (_, i) => (
                          <span key={i} className="size-[6px] shrink-0 rounded-full bg-text-primary" />
                        ))}
                      </div>
                    )}
                    {/* Button only exists once there's something to submit —
                        Figma's default/empty state (221:6900) has no button at
                        all, it only appears once typing starts (221:6875). The
                        gradient + inset double-shadow is Figma's own "glossy
                        orb" spec verbatim; the arrow now reads dark green
                        (#305F25) on the green orb rather than white-on-flat-
                        green, matching this redesign's own icon-on-orb
                        convention (warning-circle.svg was already #662414 —
                        dark red on red — before this change, so only the
                        success icon needed a new dark-tinted asset). */}
                    {value && (
                      <button
                        type="submit"
                        aria-label="Submit password"
                        className={`flex shrink-0 items-center justify-center rounded-full p-1 shadow-[inset_0.5px_0.5px_2px_0px_rgba(0,0,0,0.4),inset_-0.5px_-0.5px_1.5px_0px_rgba(255,255,255,0.08)] transition-transform duration-100 active:scale-95 ${
                          error
                            ? "bg-[radial-gradient(circle,#f24822_0%,#db3b17_35%,#f24822_70%)]"
                            : "bg-[radial-gradient(circle,#6bc257_0%,#60a650_35%,#6bc257_70%)]"
                        }`}
                      >
                        <Image
                          src={error ? "/images/home/warning-circle.svg" : "/images/home/arrow-right-success.svg"}
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
            </div>
          </div>

          {/* mailto, not a /contact route — this site has no contact page
              (nor a form to back one), just the same real mailto every
              other "get in touch" surface already uses (app/page.tsx's
              own hero). Sits outside the card — Figma 221:6748 doesn't
              include it at all, so this keeps the old placement/spacing
              instead of guessing a new one. */}
          <a
            href="mailto:weberadam54@gmail.com"
            className="text-center font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-secondary transition-colors hover:text-text-primary"
          >
            Get in touch
          </a>
        </div>
      </div>
    </div>
  );
}
