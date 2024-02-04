import { BrowserWindow, nativeTheme } from "electron";
import { ipcMain } from "electron";
import {
    THEME_MODE_CURRENT_CHANNEL,
    THEME_MODE_DARK_CHANNEL,
    THEME_MODE_LIGHT_CHANNEL,
    THEME_MODE_SYSTEM_CHANNEL,
    THEME_MODE_TOGGLE_CHANNEL,
    WIN_CLOSE_CHANNEL,
    WIN_MAXIMIZE_CHANNEL,
    WIN_MINIMIZE_CHANNEL,
} from "./ipc-channels";

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

export function addThemeEventListeners() {
    ipcMain.handle(THEME_MODE_CURRENT_CHANNEL, () => nativeTheme.themeSource);
    ipcMain.handle(THEME_MODE_TOGGLE_CHANNEL, () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = "light";
        } else {
            nativeTheme.themeSource = "dark";
        }
        return nativeTheme.shouldUseDarkColors;
    });
    ipcMain.handle(THEME_MODE_DARK_CHANNEL, () => (nativeTheme.themeSource = "dark"));
    ipcMain.handle(THEME_MODE_LIGHT_CHANNEL, () => (nativeTheme.themeSource = "light"));
    ipcMain.handle(THEME_MODE_SYSTEM_CHANNEL, () => {
        nativeTheme.themeSource = "system";
        return nativeTheme.shouldUseDarkColors;
    });
}
