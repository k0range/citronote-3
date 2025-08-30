import type { FsEntry, NotebookFsMgr, NotebookMetadata, NotebookLocationHandle, Folder } from "./types";

async function readDirRecursive(
  fs: NotebookFsMgr,
  path: string
): Promise<FsEntry[]> {
  const entries = await fs.readDir(path);
  const result: FsEntry[] = [];

  for (const entry of entries) {
    result.push(entry);
    if (entry.kind === "directory") {
      const children = await readDirRecursive(fs, entry.path);
      result.push(...children);
    }
  }
  return result;
}

function dirToFolder(dir: FsEntry): Folder {
  let children: Folder[] | null = null;
  if (dir.children) {
    children = dir.children.map((child) => {
      return dirToFolder(child);
    });
  }
  
  return ({
    name: dir.name,
    path: dir.path,
    children: children || [],
  })
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
    fsMgr: NotebookFsMgr
  }) {
    this.id = metadata.id;
    this.name = metadata.name;
    this.iconUrl = metadata.iconUrl;
    this.location = metadata.location; // これらは保存するだけで、プロバイダ切り替えには使わない
    this.locationHandle = metadata.locationHandle;

    this.fsMgr = fsMgr;
  }

  async listFolders(path: string) {
    let folders: Folder[] = [];
    const dirs = await readDirRecursive(this.fsMgr, path);
    for (const dir of dirs) {
      folders.push(dirToFolder(dir))
    }
    return folders;
  }

  async newFolder(path: string) {
    await this.fsMgr.mkdir(path);
  }
}