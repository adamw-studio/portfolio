"use client";

import { useEffect, useState } from "react";
import { AnalogClock } from "@/components/AnalogClock";
import { BUDAPEST_TZ } from "@/components/budapestClock";

// Figma 175:4031/175:3994 ("watch widget") — today's own real weekday +
// date next to the nav's own analog clock icon (AnalogClock.tsx).
// Budapest's own weekday/date, not the visitor's: this reads as "MY
// local clock / portfolio identity," so this text stays consistent with
// that rather than showing Budapest time next to a date that might
// already be tomorrow in the visitor's own timezone. Not literal copy
// from the export either way: Figma's own text ("Monday" / "14
// September") is whatever date the designer had the file open, which
// would go stale the moment this page's static build ages past that day.
//
// Weekday/date computed client-side only (`now` starts null) — the
// server has no reliable notion of "today" for a statically pre-rendered
// page (it would freeze at whatever day the site was last built), and
// Budapest's own current date is only knowable (via Intl) once this
// runs in a real browser. The 71px-wide text column and non-breaking-
// space placeholders hold this widget's own layout steady before that
// first correction rather than collapsing to zero width and reflowing
// the bar around it.
const WEEKDAY_FORMAT = new Intl.DateTimeFormat("en-US", { timeZone: BUDAPEST_TZ, weekday: "long" });
const DAY_MONTH_FORMAT = new Intl.DateTimeFormat("en-US", { timeZone: BUDAPEST_TZ, day: "numeric", month: "long" });

export function NavDateWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  return (
    <div className="flex items-center gap-2">
      <AnalogClock />
      {/* hidden below sm — this text column has nowhere to go on a
          narrow bar that also has to fit a back button and/or the
          centered nav segment, the same space constraint this file's
          own comment on Nav.tsx already covers for the case-study
          variant. */}
      <div className="hidden w-[71px] shrink-0 flex-col gap-0.5 text-[12px] leading-[12px] sm:flex">
        <p className="text-text-primary">{now ? WEEKDAY_FORMAT.format(now) : " "}</p>
        <p className="text-text-subtle">{now ? DAY_MONTH_FORMAT.format(now) : " "}</p>
      </div>
    </div>
  );
}
