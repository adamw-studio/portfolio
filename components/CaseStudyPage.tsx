import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Placeholder shell for an individual project's case study page. Real
 * content (write-up, images, process) isn't ready yet for any of these
 * projects — this just gives each one a real route to link to instead of
 * everything pointing at the generic /work index.
 */
export default function CaseStudyPage({
  title,
  role,
  year,
}: {
  title: string;
  role: string;
  year: string;
}) {
  return (
    <div className="flex flex-1 flex-col bg-bg-default">
      <Navbar />
      <main className="flex flex-1 flex-col items-start justify-center gap-2 px-6 py-24">
        <h1 className="text-[32px] font-medium leading-10 tracking-[-1px] text-text-primary">{title}</h1>
        <p className="text-[14px] leading-6 tracking-[-0.128px] text-text-subtle">
          {role} · {year}
        </p>
        <p className="mt-6 text-[14px] leading-6 tracking-[-0.128px] text-text-subtle">Case study coming soon.</p>
      </main>
      <Footer />
    </div>
  );
}
