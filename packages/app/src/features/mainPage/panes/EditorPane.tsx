import { FileXIcon, TrashIcon } from "lucide-react";

import { Icon, ErrorBoundary, Tooltip, Popover, MenuActionButton, showAlertDialog } from "ui";

import Header from "../components/Header";
import useCurrentNoteStore from "../stores/currentNote";
import { useMemo, useRef, useState } from "react";
import { useNotesListStore } from "../stores/notesList";
import HeaderIconButton from "../components/HeaderIconButton";
import { t } from "i18next";
import useActiveNotebookStore from "../stores/activeNotebook";

export default function EditorPane() {
  console.log("Render EditorPane");

  const notebook = useActiveNotebookStore((state) => state.notebook);

  const noteMetadata = useCurrentNoteStore((state) => state.noteMetadata);
  const note = useCurrentNoteStore((state) => state.note);
  const noteListStore = useNotesListStore((state) => state);

  const [editorCompFor, setEditorCompFor] = useState<string | null>(null);

  const paneRef = useRef<HTMLDivElement>(null);

  const editor = useMemo(() => {
    if (note?.metadata?.notetype && notebook) {
      const notetype = notebook.notetypeRegistry.get(note.metadata.notetype.id);
      if (notetype && notetype.editor?.app) {
        setEditorCompFor(note.metadata.notetype.id);
        return notetype.editor.app;
      }
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.metadata, note?.metadata?.notetype, notebook]);

  return (
    <div className="flex-grow bg-background-0 flex flex-col min-w-0 @container" ref={paneRef}>
      <Header>
        <div className="w-full flex justify-end gap-2">
          <Tooltip content="New Note">
            <Popover
              align="end"
              content={
                <Popover.Close asChild>
                  <MenuActionButton
                    icon={TrashIcon}
                    label={t("deleteNote")}
                    onClick={async () => {
                      const ans = await showAlertDialog({
                        text: t("deleteNote"),
                        description: t("deleteNoteConfirm"),
                        icon: {
                          type: "lucide",
                          name: "Trash",
                        },
                        buttons: [
                          { text: t("deleteNote"), variant: "primary", value: "confirm" },
                          { text: t("cancel"), variant: "text", value: "cancel" },
                        ]
                      })
                      if (ans === "confirm" && note) {
                        notebook?.deleteNote(noteMetadata!.path);
                        useCurrentNoteStore.getState().reset();
                        setEditorCompFor(null);
                        noteListStore.removeNote(noteMetadata!.path);
                      }
                    }}
                  />
                </Popover.Close>
              }
            >
              <HeaderIconButton
                icon={{
                  type: "lucide",
                  name: "Ellipsis",
                }}
              />
            </Popover>
          </Tooltip>
        </div>
      </Header>
      <div className="overflow-y-auto h-full relative">
        <div className="h-full flex flex-col">
          <div className="mx-auto w-full pt-8 flex flex-col" style={{
            maxWidth: "min(56rem, 100% - 3.5rem)"
          }}>
            { noteMetadata && (
              <div className="flex @[1000px]:block">
                <Icon
                  icon={noteMetadata?.notetype?.ui.icon || {
                    type: "lucide",
                    name: "FileQuestion",
                  }}
                  className="@[1000px]:absolute @[1000px]:-translate-x-8 mr-3 h-5 w-5 mt-1.75"
                  style={{ color: noteMetadata?.notetype?.ui.color || "#999" }}
                />
                <h1 className="text-2xl mb-2">{noteMetadata?.name}</h1>
              </div>
            ) }
          </div>
          { noteMetadata && (
            <div className="flex-grow min-h-0" style={{
              display: "grid",
              gridTemplateColumns: "1fr min(56rem, 100% - 3.5rem) 1fr"
            }} >
              {(note && editor?.component && editorCompFor === note.metadata.notetype?.id) ?
                <ErrorBoundary>
                  <editor.component
                    key={note.metadata.path}
                    note={note}
                    ctx={{
                      updateMetadata: (patch) => {
                        noteListStore.updateNote(note.metadata.path, patch);
                      }
                    }}
                  />
                </ErrorBoundary>
              : null}
              {!noteMetadata.notetype ? (
                <div className="col-[2]">
                  <div className="text-center text-color bg-background-2 border border-border rounded-lg py-5 select-none">
                    <FileXIcon className="mx-auto w-7 h-7 mb-2 opacity-50" />
                    <div className="opacity-80">{t("editorPane.unsupportedFile")}</div>
                    {/*<Button className="mt-1.5">外部アプリで開く</Button>*/}
                  </div>
                </div>
              ): null}
            </div>
          ) }
        </div>
      </div>
    </div>
  );
}
