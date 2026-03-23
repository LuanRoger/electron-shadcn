import { ipc } from "@/ipc/manager";
import type { SettingsType } from "@/config/settings";

export async function getSettings() {
  return ipc.client.store.getSettings();
}

export async function getSetting(key: keyof SettingsType) {
  return ipc.client.store.getSetting({ key });
}

export async function setSettings(settings: Partial<SettingsType>) {
  return ipc.client.store.setSettings(settings);
}

export async function resetSettings() {
  return ipc.client.store.resetSettings();
}
