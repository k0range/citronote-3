import { Notebook } from "./Notebook";
import { NotebookFsMgr, NotebookMetadata, NotebookStorage } from "./types";

export class NotebooksManager {
  private storage: NotebookStorage;
  private localFsMgr: NotebookFsMgr;

  constructor({ storage, localFsMgr }: {
    storage: NotebookStorage,
    localFsMgr: NotebookFsMgr
  }) { // memo: localFsMgrを定義する側ではシングルトンとしてexportする
    this.storage = storage;
    this.localFsMgr = localFsMgr;
  }

  async getNotebook(id: string) {
    const metadata = await this.storage.getNotebook(id)

    if (!metadata) return null;

    let fsMgr: NotebookFsMgr | null = null;
    if (metadata.location === "local") {
      fsMgr = this.localFsMgr
    } else if (metadata.location === "cloud") {
      throw new Error("Cloud storage is not implemented yet");
    }

    const notebook = new Notebook({
      metadata,
      fsMgr: fsMgr!,
    });

    return notebook;
  }

  async fetchNotebooks() {
    const metadatas = await this.storage.fetchNotebooks();

    return metadatas
  }

  async addNotebook({ name, location, locationHandle }: {
    name: string;
    location: "local" | "cloud";
    locationHandle: NotebookMetadata["locationHandle"];
  }) {
    await this.storage.addNotebook({
      id: crypto.randomUUID(),
      name,
      location,
      locationHandle,
    });
  }
}
