import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { FormInput, Button, Label, RadioGroup, Icon } from "ui";
import type { NotebookLocationHandle, NotebookMetadata } from "core/notebooks";
import { appEnv } from "@/env";
import { useNotebooksManager } from "@/hooks/useNotebooksManager";
import { t } from "i18next";

function checkFsApiSupport() {
  if ("showDirectoryPicker" in window) {
    return true;
  }
  return false;
}

function BetaWarning({ text }: { text: string }) {
  return (
    <div className="flex">
      <Icon
        icon={{
          type: "lucide",
          name: "TriangleAlert"
        }}
        className="inline h-4 w-4 min-w-4 mr-1.5 text-danger my-0.5"
      />
      <span className="text-sm text-danger text-nowrap">
        {t("warning")}
      </span>
      <span className="text-sm text-color ml-2 break-all opacity-95">
        { text }
      </span>
    </div>
  )
}

export default function NewNotebook({
  goBack,
}: {
  goBack: () => void;
}) {
  const notebooksMgr = useNotebooksManager();

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [nbLocationDisplay, setNbLocationDisplay] = useState<string | null>(null);

  const [notebookName, setNotebookName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [folderPath, setFolderPath] = useState("");
  const [pathResult, setPathResult] = useState<
    "folder-exists" | "file-exists" | "notebook-same-path" | "not-found" | "invalid" | null
  >(null);

  const [folderHandle, setFolderHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  
  const fsSupported = checkFsApiSupport();
  
  const locationOptions = [
    {
      label: t("addNotebookPage.localOption"),
      value: "local",
      disabled: !checkFsApiSupport(),
      info: appEnv.platform === "browser" && !fsSupported ? t("addNotebookPage.fsApiNotSupported") : undefined
    },
    //{ label: (
    //  <div className="flex items-center">
    //    実行ファイルがある場所
    //    <span className="text-xs ml-1.5 bg-secondary rounded-md py-0.5 px-1.5">ポータブル</span>
    //  </div>
    //), value: "portable" },
  ]

  useEffect(() => {
    if (folderPath) {
      setNbLocationDisplay(folderPath)
      window.api.checkPath(folderPath).then((result) => {
        setPathResult(result);
      });
    } else {
      setPathResult(null);
    }
  }, [folderPath]);

  useEffect(() => {
    async function checkNotebookSamePath(folderHandle: FileSystemDirectoryHandle) {
      const result = await notebooksMgr.getNotebookAtLocation({
        kind: "browser",
        handle: folderHandle
      });
      if (result) {
        setPathResult("notebook-same-path");
      } else {
        setPathResult("folder-exists"); // フォルダが存在するかはブラウザでハンドルしているだろう
        setNbLocationDisplay(folderHandle.name);
      }
    }

    if (appEnv.platform === "browser" && folderHandle) {
      checkNotebookSamePath(folderHandle);
    }
  }, [folderHandle, notebooksMgr]);

  const addNotebook = async (name: string, location: NotebookMetadata["location"] , locationHandle: NotebookLocationHandle) => {
    const notebook = await notebooksMgr.addNotebook({
      name,
      location,
      locationHandle,
    });
    return notebook;
  }

  return (
    <>
      <button
        className="flex items-center opacity-50 hover:opacity-80 duration-200 cursor-pointer text-sm"
        onClick={() => {
          goBack();
        }}
      >
        <ArrowLeftIcon className="inline h-4 w-4 mr-1" />
        {t("back")}
      </button>
      <h2 className="text-xl mt-1">{t("addNotebook")}</h2>
      <p className="opacity-85 mt-1 text-sm">
        {t("addNotebookPage.description")}
      </p>
      <Label>{t("addNotebookPage.nameLabel")}</Label>
      <FormInput
        className=""
        wFull
        placeholder={t("addNotebookPage.namePlaceholder")}
        value={notebookName}
        onChange={(text) => setNotebookName(text)}
      />
      <Label>{t("location")}</Label>
      <RadioGroup
        className="mb-3"
        value={selectedLocation}
        onChange={(val) => setSelectedLocation(val)}
        options={locationOptions}
      />

      {selectedLocation === "local" && appEnv.platform === "electron" && (
        <>
          <Label>{t("folder")}</Label>
          <div className="flex gap-2">
            <FormInput
              className="flex-grow"
              placeholder={t("addNotebookPage.path")}
              value={folderPath}
              onChange={(text) => setFolderPath(text)}
            />
            <Button
              onClick={() => {
                window.api.selectFolder().then((path) => {
                  if (path) {
                    setFolderPath(path);
                    if (notebookName === "") {
                      setNotebookName(
                        path.replace(/\\/g, "/").split("/").pop(),
                      );
                    }
                  }
                });
              }}
            >
              {t("browse")}
            </Button>
          </div>
        </>
      )}

      {selectedLocation === "local" && appEnv.platform === "browser" && (
        <>
          <Label>{t("folder")}</Label>
          <div className="flex items-center gap-3.5">
            <Button
              onClick={async () => {
                try {
                  const dirHandle = await window.showDirectoryPicker()
                  setFolderHandle(dirHandle);
                  if (notebookName === "") {
                    setNotebookName(dirHandle.name);
                  }
                } catch (e) {
                  if (!(e instanceof DOMException && e.name === "AbortError")) {
                    alert(t("addNotebookPage.addFailed"));
                    console.error(e);
                  }
                }
              }}
            >
              {t("browse")}
            </Button>
            <div>{folderHandle?.name}</div>
          </div>
        </>
      )}

      {pathResult === "invalid" && (
        <div className="text-xs text-color mt-2">
          {t("addNotebookPage.invalidPath")}
        </div>
      )}
      {pathResult === "notebook-same-path" && (
        <div className="text-xs text-warning mt-2">
          {t("addNotebookPage.alreadyAdded")}
        </div>
      )}
      {pathResult === "not-found" && (
        <div className="text-xs text-warning mt-2">
          {t("addNotebookPage.folderNotFound")}
        </div>
      )}
      {pathResult === "file-exists" && (
        <div className="text-xs text-warning mt-2">{t("addNotebookPage.fileExists")}</div>
      )}
      {pathResult === "folder-exists" && (
        <div className="text-xs text-success mt-2">
          {t("addNotebookPage.folderExists", {
            "nbLocationDisplay": nbLocationDisplay
          })}
        </div>
      )}
      {/* <div className="text-xs text-[#84ff82] mt-1.5">C:\Users\koran\Documents\Bandicam\あ の内容がノートブックとして表示されます。</div> */}

      <div className="flex flex-col gap-2 mt-3 border border-border rounded-lg py-3 px-3">        <BetaWarning text={t("addNotebookPage.betaWarning1")} />
        <BetaWarning text={t("addNotebookPage.betaWarning2")} />
      </div>

      <Button
        variant="primary"
        className="mt-5 mb-8"
        disabled={
          buttonDisabled ||
          (pathResult !== "folder-exists") ||
          !notebookName
        }
        onClick={async () => {
          setButtonDisabled(true);
          try {
            // ノートブックを追加する
            let nb: NotebookMetadata | null = null;
            if (selectedLocation === "local" && appEnv.platform === "browser") {
              nb = await addNotebook(notebookName, "local", {
                kind: "browser",
                handle: folderHandle!,
              });
            } else if (selectedLocation === "local" && appEnv.platform === "electron") {
              nb = await addNotebook(notebookName, "local", {
                kind: "electron",
                path: folderPath
              });
            } else {
              alert(t("addNotebookPage.notImplemented"));
              setButtonDisabled(false);
              return;
            }
            
            // 作ったノートブックを開く
            if (appEnv.platform === "browser") {
              location.href = `/#/nb/${nb.id}`;
            } else if (appEnv.platform === "electron") {
              await window.api.openNotebook(nb.id);
              window.close();
            }
          } catch (error) {
            alert(t("addNotebookPage.addFailed"));
            console.error(error);
          }
          setButtonDisabled(false);
        }}
      >
        {t("addNotebook")}
      </Button>
    </>
  );
}
