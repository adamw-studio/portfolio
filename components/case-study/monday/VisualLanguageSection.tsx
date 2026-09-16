import { Heading, BodyCopy, Finding } from "@/components/case-study/primitives";

// Figma 207:6039 — the four labeled ingredients (207:6065) reuse
// Finding (primitives.tsx) rather than a new local component: same
// "bold title, content directly beneath, no gap" shape that component
// already exists for.
export default function VisualLanguageSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-2">
        <Heading size="section" className="tracking-[-0.16px]">
          Visual language
        </Heading>
        <BodyCopy>The visual language deliberately uses a limited set of ingredients.</BodyCopy>
      </div>
      <div className="flex w-full flex-col gap-4">
        <Finding title="Typography">
          <BodyCopy>
            A compact, unconventional wordmark gives the studio its own signature, contrasted with a neutral
            grotesque typeface for communication.
          </BodyCopy>
        </Finding>
        <Finding title="Color">
          <BodyCopy>
            Black and warm off-white establish a graphic foundation, while vivid red acts as the identity&rsquo;s
            primary signal, energetic, immediate and difficult to ignore.
          </BodyCopy>
        </Finding>
        <Finding title="Shape">
          <BodyCopy>
            Rounded geometric forms introduce movement and personality. Their oversized scale allows them to move
            between symbol, image and composition.
          </BodyCopy>
        </Finding>
        <Finding title="Composition">
          <BodyCopy>
            Large areas of negative space are contrasted with cropped, oversized forms. Rather than centering
            everything neatly, elements frequently enter and leave the frame.
          </BodyCopy>
        </Finding>
      </div>
    </div>
  );
}
