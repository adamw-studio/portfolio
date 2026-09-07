import Image from "next/image";
import Link from "next/link";
import { Chip } from "@/components/Chip";
import { themedIcon } from "@/components/themedIcon";
import { YouTubeFacade } from "@/components/YouTubeFacade";
import { KICKER_ICON, type PlaygroundProject } from "@/content/playground-projects";

const IMAGE_HOVER =
  "object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]";

// One card's visuals — positioning (left/top/width/height in world space)
// is the canvas's job, not this component's, so this always just fills
// whatever box it's given. That split is what keeps PlaygroundCanvas free
// to reposition/resize projects without this file ever changing.
//
// Every hover effect here (image scale, border) lives on `group`/
// `group-hover` scoped to *this* card's own root, not the outer canvas —
// scaling the image inside its own overflow-hidden clip means a card can
// never visually grow into a neighbor, whatever the gap between them.
export function PlaygroundCard({ project }: { project: PlaygroundProject }) {
  const { href, variant } = project;
  const clickable = Boolean(href);
  const body = variant === "framed" ? <FramedBody project={project} clickable={clickable} /> : <DefaultBody project={project} clickable={clickable} />;

  if (!clickable) {
    // Still visually part of the wall (same hover-ready markup either
    // body renders), but genuinely inert — no href, no button semantics,
    // nothing implying a destination that doesn't exist yet.
    return <div className="h-full w-full cursor-default">{body}</div>;
  }

  return (
    <Link href={href!} className="block h-full w-full" draggable={false}>
      {body}
    </Link>
  );
}

// Figma 306:12162's card: padded, rounded-2xl, image then a plain
// title/subtitle text block below it.
function DefaultBody({ project, clickable }: { project: PlaygroundProject; clickable: boolean }) {
  const { title, subtitle, image, imageAlt, imageOffset, imageBg, accent, year, tag } = project;
  return (
    <div
      className={`group flex h-full w-full flex-col gap-3 rounded-2xl border border-border-subtle bg-bg-default p-3 transition-[border-color,transform] duration-300 ${
        clickable ? "active:scale-[0.98] hover:border-text-secondary" : ""
      }`}
    >
      {/* imageBg overrides the default theme-following bg-bg-tertiary via
          inline style (which wins over the class regardless) — for a photo
          with its own white-on-dark artwork (sporting-chance), the panel
          needs to stay dark always, not flip pale in light mode and wash
          the white logo/type out. */}
      <div
        className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-bg-tertiary"
        style={imageBg ? { backgroundColor: imageBg } : undefined}
      >
        {image ? (
          imageOffset ? (
            // The oversized-crop technique straight from Figma: the image
            // renders larger than (and offset within) this clipping box,
            // so what's visible is a deliberate, art-directed slice of a
            // bigger photo rather than a plain object-cover fill.
            <div
              className="absolute transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]"
              style={{ left: imageOffset.left, top: imageOffset.top, width: imageOffset.width, height: imageOffset.height }}
            >
              <Image src={image} alt={imageAlt ?? ""} fill className="object-cover" draggable={false} sizes="400px" />
            </div>
          ) : (
            <Image src={image} alt={imageAlt ?? ""} fill className={IMAGE_HOVER} draggable={false} sizes="400px" />
          )
        ) : (
          // No photo yet — a flat accent fill with the title's own initial
          // ghosted large behind it, so an empty card still reads as a
          // deliberate placeholder rather than a broken image.
          <div className="flex size-full items-center justify-center" style={{ backgroundColor: accent }}>
            <span
              aria-hidden
              className="select-none font-serif text-[72px] leading-none text-[#0d0d0d]/15 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
            >
              {title.charAt(0)}
            </span>
          </div>
        )}
        {year && (
          <span className="absolute left-2 top-2 rounded-full border border-border-subtle bg-bg-default/70 px-1.5 py-0.5 font-sans text-[11px] tracking-wide text-text-secondary backdrop-blur-sm">
            {year}
          </span>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-1 font-sans text-[14px] leading-6 tracking-[-0.112px]">
        <p className="line-clamp-4 text-text-primary">{title}</p>
        <div className="flex items-center gap-2">
          <p className="text-text-subtle">{subtitle}</p>
          {tag && <Chip>{tag}</Chip>}
        </div>
      </div>
    </div>
  );
}

// Figma 319:16093 - 319:16164's card: no padding at all, edge-to-edge
// sections (a kicker bar, the image, optionally a description bar) each
// divided by a real border instead of a text block under the image.
function FramedBody({ project, clickable }: { project: PlaygroundProject; clickable: boolean }) {
  const { title, image, imageAlt, kicker, description, youtubeId } = project;
  // Same bar treatment for the kicker and (if present) the description —
  // bg-tertiary + a border on the edge that meets the next section, so
  // interior dividers read as one continuous rule rather than two
  // abutting borders doubling up.
  const bar = "border-border-subtle bg-bg-tertiary px-2 py-1";
  return (
    <div
      className={`group flex h-full w-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-default transition-[border-color,transform] duration-300 ${
        clickable ? "active:scale-[0.98] hover:border-text-secondary" : ""
      }`}
    >
      {kicker && (
        <div className={`flex shrink-0 items-center justify-between border-b ${bar}`}>
          <Image src={KICKER_ICON} alt="" width={36} height={12} className={themedIcon} />
          <p className="font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-subtle">{kicker}</p>
        </div>
      )}
      <div className="relative min-h-0 flex-1 overflow-hidden bg-bg-tertiary">
        {youtubeId ? (
          <YouTubeFacade videoId={youtubeId} title={title} wrapperClassName="size-full" />
        ) : (
          image && <Image src={image} alt={imageAlt ?? title} fill className={IMAGE_HOVER} draggable={false} sizes="400px" />
        )}
      </div>
      {description && (
        <div className={`shrink-0 border-t ${bar}`}>
          <p className="font-sans text-[14px] leading-6 tracking-[-0.112px] text-text-subtle">{description}</p>
        </div>
      )}
    </div>
  );
}
