import { app, globalShortcut } from "electron";
import { Logger } from "./logger";
import { store } from "./store";
import type { KeybindsType } from "../config/settings";

interface KeyboardShortcut {
  action: keyof KeybindsType;
  fn: () => void;
  allowUnbind?: boolean;
}

const keyboardShortcuts: KeyboardShortcut[] = [
  {
    action: "quit",
    allowUnbind: true,
    fn() {
      app.quit();
    },
  },
  {
    action: "reset",
    allowUnbind: true,
    fn() {
      store.delete("settings" as keyof typeof store.store);
      store.delete("keybinds" as keyof typeof store.store);
      registerKeyboardShortcuts();
    },
  },
];

export const registerKeyboardShortcuts = () => {
  globalShortcut.unregisterAll();

  const keybinds = store.get("keybinds");
  for (const shortcut of keyboardShortcuts) {
    const { action, fn } = shortcut;
    const keybind = keybinds[action];

    if (!action || !fn || !keybind) {
      Logger.info(`No keybind for ${action}`);
      continue;
    }

    Logger.info(`Registering keybind: ${action} → ${keybind}`);
    globalShortcut.register(keybind, fn);
  }
};

export const setKeybind = (
  action: keyof KeybindsType,
  accelerator: string,
) => {
  const keybinds = store.get("keybinds");

  if (!(action in keybinds)) {
    return;
  }

  const shortcut = keyboardShortcuts.find((s) => s.action === action);
  if (!accelerator && !shortcut?.allowUnbind) {
    return;
  }

  keybinds[action] = accelerator;
  store.set("keybinds", keybinds);
  registerKeyboardShortcuts();
};

export const setKeybinds = (keybinds: Partial<KeybindsType>) => {
  const current = store.get("keybinds");
  store.set("keybinds", { ...current, ...keybinds });
  registerKeyboardShortcuts();
};

export const getKeybinds = () => store.get("keybinds");
