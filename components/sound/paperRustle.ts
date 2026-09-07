"use client";

// No audio asset — synthesized with the Web Audio API instead, the same
// "cheapest tool that works" call as the CSS-only hover animations
// elsewhere on this page. A single AudioContext is created lazily (on
// the first hover) and reused; browsers refuse to start one before any
// user gesture, and a hover is as close to a gesture as this interaction
// gets, so failures here are swallowed rather than surfaced.
let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) ctx = new AudioCtx();
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}

/**
 * A short paper-rustle burst for the "What I do" tags' hover. Real paper
 * rustle is a cluster of tiny, irregularly-timed impulses, not one smooth
 * "shh" — so this fires a handful of short noise grains (random offsets,
 * durations, and bandpass center frequencies) rather than a single
 * filtered burst, which is what actually reads as paper rather than
 * static or wind.
 */
export function playPaperRustle() {
  const audioCtx = getContext();
  if (!audioCtx) return;

  try {
    const grains = 4;
    const now = audioCtx.currentTime;

    for (let i = 0; i < grains; i++) {
      const start = now + i * (0.012 + Math.random() * 0.018);
      const duration = 0.035 + Math.random() * 0.045;

      const bufferSize = Math.max(1, Math.ceil(audioCtx.sampleRate * duration));
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) data[j] = Math.random() * 2 - 1;

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = audioCtx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.value = 3200 + Math.random() * 4000;
      bandpass.Q.value = 0.5 + Math.random() * 0.4;

      const gain = audioCtx.createGain();
      const peak = 0.035 + Math.random() * 0.025; // quiet — a hint, not a click
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(peak, start + 0.004);
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
