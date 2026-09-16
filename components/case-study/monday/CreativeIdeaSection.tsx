import { Heading, BodyCopy } from "@/components/case-study/primitives";

// Figma 206:5440.
export default function CreativeIdeaSection() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Heading size="section" className="tracking-[-0.16px]">
        Creative idea
      </Heading>
      <BodyCopy>
        Motion, captured in a mark.
        <br />
        <br />
        The identity takes inspiration from triangular cone tones, simple directional forms associated with
        movement, rhythm and visual communication. Their geometry became the foundation of the wordmark, translating
        the collective&rsquo;s fast-paced and flexible approach to video production into a distinctive visual
        signature.
        <br />
        <br />
        The same forms extend beyond the wordmark into the wider identity, where they can shift, rotate, crop and
        combine, creating a system that feels continuously in motion.
        <br />
        <br />
        The result balances energy and adaptability with precision, reflecting the collective&rsquo;s commitment to
        both creative experimentation and quality.
      </BodyCopy>
    </div>
  );
}
