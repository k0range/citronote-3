import { useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { appEnv } from "@/env";

import Titlebar from "@/components/Titlebar";

import Sidebar from "./panes/Sidebar";
import NotesPane from "./panes/NotesPane";

import useActiveNotebookStore from "./stores/activeNotebook";
import { useNotebooksManager } from "@/hooks/useNotebooksManager";
import EditorPane from "./panes/EditorPane";

import { initNotebook } from "./initNotebook";
import OriginalMdEditor from "@/editors/OriginalMdEditor";
import ImageEditor from "@/editors/ImageEditor";
import ScrapEditor from "@/editors/ScrapEditor";
import PlaintextEditor from "@/editors/PlaintextEditor";

export default function MainPage() {
  const notebooksMgr = useNotebooksManager();

  const notebook = useActiveNotebookStore((state) => state.notebook);

  const navigate = useNavigate();

  const { notebookId } = useParams();

  // ここにnotebook関連のinitCoreとかも入れる
  useEffect(() => {
    (async () => {
      if (notebookId) {
        const nb = await notebooksMgr.getNotebook(notebookId, {
          builtinNotetypeEditors: {
            markdown: {
              app: {
                component: OriginalMdEditor
              }
            },
            plaintext: {
              app: {
                component: PlaintextEditor
              }
            },
            scrap: {
              app: {
                component: ScrapEditor
              }
            },
            image: {
              app: {
                component: ImageEditor
              }
            },
          }
        });
        if (nb) {
          await initNotebook({ notebook: nb });
        }
      } else {
        if (appEnv.platform === "browser") {
          navigate("/select-notebook");
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notebookId]);

  if (!notebook) {
    return (
      <div className="flex items-center justify-center h-screen text-white bg-background-1 fixed top-0 left-0 w-screen duration-200"></div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col text-color">
      {appEnv.platform === "electron" && <Titlebar title={notebook.name} />}
      <div className="flex flex-grow min-h-0 max-h-full">
        <Sidebar />
        <NotesPane />
        <EditorPane />
      </div>
    </div>
  );
}
