// Figma 207:5505 had 6 empty carousel slides reserved here — reported
// live as wrong once a real asset existed: this is a single looping
// video, not a gallery, so no prev/next controls or dot indicators at
// all — this skips the carousel abstraction entirely rather than
// rendering a one-item row with dead code paths for the parts of it
// that no longer apply (CardRow, the shared row every other gallery on
// this page uses, has no such single-item affordance of its own either
// — see GalleryD.tsx etc.).
export default function InsightsVideo() {
  return (
    <div className="w-full overflow-hidden rounded-[20px] bg-bg-tertiary" style={{ aspectRatio: "512 / 300" }}>
      <video src="/videos/monday/insights.mp4" autoPlay loop muted playsInline className="size-full object-cover" />
    </div>
  );
}
