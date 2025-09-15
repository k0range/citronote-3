import type { BaseNote, NoteMetadata } from "core/notes";
import { create } from "zustand";

type CurrentNoteStore = {
  note: BaseNote | null;
  noteMetadata: NoteMetadata | null;
  set: ({ note, noteMetadata }: { note: BaseNote | null; noteMetadata: NoteMetadata | null }) => void;
};

const useCurrentNoteStore = create<CurrentNoteStore>((set) => ({
  noteMetadata: null,
  note: null,
  set({ note, noteMetadata }) {
    set({ note, noteMetadata });
  }
}));

export default useCurrentNoteStore;
