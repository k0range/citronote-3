import { contextBridge, ipcRenderer } from "electron";
import type { NotebookLocationHandle, NotebookMetadata } from "core/notebooks";

export const nativeApi = {
  notebooks: {
    getById: (id: string) => ipcRenderer.invoke("notebooks:getById", id),
    listAll: () => ipcRenderer.invoke("notebooks:listAll"),
    add: (notebook: NotebookMetadata) =>
      ipcRenderer.invoke("notebooks:add", notebook),
    remove: (id: string) => ipcRenderer.invoke("notebooks:remove", id),
    update: (notebook: NotebookMetadata) =>
      ipcRenderer.invoke("notebooks:update", notebook),
  },
  fs: {
    stat: (locationHandle: NotebookLocationHandle, path: string) => ipcRenderer.invoke("fs:stat", locationHandle, path),
    readDir: (locationHandle: NotebookLocationHandle, path: string) => ipcRenderer.invoke("fs:readDir", locationHandle, path),
    readFile: (locationHandle: NotebookLocationHandle, path: string) => ipcRenderer.invoke("fs:readFile", locationHandle, path),
    writeFile: (locationHandle: NotebookLocationHandle, path: string, data: Uint8Array | string, options?: { recursive?: boolean }) =>
      ipcRenderer.invoke("fs:writeFile", locationHandle, path, data, options),
    delete: (locationHandle: NotebookLocationHandle, path: string, options?: { recursive?: boolean }) =>
      ipcRenderer.invoke("fs:delete", locationHandle, path, options),
    mkdir: (locationHandle: NotebookLocationHandle, path: string, options?: { recursive?: boolean }) =>
      ipcRenderer.invoke("fs:mkdir", locationHandle, path, options),
    rename: (locationHandle: NotebookLocationHandle, oldPath: string, newPath: string) =>
      ipcRenderer.invoke("fs:rename", locationHandle, oldPath, newPath),
  },
  openNotebook: (id: string) => ipcRenderer.invoke("openNotebook", id),
  openNotebookSelector: ({ page }: { page?: string } = {}) => ipcRenderer.invoke("openNotebookSelector", { page }),
  closeWindow: () => ipcRenderer.invoke("closeWindow"),
  checkPath: (
    path: string,
  ): Promise<"folder-exists" | "file-exists" | "not-found" | "invalid"> =>
    ipcRenderer.invoke("checkPath", path),
  selectFolder: () => ipcRenderer.invoke("selectFolder"),
  onWindowFocusChanged: (callback: (focused: boolean) => void) =>
    ipcRenderer.on("windowFocusChanged", (_: any, focused: boolean) =>
      callback(focused),
    ),
};

contextBridge.exposeInMainWorld("api", nativeApi);

export type NativeApi = typeof nativeApi;
