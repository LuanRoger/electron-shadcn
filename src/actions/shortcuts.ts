import { ipc } from "@/ipc/manager";
import type { KeybindsType } from "@/config/settings";

export async function getKeybinds() {
  return ipc.client.shortcuts.getKeybinds();
}

export async function setKeybind(
  action: keyof KeybindsType,
  accelerator: string,
) {
  return ipc.client.shortcuts.setKeybind({ action, accelerator });
}

export async function setKeybinds(keybinds: Partial<KeybindsType>) {
  return ipc.client.shortcuts.setKeybinds(keybinds);
}
