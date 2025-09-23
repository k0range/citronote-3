import { ipcMain } from "electron";

import type { AppStateStore } from "../store";

import { createMainWindow } from "../window/mainWindow";
import { createNotebookSelectorWindow } from "../window/notebookSelector";
import isDev from "electron-is-dev";
import path from "path";

const pathModule = require("node:path");

export function registerWindowsIpc({
  selectWindow,
  notebookWindows,
  store,
}: {
  selectWindow: Electron.BrowserWindow | null;
  notebookWindows: Record<string, Electron.BrowserWindow>;
  store: AppStateStore;
}) {
  ipcMain.handle("openNotebookSelector", (event, { page }: { page?: string }) => {
    if (selectWindow && !selectWindow.isDestroyed()) {
      if (isDev) {
        selectWindow.loadURL("http://localhost:5173/notebook_selector.html" + (page ? "?page=" + page : ""));
      } else {
        alert(path.join(__dirname, "app", "notebook_selector.html"))
        selectWindow.loadFile(path.join(__dirname, "app", "notebook_selector.html"), {
          query: page ? { page } : undefined,
        });
      }
      selectWindow.focus();
      return;
    } else {
      selectWindow = createNotebookSelectorWindow({ page });
    }
  });

  ipcMain.handle("openNotebook", (event, id: string) => {
    if (notebookWindows[id] && !notebookWindows[id].isDestroyed()) {
      notebookWindows[id].focus();
      return;
    } else {
      notebookWindows[id] = createMainWindow({ store: store, notebookId: id });
      store.set("activeNotebooks", [...store.get("activeNotebooks"), id]);
    }
  });
  ipcMain.handle("closeNotebook", (event, id: string) => {
    if (notebookWindows[id] && !notebookWindows[id].isDestroyed()) {
      notebookWindows[id].close();
      delete notebookWindows[id];
      const activeNotebooks = store.get("activeNotebooks") || [];
      store.set(
        "activeNotebooks",
        activeNotebooks.filter((n: string) => n !== id),
      );
    }
  });
}
