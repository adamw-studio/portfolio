"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CaseStudyStage } from "@/components/case-study/CaseStudyStage";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";
import { CaseStudyBackButton } from "@/components/case-study/CaseStudyBackButton";
import type { CaseStudyPageConfig } from "@/components/case-study/types";

const QUERY_KEY = "casePage";

/**
 * The presentation shell every case study renders into — orchestrates
 * which page is active, keeps that in the URL, and owns the transition
 * direction. Deliberately dumb about *content*: `pages` is the only
 * thing that varies between case studies, and next/prev is pure array-
 * index math against its length, never a hardcoded page count or a
 * per-page "what comes after this one" rule. Adding, removing or
 * reordering a case study's pages is entirely a `pages` array edit —
 * nothing in this file needs to change.
 *
 * ?casePage=N (1-based, matching the brief's own example) rather than a
 * per-page route each: these aren't independently linkable documents
 * with their own metadata/SEO needs, they're positions in one
 * presentation, the same reason a PDF viewer's page number lives in a
 * query param rather than a path segment. router.push (not replace) for
 * every page change is deliberate too — the brief explicitly wants
 * Back/Forward to step through case-study pages, not just leave the
 * route entirely on one Back press.
 */
export function CaseStudy({ pages }: { pages: CaseStudyPageConfig[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawParam = Number(searchParams.get(QUERY_KEY));
  const initialIndex = Number.isInteger(rawParam) && rawParam >= 1 && rawParam <= pages.length ? rawParam - 1 : 0;

  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // The URL is the source of truth for *which* page — this syncs local
  // `index` state to it (covers Back/Forward, a shared link with
  // ?casePage= already set, or the param going missing/out of range) —
  // rather than the other way around, so a browser nav event is never
  // fighting this component's own optimistic state update.
  useEffect(() => {
    const param = Number(searchParams.get(QUERY_KEY));
    const next = Number.isInteger(param) && param >= 1 && param <= pages.length ? param - 1 : 0;
    // Syncing from an external signal (the URL, which Back/Forward and a
    // pasted link can both change outside this component's own control) —
    // same justified exception AboutCardStack's own reduced-motion read
    // and PasswordGate's own sessionStorage read already use.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIndex((current) => (current === next ? current : next));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the param itself (via searchParams' own identity) should re-sync; pages.length is effectively static per case study
  }, [searchParams]);

  const goTo = useCallback(
    (nextIndex: number, dir: "next" | "prev") => {
      if (nextIndex < 0 || nextIndex >= pages.length) return;
      setDirection(dir);
      setIndex(nextIndex);
      const params = new URLSearchParams(searchParams);
      params.set(QUERY_KEY, String(nextIndex + 1));
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pages.length, pathname, router, searchParams],
  );

  const goNext = useCallback(() => goTo(index + 1, "next"), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1, "prev"), [goTo, index]);

  // ← / → advance the story, same as the on-screen Prev/Next — but never
  // while focus is in a text field or other editable control (brief's
  // own explicit accessibility requirement), so this can't steal a left/
  // right arrow keystroke from, say, a future contact-form input.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev]);

  const active = pages[index];
  const ActiveComponent = active.Component;

  return (
    // No bg-bg-default of its own — ThemeProvider's own page-dots wrapper
    // (ThemeContext.tsx) already paints that as the page background, with
    // the dot pattern layered *between* it and normal content; painting a
    // second opaque background here would sit right on top of that dots
    // layer (same z-order as any other normal content) and hide it
    // entirely, reported live as "the background dots... seem removed".
    <div>
      <CaseStudyBackButton />
      <CaseStudyStage pageKey={active.id} direction={direction} peek={active.peek} reducedMotion={reducedMotion}>
        <ActiveComponent />
      </CaseStudyStage>
      <CaseStudyNav index={index} count={pages.length} onPrev={goPrev} onNext={goNext} />
    </div>
  );
}
