import path from "node:path";
import { app, BrowserWindow } from "electron";
import { ipcMain } from "electron/main";
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { UpdateSourceType, updateElectronApp } from "update-electron-app";
import { ipcContext } from "@/ipc/context";
import { IPC_CHANNELS, inDevelopment } from "./constants";
import { getBasePath } from "./utils/path";
import { initializeLogger, initializeErrorHandling, Logger } from "./main/logger";
import { installCrashHandlers, wireRenderProcessGone } from "./main/crash-report";
import { initializeTray } from "./main/tray";
import { registerKeyboardShortcuts } from "./main/keyboard";
import { setupContextMenu } from "./main/context-menu";
import { store } from "./main/store";

// Initialize logger first so all subsequent logs go to file
initializeLogger();

function createWindow() {
  const basePath = getBasePath();
  const preload = path.join(basePath, "preload.js");
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: inDevelopment,
      contextIsolation: true,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: false,

      preload,
    },
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
    trafficLightPosition:
      process.platform === "darwin" ? { x: 5, y: 5 } : undefined,
  });
  ipcContext.setMainWindow(mainWindow);

  // Set up context menu (cut/copy/paste + inspect element in dev)
  setupContextMenu(mainWindow);

  // Wire crash handler for render process
  wireRenderProcessGone(mainWindow);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(basePath, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  return mainWindow;
}

async function installExtensions() {
  try {
    const result = await installExtension(REACT_DEVELOPER_TOOLS);
    Logger.info(`Extensions installed successfully: ${result.name}`);
  } catch {
    Logger.error("Failed to install extensions");
  }
}

function checkForUpdates() {
  const settings = store.get("settings");
  if (!settings.allowAutoUpdate) {
    Logger.info("Auto-update disabled by user settings");
    return;
  }

  updateElectronApp({
    updateSource: {
      type: UpdateSourceType.ElectronPublicUpdateService,
      repo: "LuanRoger/electron-shadcn",
    },
  });
}

async function setupORPC() {
  const { rpcHandler } = await import("./ipc/handler");

  ipcMain.on(IPC_CHANNELS.START_ORPC_SERVER, (event) => {
    const [serverPort] = event.ports;

    serverPort.start();
    rpcHandler.upgrade(serverPort);
  });
}

app.whenReady().then(async () => {
  try {
    // Install crash handlers early
    installCrashHandlers();
    initializeErrorHandling();

    Logger.info("App starting...");

    createWindow();
    await installExtensions();
    checkForUpdates();
    await setupORPC();

    // Initialize tray if enabled in settings
    const settings = store.get("settings");
    if (settings.showTrayIcon) {
      initializeTray();
    }

    // Register global keyboard shortcuts
    registerKeyboardShortcuts();

    Logger.info("App ready");
  } catch (error) {
    Logger.error("Error during app initialization:", error);
  }
});

//osX only
app.on("window-all-closed", () => {
  const settings = store.get("settings");
  if (process.platform !== "darwin" || settings.quitOnWindowClose) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//osX only ends

// Clean up global shortcuts on quit
app.on("will-quit", () => {
  const { globalShortcut } = require("electron");
  globalShortcut.unregisterAll();
});
