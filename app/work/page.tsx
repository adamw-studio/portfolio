import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProjectRow from "@/components/ProjectRow";
import Footer from "@/components/Footer";

// Per-row image widths/order come directly from Figma metadata (node 60:1613) —
// each row mixes two 424px slots and one 512px slot, but the order differs per row.
// `slug` is the /work/[slug] case study route, where one exists — "Archive" is a
// mixed bag of smaller projects rather than a single case study, so it stays unlinked.
const projects = [
  {
    slug: "beacon",
    title: "Beacon - Orchestro Suite",
    description: "Idea to venture, powered by agentic AI",
    images: [{ width: 424 }, { width: 424 }, { width: 512 }],
  },
  {
    slug: "robotics",
    title: "Revolution Robotics",
    description: "Inspiring young innovators with a kid-friendly robotics app",
    images: [{ width: 512 }, { width: 424 }, { width: 424 }],
  },
  {
    slug: "documentary",
    title: "Symphony of Disorder",
    description: "Retrospective cinematic journey through the body of work of painter Éva Köves",
    images: [{ width: 424 }, { width: 512 }, { width: 424 }],
  },
  {
    slug: "monday",
    title: "Monday",
    description: "Built for anything from full-scale productions to fast-moving travel shoots",
    images: [{ width: 424 }, { width: 424 }, { width: 512 }],
  },
  {
    title: "Archive",
    description: "AR, Branding, University Projects",
    images: [{ width: 424 }, { width: 424 }, { width: 512 }],
  },
];

export default function WorkPage() {
  return (
    <div className="flex flex-1 flex-col bg-bg-default">
      <Navbar />
      {/* pt-[274px]: exact gap from Figma metadata between the nav row (ends 52px
          from page top) and the first project header (starts at 326px) */}
      <main className="flex w-full flex-col gap-10 px-6 pt-[274px]">
        {projects.map(({ slug, ...project }) =>
          slug ? (
            <Link key={project.title} href={`/work/${slug}`} className="w-full">
              <ProjectRow {...project} />
            </Link>
          ) : (
            <ProjectRow key={project.title} {...project} />
          ),
        )}
      </main>
      <Footer />
    </div>
  );
}
