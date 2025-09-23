import { useEffect, useState } from "react";

import { Popover } from "radix-ui";

import {
  BookCopyIcon,
  NotebookIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { appEnv } from "@/env";
import { useNavigate } from "react-router-dom";

import { MenuActionButton, showAlertDialog } from "ui";

import useActiveNotebookStore from "../stores/activeNotebook";
import { useNotebooksManager } from "@/hooks/useNotebooksManager";
import type { NotebookMetadata } from "core/notebooks";
import { t } from "i18next";

export default function SidebarPopoverContent() {
  const notebook = useActiveNotebookStore((state) => state.notebook);

  if (!notebook) {
    throw new Error("No active notebook found");
  }

  const notebooksMgr = useNotebooksManager();

  const navigate = useNavigate();

  const [notebooks, setNotebooks] = useState<NotebookMetadata[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedNotebooks = await notebooksMgr.fetchNotebooks();
      setNotebooks(fetchedNotebooks);
    })();
  });

  return (
    <div className="flex flex-col min-w-[13rem]">
      <div
        className={`flex items-center text-color px-1 py-1 rounded-lg text-[1rem] w-full text-left`}
      >
        {notebook.iconUrl ? (
          <img
            src={notebook.iconUrl}
            className="rounded-lg mr-2.5 h-6 w-6"
          />
        ) : (
          <NotebookIcon className="inline my-0.75 ml-1 mr-2.5 h-4.5 w-4.5" />
        )}
        <span className="text-[0.95rem]">{notebook.name}</span>
      </div>
      <Popover.Close asChild>
        <MenuActionButton
          icon={XIcon}
          label={t("sidebarPopover.removeNotebook.title")}
          onClick={async () => {
            let displayLocation: string | null = null
            if (notebook.locationHandle.kind === "electron") {
              displayLocation = notebook.locationHandle.path;
            } 
            const result = await showAlertDialog({
              icon: {
                type: "lucide",
                name: "X",
              },
              text: t("sidebarPopover.removeNotebook.title"),
              description: notebook.locationHandle.kind === "electron" ? t("sidebarPopover.removeNotebook.description.desktop", {
                "location": displayLocation
              }) : t("sidebarPopover.removeNotebook.description.browser"),
              buttons: [
                { text: t("sidebarPopover.removeNotebook.confirm"), value: "delete", variant: "primary" },
                { text: t("cancel"), value: "cancel", variant: "text" }
              ],
            });

            if (result === "delete") {
              notebooksMgr.removeNotebook(notebook.id).then(() => {
                if (appEnv.platform === "browser") {
                  location.href = "./notebook_selector.html";
                } else if (appEnv.platform === "electron") {
                  window.api.openNotebookSelector();
                  window.close();
                }
              });
            }
          }}
        />
      </Popover.Close>
      {/*<Popover.Close asChild>
        <MenuActionButton
          icon={SettingsIcon}
          label="ノートブック設定"
          onClick={() => {
            if (appEnv.platform === "browser") {
              navigate("/menu");
            } else if (appEnv.platform === "electron") {
              window.api.openNotebookSelector();
            }
          }}
        />
      </Popover.Close>*/}
      <hr className="border-border my-1.5" />
      {notebooks
        .filter((nb) => nb.id !== notebook.id)
        .map((nb) => (
          <Popover.Close asChild>
            <button
              className={`flex items-center text-color px-1 py-1 rounded-lg text-[1rem] w-full text-left hover:bg-selected duration-200 cursor-pointer`}
              onClick={() => {
                navigate(`/nb/${nb.id}`);
              }}
            >
              {nb.iconUrl ? (
                <img
                  src={nb.iconUrl}
                  className="rounded-lg mr-2.5 h-6 w-6"
                />
              ) : (
                <NotebookIcon className="inline my-0.75 ml-1 mr-2.5 h-4.5 w-4.5" />
              )}
              <span className="text-[0.95rem]">{nb.name}</span>
            </button>
          </Popover.Close>
        ))}
      <Popover.Close asChild className="mt-0.5">
        <MenuActionButton
          icon={PlusIcon}
          label={t("addNotebook")}
          onClick={() => {
            if (appEnv.platform === "browser") {
              location.href = "./notebook_selector.html?page=newNotebook";
            } else if (appEnv.platform === "electron") {
              window.api.openNotebookSelector({
                page: "newNotebook",
              });
            }
          }}
        />
      </Popover.Close>
      <Popover.Close asChild>
        <MenuActionButton
          icon={BookCopyIcon}
          label={t("manageNotebooks")}
          onClick={() => {
            if (appEnv.platform === "browser") {
             location.href = "./notebook_selector.html";
            } else if (appEnv.platform === "electron") {
              window.api.openNotebookSelector();
            }
          }}
        />
      </Popover.Close>
    </div>
  );
}
