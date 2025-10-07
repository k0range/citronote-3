import { create } from "zustand";

type FolderCreationStore = {
  parentPath: string | null;
  editingPath: string | null;
  setParentPath: (folder: string | null) => void;
  setEditingPath: (path: string | null) => void;
  reset: () => void;
};

const useFolderCreationStore = create<FolderCreationStore>((set) => ({
  parentPath: null,
  editingPath: null,
  setParentPath(parentPath) {
    set({ parentPath });
  },
  setEditingPath(editingPath) {
    set({ editingPath });
  },
  reset() {
    set({ parentPath: null, editingPath: null });
  }
}));

export default useFolderCreationStore;
