import { BrowserWindow, Menu } from "electron";
import { inDevelopment } from "../constants";

export const setupContextMenu = (window: BrowserWindow) => {
  window.webContents.on("context-menu", (_, props) => {
    const menuItems: Electron.MenuItemConstructorOptions[] = [
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "selectAll" },
    ];

    if (inDevelopment) {
      menuItems.push(
        { type: "separator" },
        {
          label: "Inspect Element",
          click: () => {
            window.webContents.inspectElement(props.x, props.y);
          },
        },
      );
    }

    Menu.buildFromTemplate(menuItems).popup({ window });
  });
};
