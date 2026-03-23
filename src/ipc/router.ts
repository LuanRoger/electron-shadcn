import { app } from "./app";
import { shell } from "./shell";
import { shortcuts } from "./shortcuts";
import { storeRouter } from "./store";
import { theme } from "./theme";
import { tray } from "./tray";
import { window } from "./window";

export const router = {
  theme,
  window,
  app,
  shell,
  store: storeRouter,
  shortcuts,
  tray,
};
