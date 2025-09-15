import { create } from "zustand";

type FolderCreationStore = {
  parentPath: string | null;
  setParentPath: (folder: string | null) => void;
};

const useFolderCreationStore = create<FolderCreationStore>((set) => ({
  parentPath: null,
  setParentPath(parentPath) {
    set({ parentPath });
  }
}));

export default useFolderCreationStore;
