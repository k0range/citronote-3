import { BaseNote, TextNote } from "@/notes/BaseNote";

export class MarkdownNote extends TextNote {}

export class PlaintextNote extends TextNote {}

export class ImageNote extends BaseNote {
  blobUrl?: string;

  async init() {
    const binaryData = await this.fsMgr.readFileBinary(this.metadata.path);
    this.blobUrl = URL.createObjectURL(
      new Blob([binaryData], { type: "image/*" }),
    );
  }
}
