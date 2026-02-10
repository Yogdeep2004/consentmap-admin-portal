import { useState, useEffect } from "react";

const DARK_MODE_KEY = "consentmap:dark-mode";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(DARK_MODE_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(DARK_MODE_KEY, String(isDark));
  }, [isDark]);

  return { isDark, toggleDarkMode: () => setIsDark((prev) => !prev) };
}
