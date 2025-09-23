import type { BaseNote, NoteMetadata } from "core/notes";
import { create } from "zustand";
import useActiveNotebookStore from "./activeNotebook";

type CurrentNoteStore = {
  note: BaseNote | null;
  noteMetadata: NoteMetadata | null;
  set: ({ note, noteMetadata }: { note: BaseNote | null; noteMetadata: NoteMetadata | null }) => void;
  reset: () => void;
};

const useCurrentNoteStore = create<CurrentNoteStore>((set) => ({
  noteMetadata: null,
  note: null,
  set({ note, noteMetadata }) {
    set({ note, noteMetadata });
  },
  reset() {
    set({ note: null, noteMetadata: null });
  }
}));

useActiveNotebookStore.subscribe(() => {
  useCurrentNoteStore.getState().reset();
});

export default useCurrentNoteStore;
