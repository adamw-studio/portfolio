"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeContext";

// Figma 175:4031/175:3994 ("watch widget") — a small static analog-watch
// glyph (fixed hand angles baked into the SVG itself, not a live-
// rotating clock face) next to today's own real weekday + date, not
// literal copy from the export: Figma's own text ("Monday" / "14
// September") is whatever date the designer had the file open, and a
// hardcoded string here would go stale the moment this page's static
// build ages past that day. The icon genuinely differs per theme beyond
// what a CSS invert filter could reproduce (the accent dot is a
// different literal hex per theme, not just inverted lightness — #FFA000
// light vs #F75C03 dark), so this uses the same light/dark SVG-pair
// convention as every other themed diagram this session, not
// themedIcon's shared filter.
//
// Weekday/date computed client-side only (`now` starts null) — the
// server has no reliable notion of "today" for a statically pre-rendered
// page (it would freeze at whatever day the site was last built), and a
// visitor's own local date is only knowable after mount. The 71px-wide
// text column and non-breaking-space placeholders hold this widget's
// own layout steady before that first correction rather than collapsing
// to zero width and reflowing the bar around it.
const WEEKDAY_FORMAT = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const DAY_MONTH_FORMAT = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long" });

export function NavDateWidget() {
  const { theme } = useTheme();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Image
        src={theme === "dark" ? "/images/home/nav-watch-dark.svg" : "/images/home/nav-watch-light.svg"}
        alt=""
        width={24}
        height={24}
        className="shrink-0"
      />
      <div className="flex w-[71px] flex-col gap-0.5 text-[12px] leading-[12px]">
        <p className="text-text-primary">{now ? WEEKDAY_FORMAT.format(now) : " "}</p>
        <p className="text-text-subtle">{now ? DAY_MONTH_FORMAT.format(now) : " "}</p>
      </div>
    </div>
  );
}
