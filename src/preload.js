import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("shindo", {
  update: () => ipcRenderer.invoke("run-updater"),
  onUpdaterLog: (callback) =>
    ipcRenderer.on("updater-log", (event, ...args) => callback(...args)),
  removeUpdaterLogListener: () => ipcRenderer.removeAllListeners("updater-log"),
  launchClient: (username) => ipcRenderer.invoke("launch-client", username),
});
