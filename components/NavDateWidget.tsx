"use client";

import { useEffect, useState } from "react";
import { AnalogClock } from "@/components/AnalogClock";

// Figma 175:4031/175:3994 ("watch widget") — today's own real weekday +
// date next to the nav's own analog clock (AnalogClock.tsx — a real,
// live-ticking clock now, not the static frozen-angle SVG this file
// first shipped with), not literal copy from the export: Figma's own
// text ("Monday" / "14 September") is whatever date the designer had
// the file open, and a hardcoded string here would go stale the moment
// this page's static build ages past that day.
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
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  return (
    <div className="flex items-center gap-2">
      <AnalogClock />
      <div className="flex w-[71px] flex-col gap-0.5 text-[12px] leading-[12px]">
        <p className="text-text-primary">{now ? WEEKDAY_FORMAT.format(now) : " "}</p>
        <p className="text-text-subtle">{now ? DAY_MONTH_FORMAT.format(now) : " "}</p>
      </div>
    </div>
  );
}
