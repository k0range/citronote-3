import { BrowserWindow, app, shell } from "electron";
import isDev from "electron-is-dev";
const path = require("node:path");

let window: BrowserWindow | null = null;

export function createNotebookSelectorWindow({ page }: { page?: string } = {}) {
  if (window) {
    window.focus();
    return window;
  }

  window = new BrowserWindow({
    title: isDev ? "[DEV] " : "" + "Citronote",
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
      webSecurity: false // 仮！！お知らせを読み込むため
    },
    resizable: false,
    maximizable: false,
    width: 800,
    height: 600,
  });

  if (isDev) {
    window.loadURL("http://localhost:5173/notebook_selector.html" + (page ? "?page=" + page : ""));
  } else {
    window.loadFile(path.join(__dirname, "app", "notebook_selector.html"), {
      query: page ? { page } : undefined,
    });
  }

  window.on("closed", () => {
    window = null;
  });

  // フォーカス時イベント
  window.on("focus", () => {
    window?.webContents.send("windowFocusChanged", true);
  });

  // フォーカス外れた時イベント
  window.on("blur", () => {
    window?.webContents.send("windowFocusChanged", false);
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' }; // アプリ内で新しいウィンドウを作らない
  });
  
  window.webContents.on('will-navigate', (event, url) => {
    if (url !== window?.webContents.getURL()) { // 自分のアプリ内ページ以外なら
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  return window;
}
