import {
    WIN_CLOSE_CHANNEL,
    WIN_MAXIMIZE_CHANNEL,
    WIN_MINIMIZE_CHANNEL,
    THEME_MODE_CURRENT_CHANNEL,
    THEME_MODE_DARK_CHANNEL,
    THEME_MODE_LIGHT_CHANNEL,
    THEME_MODE_SYSTEM_CHANNEL,
    THEME_MODE_TOGGLE_CHANNEL,
} from "./ipc-channels";

export function exposeWindowContext() {
    const { contextBridge, ipcRenderer } = window.require("electron");
    contextBridge.exposeInMainWorld("electronWindow", {
        minimize: () => ipcRenderer.invoke(WIN_MINIMIZE_CHANNEL),
        maximize: () => ipcRenderer.invoke(WIN_MAXIMIZE_CHANNEL),
        close: () => ipcRenderer.invoke(WIN_CLOSE_CHANNEL),
    });
}

export function exposeThemeContext() {
    const { contextBridge, ipcRenderer } = window.require("electron");
    contextBridge.exposeInMainWorld("themeMode", {
        current: () => ipcRenderer.invoke(THEME_MODE_CURRENT_CHANNEL),
        toggle: () => ipcRenderer.invoke(THEME_MODE_TOGGLE_CHANNEL),
        dark: () => ipcRenderer.invoke(THEME_MODE_DARK_CHANNEL),
        light: () => ipcRenderer.invoke(THEME_MODE_LIGHT_CHANNEL),
        system: () => ipcRenderer.invoke(THEME_MODE_SYSTEM_CHANNEL),
    });
}
