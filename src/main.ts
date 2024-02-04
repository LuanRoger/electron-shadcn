import { app, BrowserWindow } from "electron";
import { addWindowEventListeners, addThemeEventListeners } from "./helpers/ipc/ipc-helpers";
import path from "path";

if (require("electron-squirrel-startup")) {
    app.quit();
}

const createWindow = () => {
    const preload = path.join(__dirname, "preload.js")
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: preload,
        },
        titleBarStyle: "hidden",
    });
    addWindowEventListeners(mainWindow);
    addThemeEventListeners();

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
        );
    }
};

app.whenReady().then(createWindow);

//osX only
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//osX only ends
