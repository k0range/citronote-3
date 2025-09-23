import { BaseNote } from "core/notes";
import { ImageNoteClass } from "core/builtin/notetypes";

export default function ImageEditor({ note }: { note: BaseNote }) {
  if (!(note instanceof ImageNoteClass)) {
    throw new Error("Invalid note type for ImageEditor");
  }

  return (
    <img src={note.blobUrl} alt={note.metadata.name} className="max-w-full max-h-full rounded-lg col-[2]" />
  )
}
