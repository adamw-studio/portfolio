import Image from "next/image";

export type ProjectImage = {
  /** omit while the real asset isn't ready yet — renders a gray wireframe block instead */
  src?: string;
  alt?: string;
  /** column width in px, from Figma's per-row 424/424/512 (order varies per row) */
  width: number;
};

type ProjectRowProps = {
  title: string;
  description: string;
  images: ProjectImage[];
  overlayLabel?: string;
};

export default function ProjectRow({ title, description, images, overlayLabel }: ProjectRowProps) {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Header title={title} description={description} />
      <div className="flex w-full items-center gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative h-[282px] overflow-hidden rounded-lg bg-bg-tertiary"
            style={{ flexGrow: img.width, flexBasis: 0 }}
          >
            {img.src && (
              <>
                <Image src={img.src} alt={img.alt ?? ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                {i === 0 && overlayLabel && (
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/42 px-8 py-4">
                    <span className="text-[40px] font-bold tracking-[-2px] text-white">{overlayLabel}</span>
                  </div>
                )}
                {i > 0 && (
                  <div className="absolute inset-8 rounded-[20px] bg-bg-default shadow-[0px_4px_5.7px_0px_rgba(0,0,0,0.25)]" />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex w-full flex-col text-[20px] font-medium leading-6 tracking-[-0.28px]">
      <p className="w-full text-text-primary">{title}</p>
      <p className="w-full text-text-subtle">{description}</p>
    </div>
  );
}
