import { ipcRenderer } from "electron";

window.addEventListener("message", (event) => {
  if (event.data === "start-orpc-client") {
    const [serverPort] = event.ports;

    ipcRenderer.postMessage("start-orpc-server", null, [serverPort]);
  }
});
