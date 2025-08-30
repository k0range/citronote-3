import type { NotebookFsMgr } from "../notebooks/types";
import type { NoteMetadata } from "./types";

export abstract class BaseNote {
  metadata: NoteMetadata;
  protected fsMgr!: NotebookFsMgr;

  constructor(metadata: NoteMetadata, fsMgr: NotebookFsMgr) {
    this.metadata = metadata;
    this.fsMgr = fsMgr;
  }

  async init() {}
}

export abstract class TextNote extends BaseNote {
  content?: string;

  async init() {
    const file = await this.fsMgr.readFile(this.metadata.path);
    this.content = file;
  }

  async writeContent(content: string): Promise<void> {
    this.content = content;
    await this.fsMgr.writeFile(this.metadata.path, content);
  }
}
