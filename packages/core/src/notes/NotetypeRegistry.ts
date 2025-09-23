import type { NotebookFsMgr } from "../notebooks/types";
import type { NoteMetadata, NotetypeInfo } from "./types";
import type { Notetype } from "./types";

export class NotetypeRegistry {
  private notetypes = new Map<string, Notetype>();

  reset() {
    this.notetypes.clear();
  }
 
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

  extToNotetype(ext: string): { notetype: Notetype | undefined; isMain: boolean } {
    let additionalType: Notetype | undefined = undefined;
    
    for (const notetype of this.notetypes.values()) {
      if (notetype.info.mainExt === ext) {
        return { notetype, isMain: true };
      }
      if (notetype.info.addtionalExts?.includes(ext)) {
        additionalType = notetype;
      }
    }
    
    return { notetype: additionalType, isMain: false };
  }

  createNoteClass(metadata: NoteMetadata, fsMgr: NotebookFsMgr) {
    if (!metadata.notetype) {
      return null;
    }

    const notetype = this.get(metadata.notetype.id);
    if (!notetype) {
      throw new Error(`Notetype with id ${metadata.notetype.id} is not registered.`);
    }

    const note = new notetype.noteClass(metadata, fsMgr);
    return note;
  }
}

//export const notetypeRegistry = new NotetypeRegistry(); // notebookごとにinstance持つ？
