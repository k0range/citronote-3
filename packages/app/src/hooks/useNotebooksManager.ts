import { appEnv } from "@/env";
import { NotebooksManager, type NotebookFsMgrClass, type NotebooksStorage } from "core/notebooks";
import { BrowserNotebooksStorage } from "@/providers/BrowserNotebooksStorage";
import { useRef } from "react";
import { BrowserNotebookFsMgr } from "@/providers/BrowserNotebookFsMgr";
import { ElectronNotebooksStorage } from "@/providers/ElectronNotebooksStorage";
import { ElectronNotebookFsMgr } from "@/providers/ElectronNotebookFsMgr";

export function useNotebooksManager() {
  const notebooksManager = useRef<NotebooksManager | null>(null);

  if (!notebooksManager.current) {
    let notebooksStorage: NotebooksStorage | null = null;
    let localFsMgr: NotebookFsMgrClass | null = null;

    if (appEnv.platform === "browser") {
      notebooksStorage = new BrowserNotebooksStorage();
      localFsMgr = BrowserNotebookFsMgr;
    } else if (appEnv.platform === "electron") {
      notebooksStorage = new ElectronNotebooksStorage();
      localFsMgr = ElectronNotebookFsMgr;
    } else {
      throw new Error("NotebooksStorage is not implemented for this platform: " + appEnv.platform);
    }

    notebooksManager.current = new NotebooksManager({
      storage: notebooksStorage,
      localFsMgr: localFsMgr,
    });
  }

  return notebooksManager.current;
}
