import { NotebookFsMgr } from "../notebooks/types";
import { BaseNote } from "./BaseNote";

export interface NoteMetadata {
  name: string;
  path: string;
  notetype: NotetypeInfo;
  extLabel?: string;
}

export interface Notetype {
  info: NotetypeInfo;
  noteClass: NoteClassType;
}

export interface NotetypeInfo {
  id: string; // "scrap", "task", "plugin:super-note"
  mainExt?: string; // そのノートタイプのメインの拡張子（例：Markdown=.md、Scrap=.ctrnscrap）
  addtionalExts?: string[]; // 追加でそのノートタイプとしてエディタで開ける拡張子。一覧では拡張子のバッジがつく。
}

export type NoteClassType = new (
  metadata: NoteMetadata,
  fsMgr: NotebookFsMgr,
) => BaseNote;
