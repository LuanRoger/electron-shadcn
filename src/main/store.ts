import Store, { type Schema } from "electron-store";
import {
  DEFAULT_KEYBINDS,
  DEFAULT_SETTINGS,
  type KeybindsType,
  type SettingsType,
} from "../config/settings";

export interface StoreType {
  settings: SettingsType;
  keybinds: KeybindsType;
}

const schema: Schema<StoreType> = {
  keybinds: {
    type: "object",
    properties: {
      quit: { type: "string" },
      reset: { type: "string" },
    },
    default: DEFAULT_KEYBINDS,
  },
  settings: {
    type: "object",
    properties: {
      accentColor: { type: "string" },
      allowAutoUpdate: { type: "boolean" },
      allowNotifications: { type: "boolean" },
      showDockIcon: { type: "boolean" },
      showTrayIcon: { type: "boolean" },
      startMinimized: { type: "boolean" },
      quitOnWindowClose: { type: "boolean" },
      theme: { type: "string", enum: ["system", "light", "dark"] },
    },
    default: DEFAULT_SETTINGS,
  },
};

export const store = new Store<StoreType>({ schema });
