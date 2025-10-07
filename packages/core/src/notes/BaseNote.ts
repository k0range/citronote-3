import type { NotebookFsMgr } from "../notebooks/types";
import type { NoteMetadata } from "./types";

export abstract class BaseNote {
  metadata: NoteMetadata;
  protected fsMgr!: NotebookFsMgr;

  abstract readonly __notetype: string;
  
  constructor(metadata: NoteMetadata, fsMgr: NotebookFsMgr) {
    this.metadata = metadata;
    this.fsMgr = fsMgr;
  }

  async getExcerpt?(): Promise<string>;

  async init() {}
}

export abstract class TextNote extends BaseNote {
  content?: string;

  async init() {
    const fileUint = await this.fsMgr.readFile(this.metadata.path);
    const decoder = new TextDecoder("utf-8");
    const str = decoder.decode(fileUint);
    this.content = str;
  }

  async getExcerpt(): Promise<string> {
    const fileUint = await this.fsMgr.readFile(this.metadata.path);
    const decoder = new TextDecoder("utf-8");
    const str = decoder.decode(fileUint);
    return str.replace(/\s+/g, " ").trim().slice(0, 60) || "";
  }

  async writeContent(content: string): Promise<void> {
    this.content = content;
    await this.fsMgr.writeFile(this.metadata.path, content);
  }
}
