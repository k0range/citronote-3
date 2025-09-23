import { ipcMain, dialog } from "electron";
import * as fs from "fs/promises";
import * as pathModule from "node:path";

import { NotebookMetadata, Folder, FsEntry } from "core/notebooks";

import type { AppStateStore } from "../store";

export function registerFsIpc({ store }: { store: AppStateStore }) {
  ipcMain.handle("fs:stat", async (event, locationHandle: NotebookMetadata["locationHandle"], path: string): Promise<FsEntry | null> => {
    if (locationHandle.kind !== "electron") {
      throw new Error("Invalid locationHandle for fs:stat");
    }
    const osPath = pathModule.join(locationHandle.path, path);
    try {
      const stats = await fs.stat(osPath);
      return {
        name: osPath === "/" ? "/" : pathModule.basename(osPath),
        path: path,
        isDirectory: stats.isDirectory(),
        sizeBytes: stats.size,
        lastModified: stats.mtime ? new Date(stats.mtime) : undefined,
      }
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") {
        return null;
      }
      throw e;
    }
  });

  ipcMain.handle("fs:readDir", async (event, locationHandle: NotebookMetadata["locationHandle"], path: string): Promise<FsEntry[]> => {
    if (locationHandle.kind !== "electron") {
      throw new Error("Invalid locationHandle for fs:readDir");
    }
    const osPath = pathModule.join(locationHandle.path, path);
    const dirEntries = await fs.readdir(osPath, { withFileTypes: true });
    const entries: FsEntry[] = [];
    for (const dirent of dirEntries) {
      const entryPath = pathModule.join(osPath, dirent.name);
      const stats = await fs.stat(entryPath);
      entries.push({
        name: dirent.name,
        path: pathModule.join(path, dirent.name),
        isDirectory: dirent.isDirectory(),
        sizeBytes: dirent.isFile() ? stats.size : undefined,
        lastModified: stats.mtime ? new Date(stats.mtime) : undefined,
      });
    }
    return entries;
  });

  ipcMain.handle("fs:readFile", async (event, locationHandle: NotebookMetadata["locationHandle"], path: string): Promise<Uint8Array> => {
    if (locationHandle.kind !== "electron") {
      throw new Error("Invalid locationHandle for fs:readFile");
    }
    const osPath = pathModule.join(locationHandle.path, path);
    return new Uint8Array(await fs.readFile(osPath));
  });

  ipcMain.handle("fs:writeFile", async (event, locationHandle: NotebookMetadata["locationHandle"], path: string, data: Uint8Array | string, options?: { recursive?: boolean }): Promise<void> => {
    if (locationHandle.kind !== "electron") {
      throw new Error("Invalid locationHandle for fs:writeFile");
    }
    const osPath = pathModule.join(locationHandle.path, path);
    if (options?.recursive) {
      await fs.mkdir(pathModule.dirname(osPath), { recursive: true });
    }
    await fs.writeFile(osPath, data);
  });

  ipcMain.handle("fs:delete", async (event, locationHandle: NotebookMetadata["locationHandle"], path: string, options?: { recursive?: boolean }): Promise<void> => {
    if (locationHandle.kind !== "electron") {
      throw new Error("Invalid locationHandle for fs:delete");
    }
    const osPath = pathModule.join(locationHandle.path, path);
    await fs.rm(osPath, { recursive: options?.recursive || false, force: true });
  });

  ipcMain.handle("fs:mkdir", async (event, locationHandle: NotebookMetadata["locationHandle"], path: string, options?: { recursive?: boolean }): Promise<void> => {
    if (locationHandle.kind !== "electron") {
      throw new Error("Invalid locationHandle for fs:mkdir");
    }
    const osPath = pathModule.join(locationHandle.path, path);
    await fs.mkdir(osPath, { recursive: options?.recursive || false }); // mkdirかえって
  });

  ipcMain.handle("fs:rename", async (event, locationHandle: NotebookMetadata["locationHandle"], oldPath: string, newPath: string): Promise<void> => {
    if (locationHandle.kind !== "electron") {
      throw new Error("Invalid locationHandle for fs:rename");
    }
    const osOldPath = pathModule.join(locationHandle.path, oldPath);
    const osNewPath = pathModule.join(locationHandle.path, newPath);
    await fs.rename(osOldPath, osNewPath);
  });

  ipcMain.handle(
    "checkPath",
    async (
      event,
      p: string,
    ): Promise<"file-exists" | "folder-exists" | "not-found" | "invalid"> => {
      try {
        if (!p || typeof p !== "string" || !pathModule.isAbsolute(p)) {
          return "invalid";
        }

        const stats = await fs.stat(p).catch(() => null);
        if (!stats) {
          return "not-found";
        }

        if (stats.isFile()) return "file-exists";
        if (stats.isDirectory()) return "folder-exists";

        return "invalid";
      } catch {
        return "invalid";
      }
    },
  );
  ipcMain.handle("selectFolder", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  });
}
