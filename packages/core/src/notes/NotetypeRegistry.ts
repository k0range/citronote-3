import { NotebookFsMgr } from "../notebooks/types";
import { NoteMetadata, Notetype, NotetypeInfo } from "./types";

export class NotetypeRegistry {
  private notetypes = new Map<string, Notetype>();

  register(notetype: Notetype) {
    if (this.notetypes.has(notetype.info.id)) {
      throw new Error(`Notetype with id ${notetype.info.id} is already registered.`);
    }

    this.notetypes.set(notetype.info.id, notetype);
  }

  listInfos(): NotetypeInfo[] {
    return Array.from(this.notetypes.values()).map((nt) => nt.info);
  }

  get(id: string): Notetype | undefined {
    return this.notetypes.get(id);
  }

  createNoteClass(metadata: NoteMetadata, fsMgr: NotebookFsMgr) {
    const notetype = this.get(metadata.notetype.id);
    if (!notetype) {
      throw new Error(`Notetype with id ${metadata.notetype.id} is not registered.`);
    }

    const note = new notetype.noteClass(metadata, fsMgr);
    return note;
  }
}
// 明日は試しにScrap作る