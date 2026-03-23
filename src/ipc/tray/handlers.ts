import { os } from "@orpc/server";
import {
  initializeTray,
  destroyTray,
  isTrayInitialized,
} from "../../main/tray";

export const getTrayStatus = os.handler(() => {
  return { enabled: isTrayInitialized() };
});

export const enableTray = os.handler(() => {
  initializeTray();
  return { enabled: true };
});

export const disableTray = os.handler(() => {
  destroyTray();
  return { enabled: false };
});
