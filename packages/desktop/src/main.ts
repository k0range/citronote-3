import { app, BrowserWindow, ipcMain, dialog } from "electron";
import isDev from "electron-is-dev";
const path = require("node:path");

const version = app.getVersion();

import { createMainWindow } from "./window/mainWindow";
import { createNotebookSelectorWindow } from "./window/notebookSelector";
import { createAppStateStore } from "./store";
import { registerIpc } from "./ipc";

let selectWindow: BrowserWindow | null = null;
let notebookWindows: Record<string, BrowserWindow> = {}; // notebookId, BrowserWindow

app.setName("citronote");  

if (isDev) {
  app.setPath("userData", path.join(__dirname, "..", "dev-userdata"));
}
const userdata = app.getPath("userData");
console.log("UserData path:", userdata);

const store = createAppStateStore({
  userdata,
  version,
});

registerIpc({
  selectWindow,
  notebookWindows,
  store,
});

app.whenReady().then(async () => {
  // activeNotebooksを見てそのぶんだけウィンドウを開く。まったくなかったらselectorを開く
  const activeNotebooks = store.get("activeNotebooks") || [];
  // 存在しないノートブックIDが入ってたら除外する
  const allNotebooks = await store.get("notebooks") || [];
  const validActiveNotebooks = activeNotebooks.filter((id: string) => {
    const exists = allNotebooks.find((n) => n.id === id);
    if (!exists) {
      store.set("activeNotebooks", store.get("activeNotebooks").filter((nid: string) => nid !== id));
    }
    return !!exists;
  });
  if (validActiveNotebooks.length === 0) {
    selectWindow = createNotebookSelectorWindow();
  } else {
    validActiveNotebooks.forEach((id: string) => {
      createMainWindow({ store: store, notebookId: id });
    });
  }
});
