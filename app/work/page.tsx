import { redirect } from "next/navigation";

// This used to be a standalone project-listing page (Navbar/ProjectRow/
// Footer, all now deleted) — an earlier pass at the site's own visual
// language, still using the light-theme, empty-thumbnail, dead-end-card
// look from before the Home page's dark redesign. Nothing on the live
// site links here any more (Home's own Nav is just Home/Play, and
// SelectedWorks.tsx is the real "browse the work" surface now), but the
// route itself was still reachable and reachable-from-Google — worth a
// redirect rather than a fresh 404, since a stray inbound link should
// land somewhere real instead of dead-ending twice over.
export default function WorkPage() {
  redirect("/");
}
