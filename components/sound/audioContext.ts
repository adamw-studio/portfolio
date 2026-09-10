"use client";

let ctx: AudioContext | null = null;

/**
 * Lazily creates, and then reuses, the one AudioContext behind every
 * synthesized sound on this page (paper rustle, arrow taps, and whatever
 * comes next) — browsers cap how many contexts can exist and refuse to
 * start one before a user gesture, so sharing a single lazily-created
 * instance is both what makes this actually work across components and
 * what keeps repeated triggers from spinning up a new context each time.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}
