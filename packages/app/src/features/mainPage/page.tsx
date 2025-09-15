import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { appEnv } from "@/env";

import Titlebar from "@/components/Titlebar";

import Sidebar from "./panes/Sidebar";
import NotesPane from "./panes/NotesPane";

import useActiveNotebookStore from "./stores/activeNotebook";
import { useNotebooksManager } from "@/hooks/useNotebooksManager";
import EditorPane from "./panes/EditorPane";

import { DndContext, DragOverlay } from "@dnd-kit/core";

export default function MainPage() {
  const notebooksMgr = useNotebooksManager();

  const notebook = useActiveNotebookStore((state) => state.notebook);
  const setNotebook = useActiveNotebookStore((state) => state.setNotebook);

  const navigate = useNavigate();

  const { notebookId } = useParams();

  const [drag, setDrag] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (notebookId) {
        const nb = await notebooksMgr.getNotebook(notebookId);
        setNotebook(nb);
      } else {
        if (appEnv.platform === "browser") {
          navigate("/select-notebook");
        }
      }
    })();
  }, [notebookId, notebooksMgr, setNotebook, navigate]);

  if (!notebook) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-background-1 fixed top-0 left-0 w-screen duration-200"></div>
    );
  }
  
  return (
    <DndContext
      onDragStart={(event) => {
        setDrag(event.active.id as string);
      }}
      onDragEnd={() => {
        setDrag(null);
      }}
      onDragCancel={() => {
        setDrag(null);
      }}
    >
      <div className="h-screen flex flex-col text-color">
        {appEnv.platform === "electron" && <Titlebar title={notebook.name} />}
        <div className="flex flex-grow min-h-0 max-h-full">
          <Sidebar />
          <NotesPane />
          <EditorPane />
        </div>
      </div>
      {/* ドラッグ関連は実装中 */}
      <DragOverlay>
        {drag ? (
          <div
            style={{
              padding: "4px 8px",
              background: "black",
              color: "white",
              borderRadius: 4,
            }}
          >
            📂 {drag}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
