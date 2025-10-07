import { useEffect, useState } from "react";
import { appEnv } from "@/env";
import { useNotebooksManager } from "@/hooks/useNotebooksManager";
import type { NotebookMetadata } from "core/notebooks";
import Notebook from "../components/Notebook";
import { Button } from "ui";
import { t } from "i18next";

export default function Notebooks({ changePage }: { changePage: (page: string, direction: number) => void }) {
  const notebooksMgr = useNotebooksManager();

  const [notebooks, setNotebooks] = useState<NotebookMetadata[]>([]);

  useEffect(() => {
    const fetchNotebooks = async () => {
      const fetchedNotebooks = await notebooksMgr.fetchNotebooks();
      setNotebooks(fetchedNotebooks);
    };
    
    fetchNotebooks();
  }, [notebooksMgr]);

  return (
    <>
      <div className="flex items-center justify-between pb-2.5">
        <h2 className="text-xl">{t("notebooksList")}</h2>
        <div>
          <Button onClick={() => changePage("newNotebook", 1)}>
            {t("addNotebook")}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {notebooks.map((notebook) => {
          return (
            <Notebook
              key={notebook.id}
              nb={notebook}
              onClick={() => {
                if (appEnv.platform === "browser") {
                  location.href = `/#/nb/${notebook.id}`;
                } else if (appEnv.platform === "electron") {
                  window.api.openNotebook(notebook.id);
                  window.close();
                }
              }}
            />
          );
        })}
      </div>
    </>
  )
}
