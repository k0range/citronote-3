// Scrap: Markdown対応

import { BaseNote } from "core/notes";
import { ScrapNoteClass, type Scrap } from "core/builtin/notetypes";

import ScrapInput from "./ScrapInput";
import { useEffect, useState } from "react";
import { Edit3Icon, TrashIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

function isScrap(note: BaseNote): note is ScrapNoteClass {
  return note.__notetype === "scrap";
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

interface ScrapItem extends Scrap {
  isEditing?: boolean;
}

export default function ScrapEditor({ note }: { note: BaseNote }) {
  if (!isScrap(note)) {
    throw new Error("Invalid note type for ScrapEditor");
  }

  const [scrapItems, setScrapItems] = useState<ScrapItem[]>(note.scraps);
  useEffect(() => {
    setScrapItems(note.scraps);
  }, [note.scraps]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="col-[2] flex flex-col min-h-0">
      <div className="flex-grow overflow-y-auto">
        {scrapItems.map((scrap, index) => (
          <div
            key={index}
            className={twMerge("px-3.5 py-2 rounded-lg w-full bg-background-2 border border-border text-color mb-2",
              scrap.isEditing ? "opacity-50 pointer-events-none" : ""
            )}
          >
            <div className="flex text-xs mb-0.25 select-text justify-between items-center">
              <div className="opacity-50">{scrap.date ? dateFormatter.format(new Date(scrap.date)) : ""}</div>
              <div className="flex gap-2 items-center">
                <button
                  className="group cursor-pointer"
                  onClick={() => {
                    setEditingIndex(index === editingIndex ? null : index);
                    setScrapItems((prev) =>
                      prev.map((item, i) => {
                        if (i === index) {
                          // Toggle isEditing for the clicked item
                          return { ...item, isEditing: i !== editingIndex };
                        } else {
                          // Ensure any other item is not in editing state
                          return { ...item, isEditing: false };
                        }
                      }),
                    );
                  }}
                >
                  <Edit3Icon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-70  transition-opacity duration-200" />
                </button>
                <button
                  className="group cursor-pointer"
                  onClick={() => {
                    const newScraps = scrapItems.filter((_, i) => i !== index);
                    setScrapItems(newScraps);
                    note.removeScrap(index);
                  }}
                >
                  <TrashIcon className="w-3.5 h-3.5 opacity-50 group-hover:opacity-70  transition-opacity duration-200" />
                </button>
              </div>
            </div>
            <div className="select-text">{scrap.content}</div>
          </div>
        ))}
      </div>

      <div className="my-4">
        <ScrapInput isEditing={!!editingIndex} onSubmit={(content: string) => {
          if (editingIndex === null) {
            const scrap = {
              date: new Date(),
              content: content,
            };
            setScrapItems([...scrapItems, scrap]);
            note.addScrap(scrap);
          } else {
            setScrapItems((prev) => prev.map((item, i) => i === editingIndex ? { ...item, content: content, isEditing: false } : item));
            note.editScrap(editingIndex, content);
            setEditingIndex(null);
          }
        }} onCancelEdit={() => {
          // 編集キャンセル
          setScrapItems((prev) => prev.map((item, i) => i === editingIndex ? { ...item, isEditing: false } : item));
          setEditingIndex(null);
        }} />
      </div>
    </div>
  )
}
