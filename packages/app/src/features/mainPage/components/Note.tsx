import type { NoteMetadata } from "core/notes";
import { Icon } from "ui";
import { FileQuestionIcon } from "lucide-react";

export default function NoteComponent({
  onClick,
  selected,
  note,
}: {
  onClick?: () => void;
  selected?: boolean;
  note: NoteMetadata;
}) {
  return (
    <>
      <button
        onClick={onClick}
        className={`flex items-center text-color px-2 py-1.25 rounded-lg text-[1rem] w-full text-left ${selected ? "bg-selected" : "hover:bg-hover"} duration-150 cursor-pointer my-1 first:mt-0 last:mb-0`}
      >
        <div className="py-0.5 flex">
          { note.notetype ? (
            <Icon
              icon={note.notetype?.ui.icon}
              className={`mr-2 h-4.5 w-4.5 min-w-4.5 mt-0.5`}
              style={{ color: note.notetype?.ui.color }}
            />
          ) : (
            <FileQuestionIcon className="mr-2 h-4.5 w-4.5 mt-0.5 opacity-50" />
          ) }
          <div>
            <div>
              <span className="break-all">{note.name}</span>
              {note.extLabel ? (
                <span className="text-[0.67rem] bg-border rounded-sm opacity-80 tracking-wide px-1 ml-1.5">
                  {note.extLabel}
                </span>
              ) : null}
            </div>
            <div className="text-xs mt-0.25 break-all opacity-50">{note.excerpt}</div>
          </div>
        </div>
      </button>
      <div className="[&:not(:last-child)]:border-b border-b-selected mx-1.5"></div>
    </>
  );
}
