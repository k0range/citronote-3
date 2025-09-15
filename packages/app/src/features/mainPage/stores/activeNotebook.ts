import type { Notebook } from "core/notebooks";
import { create } from "zustand";

type ActiveNotebookStore = {
  notebook: Notebook | null;
  setNotebook: (notebook: Notebook | null) => void;
};

const useActiveNotebookStore = create<ActiveNotebookStore>((set) => ({
  notebook: null,
  setNotebook(notebook) {
    set({ notebook });
  },
}));

export default useActiveNotebookStore;
