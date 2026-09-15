// Shared time/text logic for the nav's clock widget (NavClockWidget.tsx,
// AnalogClock.tsx, ClockArtwork.tsx) — every piece of this widget reads
// the same "wall clock in Budapest" concept, on direct instruction:
// "This is intentionally MY local clock / portfolio identity, not the
// visitor's location." Pulled into one file rather than duplicated per
// component so the timezone/message logic has exactly one place to edit.

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
 * callers that need sub-second smoothness (the artwork's hand rotation)
 * fold `date.getMilliseconds()` back in themselves against the real
 * instant, since Intl only ever reports whole seconds. */
export function getBudapestTime(date: Date): BudapestTime {
  const parts = PARTS_FORMAT.formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { hour: get("hour"), minute: get("minute"), second: get("second") };
}

// timeZoneName:"short" reliably returns "CET"/"CEST" for Europe/Budapest
// in every current major browser's en-US ICU data — but "reliably" isn't
// "guaranteed": a handful of older/embedded environments fall back to a
// generic "GMT+1"/"GMT+2" instead of the named abbreviation. Rather than
// trust that silently, this checks the actual UTC offset it implies and
// only uses Intl's own string when it's a real CET/CEST abbreviation;
// otherwise it derives the same answer directly from the offset itself
// (Budapest is only ever UTC+1 or UTC+2 — there's no third case to
// handle), so this never surfaces "GMT+1" as user-facing copy.
const TZ_NAME_FORMAT = new Intl.DateTimeFormat("en-US", { timeZone: BUDAPEST_TZ, timeZoneName: "short" });

export function getBudapestTzAbbr(date: Date): "CET" | "CEST" {
  const part = TZ_NAME_FORMAT.formatToParts(date).find((p) => p.type === "timeZoneName")?.value;
  if (part === "CET" || part === "CEST") return part;
  // Fallback: derive straight from the offset. Budapest's own standard
  // offset is UTC+1 (CET); anything else observed (UTC+2) is the
  // summer/DST offset (CEST).
  const budapestMinutesFromUtc = Math.round(
    (new Date(date.toLocaleString("en-US", { timeZone: BUDAPEST_TZ })).getTime() - new Date(date.toLocaleString("en-US", { timeZone: "UTC" })).getTime()) /
      60000,
  );
  return budapestMinutesFromUtc >= 90 ? "CEST" : "CET";
}

// One contextual line per part of the day, keyed by Budapest's own local
// hour — edit this list to change the copy; `startHour` is inclusive,
// each entry runs until the next one's own `startHour` (the last entry
// wraps around to the first). Ranges deliberately don't need to be
// equal-sized — "late night" is wide (23-5) on purpose, "early morning"
// narrow (6-8), matching how those hours actually feel rather than
// dividing the day into even thirds.
export const TIME_OF_DAY_MESSAGES: { startHour: number; message: string }[] = [
  { startHour: 23, message: "Probably should be sleeping." }, // 23:00–05:59 (wraps past midnight)
  { startHour: 6, message: "Apparently this counts as a reasonable hour." }, // 06:00–08:59
  { startHour: 9, message: "Currently designing something unnecessarily precise." }, // 09:00–11:59
  { startHour: 12, message: "Moving pixels by professionally insignificant amounts." }, // 12:00–17:59
  { startHour: 18, message: "One last adjustment. Allegedly." }, // 18:00–22:59
];

/** Deterministic, not random — the same Budapest hour always produces
 * the same line, so re-hovering the widget a minute later doesn't
 * surface a different one (reported as a real requirement, not
 * incidental: "the message should be deterministic... rather than
 * gimmicky"). Entries are sorted ascending by `startHour`; this just
 * finds the latest one whose own startHour has already passed (wrapping
 * around midnight via the same comparison logic — 23's own range
 * legitimately runs across the day boundary into the next day's 0-5). */
export function getTimeOfDayMessage(hour: number): string {
  const sorted = [...TIME_OF_DAY_MESSAGES].sort((a, b) => a.startHour - b.startHour);
  let current = sorted[sorted.length - 1];
  for (const entry of sorted) {
    if (hour >= entry.startHour) current = entry;
  }
  return current.message;
}

export const DIGITAL_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: BUDAPEST_TZ,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
