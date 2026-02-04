import { os } from "@orpc/server";
import type { BrowserWindow } from "electron";

class IPCContext {
  mainWindow: BrowserWindow | undefined;

  setMainWindow(window: BrowserWindow) {
    this.mainWindow = window;
  }

  get mainWindowContext() {
    const window = this.mainWindow;
    if (!window) {
      throw new Error("Main window is not set in IPC context.");
    }

    return os.middleware(({ next }) =>
      next({
        context: {
          window,
        },
      })
    );
  }
}

export const ipcContext = new IPCContext();
