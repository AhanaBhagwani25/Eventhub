import { useCallback, useState } from "react";

// The initial class is set by a small script in index.html (no flash on load).
export function useTheme() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("eventhub-theme", next ? "dark" : "light");
    } catch {
      // Storage can be blocked; the theme still changes for this visit.
    }
    setDark(next);
  }, []);

  return { dark, toggle };
}
