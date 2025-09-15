import type { Folder } from "core/notebooks";
import { create } from "zustand";

type CurrentFolderStore = {
  folder: Folder | null;
  setFolder: (folder: Folder | null) => void;
};

const useCurrentFolderStore = create<CurrentFolderStore>((set) => ({
  folder: null,
  setFolder(folder) {
    set({ folder });
  },
}));

export default useCurrentFolderStore;
