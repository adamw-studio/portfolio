import { Heading, BodyCopy, Exhibit } from "@/components/case-study/primitives";

// Same swap as HowItStarted.tsx's own "Portfolio" diagram, on the same
// instruction, applied here to this section's own "Cosmos DS" diagram:
// the hand-built pill+arrow composition is replaced by a single flat
// exhibit image with two real theme-specific exports (transparent
// PNGs — dark ink for light theme, light ink for dark theme).
export default function FragmentedProduct() {
  return (
    <div className="flex w-full max-w-[512px] flex-col gap-2">
      <Heading size="section" className="tracking-[-0.8px]">
        A fragmented product
      </Heading>
      <div className="flex w-full flex-col gap-4">
        <BodyCopy>
          When I took ownership of the product, it lacked a clear and consistent design direction. Several designers
          had contributed to it intermittently between client projects, resulting in fragmented pattern and
          experiences. My first priority was to create a structure and establish a stronger design foundation.
        </BodyCopy>
        <BodyCopy>
          I worked with leadership to align on extending the design system we had built for Orchestro across all
          three products. This gave us a shared foundation for implementing components, interaction patterns and
          experiences consistently across the product suite.
        </BodyCopy>
        <Exhibit
          src="/images/home/beacon-cosmos-ds-diagram-light.png"
          darkSrc="/images/home/beacon-cosmos-ds-diagram-dark.png"
          alt="Diagram showing Cosmos DS fanning out into three design systems: Athena DS, Metis DS, and Pantheon DS"
          frame={false}
        />
      </div>
    </div>
  );
}
