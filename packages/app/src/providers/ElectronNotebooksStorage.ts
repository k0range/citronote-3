import type { NotebooksStorage, NotebookMetadata } from "core/notebooks";

export class ElectronNotebooksStorage implements NotebooksStorage {
  async getNotebook(id: string) {
    return await window.api.notebooks.getById(id) || null;
  }
  async fetchNotebooks() {
    return await window.api.notebooks.listAll();
  }
  async getNotebookAtLocation(location: NotebookMetadata["locationHandle"]) {
    if (location.kind !== "electron") {
      throw new Error("Invalid locationHandle for ElectronNotebooksStorage");
    }
    const allNotebooks = await window.api.notebooks.listAll();

    for (const nb of allNotebooks) {
      if (nb.locationHandle.kind !== "electron") continue;
      if (await location.path === nb.locationHandle.path) {
        return nb;
      }
    }
    return null;
  }
  async addNotebook(notebook: NotebookMetadata) {
    await window.api.notebooks.add(notebook);
  }
  async removeNotebook(id: string) {
    await window.api.notebooks.remove(id);
  }
  async updateNotebook(notebook: NotebookMetadata) {
    await window.api.notebooks.update(notebook);
  }
}
