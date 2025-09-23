import {
  ComputerIcon,
  NotebookIcon,
} from "lucide-react";
import type { NotebookMetadata } from "core/notebooks";

export default function Notebook({
  nb,
  onClick,
}: {
  nb: NotebookMetadata;
  onClick: () => void;
}) {
  return (
    <button
      className="border border-border group hover:bg-background-2 min-h-16 rounded-lg overflow-hidden flex duration-200 cursor-pointer w-full"
      onClick={onClick}
    >
      <div className="w-1 bg-border duration-200"></div>
      <div className="py-2.5">
        <div className="flex items-center">
          {nb.iconUrl ? (
            <img src={nb.iconUrl} className="ml-3 mr-2 h-6 rounded-sm" />
          ) : (
            <NotebookIcon className="ml-3 mr-2 h-4.5 w-4.5" />
          )}
          <div className="mb-0.5">{nb.name}</div>
        </div>
        <div className="ml-11 text-xs opacity-80 text-left ">
          {nb.locationHandle.kind === "electron" && (
            <>
              <ComputerIcon className="inline h-3.5 w-3.5 mr-1.5 mb-0.5" />
              {"path" in nb.locationHandle && nb.locationHandle.path && (
                <>{nb.locationHandle.path}</>
              )}
            </>
          )}
          {nb.locationHandle.kind === "browser" && (
            <>
              <ComputerIcon className="inline h-3.5 w-3.5 mr-1.5 mb-0.5" />
              {nb.locationHandle.handle?.name}
            </>
          )}
        </div>
      </div>
    </button>
  );
}
