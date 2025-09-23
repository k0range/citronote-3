import type { AppStateStore } from "../store";

import { registerFsIpc } from "./fs";
import { registerNotebooksIpc } from "./notebooks";
import { registerWindowsIpc } from "./windows";

export function registerIpc({
  selectWindow,
  notebookWindows,
  store,
}: {
  selectWindow: Electron.BrowserWindow | null;
  notebookWindows: Record<string, Electron.BrowserWindow>;
  store: AppStateStore;
}) {
  registerFsIpc({ store });
  registerNotebooksIpc({ store });
  registerWindowsIpc({ selectWindow, notebookWindows, store });
}
