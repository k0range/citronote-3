import type { FsEntry, NotebookFsMgr, NotebookLocationHandle } from "core/notebooks";

function splitPath(path: string): string[] {
  const parts = path.split("/").filter(p => p.length > 0);
  const stack: string[] = [];

  for (const part of parts) {
    if (part === ".") {
      continue;
    } else if (part === "..") {
      if (stack.length > 0) {
        stack.pop();
      }
    } else {
      stack.push(part);
    }
  }

  return stack;
}

async function getHandleByName(dir: FileSystemDirectoryHandle, name: string): Promise<FileSystemDirectoryHandle | FileSystemFileHandle | null> {
  try {
    return await dir.getFileHandle(name, { create: false });
  } catch (e) {
    if ((e as DOMException).name !== "TypeMismatchError") throw e;
  }

  try {
    return await dir.getDirectoryHandle(name, { create: false });
  } catch (e) {
    if ((e as DOMException).name !== "TypeMismatchError") throw e;
  }

  return null;
}

async function pathToHandle(rootFsHandle: FileSystemDirectoryHandle, path: string): Promise<FileSystemFileHandle | FileSystemDirectoryHandle | null> {
  const parts = splitPath(path);  

  let currentHandle: FileSystemDirectoryHandle | FileSystemFileHandle = rootFsHandle;
  for (const part of parts) {
    if (currentHandle.kind === "directory") {
      const handle = await getHandleByName(currentHandle, part)

      if (!handle) return null;
      if (handle.kind === "file") {
        if (part !== parts[parts.length - 1]) {
          // 中間にファイルがあった場合は無効なパス
          return null;
        }
      }
      currentHandle = handle;
    } 
  }

  return currentHandle;
}

async function getParentHandleAndName(rootFsHandle: FileSystemDirectoryHandle, path: string): Promise<{ parentHandle: FileSystemDirectoryHandle; fileName: string }> {
  const parts = splitPath(path);
  if (parts.length === 0) {
    throw new Error("Invalid path");
  }

  const fileName = parts.pop()!;
  const dirPath = parts.join("/");
  const dirHandle = await pathToHandle(rootFsHandle, dirPath);
  if (!dirHandle) {
    throw new Error(`Parent directory not found: ${dirPath}`);
  }
  if (dirHandle.kind !== "directory") {
    throw new Error(`Parent path is not a directory: ${dirPath}`);
  }

  return {
    parentHandle: dirHandle,
    fileName: fileName,
  }
}

async function copyDirectoryRecursive(
  srcDirHandle: FileSystemDirectoryHandle,
  destDirHandle: FileSystemDirectoryHandle
) {
  for await (const [name, handle] of srcDirHandle.entries()) {
    if (handle.kind === "file") {
      const file = await handle.getFile();
      const newFileHandle = await destDirHandle.getFileHandle(name, { create: true });
      const writable = await newFileHandle.createWritable();
      await writable.write(await file.arrayBuffer());
      await writable.close();
    } else if (handle.kind === "directory") {
      const newSubDirHandle = await destDirHandle.getDirectoryHandle(name, { create: true });
      await copyDirectoryRecursive(handle, newSubDirHandle);
    }
  }
}

export class BrowserNotebookFsMgr implements NotebookFsMgr {
  private fsHandle: FileSystemDirectoryHandle;

  constructor(locationHandle: NotebookLocationHandle) {
    if (locationHandle.kind !== "browser") {
      throw new Error("Invalid locationHandle for BrowserNotebookFsMgr");
    }
    this.fsHandle = locationHandle.handle;
  }

  async stat(path: string): Promise<FsEntry | null> {
    const handle = await pathToHandle(this.fsHandle, path);
    if (!handle) {
      return null;
    }

    return {
      path: path,
      name: handle.name,
      isDirectory: handle.kind === "directory",
      sizeBytes: handle.kind === "file" ? (await handle.getFile()).size : undefined,
      lastModified: handle.kind === "file" ? (await handle.getFile()).lastModified ? new Date((await handle.getFile()).lastModified) : undefined : undefined,
    };
  }

  async readDir(path: string): Promise<FsEntry[]> {
    const handle = await pathToHandle(this.fsHandle, path);
    if (!handle) {
      throw new Error(`Directory not found: ${path}`);
    }
    if (handle.kind !== "directory") {
      throw new Error(`Not a directory: ${path}`);
    }

    const entries: FsEntry[] = [];
    for await (const [name, entryHandle] of handle.entries()) {
      entries.push({
        path: path + (path === "/" ? "" : "/") + name,
        name: name,
        isDirectory: entryHandle.kind === "directory",
        sizeBytes: entryHandle.kind === "file" ? (await entryHandle.getFile()).size : undefined,
        lastModified: entryHandle.kind === "file" ? (await entryHandle.getFile()).lastModified ? new Date((await entryHandle.getFile()).lastModified) : undefined : undefined,
      });
    }

    return entries;
  }

  async readFile(path: string): Promise<Uint8Array> {
    const handle = await pathToHandle(this.fsHandle, path);
    if (!handle) {
      throw new Error(`File not found: ${path}`);
    }
    if (handle.kind !== "file") {
      throw new Error(`Not a file: ${path}`);
    }
    const file = await handle.getFile();
    const arrayBuffer = await file.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  async writeFile(path: string, data: Uint8Array | string, options?: { recursive?: boolean }): Promise<void> {
    const { parentHandle, fileName } = await getParentHandleAndName(this.fsHandle, path);

    const fileHandle = await parentHandle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    if (data instanceof Uint8Array) {
      await writable.write(new Uint8Array(data));
    } else {
      await writable.write(data);
    }
    await writable.close();
  }

  async delete(path: string, options?: { recursive?: boolean }): Promise<void> {
    const { parentHandle, fileName } = await getParentHandleAndName(this.fsHandle, path);

    await parentHandle.removeEntry(fileName, { recursive: options?.recursive || false });
  }

  async mkdir(path: string, options?: { recursive?: boolean }): Promise<void> {
    const { parentHandle, fileName } = await getParentHandleAndName(this.fsHandle, path);

    await parentHandle.getDirectoryHandle(fileName, { create: true });
  }

  async rename(oldPath: string, newPath: string): Promise<void> { // dir/file共通にスべき？haya
    const oldHandle = await pathToHandle(this.fsHandle, oldPath);
    if (!oldHandle) {
      throw new Error(`Source path not found: ${oldPath}`);
    }
    if (oldHandle.kind === "file") {
      // 古いファイルを取得
      const oldFile = await oldHandle.getFile();

      // 新しいファイルの親ディレクトリを取得
      const { parentHandle, fileName } = await getParentHandleAndName(this.fsHandle, newPath);

      // 新しいファイルを作成
      const newHandle = await parentHandle.getFileHandle(fileName, { create: true });
      const writable = await newHandle.createWritable();
      await writable.write(await oldFile.arrayBuffer());
      await writable.close();

      // 古いファイルを削除
      const { parentHandle: oldParentHandle, fileName: oldFileName } = await getParentHandleAndName(this.fsHandle, oldPath);
      await oldParentHandle.removeEntry(oldFileName);
    } else if (oldHandle.kind === "directory") {
      const { parentHandle: newParent, fileName: newDirName } = await getParentHandleAndName(this.fsHandle, newPath);
      const newDirHandle = await newParent.getDirectoryHandle(newDirName, { create: true });

      // 再帰コピー
      await copyDirectoryRecursive(oldHandle, newDirHandle);

      // 古いディレクトリを削除（中身ごと）
      const { parentHandle: oldParent, fileName: oldDirName } = await getParentHandleAndName(this.fsHandle, oldPath);
      await oldParent.removeEntry(oldDirName, { recursive: true });
    }
  }
}
