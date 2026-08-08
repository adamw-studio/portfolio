import Navbar from "@/components/Navbar";
import ProjectRow from "@/components/ProjectRow";
import Footer from "@/components/Footer";

const projects = [
  {
    title: "Beacon - Orchestro Suite",
    description: "Idea to venture, powered by agentic AI",
    overlayLabel: "Beacon",
    images: [
      { src: "/images/projects/beacon/flowers.jpg", alt: "Beacon brand cover", weight: 424 },
      { src: "/images/projects/beacon/phone-mockup.jpg", alt: "Beacon app screen mockup", weight: 424 },
      { src: "/images/projects/beacon/lake-dock.jpg", alt: "Beacon product screen mockup", weight: 512 },
    ],
  },
  {
    title: "Revolution Robotics",
    description: "Inspiring young innovators with a kid-friendly robotics app",
  },
  {
    title: "Symphony of Disorder",
    description: "Retrospective cinematic journey through the body of work of painter Éva Köves",
  },
  {
    title: "Monday",
    description: "Built for anything from full-scale productions to fast-moving travel shoots",
  },
  {
    title: "Archive",
    description: "AR, Branding, University Projects",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-bg-default">
      <Navbar />
      <main className="flex w-full flex-col gap-10 px-6 pb-32 pt-16">
        {projects.map((project) => (
          <ProjectRow key={project.title} {...project} />
        ))}
      </main>
      <Footer />
    </div>
  );
}
