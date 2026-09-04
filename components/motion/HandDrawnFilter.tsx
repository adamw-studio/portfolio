import { useId, type ReactNode } from "react";

/**
 * Subtle procedural "sketchy" edge wobble for the shape icons (bar chart,
 * equals sign, curiosity squares, craftsmanship bars) that don't carry
 * Figma's own hand-drawn texture data — unlike the 7 dot icons, which
 * each ship a pre-baked irregular outline path straight from Figma
 * (see components/icons/dots/Dot.tsx), Figma exports these four as plain
 * flat rectangles. This reproduces the same hand-drawn character
 * procedurally instead: a low-amplitude feTurbulence distorts the
 * rectangle edges by a couple of SVG units, giving the same "drawn by
 * hand, not a vector tool" feel without needing hand-authored path data
 * per shape.
 *
 * Returns the filter's id (apply via filter={`url(#${id})`}) and the
 * <filter> element itself (render once, inside <defs>).
 */
export function useHandDrawnFilter(seed: number) {
  const id = useId();
  const filter = (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed={seed} result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
  return { filterId: id, filter };
}

export function HandDrawnDefs({ children }: { children: ReactNode }) {
  return <defs>{children}</defs>;
}
