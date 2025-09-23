import { BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import { AppStateStore } from "../store";
import { NotebookMetadata } from "core/notebooks";
const path = require("node:path");

let activeWindows: Map<string, BrowserWindow> = new Map(); // notebookIdとBrowserWindow

export function createMainWindow({ store, notebookId }: { store: AppStateStore, notebookId: string }) {
  if (activeWindows.has(notebookId)) {
    const existingWindow = activeWindows.get(notebookId);
    if (existingWindow) {
      existingWindow.focus();
      return existingWindow;
    }
  }

  const nbs = store.get("notebooks")
  const nb = nbs.find((n) => n.id === notebookId);
  if (!nb) {
    throw new Error("Notebook not found: " + notebookId);
  }

  const window = new BrowserWindow({
    title: isDev ? "[DEV] " : "" + nb.name + " - Citronote",
    icon: path.join(__dirname, "assets", "icon.ico"),
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#212121ff",
      symbolColor: "#ffffff",
      height: 30,
    },
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
    width: 1200,
    height: 800,
  });

  if (isDev) {
    window.loadURL("http://localhost:5173/#/nb/" + notebookId);
  } else {
    window.loadFile(path.join(__dirname, "app", "index.html"), {
      hash: "/nb/" + notebookId,
    });
  }

  window.on("closed", () => {
    activeWindows.delete(notebookId);
  });

  // フォーカス時イベント
  window.on("focus", () => {
    window.webContents.send("windowFocusChanged", true);
  });

  // フォーカス外れた時イベント
  window.on("blur", () => {
    window.webContents.send("windowFocusChanged", false);
  });

  activeWindows.set(notebookId, window);

  return window;
}
