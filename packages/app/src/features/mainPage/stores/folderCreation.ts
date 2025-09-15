import { create } from "zustand";

type FolderCreationStore = {
  parentPath: string | null;
  setParentPath: (folder: string | null) => void;
  reset: () => void;
};

const useFolderCreationStore = create<FolderCreationStore>((set) => ({
  parentPath: null,
  setParentPath(parentPath) {
    set({ parentPath });
  },
  reset() {
    set({ parentPath: null });
  }
}));

export default useFolderCreationStore;
