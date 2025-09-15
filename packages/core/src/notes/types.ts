import type React from "react";

import { Icon } from "@/icons/types";
import { NotebookFsMgr } from "../notebooks/types";
import { BaseNote } from "./BaseNote";

export interface NoteMetadata {
  name: string;
  path: string;
  notetype?: NotetypeInfo; // Notetypeがない = unknown
  excerpt?: string; // ノートの抜粋（最初の数文字など）。未設定ならundefined
  extLabel?: string;
}

export interface Notetype {
  info: NotetypeInfo;
  noteClass: NoteClassType;
  template?: string; // ファイル作成時の内容の初期値
  editor: NoteEditor
}

export interface NotetypeInfo {
  id: string; // "scrap", "task", "plugin:super-note"
  mainExt?: string; // そのノートタイプのメインの拡張子（例：Markdown=.md、Scrap=.ctrnscrap）
  addtionalExts?: string[]; // 追加でそのノートタイプとしてエディタで開ける拡張子。一覧では拡張子のバッジがつく。
  ui: NotetypeUIInfo;
}
export interface NotetypeUIInfo {
  displayName: string;
  color?: string;
  icon: Icon;
}

export interface NoteEditorContext {
  // まだなにもない
  updateMetadata: (patch: Partial<NoteMetadata>) => void;
}
export interface NoteEditorProps {
  note: BaseNote;
  ctx: NoteEditorContext;
}
export interface NoteEditor {
  [platform: string]: {
    component: React.ComponentType<NoteEditorProps>;
    useContainer: boolean; // コンテナの中にcomponentを入れるか、自力でやるか
    scrollAll: boolean; // エディタ部分全体をスクロール可能にするか（true）。エディタ部分の高さをコンテナに合わせて、エディタ内でスクロールさせるか（false）
  };
}

export type NoteClassType = new (
  metadata: NoteMetadata,
  fsMgr: NotebookFsMgr,
) => BaseNote;
