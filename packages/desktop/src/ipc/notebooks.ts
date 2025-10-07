import { ipcMain } from "electron";

import { NotebookMetadata } from "core/notebooks";

import type { AppStateStore } from "../store";

export function registerNotebooksIpc({ store }: { store: AppStateStore }) {
  ipcMain.handle("notebooks:getById", (event, id: string) => {
    return (
      store.get("notebooks").find((n: NotebookMetadata) => n.id === id) || null
    );
  });
  ipcMain.handle("notebooks:listAll", () => {
    return store.get("notebooks");
  });
  ipcMain.handle("notebooks:add", (event, notebook: NotebookMetadata) => {
    store.set("notebooks", [...store.get("notebooks"), notebook]);
  });
  ipcMain.handle("notebooks:remove", (event, id: string) => {
    const notebooks = store.get("notebooks");
    const updatedNotebooks = notebooks.filter(
      (n: NotebookMetadata) => n.id !== id,
    );
    store.set("notebooks", updatedNotebooks);
  });
  ipcMain.handle("notebooks:update", (event, notebook: NotebookMetadata) => {
    const notebooks = store.get("notebooks");
    const updatedNotebooks = notebooks.map((n: NotebookMetadata) =>
      n.id === notebook.id ? notebook : n,
    );
    store.set("notebooks", updatedNotebooks);
  });
}
