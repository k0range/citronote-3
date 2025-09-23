// Scrap: Markdown対応

import { BaseNote } from "core/notes";
import { ScrapNoteClass } from "core/builtin/notetypes";

import ScrapInput from "./ScrapInput";
import ScrapsList from "./ScrapsList";
import { useEffect, useState } from "react";

function isScrap(note: BaseNote): note is ScrapNoteClass {
  return note.__notetype === "scrap";
}

export default function ScrapEditor({ note }: { note: BaseNote }) {
  if (!isScrap(note)) {
    throw new Error("Invalid note type for ScrapEditor");
  }

  const [scraps, setScraps] = useState(note.scraps);
  useEffect(() => {
    setScraps(note.scraps);
  }, [note.scraps]);

  return (
    <div className="col-[2] flex flex-col min-h-0">
      <ScrapsList scraps={scraps} />
      <div className="my-4">
        <ScrapInput onSubmit={(content: string) => {
          const scrap = {
            date: new Date(),
            content: content,
          };
          setScraps([...scraps, scrap]);
          note.addScrap(scrap);
        }} />
      </div>
    </div>
  )
}
