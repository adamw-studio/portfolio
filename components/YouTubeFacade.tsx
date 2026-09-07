"use client";

import { useState } from "react";
import Image from "next/image";
import { themedIcon } from "@/components/themedIcon";
import { insetBorder } from "@/components/typography";

/**
 * Click-to-load YouTube embed: shows the video's own thumbnail with the
 * same play-button affordance Figma's static placeholder used, and only
 * swaps in the real <iframe> once clicked. YouTube's embed pulls in a
 * meaningful chunk of third-party JS on its own — loading that eagerly
 * for a trailer most visitors won't press is exactly the kind of
 * unforced page-weight this facade avoids, at zero visual cost (identical
 * at rest to the placeholder it replaces).
 *
 * youtube-nocookie.com, not youtube.com, for the actual embed — YouTube's
 * own privacy-enhanced mode, which doesn't set tracking cookies until
 * playback actually starts.
 *
 * wrapperClassName defaults to the fixed 512x301 this was originally
 * built for (DocumentaryCaseStudy's trailer slot) — pass a different one
 * (e.g. "size-full", no rounding) to drop it into a box this component
 * doesn't own the sizing of, like a Playground card's image area.
 */
export function YouTubeFacade({
  videoId,
  title,
  wrapperClassName = "h-[301px] w-[512px] max-w-full rounded-lg",
}: {
  videoId: string;
  title: string;
  wrapperClassName?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={`relative overflow-hidden bg-bg-tertiary ${wrapperClassName}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${title}`}
      className={`group relative flex items-center justify-center overflow-hidden bg-bg-tertiary ${wrapperClassName}`}
    >
      {/* Plain <img>, not next/image — an external host needs to be
          allow-listed in next.config for the optimizer, which isn't worth
          configuring for one thumbnail; this is a fixed, already-
          reasonably-sized JPEG straight from YouTube's own CDN. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.05]"
      />
      <div className={`relative flex size-8 items-center justify-center rounded-full bg-bg-tertiary backdrop-blur-[12px] ${insetBorder}`}>
        <Image src="/images/home/play.svg" alt="" width={16} height={16} className={themedIcon} />
      </div>
    </button>
  );
}
