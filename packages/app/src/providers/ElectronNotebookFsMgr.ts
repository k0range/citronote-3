import type { FsEntry, NotebookFsMgr, NotebookLocationHandle } from "core/notebooks";

export class ElectronNotebookFsMgr implements NotebookFsMgr {
  locationHandle: NotebookLocationHandle;
  
  constructor(locationHandle: NotebookLocationHandle) {
    if (locationHandle.kind !== "electron") {
      throw new Error("Invalid locationHandle for ElectronNotebookFsMgr");
    }
    this.locationHandle = locationHandle;
  }

  async stat(path: string): Promise<FsEntry | null> {
    return await window.api.fs.stat(this.locationHandle, path);
  }

  async readDir(path: string): Promise<FsEntry[]> {
    return await window.api.fs.readDir(this.locationHandle, path);
  }

  async readFile(path: string): Promise<Uint8Array> {
    return await window.api.fs.readFile(this.locationHandle, path);
  }

  async writeFile(path: string, data: Uint8Array | string, options?: { recursive?: boolean }): Promise<void> {
    return await window.api.fs.writeFile(this.locationHandle, path, data, { recursive: options?.recursive || false });
  }

  async delete(path: string, options?: { recursive?: boolean }): Promise<void> {
    return await window.api.fs.delete(this.locationHandle, path, { recursive: options?.recursive || false });
  }

  async mkdir(path: string, options?: { recursive?: boolean }): Promise<void> {
    return await window.api.fs.mkdir(this.locationHandle, path, { recursive: options?.recursive || false });
  }

  async rename(oldPath: string, newPath: string): Promise<void> {
    return await window.api.fs.rename(this.locationHandle, oldPath, newPath);
  }
}
