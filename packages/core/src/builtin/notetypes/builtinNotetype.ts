import { type Notetype, BaseNote, NoteEditor, NoteEditorProps, TextNote } from "core/notes";

export class MarkdownNoteClass extends TextNote {
  readonly __notetype = "markdown";
}

export class PlaintextNoteClass extends TextNote {
  readonly __notetype = "plaintext";
}

export interface Scrap {
  date: Date;
  content: string;
}

export class ScrapNoteClass extends BaseNote {
  readonly __notetype = "scrap";

  scraps: Scrap[] = [];

  async init() {
    const content = await this.fsMgr.readFile(this.metadata.path);
    try {
      this.scraps = JSON.parse(new TextDecoder().decode(content));
    } catch (e) {
      console.error("Failed to parse scrap content:", e);
      this.scraps = [];
    }
  }

  async addScrap(scrap: Scrap) {
    this.scraps.push(scrap);
    await this.fsMgr.writeFile(
      this.metadata.path,
      new TextEncoder().encode(JSON.stringify(this.scraps, null, 2)),
    );
  }
}

export class ImageNoteClass extends BaseNote {
  readonly __notetype = "image";
  
  blobUrl?: string;

  async init() {
    const binaryData = await this.fsMgr.readFile(this.metadata.path);
    this.blobUrl = URL.createObjectURL(
      new Blob([new Uint8Array(binaryData)], { type: "image/*" }),
    );
  }
}

export function getBuiltinNotetypes(editors: Record<
  "markdown" | "plaintext" | "scrap" | "image",
  NoteEditor
>): Notetype[] {
  const builtinNotetypes: Notetype[] = [
    {
      info: {
        id: "markdown",
        mainExt: "md",
        ui: {
          icon: { type: "lucide", name: "FileText" },
          displayName: "Markdown",
          color: "#ffcd42",
        }
      },
      noteClass: MarkdownNoteClass,
      editor: editors.markdown
    },
    {
      info: {
        id: "plaintext",
        mainExt: "txt",
        ui: {
          icon: { type: "lucide", name: "Type" },
          displayName: "Plaintext",
          color: "#5389fc",
        }
      },
      noteClass: PlaintextNoteClass,
      editor: editors.plaintext
    },
    {
      info: {
        id: "scrap",
        mainExt: "scrap",
        ui: {
          icon: { type: "lucide", name: "Scroll" },
          displayName: "Scrap",
          color: "#ff9742",
        }
      },
      noteClass: ScrapNoteClass,
      template: "[]",
      editor: editors.scrap
    },
    {
      info: {
        id: "image",
        addtionalExts: ["png", "jpg", "jpeg", "gif", "bmp", "webp", "svg"],
        ui: {
          icon: { type: "lucide", name: "Image" },
          displayName: "Image",
          color: "#b853fc",
        }
      },
      noteClass: ImageNoteClass,
      editor: editors.image
    }
  ]

  return builtinNotetypes;
}
