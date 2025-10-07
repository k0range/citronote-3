import { NbInitOptions, Notebook } from "./Notebook";
import type { NotebookFsMgrClass, NotebookMetadata, NotebooksStorage } from "./types";

export class NotebooksManager {
  private storage: NotebooksStorage;
  private localFsMgr: NotebookFsMgrClass;

  constructor({ storage, localFsMgr }: {
    storage: NotebooksStorage,
    localFsMgr: NotebookFsMgrClass
  }) { // memo: localFsMgrを定義する側ではシングルトンとしてexportする
    this.storage = storage;
    this.localFsMgr = localFsMgr;
  }

  async getNotebook(id: string, nbInitOptions: NbInitOptions) {
    const metadata = await this.storage.getNotebook(id)

    if (!metadata) return null;

    let fsMgr: NotebookFsMgrClass | null = null;
    if (metadata.location === "local") {
      fsMgr = this.localFsMgr
    } else if (metadata.location === "cloud") {
      throw new Error("Cloud storage is not implemented yet");
    }

    const notebook = new Notebook({
      metadata,
      fsMgr: fsMgr!,
    });
    await notebook.init(nbInitOptions)

    return notebook;
  }

  async fetchNotebooks() {
    const metadatas = await this.storage.fetchNotebooks(); // storageに保存するときにiconも

    return metadatas
  }

  async getNotebookAtLocation(location: NotebookMetadata["locationHandle"]) {
    return await this.storage.getNotebookAtLocation(location);
  }

  async addNotebook({ name, location, locationHandle }: {
    name: string;
    location: "local" | "cloud";
    locationHandle: NotebookMetadata["locationHandle"];
  }) {
    if (await this.getNotebookAtLocation(locationHandle)) {
      throw new Error("Notebook already exists at this location");
    }

    const metadata: NotebookMetadata = {
      id: crypto.randomUUID(),
      name,
      location,
      locationHandle,
    };

    await this.storage.addNotebook(metadata);

    return metadata
  }

  async updateNotebook(notebook: NotebookMetadata) {
    await this.storage.updateNotebook(notebook);
  }

  async removeNotebook(id: string) {
    await this.storage.removeNotebook(id);
  }
}
