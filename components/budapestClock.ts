// Shared time logic for the nav's analog clock (AnalogClock.tsx) and
// the weekday/date next to it (NavDateWidget.tsx) — both read the same
// "wall clock in Budapest" concept, on direct instruction: "This is
// intentionally MY local clock / portfolio identity, not the visitor's
// location." Pulled into one file rather than duplicated per component
// so the timezone logic has exactly one place to edit.

export const BUDAPEST_TZ = "Europe/Budapest";

// formatToParts, not a UTC-offset hand-computation: DST transitions
// (CET <-> CEST) are exactly the kind of calendar rule the Intl API
// already has correct for every past/future date, which a hand-rolled
// "add N hours" would silently get wrong twice a year.
const PARTS_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: BUDAPEST_TZ,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export type BudapestTime = { hour: number; minute: number; second: number };

/** Budapest's own current wall-clock hour/minute/second for `date` (the
 * instant in time `date` represents, read back out in Budapest's own
 * local calendar — not the visitor's). Milliseconds aren't part of this:
 * AnalogClock.tsx folds `date.getMilliseconds()` back in itself against
 * the real instant, since Intl only ever reports whole seconds. */
export function getBudapestTime(date: Date): BudapestTime {
  const parts = PARTS_FORMAT.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { hour: get("hour"), minute: get("minute"), second: get("second") };
}
