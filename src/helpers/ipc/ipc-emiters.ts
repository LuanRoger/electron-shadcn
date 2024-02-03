import { WIN_MINIMIZE_CHANNEL, WIN_MAXIMIZE_CHANNEL, WIN_CLOSE_CHANNEL } from "./ipc-channels";

export function minimizeWindow() {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send(WIN_MINIMIZE_CHANNEL);
}
export function maximizeWindow() {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send(WIN_MAXIMIZE_CHANNEL);
}
export function closeWindow() {
    const { ipcRenderer } = window.require("electron");
    ipcRenderer.send(WIN_CLOSE_CHANNEL);
}