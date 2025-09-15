import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import Label from "@/components/Label";
import RadioGroup from "@/components/RadioGroup";
import type { NotebookLocationHandle, NotebookMetadata } from "core/notebooks";
import { appEnv } from "@/env";
import { useNotebooksManager } from "@/hooks/useNotebooksManager";

function checkFsApiSupport() {
  if ("showDirectoryPicker" in window) {
    return true;
  }
  return false;
}

export default function AddNotebook({
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
      label: "このコンピューター",
      value: "local",
      disabled: !checkFsApiSupport(),
      info: fsSupported ? "このブラウザではサポートされていません。" : undefined,
      infoUrl: fsSupported ? "https://developer.mozilla.org/en-US/docs/Web/API/window/showDirectoryPicker" : undefined
    },
    { label: (
      <div className="flex items-center">
        実行ファイルがある場所
        <span className="text-xs ml-1.5 bg-secondary rounded-md py-0.5 px-1.5">ポータブル</span>
      </div>
    ), value: "portable" },
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
        戻る
      </button>
      <h2 className="text-xl mt-1">新しいノートブック</h2>
      <p className="opacity-85 mt-1 text-sm">
        Citronote はノートブックという単位でノートを保存します。
      </p>
      <Label>ノートブック名</Label>
      <FormInput
        className=""
        wFull
        placeholder="ノートブック名"
        value={notebookName}
        onChange={(text) => setNotebookName(text)}
      />
      <Label>場所</Label>
      <RadioGroup
        className="mb-3"
        value={selectedLocation}
        onChange={(val) => setSelectedLocation(val)}
        options={locationOptions}
      />

      {selectedLocation === "local" && appEnv.platform === "electron" && (
        <>
          <Label>フォルダ</Label>
          <div className="flex gap-2">
            <FormInput
              className="flex-grow"
              placeholder="パス"
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
              参照
            </Button>
          </div>
        </>
      )}

      {selectedLocation === "local" && appEnv.platform === "browser" && (
        <>
          <Label>フォルダ</Label>
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
                    alert("フォルダの選択に失敗しました。");
                    console.error(e);
                  }
                }
              }}
            >
              参照
            </Button>
            <div>{folderHandle?.name}</div>
          </div>
        </>
      )}

      {pathResult === "invalid" && (
        <div className="text-xs text-color mt-2">
          正しいパスを入力してください
        </div>
      )}
      {pathResult === "notebook-same-path" && (
        <div className="text-xs text-warning mt-2">
          既にこのフォルダをノートブックとして追加しています
        </div>
      )}
      {pathResult === "not-found" && (
        <div className="text-xs text-warning mt-2">
          フォルダが存在しません。作成しますか？
        </div>
      )}
      {pathResult === "file-exists" && (
        <div className="text-xs text-warning mt-2">フォルダではありません</div>
      )}
      {pathResult === "folder-exists" && (
        <div className="text-xs text-success mt-2">
          ノートブックは { nbLocationDisplay } に保存されます。
        </div>
      )}
      {/* <div className="text-xs text-[#84ff82] mt-1.5">C:\Users\koran\Documents\Bandicam\あ の内容がノートブックとして表示されます。</div> */}

      <Button
        variant="primary"
        className="mt-5"
        disabled={
          buttonDisabled ||
          (pathResult !== "folder-exists") ||
          !notebookName
        }
        onClick={async () => {
          setButtonDisabled(true);
          try {
            let nb: NotebookMetadata | null = null;
            if (selectedLocation === "local" && appEnv.platform === "browser") {
              nb = await addNotebook(notebookName, "local", {
                kind: "browser",
                handle: folderHandle!,
              });
            } else {
              alert("未実装");
              setButtonDisabled(false);
              return;
            }
            location.href = `/#/nb/${nb.id}`;
          } catch (error) {
            alert("ノートブックの追加に失敗しました。");
            console.error(error);
          }
          setButtonDisabled(false);
        }}
      >
        ノートブックを追加
      </Button>
    </>
  );
}
