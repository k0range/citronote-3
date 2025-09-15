import { Notetype, BaseNote, TextNote } from "core/notes";
import PlaintextEditor from "./editors/PlaintextEditor";
import ImageEditor from "./editors/ImageEditor";
import MarkdownEditor from "./editors/MarkdownEditor";

export class MarkdownNoteClass extends TextNote { }

export class PlaintextNoteClass extends TextNote { }

export class ImageNoteClass extends BaseNote {
  blobUrl?: string;

  async init() {
    const binaryData = await this.fsMgr.readFileBinary(this.metadata.path);
    this.blobUrl = URL.createObjectURL(
      new Blob([binaryData], { type: "image/*" }),
    );
  }
}

export const builtinNotetypes: Notetype[] = [
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
    editor: {
      app: {
        component: MarkdownEditor,
        useContainer: false,
        scrollAll: false,
      }
    }
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
    editor: {
      app: {
        component: PlaintextEditor,
        useContainer: false,
        scrollAll: false,
      }
    }
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
    editor: {
      app: {
        component: ImageEditor,
        useContainer: true,
        scrollAll: true,
      }
    }
  },
]
