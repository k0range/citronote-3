import { create } from "zustand";
import type { NoteMetadata } from "core/notes";

type NotesListState = {
  notes: NoteMetadata[];
  setNotes: (notes: NoteMetadata[]) => void;
  addNote: (note: NoteMetadata) => void;
  updateNote: (path: string, patch: Partial<NoteMetadata>) => void;
  removeNote: (path: string) => void;
  clearNotes: () => void;
  findByPath: (path: string) => NoteMetadata | undefined;
};


export const useNotesListStore = create<NotesListState>((set, get) => ({
  notes: [],
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((s) => ({ notes: [note, ...s.notes.filter((n) => n.path !== note.path)] })),
  updateNote: (path, patch) => set((s) => ({ notes: s.notes.map((n) => (n.path === path ? { ...n, ...patch } : n)) })),
  removeNote: (path) => set((s) => ({ notes: s.notes.filter((n) => n.path !== path) })),
  clearNotes: () => set({ notes: [] }),
  findByPath: (path) => get().notes.find((n) => n.path === path),
}));
