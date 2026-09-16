"use client";

import Image from "next/image";
import { type ReactNode } from "react";
import { useTheme } from "@/components/ThemeContext";

// The landscape 512/300 card content CardRow's own row wraps — CardRow
// itself only ever sets each slide's own width (min(cardWidth,
// calc(100vw - 80px))), so this derives its height from that via a
// locked aspect-ratio rather than needing an explicit height passed in.
export function GalleryCard({
  src,
  darkSrc,
  alt,
  bordered,
  content,
}: {
  src?: string;
  /** Dark-theme counterpart for artwork with its own light/dark exports
   * (the First round wordmark/icon marks are white-on-dark and
   * black-on-light versions of the same mark, not a color a CSS filter
   * could derive) — same convention as primitives.tsx's own Exhibit
   * darkSrc prop. Only meaningful alongside `src`. */
  darkSrc?: string;
  alt: string;
  bordered?: boolean;
  content?: ReactNode;
}) {
  const { theme } = useTheme();
  const resolvedSrc = darkSrc && theme === "dark" ? darkSrc : src;
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[20px] bg-bg-tertiary ${bordered ? "border border-border-subtle" : ""}`}
      style={{ aspectRatio: "512 / 300" }}
    >
      {content ?? (resolvedSrc && <Image src={resolvedSrc} alt={alt} fill className="object-cover" sizes="512px" />)}
    </div>
  );
}
