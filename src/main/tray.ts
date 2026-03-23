import path from "node:path";
import { Tray, Menu, app } from "electron";
import { getBasePath } from "../utils/path";

let tray: Tray | null = null;

const getIconPath = (): string => {
  const basePath = getBasePath();
  // In packaged app, resources are in a different location
  const resourcesPath = app.isPackaged
    ? path.join(process.resourcesPath, "assets")
    : path.join(basePath, "../../assets");

  if (process.platform === "darwin") {
    return path.join(resourcesPath, "icons", "tray-Template.png");
  }
  if (process.platform === "win32") {
    return path.join(resourcesPath, "icon.ico");
  }
  return path.join(resourcesPath, "icons", "icon.png");
};

export const initializeTray = () => {
  if (tray) {
    return;
  }

  tray = new Tray(getIconPath());

  const contextMenu = Menu.buildFromTemplate([
    { role: "about" },
    { type: "separator" },
    {
      label: "Show",
      click: () => {
        const { BrowserWindow } = require("electron");
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
          win.show();
          win.focus();
        }
      },
    },
    { type: "separator" },
    { role: "quit" },
  ]);

  tray.setToolTip(app.name);
  tray.setContextMenu(contextMenu);
};

export const destroyTray = () => {
  tray?.destroy();
  tray = null;
};

export const isTrayInitialized = () => tray !== null;
