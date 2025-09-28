import { useEffect, useState, useMemo } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "theme";

export function ThemeToggle() {
  const mediaQuery = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null),
    []
  );

  const getSystemPrefersDark = () => (mediaQuery ? mediaQuery.matches : false);

  const getInitialIsDark = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark") return true;
      if (stored === "light") return false;
    } catch {}
    return getSystemPrefersDark();
  };

  const [isDark, setIsDark] = useState(getInitialIsDark);

  // Apply theme to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      try { localStorage.setItem(STORAGE_KEY, "dark"); } catch {}
    } else {
      root.classList.remove("dark");
      try { localStorage.setItem(STORAGE_KEY, "light"); } catch {}
    }
  }, [isDark]);

  // Keep following system when no explicit preference is stored yet
  useEffect(() => {
    if (!mediaQuery) return;
    const stored = (() => {
      try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
    })();
    if (stored) return; // user has explicit pref
    const handler = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener ? mediaQuery.addEventListener("change", handler) : mediaQuery.addListener(handler);
    return () => {
      mediaQuery.removeEventListener ? mediaQuery.removeEventListener("change", handler) : mediaQuery.removeListener(handler);
    };
  }, [mediaQuery]);

  const toggleTheme = () => setIsDark((v) => !v);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className="rounded-full"
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}


