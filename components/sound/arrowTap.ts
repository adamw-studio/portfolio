"use client";

import { getAudioContext } from "@/components/sound/audioContext";

// Same reasoning as paperRustle's own cooldown: someone flicking through
// several projects in a row (click, click, click) shouldn't stack
// overlapping tones — the cooldown lets each individual tap still play,
// it just refuses to double up within the same beat.
const MIN_INTERVAL_MS = 90;
let lastPlayedAt = 0;

/**
 * A soft, short tap for the Selected-works prev/next arrows. A single
 * sine blip with a fast pitch drop, not the multi-grain noise burst
 * paperRustle uses — that's built to read as paper texture; this needs
 * to read as a clean, quiet UI tick (closer to a muted keyboard click
 * than a rustle), since it's confirming a discrete navigation action
 * rather than standing in for a hover.
 */
export function playArrowTap() {
  const now = performance.now();
  if (now - lastPlayedAt < MIN_INTERVAL_MS) return;
  lastPlayedAt = now;

  const audioCtx = getAudioContext();
  if (!audioCtx) return;

  try {
    const start = audioCtx.currentTime;
    const duration = 0.06;

    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(680, start);
    osc.frequency.exponentialRampToValueAtTime(420, start + duration);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.045, start + 0.006); // soft attack — a real click is near-instant, this stays just under that so it reads as gentle rather than sharp
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(start);
    osc.stop(start + duration);
  } catch {
    // Same swallow-and-skip as paperRustle — a missing/blocked
    // AudioContext should never break the actual navigation.
  }
}
