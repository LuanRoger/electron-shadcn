import { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { WIN_CLOSE_CHANNEL, WIN_MAXIMIZE_CHANNEL, WIN_MINIMIZE_CHANNEL } from "./ipc-channels";

export function addWindowEventListeners(mainWindow: BrowserWindow) {
    ipcMain.on(WIN_MINIMIZE_CHANNEL, () => {
        mainWindow.minimize();
    });
    ipcMain.on(WIN_MAXIMIZE_CHANNEL, () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });
    ipcMain.on(WIN_CLOSE_CHANNEL, () => {
        mainWindow.close();
    });
}