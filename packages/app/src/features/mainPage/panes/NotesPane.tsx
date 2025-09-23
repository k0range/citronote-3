import { useEffect } from "react";

import Header from "../components/Header";
import NoteComp from "../components/Note";

import useCurrentFolderStore from "../stores/currentFolder";
import useActiveNotebookStore from "../stores/activeNotebook";

import { Icon, Popover, Tooltip } from "ui";

import useCurrentNoteStore from "../stores/currentNote";
import { useNotesListStore } from "../stores/notesList";
import type { Icon as IconType } from "core/icons";
import HeaderIconButton from "../components/HeaderIconButton";
import { t } from "i18next";

function NotetypeItem({ icon, color, displayName, key, onClick }: {
  icon: IconType;
  color?: string;
  displayName: string;
  key: string | number;
  onClick?: () => void;
}) {
  return (
    <Popover.Close asChild key={key}>
      <button
        className="flex items-center gap-2 px-2.25 py-1 rounded-lg hover:bg-selected transition-colors duration-150 pr-4 cursor-pointer"
        onClick={onClick}>
        <Icon
          icon={icon}
          className="w-5 h-5"
          style={{ color: color || "var(--color-color)" }}
          size={20}
        />
        <div>{displayName}</div>
      </button>
    </Popover.Close>
  )
}

export default function NotesPane() {
  console.log("Render NotesPane");

  const notebook = useActiveNotebookStore((state) => state.notebook);
  const folderPath = useCurrentFolderStore((state) => state.folderPath);
  const currentNoteStore = useCurrentNoteStore((state) => state);
  const notes = useNotesListStore((state) => state);

  if (!notebook) {
    throw new Error("No active notebook found");
  }

  const notetypes = notebook.notetypeRegistry.listInfos().filter((nt) => nt.mainExt);

  useEffect(() => {
    if (!folderPath || !notebook) {
      notes.setNotes([]);
      return;
    }

    notebook
      .listNotes(folderPath, {
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
  }, [folderPath, notebook?.id]);

  return (
    <div className="w-[19rem] min-w-[19rem] h-full bg-background-2 border-r border-r-border flex flex-col">
      <Header>
        <div className="w-full flex justify-end gap-2">
          <Tooltip content={t("newNote")}>
            <Popover
              content={
                <div className="flex flex-col gap-1">
                  {notetypes.map((type, index) => (
                    <NotetypeItem
                      icon={type.ui.icon}
                      color={type.ui.color}
                      displayName={type.ui.displayName}
                      key={index}
                      onClick={async () => {
                        if (!notebook || !folderPath) return;
                        const newNote = await notebook.newNote({
                          parentPath: folderPath,
                          notetypeId: type.id,
                        })

                        notes.addNote(newNote);

                        const noteClass = await notebook?.openNote(newNote);
                        currentNoteStore.set({ note: noteClass || null, noteMetadata: newNote });
                      }}
                    />
                  ))}
                  <NotetypeItem
                    icon={{ type: "lucide", name: "Upload" }}
                    displayName={t("uploadFile")}
                    key="upload"
                    onClick={async () => {
                      const metadata = await notebook.uploadFile(folderPath!);
                      if (metadata) {
                        notes.addNote(metadata);
                      }
                    }}
                  />
                </div>
              }
            >
              <HeaderIconButton
                icon={{
                  type: "lucide",
                  name: "Plus",
                }}
              />
            </Popover>
          </Tooltip>
        </div>
      </Header>
      <div className="p-3 flex flex-col flex-grow min-h-0 overflow-y-auto">
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
