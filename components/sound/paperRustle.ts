"use client";

// No audio asset — synthesized with the Web Audio API instead, the same
// "cheapest tool that works" call as the CSS-only hover animations
// elsewhere on this page. Browsers refuse to start an AudioContext before
// any user gesture, and a hover is as close to a gesture as this
// interaction gets, so failures here are swallowed rather than surfaced.
// The context itself is shared with every other synthesized sound on the
// page — see audioContext.ts.
import { getAudioContext } from "@/components/sound/audioContext";

// Sweeping the mouse across several tags in a row used to fire one full
// burst per mouseenter with nothing to stop them overlapping — several
// bursts landing within the same 50-100ms read as one cluttered wall of
// noise, not a sequence of individual rustles, which is what actually
// made rapid hovering feel tacky rather than the sound itself. A flat
// cooldown between plays (module-level, so it holds across every tag
// sharing this one function) is what fixes that specifically: the first
// hover in a sweep still plays cleanly, the ones that land before the
// cooldown clears just skip instead of stacking on top of it.
const MIN_INTERVAL_MS = 140;
let lastPlayedAt = 0;

/**
 * A short paper-rustle burst for the "What I do" tags' hover/tap. Real
 * paper rustle is a cluster of tiny, irregularly-timed impulses, not one
 * smooth "shh" — so this fires a handful of short noise grains (random
 * offsets, durations, and bandpass center frequencies) rather than a
 * single filtered burst, which is what actually reads as paper rather
 * than static or wind. Softer than its first pass: fewer grains, a
 * gentler attack, and a lower peak — this is meant to sit at the edge of
 * noticing, not announce itself.
 */
export function playPaperRustle() {
  const now = performance.now();
  if (now - lastPlayedAt < MIN_INTERVAL_MS) return;
  lastPlayedAt = now;

  const audioCtx = getAudioContext();
  if (!audioCtx) return;

  try {
    const grains = 3;
    const startTime = audioCtx.currentTime;

    for (let i = 0; i < grains; i++) {
      const start = startTime + i * (0.014 + Math.random() * 0.02);
      const duration = 0.035 + Math.random() * 0.045;

      const bufferSize = Math.max(1, Math.ceil(audioCtx.sampleRate * duration));
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) data[j] = Math.random() * 2 - 1;

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 3000 + Math.random() * 3600;
      bandpass.Q.value = 0.5 + Math.random() * 0.4;

      const gain = audioCtx.createGain();
      const peak = 0.02 + Math.random() * 0.016; // quieter, gentler than the first pass — a hint, not even a whisper
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(peak, start + 0.009); // slower attack — softer onset than the original 4ms, which read as a faint "tick"
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start(start);
      noise.stop(start + duration);
    }
  } catch {
    // Autoplay restrictions or an unsupported API — silently skip; this
    // is a nice-to-have flourish, never worth surfacing an error over.
  }
}
