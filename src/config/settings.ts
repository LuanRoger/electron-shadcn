export type ThemeType = "system" | "light" | "dark";

export interface SettingsType {
  accentColor: string;
  allowAutoUpdate: boolean;
  allowNotifications: boolean;
  showDockIcon: boolean; // macOS only
  showTrayIcon: boolean;
  startMinimized: boolean;
  quitOnWindowClose: boolean;
  theme: ThemeType;
}

export const DEFAULT_SETTINGS: SettingsType = {
  accentColor: "#b453ff",
  allowAutoUpdate: true,
  allowNotifications: true,
  showDockIcon: true,
  showTrayIcon: true,
  startMinimized: false,
  quitOnWindowClose: false,
  theme: "system",
};

export interface KeybindsType {
  quit?: string;
  reset?: string;
}

export const DEFAULT_KEYBINDS: KeybindsType = {
  quit: "Control+Shift+Alt+Q",
  reset: "Control+Shift+Alt+R",
};
