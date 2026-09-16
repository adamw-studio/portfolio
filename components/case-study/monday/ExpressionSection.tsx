import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 207:6111.
export default function ExpressionSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section" className="tracking-[-0.16px]">
        Expression
      </Heading>
      <BodyCopy>
        The identity can expand from a studio signature into a broader communication system. The wordmark handles
        moments where recognition is most important, while the graphic language can take over when greater
        expression is needed. Across social content, posters, digital experiences, presentations, motion,
        merchandise and physical collateral, the same underlying elements can behave differently according to
        context.
        <br />
        <br />
        In motion, shapes can rotate, connect or move through the frame. In print, they can become oversized crops.
        Digitally, the modular system could become responsive or interactive.
        <br />
        <br />
        This allows Monday to remain recognisable without looking identical every time.
      </BodyCopy>
    </div>
  );
}
