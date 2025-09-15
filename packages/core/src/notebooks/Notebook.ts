import { NoteMetadata, notetypeRegistry } from "../notes";
import type { FsEntry, NotebookFsMgr, NotebookMetadata, NotebookLocationHandle, Folder, NotebookFsMgrClass } from "./types";

async function dirToFolder(dir: FsEntry, fsMgr: NotebookFsMgr): Promise<Folder> {
  // 更に子があるかを掘る
  const entries = await fsMgr.readDir(dir.path);

  // 1つでも子ディレクトリが見つかったら true
  const childrenExists = entries.some(e => e.isDirectory);

  return ({
    name: dir.name,
    path: dir.path,
    childrenExists: childrenExists,
  })
}

async function toNoteMetadata({ name, path, excerpt, fsMgr }: {
  name: string;
  path: string;
  excerpt?: boolean;
  fsMgr?: NotebookFsMgr;
}): Promise<NoteMetadata> {
  const lastDotIndex = name.lastIndexOf(".");
  const nameWithoutExt = lastDotIndex === -1 ? name : name.slice(0, lastDotIndex);
  const ext = lastDotIndex === -1 ? "" : name.slice(lastDotIndex + 1);
  
  const { notetype, isMain } = notetypeRegistry.extToNotetype(ext);

  const metadata: NoteMetadata = {
    name: nameWithoutExt,
    notetype: notetype?.info,
    path: path,
    extLabel: isMain ? undefined : ext.toUpperCase(),
  }

  if (excerpt && notetype && fsMgr) {
    const noteClass = notetypeRegistry.createNoteClass(metadata, fsMgr)
    if (noteClass && noteClass.getExcerpt) {
      metadata.excerpt = await noteClass.getExcerpt();
    }
  }
  
  return metadata
}

export class Notebook {
  id: string;
  name: string;
  iconUrl?: string;
  location: "local" | "cloud";
  locationHandle: NotebookLocationHandle;
  private fsMgr: NotebookFsMgr; // このNotebookのファイル操作に使用するプロバイダ

  constructor({ metadata, fsMgr }: {
    metadata: NotebookMetadata
    fsMgr: NotebookFsMgrClass
  }) {
    this.id = metadata.id;
    this.name = metadata.name;
    this.iconUrl = metadata.iconUrl;
    this.location = metadata.location; // これらは保存するだけで、プロバイダ切り替えには使わない
    this.locationHandle = metadata.locationHandle;

    this.fsMgr = new fsMgr(this.locationHandle);
  }

  async listFolders(path: string = "/") {
    let folders: Folder[] = [];
    const dirs = await this.fsMgr.readDir(path);
    for (const dir of dirs) {
      if (!dir.isDirectory) continue;
      folders.push(await dirToFolder(dir, this.fsMgr));
    }    
    return folders;
  }

  async newFolder(path: string) {
    await this.fsMgr.mkdir(path);
    const dir = await this.fsMgr.stat(path);
    return await dirToFolder(dir!, this.fsMgr);
  }

  async listNotes(path: string = "/", options: {
    excerpt?: boolean;
  }) {
    let notes: NoteMetadata[] = [];

    const files = await this.fsMgr.readDir(path);
    for (const file of files) {
      if (file.isDirectory) continue;
      
      const note = await toNoteMetadata({
        name: file.name,
        path: file.path,
        excerpt: options.excerpt,
        fsMgr: this.fsMgr,
      });

      notes.push(note)
    }

    return notes;
  }

  async newNote({ parentPath, noteName, notetypeId }: {
    parentPath: string,
    noteName?: string,
    notetypeId: string
  }) {
    const notetype = notetypeRegistry.get(notetypeId);
    if (!notetype) {
      throw new Error(`Unknown notetype: ${notetypeId}`);
    }
    if (!notetype.info.mainExt) {
      throw new Error(`Notetype has no main extension: ${notetypeId}`);
    }

    if (!noteName) {
      const defaultName = "新しいノート"
      noteName = defaultName;
      let addtionalNumber = 1;
      
      console.log("Checking existence for", parentPath + "/" + noteName + "." + notetype.info.mainExt);
      while (await this.fsMgr.stat(parentPath + "/" + noteName + "." + notetype.info.mainExt) !== null) {
        noteName = defaultName + ` ${addtionalNumber}`;
        addtionalNumber++;
      }
    } else {
      if (await this.fsMgr.stat(parentPath + "/" + noteName + "." + notetype.info.mainExt) !== null) {
        throw new Error(`Note already exists: ${noteName}`);
      }
    }

    const path = parentPath + "/" + (noteName || "Test") + "." + notetype.info.mainExt;

    await this.fsMgr.writeFile(path, notetype.template || "");

    return await toNoteMetadata({
      name: path.split("/").pop() || "",
      path,
      fsMgr: this.fsMgr,
    });
  }

  async openNote(metadata: NoteMetadata) {
    const note = notetypeRegistry.createNoteClass(metadata, this.fsMgr);
    if (note) {
      await note.init();
    }
    return note;
  }
}
