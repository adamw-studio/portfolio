"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import DotFieldCanvas from "@/components/DotFieldCanvas";

type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

const STORAGE_KEY = "home-theme";

/**
 * Wraps the home page so the nav's sun/moon button can toggle
 * between Figma's dark (default) and light (239:12856) designs. Renders
 * the actual `.theme-dark` (or not) class on its own root div — every
 * other component on the page already keys off that class via CSS custom
 * properties (bg/text/border tokens in globals.css), so toggling it here
 * is the only thing most of the page needs to re-theme. The exceptions
 * (icons with colors hardcoded per-theme rather than as CSS variables)
 * read the theme via useTheme() directly.
 *
 * Persisted to localStorage so the choice survives reloads; defaults to
 * dark (this page's original design) rather than reading the OS
 * prefers-color-scheme, since dark is the intentional default look here,
 * not a fallback.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Deliberately deferred to an effect rather than a lazy useState
    // initializer: window/localStorage don't exist during SSR, so both
    // the server-rendered HTML and the client's *first* render need to
    // agree on the "dark" default to avoid a hydration mismatch. This
    // corrects to the stored theme immediately after mount instead.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === "light" || stored === "dark") setTheme(stored);
    } catch {
      // localStorage unavailable (private mode, disabled storage) — just
      // keep the in-memory default.
    }
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Same as above — persistence is a nice-to-have, not required for
        // the toggle itself to work this session.
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`page-dots flex flex-1 flex-col bg-bg-default px-4 ${theme === "dark" ? "theme-dark" : ""}`}>
        <DotFieldCanvas />
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
