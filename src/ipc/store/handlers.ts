import { os } from "@orpc/server";
import { app, nativeTheme } from "electron";
import { store } from "../../main/store";
import { destroyTray, initializeTray } from "../../main/tray";
import type { SettingsType } from "../../config/settings";
import { getSettingInputSchema, setSettingsInputSchema } from "./schemas";

export const getSettings = os.handler(() => {
  return store.get("settings");
});

export const getSetting = os
  .input(getSettingInputSchema)
  .handler(({ input }) => {
    const settings = store.get("settings");
    return settings[input.key];
  });

export const setSettings = os
  .input(setSettingsInputSchema)
  .handler(({ input }) => {
    const current = store.get("settings");
    const updated = { ...current, ...input };
    store.set("settings", updated);

    // Apply side effects
    const keys = Object.keys(input) as (keyof SettingsType)[];

    if (keys.includes("theme")) {
      nativeTheme.themeSource = updated.theme;
    }

    if (keys.includes("showDockIcon")) {
      if (
        app.dock &&
        typeof app.dock.show === "function" &&
        typeof app.dock.hide === "function"
      ) {
        if (updated.showDockIcon) {
          app.dock.show();
        } else {
          app.dock.hide();
        }
      }
    }

    if (keys.includes("showTrayIcon")) {
      if (updated.showTrayIcon) {
        initializeTray();
      } else {
        destroyTray();
      }
    }

    return updated;
  });

export const resetSettings = os.handler(() => {
  store.delete("settings" as keyof typeof store.store);
  store.delete("keybinds" as keyof typeof store.store);
  return store.get("settings");
});
