"use client";

import { useEffect, useState } from "react";
import { NavClockWidget } from "@/components/NavClockWidget";
import { BUDAPEST_TZ } from "@/components/budapestClock";

// Figma 175:4031/175:3994 ("watch widget") — today's own real weekday +
// date next to the nav's own clock widget (NavClockWidget.tsx — now an
// interactive morph between the small icon and a wider expanded panel;
// see that file's own doc comment). Budapest's own weekday/date, not
// the visitor's: this whole widget reads as "MY local clock / portfolio
// identity" once the expanded panel names Budapest explicitly, so this
// text stays consistent with it rather than showing the icon's own
// Budapest time next to a date that might already be tomorrow in the
// visitor's own timezone. Not literal copy from the export either way:
// Figma's own text ("Monday" / "14 September") is whatever date the
// designer had the file open, which would go stale the moment this
// page's static build ages past that day.
//
// Weekday/date computed client-side only (`now` starts null) — the
// server has no reliable notion of "today" for a statically pre-rendered
// page (it would freeze at whatever day the site was last built), and
// Budapest's own current date is only knowable (via Intl) once this
// runs in a real browser. The 71px-wide text column and non-breaking-
// space placeholders hold this widget's own layout steady before that
// first correction rather than collapsing to zero width and reflowing
// the bar around it.
//
// The expanded panel is free to visually cover this text without this
// file doing anything about it: NavClockWidget's own expanded state is
// `position: absolute`, `z-10`, with its own opaque background, growing
// out over this same row — CSS's own normal stacking order already
// paints that above this plain, unpositioned sibling underneath it, no
// coordination between the two files needed.
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
      <NavClockWidget />
      {/* hidden below sm, the icon next to it isn't: the clock itself
          needs to stay reachable by tap on a phone ("do not make the
          interaction inaccessible on touch devices"), but this text
          column has nowhere to go on a narrow bar that also has to fit
          a back button and/or the centered nav segment — the same
          space constraint this file's own comment on Nav.tsx already
          covers for the case-study variant, now applied here too since
          checking live showed the *icon-only* footprint (24px) never
          actually needed hiding, only this wider text block did. */}
      <div className="hidden w-[71px] shrink-0 flex-col gap-0.5 text-[12px] leading-[12px] sm:flex">
        <p className="text-text-primary">{now ? WEEKDAY_FORMAT.format(now) : " "}</p>
        <p className="text-text-subtle">{now ? DAY_MONTH_FORMAT.format(now) : " "}</p>
      </div>
    </div>
  );
}
