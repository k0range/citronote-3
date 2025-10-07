import type { Notebook } from "core/notebooks";
import { create } from "zustand";

export interface FolderDisplay {
  iconUrl: string | undefined;
  name: string;
  path: string;
  isOpen: boolean;
  childrenExists: boolean;
  children: FolderDisplay[] | null;
}

type FolderTreeState = {
  root: FolderDisplay | null;
  setRoot: (root: FolderDisplay | null) => void;
  refetchFolder: (notebook: Notebook) => void;
  setFolder: (path: string, patch: Partial<FolderDisplay>) => void;
  removeFolder: (path: string) => void;
};

function updateFolder(
  folder: FolderDisplay,
  path: string,
  patch: Partial<FolderDisplay>
): FolderDisplay {
  if (folder.path === path) {
    return { ...folder, ...patch };
  }

  if (folder.children) {
    return {
      ...folder,
      children: folder.children.map((child) =>
        updateFolder(child, path, patch)
      ),
    };
  }

  return folder;
}

function removeFolder(
  folder: FolderDisplay,
  targetPath: string
): FolderDisplay | null {
  if (folder.children) {
    const filteredChildren = folder.children
      .map((child) => removeFolder(child, targetPath))
      .filter((child): child is FolderDisplay => child !== null);
    return { ...folder, children: filteredChildren };
  }
  if (folder.path === targetPath) {
    return null;
  }
  return folder;
}

const useFolderTreeStore = create<FolderTreeState>((set, get) => ({
  root: null,

  setRoot: (root) => set({ root }),

  refetchFolder: (notebook) => {
    notebook.listFolders("/").then((folders) => {
      const children: FolderDisplay[] = folders.map((f) => ({
        name: f.name,
        path: f.path,
        iconUrl: f.iconUrl,
        isOpen: false,
        childrenExists: f.childrenExists,
        children: null,
      }))
      set({ root: {
        name: notebook.name,
        path: "/",
        iconUrl: notebook.iconUrl,
        isOpen: true,
        childrenExists: true,
        children: children
      }});
    })
  },

  setFolder: (path, patch) => {
    const root = get().root;
    if (!root) return;

    const updated = updateFolder(root, path, patch);
    set({ root: updated });
  },

  removeFolder: (path) => {
    const root = get().root;
    if (!root) return;

    const updated = removeFolder(root, path);
    set({ root: updated });
  }
}));

export default useFolderTreeStore;
