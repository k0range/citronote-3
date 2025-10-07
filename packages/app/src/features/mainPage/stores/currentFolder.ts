import { create } from "zustand";

type CurrentFolderStore = {
  folderPath: string | null;
  setFolderPath: (folder: string | null) => void;
};

const useCurrentFolderStore = create<CurrentFolderStore>((set) => ({
  folderPath: null,
  setFolderPath(folderPath) {
    set({ folderPath });
  },
}));

export default useCurrentFolderStore;
