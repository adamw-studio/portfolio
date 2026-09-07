"use client";

import { insetBorder } from "@/components/typography";
import { ICON_DURATION, EASE_POP, MOTION_REDUCE } from "@/components/motion/tokens";
import { playPaperRustle } from "@/components/sound/paperRustle";

/**
 * "What I do" pill (Research, System thinking, ...). Same group-hover/
 * group-focus animation pattern as Chip — see Chip.tsx for the full
 * rationale, including why it also carries backdrop-blur-sm (softens the
 * page's dot-grid background showing through at rest, before the
 * hover/focus fill takes over).
 *
 * Label text is 14px (matching Chip and every other inline pill on this
 * page) rather than the 16px Figma's own dev-mode export shows for this
 * specific frame — that 16px reads as inconsistent next to every other
 * chip on the page, so this deliberately overrides it for the sake of
 * one consistent type scale sitewide.
 *
 * The icon (Figma calls it "Visual") is a dark rounded rect tilted
 * -9.13deg holding a dot + bar — not a per-label glyph, replaced the old
 * per-tag hand-drawn dot/texture icon set (components/icons/dots/*)
 * entirely (Figma 203:2034). It's taller (42px) than this pill (25px)
 * and meant to visually bleed off the top and bottom edges, cropped by
 * the pill's own overflow-hidden — Figma achieves that by taking the
 * icon out of flow (absolutely positioned) rather than letting it
 * stretch the row to fit, which this mirrors; the label gets a left
 * margin sized to the icon's footprint instead, so the pill still
 * auto-sizes to hug its content the way it did before.
 *
 * insetBorder, not a real border: Figma's stroke doesn't add to the
 * pill's own box size, but a CSS border would push the height to 27px
 * instead of the designed 25px. Drawn via a separate overlay div that's
 * the *last* child (painted after, i.e. on top of, everything else)
 * rather than directly on this outer container — the graphic below
 * overlaps this pill's own rounded corner, and an inset shadow set
 * directly on the container paints as part of its own background, which
 * children (including that graphic) then paint over; a dedicated
 * top-layer div is what keeps the border unbroken where they overlap.
 * Faded out on hover/focus (opacity, not removing the div) — with the
 * bg-tertiary fill hover adds, the border read as an unwanted outline
 * rather than the intended edge-definition it provides at rest.
 *
 * Per-tag box color (Figma 270:5949 dark / 254:73012 light): every tag
 * gets its own fixed brand color that's *identical* in both themes
 * (gold #d9a900, teal #00a2c2, orange #e5522e, blue #0d99ff, red
 * #d92100, green #46723c) — except "Brand identity", which is the one
 * genuinely asymmetric case: a plain neutral gray in light (#e8e8e8),
 * but its own real color in dark (#a16ea9, a purple — not a darker
 * neutral, confirmed against its actual Figma node after an earlier
 * version of this wrongly assumed it was just dark gray). Pass `color`
 * for the fixed-hex tags; omit it for Brand identity to fall back to
 * --tag-icon-bg in globals.css, which carries that asymmetry.
 *
 * The dot+bar mostly follows the same split — confirmed by comparing the
 * actual dark vs. light screenshots (not Figma's dev-code color
 * fallbacks, unreliable for this exact thing before) that on every
 * fixed-color swatch it stays a constant white-based rgba(244,244,244,0.4)
 * in both themes — except in light mode, where Brand identity's own
 * dot+bar switches to the theme-aware icon-subtle token instead, since a
 * white-based one would be nearly invisible against its light gray box.
 * In dark mode this token happens to resolve to the same
 * rgba(244,244,244,0.4) as every other tag anyway, so the two branches
 * only actually diverge in light mode.
 *
 * Hover/focus (Figma 272:6014): the pill gains a subtle bg-tertiary fill,
 * and the icon straightens out of its resting -9.13deg tilt and rises to
 * peek out above the pill instead of tucked in near its top edge — Figma
 * gives the icon's hover position/rotation directly rather than an
 * offset. left/top stay fixed at the resting values; the move to that
 * target is expressed as a `translate` instead (standalone CSS property,
 * same compositor fast-path as `transform`/`rotate` — the earlier version
 * of this animated left/top directly, which forces layout on every frame
 * instead of running on the GPU). overflow-visible only on hover/focus
 * (not at rest) is what lets the icon actually rise above the pill
 * instead of getting clipped by the same overflow-hidden that crops its
 * resting tilt — see the "It's taller..." note above.
 *
 * hover:z-50: these pills sit in a flex-wrap row with only an 8px row
 * gap, far less than the icon's own bleed past the pill's edges — a
 * risen icon always reaches into the row above it, resting icons already
 * reach into the row below on their own. A raised z-index on the hovered
 * pill is what keeps its icon the topmost thing in that overlap, above
 * every neighboring tag's border, regardless of row or DOM order — a low
 * value like z-10 is still inside the range ordinary content on the page
 * can carry, so this uses a deliberately loud value instead.
 *
 * onMouseEnter → playPaperRustle: a quiet, synthesized paper-crinkle
 * sound, not an audio file (see paperRustle.ts). Bound to mouseenter
 * specifically, not focus — keyboard users tabbing quickly through every
 * tag would otherwise trigger a rustle per tag, which reads as noise
 * rather than feedback; a mouse hovering one tag at a time doesn't have
 * that problem. This makes the file a client component, the one exception
 * to every other hover effect here being pure CSS.
 */
export function Tag({ label, color }: { label: string; color?: string }) {
  // Figma gives the hover icon's own position (calc(12.5%+25px), 993px)
  // and the pill's (calc(12.5%+17px), 1009px) rather than an offset — the
  // -9.13deg resting rotation means the two aren't directly comparable
  // (Figma's exported rest position is the *unrotated* box, centered
  // inside this 35.65x42.28 flex wrapper, so translating the wrapper by
  // the raw position delta would double-count that centering inset).
  // Working back from both exports to the same unrotated-wrapper space
  // gives ~0px horizontal and -20px vertical, not the eyeballed
  // 3px/-18px this shipped with.
  const hoverClasses = "group-hover:translate-y-[-20px] group-focus-visible:translate-y-[-20px]";
  return (
    <div
      tabIndex={0}
      onMouseEnter={playPaperRustle}
      className={`group relative z-0 flex items-center overflow-hidden rounded-xs px-1.5 py-0.5 backdrop-blur-sm transition-colors ${ICON_DURATION} ${MOTION_REDUCE} hover:z-50 hover:overflow-visible hover:bg-bg-tertiary focus-visible:z-50 focus-visible:overflow-visible focus-visible:bg-bg-tertiary`}
    >
      <div
        className={`absolute left-[5px] top-[2px] flex h-[42.279px] w-[35.65px] translate-x-0 translate-y-0 items-center justify-center transition-transform ${ICON_DURATION} ${EASE_POP} ${MOTION_REDUCE} ${hoverClasses}`}
      >
        <div
          className={`rotate-[-9.13deg] transition-transform ${ICON_DURATION} ${EASE_POP} ${MOTION_REDUCE} group-hover:rotate-0 group-focus-visible:rotate-0`}
        >
          <div
            className="relative h-[38px] w-[30px] overflow-hidden rounded-[4px]"
            style={{ backgroundColor: color ?? "var(--tag-icon-bg)" }}
          >
            <div
              className="absolute left-[7px] top-1 h-0.5 w-4 rounded-full"
              style={{ backgroundColor: color ? "rgba(244,244,244,0.4)" : "var(--color-icon-subtle)" }}
            />
            <div
              className="absolute left-[3px] top-1 size-0.5 rounded-full"
              style={{ backgroundColor: color ? "rgba(244,244,244,0.4)" : "var(--color-icon-subtle)" }}
            />
          </div>
        </div>
      </div>
      <span className="ml-[39px] whitespace-nowrap font-sans text-[14px] leading-[normal] tracking-[-0.128px] text-text-primary">
        {label}
      </span>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 rounded-xs opacity-100 transition-opacity ${ICON_DURATION} ${MOTION_REDUCE} group-hover:opacity-0 group-focus-visible:opacity-0 ${insetBorder}`}
      />
    </div>
  );
}
