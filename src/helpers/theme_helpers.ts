import { ThemeMode } from "@/types/theme-mode";
import { ipc } from "./ipc/manager";

export interface ThemePreferences {
  system: ThemeMode;
  local: ThemeMode | null;
}

const THEME_KEY = "theme";

export async function getCurrentTheme(): Promise<ThemePreferences> {
  const currentTheme = await ipc.client.theme.getCurrentThemeMode();
  const localTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;

  return {
    system: currentTheme,
    local: localTheme,
  };
}

export async function setTheme(newTheme: ThemeMode) {
  await ipc.client.theme.setThemeMode(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
}

export async function toggleTheme() {
  const isDarkMode = await ipc.client.theme.toggleThemeMode();
  const newTheme = isDarkMode ? "dark" : "light";

  updateDocumentTheme(isDarkMode);
  localStorage.setItem(THEME_KEY, newTheme);
}

export async function syncWithLocalTheme() {
  const { local } = await getCurrentTheme();
  if (!local) {
    setTheme("system");
    return;
  }

  await setTheme(local);
}

function updateDocumentTheme(isDarkMode: boolean) {
  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
