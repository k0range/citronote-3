import { useEffect } from "react";

import Header from "../components/Header";
import NoteComp from "../components/Note";
import { notetypeRegistry } from "core/notes";

import { PlusIcon } from "lucide-react";
import Popover from "@/components/Popover";
import Tooltip from "@/components/Tooltip";
import useCurrentFolderStore from "../stores/currentFolder";
import useActiveNotebookStore from "../stores/activeNotebook";

import Icon from "@/components/Icon";
import useCurrentNoteStore from "../stores/currentNote";
import { useNotesListStore } from "../stores/notesList";

export default function NotesPane() {
  const notetypes = notetypeRegistry.listInfos().filter((nt) => nt.mainExt);

  const notebook = useActiveNotebookStore((state) => state.notebook);
  const folder = useCurrentFolderStore((state) => state.folder);
  const currentNoteStore = useCurrentNoteStore((state) => state);
  const notes = useNotesListStore((state) => state);

  useEffect(() => {
    if (!folder || !notebook) {
      notes.setNotes([]);
      return;
    }

    notebook
      .listNotes(folder.path, {
        excerpt: true,
      })
      .then((n) => {
        notes.setNotes(n);
      })
      .catch((err) => {
        console.error("failed to list notes", err);
        notes.setNotes([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder?.path, notebook?.id]);

  return (
    <div className="w-[19rem] min-w-[19rem] h-full bg-background-2 border-r border-r-border flex flex-col">
      <Header>
        <div className="w-full flex justify-end gap-2">
          <Tooltip content="New Note">
            <Popover
              content={
                <div className="flex flex-col gap-1">
                  {notetypes.map((type, index) => (
                    <Popover.Close asChild key={index}>
                      <button
                        className="flex items-center gap-2 px-2.25 py-1 rounded-lg hover:bg-selected transition-colors duration-150 pr-4 cursor-pointer"
                        onClick={async () => {
                          if (!notebook || !folder) return;
                          const newNote = await notebook.newNote({
                            parentPath: folder.path,
                            notetypeId: type.id,
                          })

                          notes.addNote(newNote);

                          const noteClass = await notebook?.openNote(newNote);
                          currentNoteStore.set({ note: noteClass || null, noteMetadata: newNote });
                        }}
                      >
                        <Icon
                          icon={type.ui.icon}
                          className="w-5 h-5"
                          style={{ color: type.ui.color }}
                          size={20}
                        />
                        <div>{type.ui.displayName}</div>
                      </button>
                    </Popover.Close>
                  ))}
                </div>
              }
            >
              <button className="group hover:bg-selected transition-colors duration-150 p-1.25 cursor-pointer rounded-full">
                <PlusIcon className="h-5 w-5 text-color opacity-70 group-hover:opacity-80 transition-colors duration-150" />
              </button>
            </Popover>
          </Tooltip>
        </div>
      </Header>
      <div className="p-3 flex flex-col flex-grow">
        {notes.notes.map((note) => (
          <NoteComp
            key={note.path}
            selected={currentNoteStore.noteMetadata?.path === note.path}
            onClick={async () => {
              const noteClass = await notebook?.openNote(note);
              currentNoteStore.set({ note: noteClass || null, noteMetadata: note });
            }}
            note={{
              name: note.name,
              path: note.path,
              excerpt: note.excerpt,
              notetype: note.notetype,
              extLabel: note.extLabel,
            }}
          />
        ))}
      </div>
    </div>
  );
}
