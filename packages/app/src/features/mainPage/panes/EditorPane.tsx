import { FileXIcon } from "lucide-react";

import Icon from "@/components/Icon";

import Header from "../components/Header";
import useCurrentNoteStore from "../stores/currentNote";
import { notetypeRegistry } from "core/notes";
import { useMemo, useRef, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useNotesListStore } from "../stores/notesList";

export default function EditorPane() {
  const noteMetadata = useCurrentNoteStore((state) => state.noteMetadata);
  const note = useCurrentNoteStore((state) => state.note);
  const noteListStore = useNotesListStore((state) => state);

  const [editorCompFor, setEditorCompFor] = useState<string | null>(null);

  const paneRef = useRef<HTMLDivElement>(null);

  const editor = useMemo(() => {
    if (note?.metadata?.notetype) {
      const notetype = notetypeRegistry.get(note.metadata.notetype.id);
      if (notetype && notetype.editor?.app) {
        setEditorCompFor(note.metadata.notetype.id);
        return notetype.editor.app;
      }
    }
    return null;
  }, [note?.metadata]);

  return (
    <div className="flex-grow bg-background-0 flex flex-col min-w-0" ref={paneRef}>
      <Header></Header>
      <div className="overflow-y-auto h-full relative">
        <div className="h-full flex flex-col">
          <div className="mx-auto w-full pt-8 flex flex-col" style={{
            maxWidth: "min(56rem, 100% - 8rem)"
          }}>
            { noteMetadata && (
              <>
                <Icon
                  icon={noteMetadata?.notetype?.ui.icon || {
                    type: "lucide",
                    name: "FileQuestion",
                  }}
                  className="absolute -translate-x-8 mr-2 h-5 w-5 mt-1.75"
                  style={{ color: noteMetadata?.notetype?.ui.color || "#999" }}
                />
                <h1 className="text-2xl mb-2">{noteMetadata?.name}</h1>
              </>
            ) }
          </div>
          { noteMetadata && (
            <div className="flex-grow min-h-0" style={{
              display: "grid",
              gridTemplateColumns: "1fr min(56rem, 100% - 8rem) 1fr"
            }} >
              {(note && editor?.component && editorCompFor === note.metadata.notetype?.id) ?
                <ErrorBoundary>
                  <editor.component
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
                <div className="text-center text-color bg-background-2 border border-border rounded-lg py-5 select-none">
                  <FileXIcon className="mx-auto w-7 h-7 mb-2 opacity-50" />
                  <div className="opacity-80">Citronote で開けないファイルです</div>
                  {/*<Button className="mt-1.5">外部アプリで開く</Button>*/}
                </div>
              ): null}
            </div>
          ) }
        </div>
      </div>
    </div>
  );
}
