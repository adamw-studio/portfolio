"use client";

import { ThemeProvider } from "@/components/ThemeContext";
import MondayCaseStudyBody from "@/components/MondayCaseStudyBody";

// Same shape as RoboticsCaseStudy.tsx — see that file's own doc comment.
export default function MondayCaseStudy() {
  return (
    <ThemeProvider>
      <MondayCaseStudyBody />
    </ThemeProvider>
  );
}
