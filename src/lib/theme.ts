import { browser } from "$app/environment";
import { settings } from "$lib/settings";

let stored: string;

if (browser) {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    updateTheme(stored);
  });
}

settings.subscribe((settings) => {
  stored = settings.theme;
  updateTheme(stored);
});

// Update theme
function updateTheme(theme: string) {
  if (!browser) return;
  // Detect system theme
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (theme === "auto") {
    theme = prefersDark ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", theme);
}
