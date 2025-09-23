import { openIndexedDb } from "@/openIndexedDb";
import type { NotebooksStorage, NotebookMetadata } from "core/notebooks";

const db = await openIndexedDb();

export class BrowserNotebooksStorage implements NotebooksStorage {
  async getNotebook(id: string) {
    return await db.get("notebooks", id) || null;
  }
  async fetchNotebooks() {
    return await db.getAll("notebooks");
  }
  async getNotebookAtLocation(location: NotebookMetadata["locationHandle"]) {
    if (location.kind !== "browser") {
      throw new Error("Invalid locationHandle for BrowserNotebooksStorage");
    }
    const allNotebooks = await this.fetchNotebooks();

    for (const nb of allNotebooks) {
      if (nb.locationHandle.kind !== "browser") continue;
      if (await location.handle.isSameEntry(nb.locationHandle.handle)) {
        return nb;
      }
    }
    return null;
  }
  async addNotebook(notebook: NotebookMetadata) {
    await db.add("notebooks", notebook);
  }
  async removeNotebook(id: string) {
    await db.delete("notebooks", id);
  }
  async updateNotebook(notebook: NotebookMetadata) {
    await db.put("notebooks", notebook);
  }
}
