import { ChevronDownIcon, FolderIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import type { FolderDisplay } from "../stores/folderTree";

type BaseFolderProps = {
  nest: number;
};

type DisplayFolderProps = BaseFolderProps & {
  mode?: "display";
  folder: FolderDisplay;
  childrenExists: boolean;
  isOpen: boolean;
  onToggle: () => void;
  isActive: boolean;
  onSelect: () => void;
  isRoot?: boolean;
};

type InputFolderProps = BaseFolderProps & {
  mode: "input";
  initialValue?: string;
  onSubmit: (name: string) => void;
  onCancel?: () => void;
  isActive?: boolean;
  onSelect?: () => void;
  isRoot?: boolean;
};

type FolderProps = DisplayFolderProps | InputFolderProps;

export default function Folder(props: FolderProps) {
  return (
    <button
      type="button"
      onClick={props.onSelect}
      className={twMerge(
        `flex px-1.5 py-1 w-full text-left rounded-lg relative cursor-pointer ${
          props.isActive ? "bg-selected" : "hover:bg-hover"
        } transition-colors duration-150`
      )}
      style={{
        paddingLeft: `${Math.max((props.nest - 1) * 1.1 + (props.nest - 1 ? 0.2 : 0), 0.375)}rem`,
        ...(props.mode === "input"
          ? {
              boxShadow: "inset 0 0 0 1px var(--color-primary)",
              backgroundColor: "var(--color-hover)",
            }
          : {}),
      }}
      aria-current={props.isActive ? "true" : undefined}
    >
      <div className="h-6 absolute flex items-center">
        {!props.isRoot ? (
          props.mode === "display" && props.childrenExists ? (
            <span
              role="button"
              tabIndex={0}
              aria-label={props.isOpen ? "閉じる" : "開く"}
              onClick={(e) => {
                e.stopPropagation();
                props.onToggle();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  props.onToggle();
                }
              }}
              className="h-5.5 w-5.5 min-w-5.5 flex items-center justify-center mr-1.5 rounded-md hover:bg-border transition-colors duration-150 opacity-50"
            >
              <ChevronDownIcon
                className={`h-3.5 w-3.5 transition-transform ${
                  !props.isOpen ? "-rotate-90" : ""
                }`}
              />
            </span>
          ) : (
            <span className="w-5.5 h-5.5 mr-1.5" />
          )
        ) : (
          <span className="mr-0.5" />
        )}
        {props.mode === "display" && props.folder?.iconUrl ? (
          <img
            src={props.folder.iconUrl}
            className="inline-block h-5.5 w-5.5 mr-2 rounded-lg"
            alt="folder icon"
          />
        ) : (
          <FolderIcon className="inline mr-2 h-4.5 w-4.5 min-w-4.5 min-h-4.5" />
        )}
      </div>
      <div className={`flex items-center ${props.isRoot ? "ml-7.5" : "ml-13.5"}`}>
        {props.mode === "display" && (
          props.folder.name
        )}
        {props.mode === "input" && (
          <input
            type="text"
            defaultValue={props.initialValue}
            autoFocus
            onFocus={(e) => e.currentTarget.select()}
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent w-full no-focus-outline"
            placeholder={props.initialValue || "フォルダ名"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                props.onSubmit(e.currentTarget.value);
              } else if (e.key === "Escape" && props.onCancel) {
                props.onCancel();
              }
            }}
            onBlur={() => {
              if (props.onCancel) {
                props.onCancel();
              }
            }}
          />
        )}
      </div>
    </button>
  );
}
