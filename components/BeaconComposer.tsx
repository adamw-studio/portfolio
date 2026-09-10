"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Figma 356:1195 ("Composer"), overlaid on the Beacon cover (356:1192) in
// place of the old blurred-product-screenshot inset that only Beacon
// used (see SelectedWorks.tsx). Every color/border/shadow here is a
// one-off literal lifted straight from Figma, not mapped onto the site's
// own --color-border-subtle/bg-tertiary tokens: this is a small glass
// panel floating over a photo, not part of the page's light/dark theme
// chrome, so it needs its own fixed always-white-on-dark-glass look
// regardless of site theme — the same reason its icons render plain,
// with no themedIcon invert, unlike every other icon on the page.
//
// left-1/2 -translate-x-1/2 + w-[453px] max-w-[calc(100%-32px)], not
// Figma's literal left-115px: the cover frame Figma measures this
// against is a fixed 688x400, exactly this card's own max size, but the
// card's actual width shrinks well below that on narrow viewports (this
// page wraps it in `max-w-[688px]`, not a fixed width) — a literal
// left/width pair would badly overflow a phone-width card. Figma's own
// left(115)+width(453)+right-margin(120) is already close enough to
// centered that true centering reproduces the composition faithfully
// while scaling cleanly, and the max-w clamp mirrors Nav's own
// w-[400px] max-w-[calc(100vw-32px)] pattern for the same reason. Top
// stays a literal 151px, unscaled — the card's height is 400px at every
// breakpoint (only its width responds), so nothing there ever needs to
// scale.
//
// This renders at Figma's literal size, full stop — every "make it
// bigger/wider" request tried directly on this component got walked
// back to here, because each one turned out to mean the Beacon
// project-page thumbnail specifically, not this shared component (and,
// through it, the Home page cover, which nobody asked to change). See
// BeaconCaseStudyBody.tsx's own scale-x/scale-y factors for where that
// bigger, wider, more-legible-at-a-glance look actually lives.
//
// backdrop-blur-[23px]: Figma's own code export for this frame doesn't
// emit a backdrop-filter at all (its "Background blur" layer effect
// doesn't have a direct Tailwind-class translation the MCP tool
// produces), but the frame's screenshot is unambiguously a frosted-glass
// panel, not a plain transparent border over a sharp photo. Reusing
// Nav's own blur value here rather than guessing a new one — it's
// already this site's established strength for exactly this "translucent
// panel floating over busy content" treatment (Nav's pill, the contact
// panel), not a coincidence worth re-deriving.
const COMPOSER_WRAPPER =
  "absolute left-1/2 top-[151px] w-[453px] max-w-[calc(100%-32px)] -translate-x-1/2 overflow-hidden rounded-[20px] border border-[rgba(221,221,221,0.4)] bg-transparent backdrop-blur-[23px]";

// Figma's Icon Button (the + and microphone controls): 16px icon in 4px
// padding with its own border — 24px square either way, so rounded-full
// lands on the same fully-round result as Figma's literal
// rounded-[20px] (its radius-3xl token) without hardcoding a radius
// bigger than the box needs.
const ICON_BUTTON =
  "flex items-center justify-center gap-1 rounded-full border border-[rgba(255,255,255,0.44)] p-1";

// The four prompts this cycles through, typed and deleted in order, on
// an indefinite loop (see useTypewriter below). Curly apostrophe to
// match the rest of the site's copy (SelectedWorks' own "don't", etc.),
// not a style choice specific to this component.
const MESSAGES = [
  "Let’s create a new workspace",
  "Build a compelling business case",
  "Create an investor-ready pitch deck",
  "Prototype this venture concept",
] as const;

const TYPE_MS: [number, number] = [35, 65]; // per character, jittered for a natural (not metronomic) cadence
const DELETE_MS: [number, number] = [18, 32]; // backspacing reads faster than typing, same as a real composer
const HOLD_MS = 1500; // fully-typed message stays put long enough to actually read
const PAUSE_MS = 350; // brief beat on an empty line before the next message starts

function jitter([min, max]: [number, number]) {
  return min + Math.random() * (max - min);
}

/**
 * Runs the type → hold → delete → pause loop over `messages` and returns
 * the substring currently on screen. One state value, one effect that
 * only depends on `reducedMotion` (MESSAGES is a module-level constant,
 * so its identity never changes and never re-triggers the effect) — the
 * whole animation lives in a single small re-render per keystroke,
 * scoped to this component alone, not a library or a per-frame loop.
 *
 * prefers-reduced-motion: skip the loop entirely and hold on the first
 * message, statically — cycling text is exactly the kind of motion that
 * preference asks to drop, not just slow down.
 */
function useTypewriter(messages: readonly string[], reducedMotion: boolean) {
  const [displayText, setDisplayText] = useState<string>(messages[0]);

  useEffect(() => {
    if (reducedMotion) {
      // Resets back to the first message if reducedMotion flips true
      // mid-loop (the matchMedia check in the parent resolves a beat
      // after mount, same as PasswordGate's own sessionStorage read) —
      // syncing from that external signal, not a state update a plain
      // initializer could do instead.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayText(messages[0]);
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let messageIndex = 0;
    let charIndex = 0;

    const typeNext = () => {
      if (cancelled) return;
      const message = messages[messageIndex];
      charIndex += 1;
      setDisplayText(message.slice(0, charIndex));
      timeoutId = setTimeout(charIndex < message.length ? typeNext : deleteNext, charIndex < message.length ? jitter(TYPE_MS) : HOLD_MS);
    };

    const deleteNext = () => {
      if (cancelled) return;
      const message = messages[messageIndex];
      charIndex -= 1;
      setDisplayText(message.slice(0, charIndex));
      if (charIndex > 0) {
        timeoutId = setTimeout(deleteNext, jitter(DELETE_MS));
      } else {
        messageIndex = (messageIndex + 1) % messages.length;
        timeoutId = setTimeout(typeNext, PAUSE_MS);
      }
    };

    charIndex = 0;
    timeoutId = setTimeout(typeNext, jitter(TYPE_MS));

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [messages, reducedMotion]);

  return displayText;
}

export function BeaconComposer() {
  const [reducedMotion, setReducedMotion] = useState(false);

  // Same matchMedia + addEventListener pattern as AboutCardStack's own
  // reduced-motion check, not a new one invented for this component.
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(motionQuery.matches);
    update();
    motionQuery.addEventListener("change", update);
    return () => motionQuery.removeEventListener("change", update);
  }, []);

  const text = useTypewriter(MESSAGES, reducedMotion);

  return (
    <div className={COMPOSER_WRAPPER} data-name="Composer">
      {/* pt-2 px-3 pb-5 (8/12/20px) — Figma's own padding on this row,
          not the composer's shared 8px used everywhere else in it. A
          fixed leading-5 (20px) line-height is what keeps this row's
          height constant as `text` grows/shrinks character by character
          — nothing here reflows because of that, only the text content
          inside an already-fixed-height line changes. */}
      <div className="flex w-full items-start gap-2 px-3 pb-5 pt-2">
        <p className="min-w-0 flex-1 whitespace-nowrap font-sans text-[14px] leading-5 tracking-[-0.056px] text-white">
          {/* The caret is a border-right on the text's own inline box,
              not a separately-positioned sibling span — a sibling has to
              guess its height/vertical-align against the text next to
              it (the previous version used a fixed 14px height + a
              translate-y fudge, and still didn't line up right). A
              border on the text itself has no such guesswork: it's
              anchored to that inline box's own font metrics, so it
              tracks the actual glyphs exactly, at any font-size, with
              zero manual offsets. */}
          <span className={reducedMotion ? undefined : "composer-caret border-r border-white pr-px"}>{text}</span>
        </p>
      </div>

      <div className="flex w-full items-center justify-between p-2">
        <div className={ICON_BUTTON}>
          <span className="relative block size-4">
            <Image src="/images/home/composer-plus.svg" alt="" fill />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full py-1">
            <span className="relative block size-3 shrink-0">
              <Image src="/images/home/composer-model.svg" alt="" fill />
            </span>
            <p className="whitespace-nowrap font-sans text-[12px] font-medium leading-4 tracking-[0.06px] text-white">GPT 5.6</p>
          </div>

          <div className={ICON_BUTTON}>
            <span className="relative block size-4">
              <Image src="/images/home/composer-mic.svg" alt="" fill />
            </span>
          </div>

          {/* AI - Send: the one non-transparent control in this panel —
              Figma's own primary-button treatment (brand blue fill,
              matching drop + inset shadow pair), not derived from any of
              the composer's other rgba(255,255,255,*) glass surfaces. */}
          <div className="relative flex size-6 shrink-0 items-center justify-center rounded-full bg-[#007bff] p-1.5 shadow-[0px_2px_3px_0px_rgba(31,71,205,0.14),inset_2px_2px_2px_0px_rgba(86,189,255,0.4)]">
            <span className="relative block size-4">
              <Image src="/images/home/composer-arrow-up.svg" alt="" fill />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
