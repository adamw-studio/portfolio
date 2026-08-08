import Navbar from "@/components/Navbar";
import ProjectRow from "@/components/ProjectRow";
import Footer from "@/components/Footer";

// Per-row image widths/order come directly from Figma metadata (node 60:1613) —
// each row mixes two 424px slots and one 512px slot, but the order differs per row.
const projects = [
  {
    title: "Beacon - Orchestro Suite",
    description: "Idea to venture, powered by agentic AI",
    overlayLabel: "Beacon",
    images: [
      { src: "/images/projects/beacon/flowers.jpg", alt: "Beacon brand cover", width: 424 },
      { src: "/images/projects/beacon/phone-mockup.jpg", alt: "Beacon app screen mockup", width: 424 },
      { src: "/images/projects/beacon/lake-dock.jpg", alt: "Beacon product screen mockup", width: 512 },
    ],
  },
  {
    title: "Revolution Robotics",
    description: "Inspiring young innovators with a kid-friendly robotics app",
    images: [{ width: 512 }, { width: 424 }, { width: 424 }],
  },
  {
    title: "Symphony of Disorder",
    description: "Retrospective cinematic journey through the body of work of painter Éva Köves",
    images: [{ width: 424 }, { width: 512 }, { width: 424 }],
  },
  {
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

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-bg-default">
      <Navbar />
      {/* pt-[274px]: exact gap from Figma metadata between the nav row (ends 52px
          from page top) and the first project header (starts at 326px) */}
      <main className="flex w-full flex-col gap-10 px-6 pt-[274px]">
        {projects.map((project) => (
          <ProjectRow key={project.title} {...project} />
        ))}
      </main>
      <Footer />
    </div>
  );
}
