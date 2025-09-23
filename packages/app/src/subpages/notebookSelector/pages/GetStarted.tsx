import { useEffect, useState } from "react";
import { useNotebooksManager } from "@/hooks/useNotebooksManager";
import type { NotebookMetadata } from "core/notebooks";
import { Icon, SimpleIcon } from "ui";
import type { Icon as IconType } from "core/icons";

function ActionItem({ icon, name, description, onClick }: { icon: IconType; name: string; description: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="border border-border group bg-background-2 hover:bg-hover min-h-16 rounded-lg overflow-hidden flex duration-200 cursor-pointer w-full">
      <div className="min-h-16 px-3 flex flex-col justify-center items-cente">
        <Icon icon={icon} size={42} className="m-auto opacity-40" />
      </div>
      <div className="py-3 flex-grow text-left mr-4">
        <div className="flex items-center opacity-90">
          <div className="mb-0.25">{name}</div>
        </div>
        <div className="text-xs opacity-50 mt-0.5">
          {description}
        </div>
      </div>
    </button>
  )
}

export default function GetStarted({ changePage }: { changePage: (page: string, direction: number) => void }) {
  const notebooksMgr = useNotebooksManager();

  const [, setNotebooks] = useState<NotebookMetadata[]>([]);

  useEffect(() => {
    const fetchNotebooks = async () => {
      const fetchedNotebooks = await notebooksMgr.fetchNotebooks();
      setNotebooks(fetchedNotebooks);
    };
    
    fetchNotebooks();
  }, [notebooksMgr]);

  return (
    <>
      <SimpleIcon className="w-12 h-12 mx-auto mb-3 opacity-65 mt-4" />
      <h2 className="text-lg text-center pb-1 opacity-80 mb-6">Citronote へようこそ！</h2>
      <div className="flex flex-col gap-2">
        <ActionItem
          icon={{
            type: "lucide",
            name: "Plus",
          }}
          name="新しいノートブックを作成"
          description="新しいノートブックを作成します"
          onClick={() => changePage("addNotebook", 1)}
        />
      </div>
    </>
  )
}
