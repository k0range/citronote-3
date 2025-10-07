import { type Notetype, BaseNote, NoteEditor, TextNote } from "core/notes";

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

  async editScrap(index: number, newContent: string) {
    if (index < 0 || index >= this.scraps.length) {
      throw new Error("Invalid scrap index");
    }
    this.scraps[index].content = newContent;
    await this.fsMgr.writeFile(
      this.metadata.path,
      new TextEncoder().encode(JSON.stringify(this.scraps, null, 2)),
    );
  }

  async removeScrap(index: number) {
    this.scraps.splice(index, 1);
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
          nameKey: "builtin:notetype.markdown",
          fallbackName: "Markdown",
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
          nameKey: "builtin:notetype.plaintext",
          fallbackName: "Plaintext",
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
          nameKey: "builtin:notetype.scrap",
          fallbackName: "Scrap",
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
          nameKey: "builtin:notetype.image",
          fallbackName: "Image",
          color: "#b853fc",
        }
      },
      noteClass: ImageNoteClass,
      editor: editors.image
    },
    //{
    //  info: {
    //    id: "tasks",
    //    mainExt: "tasks",
    //    ui: {
    //      icon: { type: "lucide", name: "CheckSquare" },
    //      displayName: "Tasks",
    //      color: "#42bff4",
    //    }
    //  }
    //},
    //{
    //  info: {
    //    id: "canvas",
    //    mainExt: "canvas",
    //    ui: {
    //      icon: { type: "lucide", name: "LayoutDashboard" },
    //      displayName: "Canvas",
    //      color: "#42f4a2",
    //    }
    //  }
    //}
  ]

  return builtinNotetypes;
}
