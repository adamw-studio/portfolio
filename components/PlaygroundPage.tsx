import Nav from "@/components/Nav";
import { ThemeProvider } from "@/components/ThemeContext";
import PlaygroundCanvas from "@/components/PlaygroundCanvas";

// Deliberately no HomeFooter here — the canvas below is the entire
// experience, full-bleed and its own self-contained space; a footer
// breaking the bottom edge would undercut the "exhibition, not a page
// you scroll to the end of" framing the whole thing is going for.
export default function PlaygroundPage() {
  return (
    <ThemeProvider>
      <Nav />
      {/* fixed inset-0, not flex-1: ThemeProvider's wrapper only gets real
          height from its content's own natural size (every other page
          has enough stacked content to force that height; Nav is `fixed`
          and contributes none). With nothing else in flow here, a flex-1
          child has no definite space to grow into and collapses to zero
          height instead. Escaping to fixed positioning — the same move
          Nav itself already makes — sidesteps that chain entirely and
          guarantees the canvas is the full viewport regardless. Nav's own
          z-20 keeps it painting above this despite the later DOM order. */}
      <div className="fixed inset-0">
        <PlaygroundCanvas />
      </div>
    </ThemeProvider>
  );
}
